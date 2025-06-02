import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function History() {
  const [symbols, setSymbols] = useState([]);
  const [symbol,  setSymbol]  = useState('');
  const [series,  setSeries]  = useState([]);
  const [from,    setFrom]    = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [to,      setTo]      = useState(dayjs().format('YYYY-MM-DD'));

  /* ─────────────── Load symbol list on mount ───────────────────────── */
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/cryptos');   // you can expose this endpoint
        const list = res.data.map(c => c.symbol);
        setSymbols(list);
        setSymbol(list[0] || '');
      } catch (err) {
        console.error('Fallback to hard-coded symbols'); // if /api/cryptos not ready
        const fallback = ['BTC','ETH','DOGE','BNB','SOL','ADA','XRP','AVAX','LINK','MATIC'];
        setSymbols(fallback);
        setSymbol(fallback[0]);
      }
    }
    load();
  }, []);

  /* ─────────────── Fetch price series whenever inputs change ───────── */
  useEffect(() => {
    if (!symbol) return;
    async function fetchSeries() {
      try {
        const url = `/api/prices/${symbol}?from=${from}&to=${to}`;
        const res = await axios.get(url);
        const s   = res.data.map(r => ({
          date: dayjs(r.date).format('YYYY-MM-DD'),
          price: r.price_usd
        }));
        setSeries(s);
      } catch (err) {
        console.error(err);
        setSeries([]);
      }
    }
    fetchSeries();
  }, [symbol, from, to]);

  /* ───────────────────────── UI ─────────────────────────────────────── */
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold border-b-4 border-amber-400 inline-block mb-6">
        Price History
      </h1>

      <div className="flex flex-wrap gap-4 items-end mb-4">
        {/* Symbol picker */}
        <label className="flex flex-col text-sm">
          Currency
          <select value={symbol} onChange={e => setSymbol(e.target.value)}
                  className="border rounded px-3 py-2">
            {symbols.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>

        {/* Date range pickers */}
        <label className="flex flex-col text-sm">
          From
          <input type="date" value={from} max={to}
                 onChange={e => setFrom(e.target.value)}
                 className="border rounded px-3 py-2" />
        </label>

        <label className="flex flex-col text-sm">
          To
          <input type="date" value={to} min={from}
                 onChange={e => setTo(e.target.value)}
                 className="border rounded px-3 py-2" />
        </label>
      </div>

      <div className="bg-white shadow rounded p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={series}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis width={80} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#4f46e5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
