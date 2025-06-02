import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import classNames from 'classnames';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

/* preset intervals */
const INTERVALS = [
  { label: '12 h', value: 12 },
  { label: '1 d',  value: 24 },
  { label: '3 d',  value: 72 },
  { label: '7 d',  value: 168 },
];

/* helpers */
const avg = (arr, k = 'price') => arr.reduce((s, d) => s + d[k], 0) / (arr.length || 1);
const pct = (b, a) => (b === 0 ? 0 : ((a - b) / b) * 100);
const clean = (x) => (!Number.isFinite(x) || Number.isNaN(x) ? 0 : x);   // ⬅️  new

export default function Analysis() {
  /* ─── state ───────────────────────────────────────────────────────── */
  const [cryptos, setCryptos]     = useState([]);
  const [events,  setEvents]      = useState([]);
  const [cats,    setCats]        = useState([]);

  /* selections */
  const [sym,   setSym]   = useState('');
  const [eid,   setEid]   = useState(null);
  const [hrs,   setHrs]   = useState(24);

  const [cat,   setCat]   = useState('');
  const [cHrs,  setCHrs]  = useState(24);

  /* data */
  const [chart, setChart] = useState({ series: [], avgBefore: 0, avgAfter: 0, delta: 0 });
  const [catRes, setCatRes] = useState({ avgDelta: 0, events: [] });

  /* ─── initial load ────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      const [cRes, eRes] = await Promise.all([
        axios.get('/api/cryptos'),
        axios.get('/api/events'),
      ]);

      const syms = cRes.data.map((c) => c.symbol);
      setCryptos(syms);
      setSym(syms[0] || '');

      setEvents(eRes.data);
      const categories = [...new Set(eRes.data.map((e) => e.category))];
      setCats(categories);
      setCat(categories[0] || '');

      /* pick first event for the first symbol */
      const first = eRes.data.find((e) => e.crypto === syms[0]);
      if (first) setEid(first.id);
    })();
  }, []);

  /* ─── fetch event-impact data ─────────────────────────────────────── */
  useEffect(() => {
    if (!eid) return;
    (async () => {
      const r = await axios.get(`/api/analysis/event/${eid}?interval=${hrs}`);
      setChart({
        ...r.data,
        delta: clean(r.data.delta),          // ⬅️  sanitize here too
      });
    })();
  }, [eid, hrs]);

  /* ─── fetch category data ─────────────────────────────────────────── */
  useEffect(() => {
    if (!cat) return;
    (async () => {
      const r = await axios.get(
        `/api/analysis/category?category=${encodeURIComponent(cat)}&interval=${cHrs}`,
      );
      setCatRes({
        avgDelta: clean(r.data.avgDelta),
        events:   r.data.events.map((e) => ({ ...e, delta: clean(e.delta) })), // ⬅️
      });
    })();
  }, [cat, cHrs]);

  /* ─── UI helpers ──────────────────────────────────────────────────── */
  const Select = ({ label, value, onChange, options }) => (
    <label className="flex flex-col text-sm">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 min-w-[180px]"
      >
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </label>
  );

  const Stat = ({ label, value }) => (
    <div>
      <span className="text-sm text-slate-500">{label}</span>
      <div
        className={classNames(
          'text-lg font-semibold',
          value >= 0 ? 'text-emerald-600' : 'text-red-600',
        )}
      >
        {value.toFixed(2)}
      </div>
    </div>
  );

  const selectedEvent = events.find((e) => e.id === eid);

  /* ─── render ──────────────────────────────────────────────────────── */
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* 🟦 Event impact */}
      <section>
        <h1 className="text-3xl font-bold border-b-4 border-amber-400 mb-6">
          Event Impact
        </h1>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <Select label="Cryptocurrency" value={sym} onChange={(v) => {
            setSym(v);
            const ev = events.find((e) => e.crypto === v);
            if (ev) setEid(ev.id);
          }} options={cryptos} />

          <Select
            label="Interval"
            value={hrs}
            onChange={(v) => setHrs(parseInt(v, 10))}
            options={INTERVALS.map((i) => ({ value: i.value, label: i.label }))}
          />

          <Select
            label="Event"
            value={eid || ''}
            onChange={(id) => setEid(parseInt(id, 10))}
            options={events
              .filter((e) => e.crypto === sym)
              .map((e) => ({ value: e.id, label: e.title.slice(0, 60) }))}
          />
        </div>

        {chart.series.length ? (
          <div className="bg-white shadow rounded p-6">
            <div className="flex gap-8 mb-4">
              <Stat label="Avg before" value={chart.avgBefore} />
              <Stat label="Avg after" value={chart.avgAfter} />
              <Stat label="Δ %" value={chart.delta} />
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chart.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(t) => dayjs(t).format('MM-DD HH:mm')}
                />
                <YAxis
                  width={80}
                  domain={['dataMin', 'dataMax']}  // add dynamic buffer
                  tickFormatter={(v) => v.toFixed(0)}
                />
                <Tooltip
                  labelFormatter={(l) => dayjs(l).format('YYYY-MM-DD HH:mm')}
                  formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : String(v))}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4f46e5"
                  dot={false}
                />
                <ReferenceLine
                  x={selectedEvent?.date}
                  stroke="#eab308"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{
                    position: 'top',
                    value: 'Event',
                    fill: '#eab308',
                    fontSize: 12,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-500">No data yet for this selection.</p>
        )}
      </section>

      {/* 🟨 Category analysis */}
      <section>
        <h2 className="text-2xl font-bold border-b-4 border-blue-400 mb-6">
          Category Analysis
        </h2>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <Select label="Category" value={cat} onChange={setCat} options={cats} />
          <Select
            label="Interval"
            value={cHrs}
            onChange={(v) => setCHrs(parseInt(v, 10))}
            options={INTERVALS.map((i) => ({ value: i.value, label: i.label }))}
          />
        </div>

        {catRes.events.length ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Average bar */}
            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-4">Average Δ %</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[{ cat, delta: catRes.avgDelta }]}>
                  <XAxis hide dataKey="cat" />
                  <YAxis tickFormatter={(v) => v.toFixed(1) + '%'} />
                  <Tooltip formatter={(v) => v.toFixed(2) + '%'} />
                  <Bar
                    dataKey="delta"
                    fill={catRes.avgDelta >= 0 ? '#10b981' : '#ef4444'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top events */}
            <div className="bg-white shadow rounded p-6 overflow-x-auto">
              <h3 className="font-semibold mb-4">Top impactful events</h3>
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Event</th>
                    <th className="px-3 py-2 text-left">Crypto</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-right">Δ %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {catRes.events
                    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
                    .slice(0, 5)
                    .map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{ev.title.slice(0, 60)}</td>
                        <td className="px-3 py-2">{ev.crypto}</td>
                        <td className="px-3 py-2">
                          {dayjs(ev.date).format('YYYY-MM-DD')}
                        </td>
                        <td
                          className={classNames(
                            'px-3 py-2 text-right',
                            ev.delta >= 0 ? 'text-emerald-600' : 'text-red-600',
                          )}
                        >
                          {ev.delta.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">No events in this category yet.</p>
        )}
      </section>
    </main>
  );
}
