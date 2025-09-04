import {
  FaMoneyBill,
  FaCreditCard,
  FaPaypal,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Payments = () => {
  const { user, loading } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payments/user/${user.userId}`
        );
        setPayments(res.data);
        console.log("Response from the backend ", res.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    fetchPayments();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-100 text-center text-xl p-20 dark:bg-gray-900 dark:text-gray-100">
        Loading your payment history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 text-gray-900 p-4 sm:p-8 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 dark:bg-gray-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2 sm:mb-4 dark:text-gray-100">
          Payments History
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 dark:text-gray-400">
          View details of your past payments and transactions.
        </p>

        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.paymentId}
                className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center dark:bg-gray-700 dark:border-gray-600"
              >
                <div className="flex flex-col mb-2 sm:mb-0">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      User:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {payment.userId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Reservation:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {payment.reservationId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Amount:
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-bold dark:text-green-400">
                      <FaMoneyBill /> ${payment.amount}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end space-y-2">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Method:
                    </span>
                    {payment.paymentMethod === "credit_card" ? (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <FaCreditCard /> Credit Card
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-500 dark:text-blue-300">
                        <FaPaypal /> PayPal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Status:
                    </span>
                    {payment.status === "completed" ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <FaCheckCircle /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <FaTimesCircle /> Failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Time:
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FaClock /> {payment.paymentTime}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6">
              No payments found.
            </div>
          )}
        </div>

        {payments.length > 0 && (
          <div className="mt-4 sm:mt-6 text-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition-colors duration-300">
              View More Payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
