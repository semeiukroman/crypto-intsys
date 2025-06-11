import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import PriceTable from '../components/PriceTable';

const SYMBOLS = ['BTC','ETH','DOGE','BNB','SOL','ADA','XRP','AVAX','LINK','MATIC'];

export default function Home() {
  const [data, setData]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('json');

  useEffect(() => {
    refreshPrices();
  }, []);

  async function refreshPrices() {
    try {
      setLoading(true);
      
      await axios.post(`/api/prices/refresh`);

      const results = await Promise.all(
        SYMBOLS.map(async (sym) => {
          const res   = await axios.get(`/api/prices/${sym}`);
          const row   = res.data.at(-1);
          return { symbol: sym, price: row?.price_usd ?? 0, date: row?.date };
        }),
      );
      setData(results);
    } catch (err) {
      console.error(err);
      alert('Error fetching prices — check console');
    } finally {
      setLoading(false);
    }
  }

  function exportTable() {
    const ts = dayjs().format('YYYYMMDD-HHmm');
    if (exportType === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      saveAs(blob, `crypto-prices-${ts}.json`);
    } else {
      const xmlRows = data
        .map(p => `<price symbol="${p.symbol}" value="${p.price}" date="${p.date ?? ''}" />`)
        .join('\n  ');
      const xml = `<?xml version="1.0"?>\n<prices>\n  ${xmlRows}\n</prices>`;
      const blob = new Blob([xml], { type: 'application/xml' });
      saveAs(blob, `crypto-prices-${ts}.xml`);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-3xl font-bold border-b-4 border-amber-400 inline-block">Live Prices</h1>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={refreshPrices}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-2 rounded shadow"
        >
          {loading ? 'Updating…' : '⟳ Update Prices'}
        </button>

        <label className="flex items-center gap-2 text-sm">
          Export as
          <select value={exportType} onChange={e => setExportType(e.target.value)}
                  className="border rounded px-2 py-1">
            <option value="json">JSON</option>
            <option value="xml">XML</option>
          </select>
        </label>

        <button onClick={exportTable}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded shadow">
          💾 Save
        </button>
      </div>

      <PriceTable data={data} />
    </main>
  );
}
