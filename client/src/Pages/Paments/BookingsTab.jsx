import React from "react";
import PaginationFooter from "../../components/PaginationFooter";
import { FileText } from "lucide-react";
import usePagination from "../../hooks/usePagination";

function BookingsTab() {
  // --- YOUR MOCK DATA GOES HERE (bookings, payments, history, etc.) ---
  
  const generateBookings = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      bookingId: `BKG-${100 + i}`,
      slotNumber: `A-${String((i % 5) + 1).padStart(2, "0")}`,
      location: i % 2 === 0 ? "Level 1 - North" : "Level 1 - South",
      amountPaid: +(Math.random() * 20 + 5).toFixed(2),
      paymentStatus: i % 3 === 0 ? "Pending" : "Paid",
      startTime: new Date(Date.now() - i * 3600000).toISOString(),
      endTime: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
      licensePlate: `CAR-${1000 + i}`,
      vehicleType: i % 2 === 0 ? "Car" : "Bike",
    }));
  };

  const bookings = generateBookings(15);
  const bookingsPagination = usePagination(bookings);
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsTab;
