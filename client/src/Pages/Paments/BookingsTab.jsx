import React, { useEffect, useState } from "react";
import PaginationFooter from "../../components/PaginationFooter";
import { FileText } from "lucide-react";
import usePagination from "../../hooks/usePagination";
import axios from "../../config/axiosInstance";
function BookingsTab() {
  // --- YOUR MOCK DATA GOES HERE (bookings, payments, history, etc.) ---

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "/api/bookings/location/69d7d255bae40612cb6796be",
        );

        // Axios already gives data in response.data
        const data = response.data;

        const formattedData = data.map((item) => ({
          bookingId: item.bookingId.slice(0, 5),
          slotNumber: item.slotNumber,
          location: item.location,
          amountPaid: item.amountPaid / 100, // paise → rupees
          paymentStatus: item.paymentStatus,
          startTime: item.startTime,
          endTime: item.endTime,
          licensePlate: item.licensePlate,
          vehicleType: item.vehicleType,
        }));

        console.log(formattedData);
        setBookings(formattedData);
      } catch (err) {
        console.error(err);

        // Better error handling
        if (err.response) {
          setError(err.response.data.message || "Server error");
        } else if (err.request) {
          setError("No response from server");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const bookingsPagination = usePagination(bookings);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Current Active Bookings
        </h2>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1">
          <FileText size={16} /> Print List
        </button>
        <PaginationFooter paginationProps={bookingsPagination} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
            <tr>
              <th className="p-4">Booking ID</th>
              <th className="p-4">Slot & Location</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Time Window</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {bookingsPagination.paginatedData.map((b) => (
              <tr
                key={b.bookingId}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-4 font-medium text-gray-900 dark:text-gray-200">
                  {b.bookingId}
                </td>
                <td className="p-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {b.slotNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {b.location}
                  </p>
                </td>
                <td className="p-4">
                  <p className="text-gray-900 dark:text-gray-200">
                    {b.licensePlate}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {b.vehicleType}
                  </p>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <span className="font-medium">In:</span>{" "}
                    {new Date(b.startTime).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Out:</span>{" "}
                    {new Date(b.endTime).toLocaleString()}
                  </div>
                </td>
                <td className="p-4 font-bold text-green-600 dark:text-green-400">
                  ${b.amountPaid.toFixed(2)}
                </td>
                <td className="p-4">
                  <p
                    style={{
                      color:
                        b.paymentStatus === "Completed" ? "green" : "orange",
                    }}
                  >
                    {b.paymentStatus}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsTab;
