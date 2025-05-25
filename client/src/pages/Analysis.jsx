import { priceHistoryBySymbol, events } from '../mockData';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Analysis() {
  const symbol = 'BTC'; // hard-coded demo; will become a selector later
  const series = priceHistoryBySymbol[symbol];
  const event = events.find((e) => e.crypto === symbol);

  const data = useMemo(() => {
    const cut = event?.date ?? '';
    const pre = series.filter((p) => p.date < cut);
    const post = series.filter((p) => p.date >= cut);

    const avg = (arr) =>
      arr.reduce((s, d) => s + d.price, 0) / (arr.length || 1);

    return [
      { name: 'Pre-Event', avg: avg(pre) },
      { name: 'Post-Event', avg: avg(post) },
    ];
  }, [series, event]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold inline-block border-b-4 border-amber-400 mb-6">
        Impact Analysis ({symbol})
      </h1>

      <div className="bg-white shadow rounded p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
