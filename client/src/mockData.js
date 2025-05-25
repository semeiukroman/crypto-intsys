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
      { date: '2025-05-17', price: 3_120 },
      { date: '2025-05-18', price: 3_155 },
      { date: '2025-05-19', price: 3_140 },
      { date: '2025-05-20', price: 3_170 },
    ],
    DOGE: [
      { date: '2025-05-16', price: 0.158 },
      { date: '2025-05-17', price: 0.160 },
      { date: '2025-05-18', price: 0.168 },
      { date: '2025-05-19', price: 0.163 },
      { date: '2025-05-20', price: 0.165 },
    ],
  };
  
  export const events = [
    {
      id: 1,
      title: 'ETF Approval',
      date: '2025-01-15',
      category: 'Economy',
      crypto: 'BTC',
      description: 'SEC approved first BTC spot ETF',
    },
    {
      id: 2,
      title: 'Musk Tweets DOGE',
      date: '2025-02-10',
      category: 'Pop Culture',
      crypto: 'DOGE',
      description: 'Elon Musk tweets about DOGE 🚀',
    },
    {
      id: 3,
      title: 'Ethereum Cancun Upgrade',
      date: '2025-03-05',
      category: 'Economy',
      crypto: 'ETH',
      description: 'Cancun upgrade activates proto-danksharding',
    },
  ];
  