import {
  FaMoneyBill,
  FaCreditCard,
  FaPaypal,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";

// const payments = [
//   {
//     paymentId: "PAY001",
//     userId: "USER123",
//     reservationId: "RES789",
//     amount: 25.99,
//     paymentMethod: "credit_card",
//     status: "completed",
//     paymentTime: "2025-03-22 12:45 PM",
//   },
//   {
//     paymentId: "PAY002",
//     userId: "USER456",
//     reservationId: "RES456",
//     amount: 40.5,
//     paymentMethod: "paypal",
//     status: "failed",
//     paymentTime: "2025-03-20 10:30 AM",
//   },
// ];

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
      <div className="min-h-screen bg-yellow-100 text-center text-xl p-20">
        Loading your payment history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Payments History
        </h2>
        <p className="text-center text-gray-600 mb-6">
          View details of your past payments and transactions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <tr className="bg-yellow-500 text-white text-left">
              <td className="p-3">User</td>
              <td className="p-3">Reservation</td>
              <td className="p-3">Amount</td>
              <td className="p-3">Method</td>
              <td className="p-3">Status</td>
              <td className="p-3">Payment Time</td>
            </tr>

            {payments.map((payment) => (
              <tr key={payment.paymentId} className="border-b border-gray-300">
                <td className="p-3">{payment.userId}</td>
                <td className="p-3">{payment.reservationId}</td>
                <td className="p-3 whitespace-nowrap  items-center gap-2">
                  <>
                    <FaMoneyBill className="text-green-600" />
                  </>
                  <> ${payment.amount} </>
                </td>
                <td className="p-3 whitespace-nowrap items-center gap-2">
                  {payment.paymentMethod === "credit_card" ? (
                    <>
                      <FaCreditCard className="text-blue-600" /> Credit Card
                    </>
                  ) : (
                    <>
                      <FaPaypal className="text-blue-500" /> PayPal
                    </>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap flex items-center gap-2">
                  {payment.status === "completed" ? (
                    <>
                      <FaCheckCircle className="text-green-600" /> Completed
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-600" /> Failed
                    </>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap  items-center gap-2">
                  <FaClock className="text-gray-600" /> {payment.paymentTime}
                </td>
              </tr>
            ))}
          </table>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
            View More Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
