import { useState } from 'react';
import PriceTable from '../components/PriceTable';
import { prices } from '../mockData';

export default function Home() {
  const [data, setData] = useState(prices);

  const updatePrices = () => {
    // TODO: replace with real fetch
    alert('Would fetch latest prices here');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold inline-block border-b-4 border-amber-400 mb-6">
        Live Prices
      </h1>

      <div>
        <button
          onClick={updatePrices}
          className="mb-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          ⟳ Update Prices
        </button>

        <PriceTable data={data} />
      </div>
      
    </main>
  );
}
