const express = require('express');
const { Cryptocurrency } = require('../models');

const router = express.Router();

/**
 * GET /api/cryptos
 * → [{ id, symbol, name }]
 */
router.get('/', async (_, res, next) => {
  try {
    const list = await Cryptocurrency.findAll({
      attributes: ['id', 'symbol', 'name'],
      order: [['symbol', 'ASC']],
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
