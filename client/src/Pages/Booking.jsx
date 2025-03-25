import {
  FaCar,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaParking,
} from "react-icons/fa";

const bookings = [
  {
    bookingId: "BK001",
    userId: "USER123",
    vehicleId: "VH1234",
    slotId: "SLOT56",
    startTime: "2025-03-22 09:00 AM",
    endTime: "2025-03-22 12:00 PM",
    status: "active",
    amountPaid: 10.0,
    totalCost: 15.0,
  },
  {
    bookingId: "BK002",
    userId: "USER456",
    vehicleId: "VH5678",
    slotId: "SLOT21",
    startTime: "2025-03-20 02:00 PM",
    endTime: "2025-03-20 05:00 PM",
    status: "completed",
    amountPaid: 15.0,
    totalCost: 15.0,
  },
  {
    bookingId: "BK003",
    userId: "USER789",
    vehicleId: "VH9876",
    slotId: "SLOT33",
    startTime: "2025-03-19 10:00 AM",
    endTime: "2025-03-19 12:00 PM",
    status: "cancelled",
    amountPaid: 5.0,
    totalCost: 12.0,
  },
];

const MyBookings = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Bookings History
        </h2>
        <p className="text-center text-gray-600 mb-8">
          View details of your past parking bookings.
        </p>

        {/* Responsive Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4 "
              style={{
                borderColor:
                  booking.status === "active"
                    ? "#10b981"
                    : booking.status === "completed"
                    ? "#3b82f6"
                    : "#ef4444",
              }}
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaCar className="text-blue-500" /> {booking.vehicleId}
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                <FaParking className="text-gray-700" /> Slot: {booking.slotId}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaClock className="text-gray-700" /> {booking.startTime} -{" "}
                {booking.endTime}
              </p>
              <p
                className={`text-lg font-semibold flex items-center gap-2 ${
                  booking.status === "active"
                    ? "text-green-600"
                    : booking.status === "completed"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {booking.status === "active" ? (
                  <FaCheckCircle />
                ) : booking.status === "completed" ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-green-600" /> Paid: $
                  {booking.amountPaid}
                </p>
                <p className="text-gray-800 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-gray-700" /> Total: $
                  {booking.totalCost}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-10 text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300">
            View More Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
