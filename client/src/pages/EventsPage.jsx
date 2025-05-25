import { useState, useMemo } from 'react';
import { events } from '../mockData';
import dayjs from 'dayjs';

export default function EventsPage() {
  const [category, setCategory] = useState('All');
  const [crypto, setCrypto] = useState('All');
  const [asc, setAsc] = useState(true);

  const categories = ['All', ...new Set(events.map((e) => e.category))];
  const cryptos = ['All', ...new Set(events.map((e) => e.crypto))];

  const filtered = useMemo(
    () =>
      events
        .filter((e) => (category === 'All' ? true : e.category === category))
        .filter((e) => (crypto === 'All' ? true : e.crypto === crypto))
        .sort((a, b) =>
          asc
            ? dayjs(a.date).unix() - dayjs(b.date).unix()
            : dayjs(b.date).unix() - dayjs(a.date).unix(),
        ),
    [category, crypto, asc],
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold inline-block border-b-4 border-amber-400 mb-6">
        Events
      </h1>

      {/* filters */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <label>
          <span className="text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block border rounded px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium">Currency</span>
          <select
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            className="block border rounded px-3 py-2"
          >
            {cryptos.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setAsc((prev) => !prev)}
          className="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Sort by date {asc ? '↓' : '↑'}
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-300 rounded-lg divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
                Category
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
                Crypto
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">{e.title}</td>
                <td className="px-4 py-2">{e.date}</td>
                <td className="px-4 py-2">{e.category}</td>
                <td className="px-4 py-2">{e.crypto}</td>
                <td className="px-4 py-2">{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
