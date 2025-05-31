const cron = require('node-cron');
const { fetchPrices } = require('../services/priceFetcher');
const { fetchEvents } = require('../services/eventFetcher');

function startSchedulers() {
  // every 10 min
  cron.schedule('*/10 * * * *', () => {
    console.log('[cron] Fetching prices …');
    fetchPrices().catch(console.error);
  });

  // every hour
  cron.schedule('0 * * * *', () => {
    console.log('[cron] Fetching news/events …');
    fetchEvents().catch(console.error);
  });
}

module.exports = { startSchedulers };
