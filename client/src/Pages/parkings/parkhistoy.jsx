import { useEffect, useMemo, useState } from "react";
import {
  FaCar,
  FaMoneyBill,
  FaClock,
  FaParking,
  FaHistory,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "../../config/axiosInstance";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      active
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        active ? "bg-blue-500" : "bg-green-500"
      }`}
    />
    {active ? "In Progress" : "Completed"}
  </span>
);

const ParkingHistory = () => {
  const { user, loading } = useAuth();
  const [parkingHistory, setParkingHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchParkingHistory = async () => {
      if (!user || !user.userId) return;

      try {
        setIsFetching(true);
        const response = await axios.get(
          `/api/parking-history/user/${user.userId}`,
        );
        setParkingHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch parking history:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchParkingHistory();
  }, [user]);

  const stats = useMemo(() => {
    const totalTrips = parkingHistory.length;
    const totalSpent = parkingHistory.reduce(
      (sum, h) => sum + (h.amountPaid || 0) / 100,
      0,
    );
    const activeTrips = parkingHistory.filter((h) => !h.exitTime).length;
    return { totalTrips, totalSpent, activeTrips };
  }, [parkingHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300">
          <svg
            className="animate-spin h-8 w-8 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Loading user info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Parking History
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your previous parking sessions and payments.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
              <FaHistory className="text-yellow-600 dark:text-yellow-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Trips
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalTrips}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <FaParking className="text-blue-600 dark:text-blue-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Active Sessions
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.activeTrips}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
              <FaWallet className="text-green-600 dark:text-green-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Spent
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currencyFormatter.format(stats.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* History Card */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
          {isFetching ? (
            <div className="p-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg
                className="animate-spin h-6 w-6 text-yellow-500 mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm font-medium">
                Fetching your parking history...
              </span>
            </div>
          ) : parkingHistory.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center mb-4">
                <FaParking className="text-yellow-600 dark:text-yellow-400 text-2xl" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                No parking history yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your completed and active sessions will show up here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Vehicle
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Slot
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Entry Time
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Exit Time
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-right">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parkingHistory.map((history, idx) => (
                      <tr
                        key={history.history_id}
                        className={`border-t border-gray-100 dark:border-gray-700 hover:bg-yellow-50/60 dark:hover:bg-gray-700/40 transition-colors ${
                          idx % 2 === 1
                            ? "bg-gray-50/50 dark:bg-gray-800/40"
                            : ""
                        }`}
                      >
                        <td className="p-4">
                          <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                            <FaCar className="text-blue-600 dark:text-blue-400" />
                            {history.vehicleId}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          {history.slotId}
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaClock className="text-gray-400 dark:text-gray-500 text-sm" />
                            {formatDateTime(history.entryTime)}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          {formatDateTime(history.exitTime)}
                        </td>
                        <td className="p-4">
                          <StatusBadge active={!history.exitTime} />
                        </td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                            <FaMoneyBill className="text-yellow-600 dark:text-yellow-500 text-sm" />
                            {currencyFormatter.format(
                              (history.amountPaid || 0) / 100,
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                {parkingHistory.map((history) => (
                  <div key={history.history_id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                        <FaCar className="text-blue-600 dark:text-blue-400" />
                        {history.vehicleId}
                      </span>
                      <StatusBadge active={!history.exitTime} />
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                          Slot
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {history.slotId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                          Payment
                        </p>
                        <p className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                          <FaMoneyBill className="text-yellow-600 dark:text-yellow-500 text-xs" />
                          {currencyFormatter.format(
                            (history.amountPaid || 0) / 100,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                          Entry
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {formatDateTime(history.entryTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                          Exit
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {formatDateTime(history.exitTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Button */}
        {parkingHistory.length > 0 && (
          <div className="mt-8 text-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-300">
              View More History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingHistory;
