import { useState, useMemo } from 'react';
import {
  priceSeriesBySymbol,
  events,
  timeIntervals,
} from '../mockData';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import classNames from 'classnames';

/*───────────────────────────────────────────────────────────────────────────
  Utils
───────────────────────────────────────────────────────────────────────────*/
const avg = (arr, key = 'price') =>
  arr.reduce((s, d) => s + d[key], 0) / (arr.length || 1);

function deltaPct(before, after) {
  return ((after - before) / before) * 100;
}

function filterWindow(series, center, hrs, side /* -1 before, 1 after */) {
  return series.filter((p) => {
    const diff = dayjs(p.time).diff(center, 'hour', true); // float hrs
    return side < 0 ? diff >= -hrs && diff < 0 : diff > 0 && diff <= hrs;
  });
}

/*───────────────────────────────────────────────────────────────────────────
  Component
───────────────────────────────────────────────────────────────────────────*/
export default function Analysis() {
  /* --- state ----------------------------------------------------------- */
  const symbols = Object.keys(priceSeriesBySymbol);
  const [symbol, setSymbol] = useState(symbols[0]);
  const [interval, setInterval] = useState(timeIntervals[3].value); // 1 day
  const [eventId, setEventId] = useState(events.find((e) => e.crypto === symbol)?.id);

  const categories = [...new Set(events.map((e) => e.category))];
  const [catInterval, setCatInterval] = useState(timeIntervals[3].value);
  const [category, setCategory] = useState(categories[0]);

  /* --- derived --------------------------------------------------------- */
  const selectedEvent = events.find((e) => e.id === eventId);
  const series = priceSeriesBySymbol[symbol];

  const eventImpact = useMemo(() => {
    if (!selectedEvent) return null;
    const center = selectedEvent.date;
    const before = filterWindow(series, center, interval, -1);
    const after = filterWindow(series, center, interval, 1);
    const avgBefore = avg(before);
    const avgAfter = avg(after);
    return {
      before,
      after,
      center,
      avgBefore,
      avgAfter,
      delta: deltaPct(avgBefore, avgAfter),
    };
  }, [series, selectedEvent, interval]);

  /* Category analysis */
  const catData = useMemo(() => {
    const evts = events.filter((e) => e.category === category);
    const deltas = evts.map((ev) => {
      const s = priceSeriesBySymbol[ev.crypto];
      const before = filterWindow(s, ev.date, catInterval, -1);
      const after = filterWindow(s, ev.date, catInterval, 1);
      return {
        id: ev.id,
        title: ev.title,
        crypto: ev.crypto,
        date: ev.date,
        delta: deltaPct(avg(before), avg(after)),
      };
    });
    const avgDelta = avg(deltas, 'delta');
    const top5 = [...deltas].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 5);
    return { avgDelta, top5 };
  }, [category, catInterval]);

  /*───────────────────────────────────────────────────────────────────────*/
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* 1️⃣ Event Impact Chart */}
      <section>
        <h1 className="text-3xl font-bold border-b-4 border-amber-400 mb-6">
          Event Impact
        </h1>

        {/* controls */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          {/* crypto */}
          <label className="flex flex-col text-sm">
            Cryptocurrency
            <select
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                const ev = events.find((ev) => ev.crypto === e.target.value);
                if (ev) setEventId(ev.id);
              }}
              className="border rounded px-3 py-2"
            >
              {symbols.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* interval */}
          <label className="flex flex-col text-sm">
            Interval
            <select
              value={interval}
              onChange={(e) => setInterval(+e.target.value)}
              className="border rounded px-3 py-2"
            >
              {timeIntervals.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          {/* event */}
          <label className="flex flex-col text-sm">
            Event
            <select
              value={eventId}
              onChange={(e) => setEventId(+e.target.value)}
              className="border rounded px-3 py-2 min-w-[220px]"
            >
              {events
                .filter((e) => e.crypto === symbol)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({dayjs(e.date).format('YYYY-MM-DD')})
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* chart & stats */}
        {eventImpact && (
          <div className="bg-white shadow rounded p-6">
            <div className="flex flex-wrap gap-8 mb-4">
              <div>
                <span className="text-sm text-slate-500">Avg before</span>
                <div className="text-lg font-semibold">
                  {eventImpact.avgBefore.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">Avg after</span>
                <div className="text-lg font-semibold">
                  {eventImpact.avgAfter.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">Δ%</span>
                <div
                  className={classNames(
                    'text-lg font-semibold',
                    eventImpact.delta >= 0 ? 'text-emerald-600' : 'text-red-600',
                  )}
                >
                  {eventImpact.delta.toFixed(2)}%
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(t) => dayjs(t).format('MM-DD HH:mm')}
                />
                <YAxis
                  width={70}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => v.toFixed(0)}
                />
                <Tooltip
                  labelFormatter={(l) => dayjs(l).format('YYYY-MM-DD HH:mm')}
                  formatter={(v) => v.toFixed(2)}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4f46e5"
                  dot={false}
                  isAnimationActive={false}
                />
                <ReferenceLine
                  x={selectedEvent.date}
                  stroke="#eab308"
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
        )}
      </section>

      {/* 2️⃣ Category Analysis */}
      <section>
        <h2 className="text-2xl font-bold border-b-4 border-blue-400 mb-6">
          Category-Based Impact Analysis
        </h2>

        {/* controls */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <label className="flex flex-col text-sm">
            Event category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            Interval
            <select
              value={catInterval}
              onChange={(e) => setCatInterval(+e.target.value)}
              className="border rounded px-3 py-2"
            >
              {timeIntervals.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* charts + list */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* bar chart */}
          <div className="bg-white shadow rounded p-6">
            <h3 className="font-semibold mb-4">
              Average Δ% for {category}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[{ category, delta: catData.avgDelta }]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => v.toFixed(2) + '%'}
                />
                <YAxis type="category" dataKey="category" hide />
                <Tooltip formatter={(v) => v.toFixed(2) + '%'} />
                <Bar
                  dataKey="delta"
                  fill={catData.avgDelta >= 0 ? '#10b981' : '#ef4444'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* top 5 events */}
          <div className="bg-white shadow rounded p-6 overflow-x-auto">
            <h3 className="font-semibold mb-4">Top 5 impactful events</h3>
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                    Event
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                    Crypto
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                    Date
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                    Δ%
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catData.top5.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{e.title}</td>
                    <td className="px-3 py-2">{e.crypto}</td>
                    <td className="px-3 py-2">
                      {dayjs(e.date).format('YYYY-MM-DD')}
                    </td>
                    <td
                      className={classNames(
                        'px-3 py-2 text-right',
                        e.delta >= 0 ? 'text-emerald-600' : 'text-red-600',
                      )}
                    >
                      {e.delta.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
