const express = require('express');
const { Op } = require('sequelize');
const { Cryptocurrency, Price } = require('../models');
const { fetchPrices } = require('../services/priceFetcher');

const router = express.Router();

/* on-demand refresh */
router.post('/refresh', async (_, res, next) => {
  try {
    const result = await fetchPrices();
    res.json(result);
  } catch (err) { next(err); }
});

/* GET /prices/:symbol?from=2025-05-01&to=2025-05-10 */
router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { from, to } = req.query;
    const crypto = await Cryptocurrency.findOne({ where: { symbol } });
    if (!crypto) return res.status(404).json({ error: 'Unknown symbol' });

    const where = { cryptoId: crypto.id };
    if (from || to)
      where.date = {
        ...(from && { [Op.gte]: from }),
        ...(to   && { [Op.lte]: to })
      };

    const prices = await Price.findAll({ where, order: [['date', 'ASC']] });
    res.json(prices);
  } catch (err) { next(err); }
});

module.exports = router;
