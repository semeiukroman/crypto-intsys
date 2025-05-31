const axios = require('axios');
const dayjs = require('dayjs');
const { Cryptocurrency, Price } = require('../models');

const symbols = process.env.CMC_SYMBOLS.split(',').map((s) => s.trim().toUpperCase());
const CMC_KEY = process.env.COINMARKETCAP_API_KEY;

/**
 * Fetch current prices from CoinMarketCap free tier
 * Docs: https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest
 */
async function fetchPrices() {
  const url =
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?' +
    `symbol=${symbols.join(',')}&convert=USD`;

  const { data } = await axios.get(url, {
    headers: { 'X-CMC_PRO_API_KEY': CMC_KEY },
    timeout: 10_000,
  });

  const list = data?.data ?? {};

  for (const sym of symbols) {
    const crypto = await Cryptocurrency.findOne({ where: { symbol: sym } });
    if (!crypto) continue;

    const priceUsd = list[sym]?.quote?.USD?.price;
    if (!priceUsd) continue;

    await Price.create({
      cryptoId: crypto.id,
      date: dayjs().toDate(),
      price_usd: priceUsd,
    });
  }

  return { ok: true, source: 'CoinMarketCap', symbols };
}

module.exports = { fetchPrices };
