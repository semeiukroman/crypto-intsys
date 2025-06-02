const express = require('express');
const dayjs    = require('dayjs');
const { Op, fn, col } = require('sequelize');
const { Event, Price, Cryptocurrency } = require('../models');

const router = express.Router();

/* helper ─ average price for a time window */
async function avgPrice(cryptoId, from, to) {
  const row = await Price.findOne({
    attributes: [[fn('AVG', col('price_usd')), 'avg']],
    where: { cryptoId, date: { [Op.between]: [from, to] } },
    raw: true,
  });
  return parseFloat(row.avg || 0);
}

/* ───────────────────────────────── EVENT IMPACT ──────────────────────────
   GET /api/analysis/event/:id?interval=24
   -> { series:[{time,price}], avgBefore, avgAfter, delta }
*/
router.get('/event/:id', async (req, res, next) => {
  try {
    const interval = parseInt(req.query.interval ?? 24, 10); // hours
    const ev = await Event.findByPk(req.params.id, { include: Cryptocurrency });
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    const cryptoId = ev.cryptoId;
    const start    = dayjs(ev.date).subtract(interval, 'hour').toDate();
    const end      = dayjs(ev.date).add(interval, 'hour').toDate();

    /* price series for chart */
    const rows = await Price.findAll({
      where: { cryptoId, date: { [Op.between]: [start, end] } },
      order: [['date', 'ASC']],
      raw: true,
    });
    const series = rows.map(r => ({ time: r.date, price: r.price_usd }));

    /* stats */
    const avgBefore = await avgPrice(cryptoId, start, ev.date);
    const avgAfter  = await avgPrice(cryptoId, ev.date, end);
    const delta     = avgBefore === 0 ? 0 : ((avgAfter - avgBefore) / avgBefore) * 100;

    res.json({ series, avgBefore, avgAfter, delta });
  } catch (err) { next(err); }
});

/* ───────────────────────────────── CATEGORY IMPACT ───────────────────────
   GET /api/analysis/category?category=Economy&interval=24
   -> { avgDelta, events:[{id,title,crypto,date,delta}] }
*/
router.get('/category', async (req, res, next) => {
  try {
    const interval = parseInt(req.query.interval ?? 24, 10);
    const category = req.query.category;
    if (!category) return res.status(400).json({ error: 'category required' });

    const evts = await Event.findAll({ where: { category }, raw: true });
    if (!evts.length) return res.json({ avgDelta: 0, events: [] });

    const out = [];
    for (const ev of evts) {
      const start = dayjs(ev.date).subtract(interval, 'hour').toDate();
      const end   = dayjs(ev.date).add(interval, 'hour').toDate();

      const avgB = await avgPrice(ev.cryptoId, start, ev.date);
      const avgA = await avgPrice(ev.cryptoId, ev.date, end);
      const delta  = avgB === 0 ? 0 : ((avgA - avgB) / avgB) * 100;

      out.push({
        id: ev.id,
        title: ev.title,
        crypto: (await Cryptocurrency.findByPk(ev.cryptoId)).symbol,
        date: ev.date,
        delta,
      });
    }

    const avgDelta = out.reduce((s, d) => s + d.delta, 0) / out.length;
    res.json({ avgDelta, events: out });
  } catch (err) { next(err); }
});

module.exports = router;
