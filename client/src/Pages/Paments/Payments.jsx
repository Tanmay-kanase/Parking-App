import React, { useState } from "react";
import {
  LayoutDashboard,
  CarFront,
  Wallet,
  History,
  Download,
  FileText,
} from "lucide-react";
import LiveSlotsTab from "./LiveSlots";
import BookingsTab from "./BookingsTab";
import FinanceTab from "./FinanceTab";
import HistoryTab from "./HistoryTab";
import { useAuth } from "../../context/AuthContext";

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState("slots");
  const { user } = useAuth();
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
        {activeTab === "slots" && <LiveSlotsTab userId={user.userId} />}

        {/* TAB CONTENT: BOOKINGS */}
        {activeTab === "bookings" && <BookingsTab userId={user.userId} />}

        {/* TAB CONTENT: FINANCE & REPORTS */}
        {activeTab === "finance" && <FinanceTab userId={user.userId} />}

        {/* TAB CONTENT: HISTORY LOG */}
        {activeTab === "history" && <HistoryTab userId={user.userId} />}
      </div>
    </div>
  );
};

export default PaymentsPage;
