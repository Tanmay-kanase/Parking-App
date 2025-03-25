import { FaCar, FaMoneyBill, FaClock, FaParking } from "react-icons/fa";

const parkingHistory = [
  {
    history_id: "HIST001",
    userId: "USER123",
    vehicleId: "VEH456",
    parking_lotid: "LOT789",
    slotId: "SLOT101",
    paymentId: "PAY202",
    entryTime: "2025-03-22 10:00 AM",
    exitTime: "2025-03-22 12:30 PM",
    amountPaid: "$15",
  },
  {
    history_id: "HIST002",
    userId: "USER789",
    vehicleId: "VEH321",
    parking_lotid: "LOT555",
    slotId: "SLOT505",
    paymentId: "PAY808",
    entryTime: "2025-03-20 09:00 AM",
    exitTime: "2025-03-20 11:00 AM",
    amountPaid: "$12",
  },
];

const ParkingHistory = () => {
  return (
    <div className="min-h-screen bg-yellow-100 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Parking History
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Your previous parking details and payments.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-yellow-500 text-white text-left">
                <th className="p-3">Vehicle</th>
                <th className="p-3">Parking Lot</th>
                <th className="p-3">Slot</th>
                <th className="p-3">Entry Time</th>
                <th className="p-3">Exit Time</th>
                <th className="p-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {parkingHistory.map((history) => (
                <tr
                  key={history.history_id}
                  className="border-b border-gray-300"
                >
                  <td className="p-3 flex items-center gap-2">
                    <FaCar className="text-blue-600" /> {history.vehicleId}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <FaParking className="text-green-600" />{" "}
                    {history.parking_lotid}
                  </td>
                  <td className="p-3">{history.slotId}</td>
                  <td className="p-3 flex items-center gap-2">
                    <FaClock className="text-gray-600" /> {history.entryTime}
                  </td>
                  <td className="p-3">{history.exitTime}</td>
                  <td className="p-3 flex items-center gap-2">
                    <FaMoneyBill className="text-yellow-600" />{" "}
                    {history.amountPaid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Button */}
        <div className="mt-6 text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
            View More History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingHistory;
