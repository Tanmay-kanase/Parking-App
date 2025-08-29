/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import {
  FaCar,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaParking,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user || !user.userId) return;
    const fetchBookings = async () => {
      console.log("Fetchin user for userid", user);
      console.log("Fetching bookings for userId:", user.userId);

      if (!user.userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/user/${user.userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user]);
  console.log("Booking : ", bookings);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
          Bookings History
        </h2>
        <p className="text-center text-gray-400 mb-8">
          View details of your past parking bookings.
        </p>

        {/* Responsive Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4"
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
                <FaCar className="text-blue-400" /> {booking.licensePlate}
              </h3>

              <p className="text-gray-400 flex items-center gap-2">
                <FaParking className="text-gray-300" /> Slot:{" "}
                {booking.slotNumber}
              </p>

              <p className="text-gray-400">
                Location:{" "}
                <span className="font-medium">{booking.location}</span>
              </p>

              <p className="text-gray-400">
                Vehicle Type:{" "}
                <span className="font-medium">{booking.vehicleType}</span>
              </p>

              <p className="text-gray-400">
                Start Time:{" "}
                <span className="font-medium">
                  {new Date(booking.startTime).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </p>

              <p className="text-gray-400">
                End Time:{" "}
                <span className="font-medium">
                  {new Date(booking.startTime).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </p>

              <p className="text-gray-400">
                Payment Method:{" "}
                <span className="font-medium">{booking.paymentMethod}</span>
              </p>

              <p className="text-gray-400">
                Payment Status:{" "}
                <span className="font-medium text-green-400">
                  {booking.paymentStatus}
                </span>
              </p>

              <p
                className={`text-lg font-semibold flex items-center gap-2 ${
                  new Date() > new Date(booking.endTime)
                    ? "text-blue-400"
                    : new Date() < new Date(booking.startTime)
                    ? "text-yellow-400"
                    : "text-green-400"
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
                <p className="text-gray-200 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-green-400" /> Paid: $
                  {booking.amountPaid}
                </p>
                <p className="text-gray-200 font-semibold flex items-center gap-2">
                  <FaDollarSign className="text-gray-300" /> Total: $
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
