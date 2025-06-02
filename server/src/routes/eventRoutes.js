const express = require('express');
const { Op } = require('sequelize');
const { Event, Cryptocurrency } = require('../models');
const { fetchEvents } = require('../services/eventFetcher');
const router = express.Router();

/* on-demand refresh */
router.post('/refresh', async (_, res, next) => {
  try {
    const out = await fetchEvents();
    res.json(out);
  } catch (err) { next(err); }
});

/* GET /events?category=Economy&symbol=BTC */
router.get('/', async (req, res, next) => {
  try {
    const { category, symbol, from, to } = req.query;
    const where = {};
    if (category) where.category = category;
    if (symbol) {
      const crypto = await Cryptocurrency.findOne({ where: { symbol } });
      if (!crypto) return res.status(404).json({ error: 'Unknown symbol' });
      where.cryptoId = crypto.id;
    }
    if (from || to)
      where.date = {
        ...(from && { [Op.gte]: from }),
        ...(to   && { [Op.lte]: to })
      };

      const events = await Event.findAll({
              where,
              include: [{
                model: Cryptocurrency,
                attributes: ['symbol'],
              }],
              order: [['date', 'ASC']],
            });
        
            /* Flatten so each record has { …, crypto: 'BTC' } */
            res.json(events.map(e => ({
              ...e.toJSON(),
              crypto: e.Cryptocurrency.symbol,
            })));
  } catch (err) { next(err); }
});

module.exports = router;
