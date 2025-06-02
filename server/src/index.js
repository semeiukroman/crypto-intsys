require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const priceRoutes = require('./routes/priceRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const { startSchedulers } = require('./jobs/scheduler');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/prices',  priceRoutes);
  app.use('/api/events',  eventRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/cryptos', cryptoRoutes);
  app.use('/api/analysis', analysisRoutes);

  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  startSchedulers();

  app.listen(process.env.PORT, () =>
    console.log(`Server listening on port :${process.env.PORT}`)
  );
}

start();
