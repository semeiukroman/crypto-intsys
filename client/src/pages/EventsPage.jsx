import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function EventsPage() {
  /* data -------------------------------------------------------------- */
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cryptos, setCryptos] = useState([]);

  /* filters ----------------------------------------------------------- */
  const [category, setCategory] = useState('All');
  const [crypto,   setCrypto]   = useState('All');
  const [asc,      setAsc]      = useState(true);

  /* load from backend once ------------------------------------------- */
  useEffect(() => {
    async function load() {
      /* fetch every event just once */
      const evRes = await axios.get('/api/events');
      setEvents(evRes.data);

      /* get distinct categories */
      const cats = [...new Set(evRes.data.map(e => e.category))];
      setCategories(['All', ...cats]);

      /* fetch crypto list for filter dropdown */
      try {
        const cRes = await axios.get('/api/cryptos');
        const syms = cRes.data.map(c => c.symbol);
        setCryptos(['All', ...syms]);
      } catch {
        const fallback = [...new Set(evRes.data.map(e => e.crypto))];
        setCryptos(['All', ...fallback]);
      }
    }
    load();
  }, []);

  /* filtered + sorted list ------------------------------------------- */
  const filtered = useMemo(() => {
    return events
      .filter(e => (category === 'All' ? true : e.category === category))
      .filter(e => (crypto   === 'All' ? true : (e.crypto || e.Cryptocurrency?.symbol) === crypto))
      .sort((a, b) =>
        asc
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date),
      );
  }, [events, category, crypto, asc]);

  /* ui ---------------------------------------------------------------- */
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold inline-block border-b-4 border-amber-400 mb-6">
        Events
      </h1>

      {/* filters */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <label className="flex flex-col text-sm">
          Category
          <select value={category} onChange={e => setCategory(e.target.value)}
                  className="border rounded px-3 py-2">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          Currency
          <select value={crypto} onChange={e => setCrypto(e.target.value)}
                  className="border rounded px-3 py-2">
            {cryptos.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        <button onClick={() => setAsc(p => !p)}
                className="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded shadow">
          Sort by date {asc ? '↓' : '↑'}
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-300 rounded-lg divide-y divide-slate-200">
          <thead className="bg-slate-50 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Crypto</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">{e.title}</td>
                <td className="px-4 py-2">{dayjs(e.date).format('YYYY-MM-DD')}</td>
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
