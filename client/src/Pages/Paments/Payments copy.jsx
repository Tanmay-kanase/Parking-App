import React, { useState } from "react";
import {
  LayoutDashboard,
  CarFront,
  Wallet,
  History,
  Download,
  FileText,
  PieChart,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Archive, // Added missing import from previous version
} from "lucide-react";

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState("slots");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // --- MOCK DATA ---
  const parkingSlots = [
    {
      slotId: "S1",
      slotNumber: "A-01",
      location: "Level 1 - North",
      pricePerHour: 5.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S2",
      slotNumber: "A-02",
      location: "Level 1 - North",
      pricePerHour: 5.0,
      vehicleType: "Car",
      isAvailable: false,
    },
    {
      slotId: "S3",
      slotNumber: "B-01",
      location: "Level 1 - South",
      pricePerHour: 3.0,
      vehicleType: "Bike",
      isAvailable: true,
    },
    {
      slotId: "S4",
      slotNumber: "B-02",
      location: "Level 1 - South",
      pricePerHour: 3.0,
      vehicleType: "Bike",
      isAvailable: false,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
    {
      slotId: "S5",
      slotNumber: "A-03",
      location: "Level 2 - VIP",
      pricePerHour: 10.0,
      vehicleType: "Car",
      isAvailable: true,
    },
  ];

  const bookings = [
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-101",
      slotNumber: "A-02",
      location: "Level 1 - North",
      amountPaid: 15.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T10:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "XYZ-1234",
      vehicleType: "Car",
    },
    {
      bookingId: "BKG-102",
      slotNumber: "B-02",
      location: "Level 1 - South",
      amountPaid: 6.0,
      paymentStatus: "Paid",
      startTime: "2023-10-24T11:00",
      endTime: "2023-10-24T13:00",
      licensePlate: "MNO-9876",
      vehicleType: "Bike",
    },
  ];

  const payments = Array.from({ length: 15 }, (_, i) => ({
    paymentId: `PAY-00${i + 1}`,
    transactionId: `TXN-998${i + 1}`,
    paymentMethod: i % 2 === 0 ? "credit_card" : "paypal",
    paymentTime: new Date(Date.now() - i * 10000000).toISOString(),
    amount: Math.floor(Math.random() * 50) + 10,
    status: i % 4 === 0 ? "failed" : "completed",
  }));

  const history = [
    {
      history_id: "H-551",
      vehicleId: "XYZ-1234",
      slotId: "S2",
      entryTime: "2023-10-24 10:00",
      exitTime: "2023-10-24 13:05",
      amountPaid: "15.00",
    },
    {
      history_id: "H-552",
      vehicleId: "DEF-5678",
      slotId: "S1",
      entryTime: "2023-10-23 09:00",
      exitTime: "2023-10-23 18:00",
      amountPaid: "45.00",
    },
  ];

  // --- HANDLERS ---
  const handleDownload = (reportName) => {
    alert(`Triggering PDF generation for: ${reportName}`);
  };

  // --- RENDER HELPERS ---
  const renderTabs = () => (
    <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
      {[
        { id: "slots", label: "Live Slots", icon: CarFront },
        { id: "bookings", label: "Active Bookings", icon: LayoutDashboard },
        { id: "finance", label: "Finance & Reports", icon: Wallet },
        { id: "history", label: "Parking Log", icon: History },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentTableData = payments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Owner Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your lots, track revenue, and export reports.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload("Daily Summary")}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <FileText size={18} /> Daily Snapshot
            </button>
            <button
              onClick={() => handleDownload("Complete Monthly Report")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
            >
              <Download size={18} /> Export Monthly Data
            </button>
          </div>
        </div>

        {renderTabs()}

        {/* TAB CONTENT: LIVE SLOTS */}
        {activeTab === "slots" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Capacity
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parkingSlots.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Available Now
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {parkingSlots.filter((s) => s.isAvailable).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Occupied
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {parkingSlots.filter((s) => !s.isAvailable).length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {parkingSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className={`relative p-5 rounded-xl border-2 transition-all ${
                    slot.isAvailable
                      ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        slot.isAvailable
                          ? "bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {slot.slotNumber}
                    </span>
                    {slot.isAvailable ? (
                      <CheckCircle2
                        className="text-green-500 dark:text-green-400"
                        size={20}
                      />
                    ) : (
                      <CarFront
                        className="text-gray-400 dark:text-gray-500"
                        size={20}
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {slot.location}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Type: {slot.vehicleType}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${slot.pricePerHour}/hr
                    </span>
                    <span
                      className={`text-sm font-medium ${slot.isAvailable ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {slot.isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Current Active Bookings
              </h2>
              <button
                onClick={() => handleDownload("Active Bookings List")}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <FileText size={16} /> Print List
              </button>
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
                  {bookings.map((b) => (
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
        )}

        {/* TAB CONTENT: FINANCE & REPORTS */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-xl shadow-sm">
                <h3 className="text-blue-100 dark:text-blue-200 mb-2">
                  Total Revenue (This Month)
                </h3>
                <p className="text-3xl font-bold">$3,240.50</p>
              </div>

              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm flex flex-col justify-center items-start gap-3 hover:border-blue-300 dark:hover:border-blue-600 transition cursor-pointer"
                onClick={() => handleDownload("Tax Invoice Ledger")}
              >
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <PieChart size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    Tax & Revenue Ledger
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download formatted PDF for accounting.
                  </p>
                </div>
              </div>

              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm flex flex-col justify-center items-start gap-3 hover:border-blue-300 dark:hover:border-blue-600 transition cursor-pointer"
                onClick={() => handleDownload("Payment Disputes/Failures")}
              >
                <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <XCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    Failed Transactions Report
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PDF of all failed or disputed payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg p-4 font-bold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-b-xl">
                  <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payments.length === 0 ? 0 : startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.min(startIndex + itemsPerPage, payments.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {payments.length}
                    </span>{" "}
                    entries
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700 dark:text-gray-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700 dark:text-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="p-4">Payment / TXN ID</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {currentTableData.map((p) => (
                      <tr
                        key={p.paymentId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900 dark:text-gray-200">
                            {p.paymentId}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {p.transactionId}
                          </div>
                        </td>
                        <td className="p-4 capitalize text-gray-700 dark:text-gray-300">
                          {p.paymentMethod.replace("_", " ")}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {new Date(p.paymentTime).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">
                          ${p.amount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              p.status === "completed"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              handleDownload(`Receipt-${p.paymentId}`)
                            }
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 font-medium"
                          >
                            <Download size={16} /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: HISTORY LOG */}
        {activeTab === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Historical Parking Log
              </h2>
              <button
                onClick={() => handleDownload("Full Parking History Archive")}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <Archive size={16} /> Download Archive
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="p-4">History ID</th>
                    <th className="p-4">Vehicle ID</th>
                    <th className="p-4">Slot</th>
                    <th className="p-4">Entry</th>
                    <th className="p-4">Exit</th>
                    <th className="p-4">Final Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {history.map((h) => (
                    <tr
                      key={h.history_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-200">
                        {h.history_id}
                      </td>
                      <td className="p-4 font-mono text-gray-600 dark:text-gray-400">
                        {h.vehicleId}
                      </td>
                      <td className="p-4 font-bold text-gray-800 dark:text-gray-300">
                        {h.slotId}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {h.entryTime}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {h.exitTime}
                      </td>
                      <td className="p-4 font-bold text-green-600 dark:text-green-400">
                        ${h.amountPaid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
