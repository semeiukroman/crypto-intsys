const axios = require('axios');
const { Event, Cryptocurrency } = require('../models');
const dayjs = require('dayjs');

const API_KEY = process.env.NEWS_API_KEY;
const Q = process.env.NEWS_QUERY;

async function fetchEvents() {

  const url =
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(Q)}&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;

  const { data } = await axios.get(url, { timeout: 10_000 });
  const articles = data.articles ?? [];

  console.log(`📰 Fetched ${articles.length} articles from NewsAPI`);

  for (const art of articles) {
    const title = art.title?.slice(0, 190) || 'Untitled';
    const date  = art.publishedAt || art.updatedAt || new Date();
    const description = art.description || art.url;

    function detectCategory(text) {
      const t = text.toLowerCase();
    
      if (/fed|interest rate|inflation|cpi|unemployment|recession|etf|stocks|bond|gdp/.test(t)) {
        return 'Economy';
      }
    
      if (/regulation|law|ban|government|policy|election|senate|congress|sec|lawsuit/.test(t)) {
        return 'Politics';
      }
    
      if (/celebrity|elon musk|trending|meme|hype|tiktok|social media|viral|pop star/.test(t)) {
        return 'Pop Culture';
      }
    
      return 'General';
    }

    const category = detectCategory(title + ' ' + description);

    const symbols = ['BTC', 'ETH', 'DOGE', 'BNB', 'SOL', 'ADA', 'XRP', 'AVAX', 'LINK', 'MATIC'];

    const cryptoMatch = symbols.find(sym =>
    title.toUpperCase().includes(sym) || description?.toUpperCase().includes(sym)
    );
    if (!cryptoMatch) continue;

    const crypto = await Cryptocurrency.findOne({ where: { symbol: cryptoMatch } });
    if (!crypto) continue;

    const exists = await Event.findOne({ where: { title } });
    if (exists) continue;
    console.log(`✅ Inserting event: ${title}`);


    await Event.create({
      title,
      date,
      category,
      cryptoId: crypto.id,
      description
    });
  }
  return { added: articles.length };
}

module.exports = { fetchEvents };
