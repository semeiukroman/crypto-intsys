import dayjs from 'dayjs';

/*───────────────────────────────────────────────────────────────────────────
  Helper – make hourly points around an event date
───────────────────────────────────────────────────────────────────────────*/
function genSeries(base, startHours, endHours) {
  if (typeof base.price !== 'number') throw new Error('base.price missing');
  const baseTime = base.date || '2025-01-01T00:00:00Z';
  const data = [];

  for (let h = startHours; h <= endHours; h += 3) {
    const timestamp = dayjs(baseTime).add(h, 'hour').toISOString();
    const price =
      base.price *
      (1 + (Math.random() - 0.5) * 0.015) *
      (h > 0 ? 1 + h * 0.0008 : 1);

    data.push({ time: timestamp, price: parseFloat(price.toFixed(2)) });
  }

  return data;
}

/*───────────────────────────────────────────────────────────────────────────
  Events – same as before (plus ISO datetime for precision)
───────────────────────────────────────────────────────────────────────────*/
export const events = [
  {
    id: 1,
    title: 'ETF Approval',
    date: '2025-01-15T12:00:00Z',
    category: 'Economy',
    crypto: 'BTC',
    description: 'SEC approved first BTC spot ETF',
  },
  {
    id: 2,
    title: 'Musk Tweets DOGE',
    date: '2025-02-10T18:00:00Z',
    category: 'Pop Culture',
    crypto: 'DOGE',
    description: 'Elon Musk tweets about DOGE 🚀',
  },
  {
    id: 3,
    title: 'Ethereum Cancun Upgrade',
    date: '2025-03-05T09:00:00Z',
    category: 'Economy',
    crypto: 'ETH',
    description: 'Cancun upgrade activates proto-danksharding',
  },
];

/*───────────────────────────────────────────────────────────────────────────
  Fine-grained price series, keyed by symbol
───────────────────────────────────────────────────────────────────────────*/
export const priceSeriesBySymbol = {
  BTC: genSeries({ price: 68000 }, -24, 24),
  ETH: genSeries({ price: 3200 }, -24, 24),
  DOGE: genSeries({ price: 0.17 }, -24, 24),
};

// export const priceSeriesBySymbol = {
//   BTC: [{ time: '2025-01-01T00:00:00Z', price: 68000 }],
//   ETH: [{ time: '2025-01-01T00:00:00Z', price: 3200 }],
//   DOGE: [{ time: '2025-01-01T00:00:00Z', price: 0.17 }],
// };

/*───────────────────────────────────────────────────────────────────────────
  Time-interval presets (in hours)
───────────────────────────────────────────────────────────────────────────*/
export const timeIntervals = [
  { label: '1 h', value: 1 },
  { label: '3 h', value: 3 },
  { label: '12 h', value: 12 },
  { label: '1 d', value: 24 },
  { label: '3 d', value: 72 },
  { label: '7 d', value: 168 },
];


export const prices = [
    { symbol: 'BTC', price: 67_900 },
    { symbol: 'ETH', price: 3_170 },
    { symbol: 'DOGE', price: 0.165 },
  ];
  
  export const priceHistoryBySymbol = {
    BTC: [
      { date: '2025-05-16', price: 67_000 },
      { date: '2025-05-17', price: 67_500 },
      { date: '2025-05-18', price: 68_050 },
      { date: '2025-05-19', price: 67_800 },
      { date: '2025-05-20', price: 68_100 },
    ],
    ETH: [
      { date: '2025-05-16', price: 3_090 },
      { date: '2025-05-17', price: 2_120 },
      { date: '2025-05-18', price: 1_155 },
      { date: '2025-05-19', price: 3_140 },
      { date: '2025-05-20', price: 3_500 },
    ],
    DOGE: [
      { date: '2025-05-16', price: 0.158 },
      { date: '2025-05-17', price: 0.160 },
      { date: '2025-05-18', price: 0.168 },
      { date: '2025-05-19', price: 0.163 },
      { date: '2025-05-20', price: 0.165 },
    ],
  };

  