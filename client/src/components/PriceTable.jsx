const cell = { border: '1px solid #ddd', padding: 8 };

export default function PriceTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-300 rounded-lg divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
              Symbol
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600">
              Price&nbsp;(USD)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.symbol} className="hover:bg-slate-50">
              <td className="px-4 py-2 font-medium">{row.symbol}</td>
              <td className="px-4 py-2">
                {row.price.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

      
