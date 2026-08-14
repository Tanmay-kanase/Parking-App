import { useEffect, useMemo, useState } from "react";
import axios from "../../config/axiosInstance";
import {
  FaCar,
  FaClock,
  FaMoneyBill,
  FaCheckCircle,
  FaParking,
  FaDownload,
  FaCalendarCheck,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const getBookingStatus = (booking) => {
  const now = new Date();
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  if (now > end) {
    return {
      label: "Parking Completed",
      icon: FaCheckCircle,
      textClass: "text-blue-600 dark:text-blue-400",
      borderColor: "#3b82f6",
    };
  }
  if (now < start) {
    return {
      label: "Upcoming",
      icon: FaClock,
      textClass: "text-yellow-600 dark:text-yellow-400",
      borderColor: "#eab308",
    };
  }
  return {
    label: "Ongoing",
    icon: FaCar,
    textClass: "text-green-600 dark:text-green-400",
    borderColor: "#10b981",
  };
};

const getPaymentStatusClasses = (status) => {
  const normalized = (status || "").toLowerCase();
  if (["paid", "success", "completed"].includes(normalized)) {
    return "text-green-600 dark:text-green-400";
  }
  if (["pending", "processing"].includes(normalized)) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  if (["failed", "cancelled", "refunded"].includes(normalized)) {
    return "text-red-600 dark:text-red-400";
  }
  return "text-gray-600 dark:text-gray-400";
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  useEffect(() => {
    if (!user || !user.userId) return;

    const fetchBookings = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/api/bookings/user/${user.userId}`);
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime),
        );
        setBookings(sorted); // CHANGED from setBookings(response.data)
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBookings();
  }, [user]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(
      (b) => new Date() < new Date(b.startTime),
    ).length;
    const ongoing = bookings.filter(
      (b) =>
        new Date() >= new Date(b.startTime) &&
        new Date() <= new Date(b.endTime),
    ).length;
    const totalSpent = bookings.reduce(
      (sum, b) => sum + (b.amountPaid || 0) / 100,
      0,
    );
    return { total, upcoming, ongoing, totalSpent };
  }, [bookings]);

  const downloadRec = async (booking) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(booking.bookingId, {
        width: 200,
        margin: 1,
      });

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Parking Booking Receipt", 20, 20);

      doc.setFontSize(11);
      const lines = [
        `Booking ID: ${booking.bookingId}`,
        `License Plate: ${booking.licensePlate}`,
        `Slot: ${booking.slotNumber}`,
        `Location: ${booking.location}`,
        `Vehicle Type: ${booking.vehicleType}`,
        `Start: ${new Date(booking.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
        `End: ${new Date(booking.endTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
        `Payment Method: ${booking.paymentMethod}`,
        `Payment Status: ${booking.paymentStatus}`,
        `Amount Paid: ${currencyFormatter.format((booking.amountPaid || 0) / 100)}`,
      ];

      let y = 35;
      lines.forEach((line) => {
        doc.text(line, 20, y);
        y += 8;
      });

      doc.addImage(qrDataUrl, "PNG", 20, y + 5, 50, 50);

      doc.save(`receipt-${booking.bookingId}.pdf`);
    } catch (err) {
      console.error("Failed to generate receipt:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bookings History
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View details of your past parking bookings.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <FaCalendarCheck className="text-blue-600 dark:text-blue-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Bookings
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
              <FaCar className="text-green-600 dark:text-green-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Ongoing
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.ongoing}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
              <FaClock className="text-yellow-600 dark:text-yellow-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Upcoming
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.upcoming}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <FaWallet className="text-emerald-600 dark:text-emerald-400 text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Spent
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currencyFormatter.format(stats.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings */}
        {isFetching ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <svg
              className="animate-spin h-6 w-6 text-yellow-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm font-medium">
              Fetching your bookings...
            </span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center mb-4">
              <FaParking className="text-yellow-600 dark:text-yellow-400 text-2xl" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              No bookings yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your upcoming and past bookings will show up here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const status = getBookingStatus(booking);
              const StatusIcon = status.icon;

              return (
                <div
                  key={booking.bookingId}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 border border-gray-100 dark:border-gray-700 border-l-4"
                  style={{ borderLeftColor: status.borderColor }}
                >
                  <div className="flex items-center justify-between gap-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <FaCar className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{booking.licensePlate}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadRec(booking);
                      }}
                      aria-label="Download Receipt"
                      title="Download Receipt"
                      className="flex items-center justify-center p-2 text-sm text-gray-600 transition-colors border-2 border-gray-200 rounded-full dark:text-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    >
                      <FaDownload />
                    </button>
                  </div>

                  <p
                    className={`text-sm font-semibold flex items-center gap-2 ${status.textClass}`}
                  >
                    <StatusIcon />
                    {status.label}
                  </p>

                  {(status.label === "Ongoing" ||
                    status.label === "Upcoming") && (
                    <div className="flex justify-center py-3 border-t border-gray-100 dark:border-gray-700">
                      <QRCodeSVG
                        value={booking.bookingId}
                        size={120}
                        bgColor="transparent"
                        fgColor="currentColor"
                        className="text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <FaParking className="text-gray-400 dark:text-gray-500" />
                      Slot:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {booking.slotNumber}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      Location:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {booking.location}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      Vehicle Type:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {booking.vehicleType}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      Start:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {new Date(booking.startTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      End:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {new Date(booking.endTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      Payment Method:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {booking.paymentMethod}
                      </span>
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      Payment Status:{" "}
                      <span
                        className={`font-medium ${getPaymentStatusClasses(
                          booking.paymentStatus,
                        )}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                    <p className="text-gray-700 dark:text-gray-200 font-semibold flex items-center gap-2">
                      <FaMoneyBill className="text-green-600 dark:text-green-400" />
                      Paid:{" "}
                      {currencyFormatter.format(
                        (booking.amountPaid || 0) / 100,
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        {bookings.length > 0 && (
          <div className="mt-10 text-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300">
              View More Bookings
            </button>
          </div>
        )}

        {/* Scan QR Modal - metro-style scan screen */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Scan at Entry/Exit
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Slot {selectedBooking.slotNumber} &bull;{" "}
                {selectedBooking.licensePlate}
              </h3>

              <div className="bg-white p-4 rounded-xl border-4 border-yellow-500 shadow-inner">
                <QRCodeSVG
                  value={selectedBooking.bookingId}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                Hold this code up to the scanner at the gate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
