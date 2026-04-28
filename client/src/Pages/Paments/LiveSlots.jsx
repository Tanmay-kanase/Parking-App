import { CarFront, CheckCircle2, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import PaginationFooter from "../../components/PaginationFooter";
import axios from "../../config/axiosInstance";

const LiveSlotsTab = (userId) => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          "/api/parking-slots/parking/69d7d255bae40612cb6796be",
        );

        const data = response.data;

        // 🔥 Transform backend → frontend format
        const formattedSlots = data.map((item) => ({
          slotId: item.slotId,
          slotNumber: item.slotNumber,
          location: item.location,
          pricePerHour: item.pricePerHour,
          vehicleType: item.vehicleType,
          isAvailable: item.available, // rename for UI
        }));

        setParkingSlots(formattedSlots);
      } catch (err) {
        console.error(err);

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

    fetchSlots();
  }, []);
  // 1. Move the filter state inside the child component
  const [slotFilterType, setSlotFilterType] = useState("All");
  const [slotFilterStatus, setSlotFilterStatus] = useState("All");

  // 2. Move the filtering logic inside the child component
  const filteredParkingSlots = parkingSlots.filter((slot) => {
    const typeMatch =
      slotFilterType === "All" || slot.vehicleType === slotFilterType;
    const statusMatch =
      slotFilterStatus === "All" ||
      (slotFilterStatus === "Available" ? slot.isAvailable : !slot.isAvailable);

    return typeMatch && statusMatch;
  });

  // 3. Move the pagination hook inside the child component
  const parkingSlotsPagination = usePagination(filteredParkingSlots, 5);
  if (loading) return <p>Loading slots...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
          <p className="text-gray-500 dark:text-gray-400 text-sm">Occupied</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {parkingSlots.filter((s) => !s.isAvailable).length}
          </p>
        </div>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Filter Controls Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mr-2 font-medium">
            <Filter size={18} />
            Filters:
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              value={slotFilterType}
              onChange={(e) => {
                setSlotFilterType(e.target.value);
                parkingSlotsPagination.resetPage();
              }}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">All Vehicle Types</option>
              <option value="Car">Compact</option>
              <option value="Sedan">Sedan</option>
              <option value="compact">Compact</option>
              <option value="Bike">Bikes</option>
            </select>

            <select
              value={slotFilterStatus}
              onChange={(e) => {
                setSlotFilterStatus(e.target.value);
                parkingSlotsPagination.resetPage();
              }}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4">Slot</th>
                <th className="p-4">Location</th>
                <th className="p-4">Vehicle Type</th>
                <th className="p-4">Price/Hour</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {parkingSlotsPagination.paginatedData.length > 0 ? (
                parkingSlotsPagination.paginatedData.map((slot) => (
                  <tr
                    key={slot.slotId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          slot.isAvailable
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {slot.slotNumber}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {slot.location}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      {slot.vehicleType}
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      ${slot.pricePerHour}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {slot.isAvailable ? (
                          <>
                            <CheckCircle2
                              className="text-green-500 dark:text-green-400"
                              size={18}
                            />
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Available
                            </span>
                          </>
                        ) : (
                          <>
                            <CarFront
                              className="text-gray-400 dark:text-gray-500"
                              size={18}
                            />
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                              Occupied
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No slots match your selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationFooter paginationProps={parkingSlotsPagination} />
      </div>
    </div>
  );
};

export default LiveSlotsTab;
