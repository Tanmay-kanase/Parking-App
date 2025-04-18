import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCar,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaParking,
} from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/user/${userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);
  console.log("Booking : ", bookings);

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
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4"
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
                <FaCar className="text-blue-500" /> {booking.licensePlate}
              </h3>

              <p className="text-gray-600 flex items-center gap-2">
                <FaParking className="text-gray-700" /> Slot:{" "}
                {booking.slotNumber}
              </p>

              <p className="text-gray-600">
                Location:{" "}
                <span className="font-medium">{booking.location}</span>
              </p>

              <p className="text-gray-600">
                Vehicle Type:{" "}
                <span className="font-medium">{booking.vehicleType}</span>
              </p>

              <p className="text-gray-600">
                Start Time:{" "}
                <span className="font-medium">
                  {new Date(booking.startTime).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </p>

              <p className="text-gray-600">
                End Time:{" "}
                <span className="font-medium">
                  {new Date(booking.startTime).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </p>

              <p className="text-gray-600">
                Payment Method:{" "}
                <span className="font-medium">{booking.paymentMethod}</span>
              </p>

              <p className="text-gray-600">
                Payment Status:{" "}
                <span className="font-medium text-green-600">
                  {booking.paymentStatus}
                </span>
              </p>

              <p
                className={`text-lg font-semibold flex items-center gap-2 ${
                  new Date() > new Date(booking.endTime)
                    ? "text-blue-600"
                    : new Date() < new Date(booking.startTime)
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {new Date() > new Date(booking.endTime) ? (
                  <FaCheckCircle />
                ) : new Date() < new Date(booking.startTime) ? (
                  <FaClock />
                ) : (
                  <FaCar />
                )}

                {new Date() > new Date(booking.endTime)
                  ? "Parking Completed"
                  : new Date() < new Date(booking.startTime)
                  ? "Upcoming"
                  : "Ongoing"}
              </p>

              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-green-600" /> Paid: $
                  {booking.amountPaid}
                </p>
                <p className="text-gray-800 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-gray-700" /> Total: $
                  {booking.totalCost || booking.amountPaid}
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
