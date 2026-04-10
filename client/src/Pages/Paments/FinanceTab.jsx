import { Download, PieChart, XCircle } from "lucide-react";
import React from "react";
import PaginationFooter from "../../components/PaginationFooter";
import usePagination from "../../hooks/usePagination";

function FinanceTab() {
  const payments = Array.from({ length: 15 }, (_, i) => ({
    paymentId: `PAY-00${i + 1}`,
    transactionId: `TXN-998${i + 1}`,
    paymentMethod: i % 2 === 0 ? "credit_card" : "paypal",
    paymentTime: new Date(Date.now() - i * 10000000).toISOString(),
    amount: Math.floor(Math.random() * 50) + 10,
    status: i % 4 === 0 ? "failed" : "completed",
  }));
  const paymentsPagination = usePagination(payments, 10);
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
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        p.status === "completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
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
