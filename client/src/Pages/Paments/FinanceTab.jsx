import { Download, PieChart, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import PaginationFooter from "../../components/PaginationFooter";
import usePagination from "../../hooks/usePagination";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";
function FinanceTab({ locationId }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      // Return early if we don't have the user yet
      if (!user?.userId) return;

      try {
        setLoading(true);
        // Fetching by userId based on your PaymentController
        const response = await axios.get(`/api/payments/user/${user.userId}`);

        // Map backend variables to match your existing frontend keys safely
        const formattedData = response.data.map((p) => ({
          paymentId: p.paymentId || "N/A",
          transactionId: p.transactionId || "N/A",
          paymentMethod: p.paymentMethod || "unknown",
          paymentTime: p.paymentTime || new Date().toISOString(),
          // Note: If Razorpay saves this to your DB in paise, change this to p.amount / 100
          amount: p.amount / 100 || 0,
          status: p.status || "pending",
        }));

        // Optional: Sort so newest payments are on top
        formattedData.sort(
          (a, b) => new Date(b.paymentTime) - new Date(a.paymentTime),
        );

        setPayments(formattedData);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const paymentsPagination = usePagination(payments, 10);

  // Return loading/error states before rendering the main UI
  if (loading)
    return <p className="text-gray-500">Loading financial data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-xl shadow-sm">
          <h3 className="text-blue-100 dark:text-blue-200 mb-2">
            Total Revenue (This Month)
          </h3>
          <p className="text-3xl font-bold">$3,240.50</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm flex flex-col justify-center items-start gap-3 hover:border-blue-300 dark:hover:border-blue-600 transition cursor-pointer">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <PieChart size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">
              Tax & Revenue Ledger
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download formatted PDF for accounting.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm flex flex-col justify-center items-start gap-3 hover:border-blue-300 dark:hover:border-blue-600 transition cursor-pointer">
          <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <XCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">
              Failed Transactions Report
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PDF of all failed or disputed payments.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg p-4 font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          {/* Pagination Footer */}
          <PaginationFooter paginationProps={paymentsPagination} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4">Payment / TXN ID</th>
                <th className="p-4">Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paymentsPagination.paginatedData.map((p) => (
                <tr
                  key={p.paymentId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-200">
                      {p.paymentId}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {p.transactionId}
                    </div>
                  </td>
                  <td className="p-4 capitalize text-gray-700 dark:text-gray-300">
                    {p.paymentMethod.replace("_", " ")}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(p.paymentTime).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">
                    {p.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 font-medium">
                      <Download size={16} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FinanceTab;
