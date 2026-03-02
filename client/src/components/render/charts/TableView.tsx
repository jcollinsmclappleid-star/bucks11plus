import type { ChartTableConfig } from "@shared/contentTypes";

interface TableViewProps {
  config: ChartTableConfig;
}

export default function TableView({ config }: TableViewProps) {
  const { title, headers, rows } = config;

  return (
    <div className="space-y-3" data-testid="table-view">
      <h3 className="text-center text-sm font-semibold text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-300 px-4 py-2 text-gray-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
