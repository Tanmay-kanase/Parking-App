import { Archive } from "lucide-react";
import React from "react";
import PaginationFooter from "../../components/PaginationFooter";
import usePagination from "../../hooks/usePagination";

function HistoryTab(userId) {
  const generateHistory = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const entry = new Date(Date.now() - (i + 5) * 3600000);
      const exit = new Date(entry.getTime() + Math.random() * 5 * 3600000);

      return {
        history_id: `H-${500 + i}`,
        vehicleId: `CAR-${1000 + i}`,
        slotId: `S${(i % 10) + 1}`,
        entryTime: entry.toISOString(),
        exitTime: exit.toISOString(),
        amountPaid: (Math.random() * 50).toFixed(2),
      };
    });
  };

  const history = generateHistory(10);
  const historyPagination = usePagination(history, 5);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Historical Parking Log
        </h2>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1">
          <Archive size={16} /> Download Archive
        </button>
        <PaginationFooter paginationProps={historyPagination} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="p-4">History ID</th>
              <th className="p-4">Vehicle ID</th>
              <th className="p-4">Slot</th>
              <th className="p-4">Entry</th>
              <th className="p-4">Exit</th>
              <th className="p-4">Final Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {historyPagination.paginatedData.map((h) => (
              <tr
                key={h.history_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-4 font-medium text-gray-900 dark:text-gray-200">
                  {h.history_id}
                </td>
                <td className="p-4 font-mono text-gray-600 dark:text-gray-400">
                  {h.vehicleId}
                </td>
                <td className="p-4 font-bold text-gray-800 dark:text-gray-300">
                  {h.slotId}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {h.entryTime}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {h.exitTime}
                </td>
                <td className="p-4 font-bold text-green-600 dark:text-green-400">
                  ${h.amountPaid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTab;
