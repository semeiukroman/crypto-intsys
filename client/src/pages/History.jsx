import { useState, useMemo } from 'react';
import { priceHistoryBySymbol } from '../mockData';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function History() {
  const symbols = Object.keys(priceHistoryBySymbol);
  const [symbol, setSymbol] = useState(symbols[0]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const rawSeries = priceHistoryBySymbol[symbol];

  const series = useMemo(
    () =>
      rawSeries.filter((p) => {
        if (start && p.date < start) return false;
        if (end && p.date > end) return false;
        return true;
      }),
    [rawSeries, start, end],
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold inline-block border-b-4 border-amber-400 mb-6">
        Price History
      </h1>

      {/* controls */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <label>
          <span className="text-sm font-medium">Currency</span>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="block border rounded px-3 py-2"
          >
            {symbols.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium">Start date</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="block border rounded px-3 py-2"
          />
        </label>

        <label>
          <span className="text-sm font-medium">End date</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="block border rounded px-3 py-2"
          />
        </label>
      </div>

      {/* chart */}
      <div className="bg-white shadow rounded p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={series}>
            <Line type="monotone" dataKey="price" stroke="#4f46e5" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
