import { useEffect, useState } from "react";
import { FaCar, FaMoneyBill, FaClock, FaParking } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "../../config/axiosInstance";
// const parkingHistory = [
//   {
//     history_id: "HIST001",
//     userId: "USER123",
//     vehicleId: "VEH456",
//     parking_lotid: "LOT789",
//     slotId: "SLOT101",
//     paymentId: "PAY202",
//     entryTime: "2025-03-22 10:00 AM",
//     exitTime: "2025-03-22 12:30 PM",
//     amountPaid: "$15",
//   },
//   {
//     history_id: "HIST002",
//     userId: "USER789",
//     vehicleId: "VEH321",
//     parking_lotid: "LOT555",
//     slotId: "SLOT505",
//     paymentId: "PAY808",
//     entryTime: "2025-03-20 09:00 AM",
//     exitTime: "2025-03-20 11:00 AM",
//     amountPaid: "$12",
//   },
// ];

const ParkingHistory = () => {
  const { user, loading } = useAuth(); // get current user
  if (loading) {
    return <div>Loading user info...</div>;
  }
  const [parkingHistory, setParkingHistory] = useState([]);
  useEffect(() => {
    const fetchParkingHistory = async () => {
      if (!user || !user.userId) return;

      try {
        const response = await axios.get(
          `/api/parking-history/user/${user.userId}`
        );
        console.log(response);

        setParkingHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch parking history:", error);
      }
    };

    fetchParkingHistory();
  }, [user]);

  return (
    // Main container with responsive padding and dark mode background/text colors
    <div className="min-h-screen bg-yellow-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Parking History
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Your previous parking details and payments.
        </p>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          {/*
          On screens smaller than `md` (768px), the table will behave like a block element.
          - The `thead` is hidden.
          - Each `tr` becomes a card with its own border and padding.
          - Each `td` stacks vertically and uses a `data-label` for context.
          On `md` screens and larger, it reverts to a standard table layout.
        */}
          <table className="w-full bg-white dark:bg-gray-800 border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-yellow-500 dark:bg-yellow-600 text-white text-left">
                <th className="p-3 font-semibold">Vehicle</th>
                <th className="p-3 font-semibold">Slot</th>
                <th className="p-3 font-semibold">Entry Time</th>
                <th className="p-3 font-semibold">Exit Time</th>
                <th className="p-3 font-semibold">Payment</th>
              </tr>
            </thead>
            <tbody>
              {parkingHistory.map((history) => (
                <tr
                  key={history.history_id}
                  className="block md:table-row border-b border-gray-300 dark:border-gray-700 md:border-b mb-4 md:mb-0 rounded-lg md:rounded-none shadow-md md:shadow-none"
                >
                  <td
                    data-label="Vehicle"
                    className="p-3 flex items-center justify-between md:table-cell md:text-left border-b md:border-none"
                  >
                    <span className="font-semibold md:hidden mr-2">
                      Vehicle
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCar className="text-blue-600 dark:text-blue-400" />{" "}
                      {history.vehicleId}
                    </span>
                  </td>
                  <td
                    data-label="Slot"
                    className="p-3 flex items-center justify-between md:table-cell md:text-left border-b md:border-none"
                  >
                    <span className="font-semibold md:hidden mr-2">Slot</span>
                    <span>{history.slotId}</span>
                  </td>
                  <td
                    data-label="Entry Time"
                    className="p-3 flex items-center justify-between md:table-cell md:text-left border-b md:border-none"
                  >
                    <span className="font-semibold md:hidden mr-2">
                      Entry Time
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-gray-600 dark:text-gray-400" />{" "}
                      {history.entryTime}
                    </span>
                  </td>
                  <td
                    data-label="Exit Time"
                    className="p-3 flex items-center justify-between md:table-cell md:text-left border-b md:border-none"
                  >
                    <span className="font-semibold md:hidden mr-2">
                      Exit Time
                    </span>
                    <span>{history.exitTime}</span>
                  </td>
                  <td
                    data-label="Payment"
                    className="p-3 flex items-center justify-between md:table-cell md:text-left"
                  >
                    <span className="font-semibold md:hidden mr-2">
                      Payment
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMoneyBill className="text-yellow-600 dark:text-yellow-500" />{" "}
                      {history.amountPaid}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Button */}
        <div className="mt-8 text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300">
            View More History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingHistory;
