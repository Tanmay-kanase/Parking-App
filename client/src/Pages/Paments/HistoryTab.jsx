import { Archive } from "lucide-react";
import React, { useEffect, useState } from "react";
import PaginationFooter from "../../components/PaginationFooter";
import usePagination from "../../hooks/usePagination";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Archive } from "lucide-react";
import React from "react";
import PaginationFooter from "../../components/PaginationFooter";
import usePagination from "../../hooks/usePagination";

function HistoryTab(userId) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/parking-history/user/${user.userId}`,
        );

        // Map the backend data to match the table's expected format
        const formattedData = response.data.map((h) => ({
          // Using h.histroy_id to match the typo in your Spring Boot model
          history_id: h.histroy_id || h.historyId || "N/A",
          vehicleId: h.vehicleId || "N/A",
          slotId: h.slotId || "N/A",
          entryTime: h.entryTime
            ? new Date(h.entryTime).toLocaleString()
            : "N/A",
          exitTime: h.exitTime ? new Date(h.exitTime).toLocaleString() : "N/A",
          amountPaid: h.amountPaid || "0.00",
          parking_lot_id: h.parking_lot_id, // Keep this for potential filtering later
        }));

        // Optional: If you only want to show history for the currently selected location from the dropdown
        const filteredByLocation = locationId
          ? formattedData.filter((h) => h.parking_lot_id === locationId)
          : formattedData;

        setHistory(filteredByLocation);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load historical data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, locationId]); // Re-run if user or selected location changes

  const historyPagination = usePagination(history, 5);

  if (loading) return <p className="text-gray-500">Loading history...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
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
