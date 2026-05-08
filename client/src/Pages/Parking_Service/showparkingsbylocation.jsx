import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../config/axiosInstance";
import {
  FaCar,
  FaTruck,
  FaMotorcycle,
  FaBus,
  FaTimesCircle,
  FaShower,
  FaCheckCircle,
  FaVideo,
  FaChargingStation,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SearchParkings() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query") || "";

  const showError = (msg) => toast.error(msg);
  const [flashId, setFlashId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});
  const [parkings, setParkings] = useState([]);

  const handleBooking = (parkingId, name) => {
    const selection = selections[parkingId];
    if (!selection || !selection.vehicleType) {
      setFlashId(parkingId);

      // Remove the flash class after the animation completes
      setTimeout(() => {
        setFlashId(null);
      }, 1400);
      return;
    }
    const selectedVehicleType = selection.vehicleType;
    navigate(
      `/do-booking?locID=${parkingId}&name=${name}&vType=${selectedVehicleType}`,
    );
  };

  useEffect(() => {
    setLoading(true);
    if (searchQuery) {
      axios
        .get(
          // Updated to match the new Spring Boot Controller mapping
          `api/parking-locations/getLocationsByAddress?address=${searchQuery}`,
          { withCredentials: true },
        )
        .then((response) => {
          // Handle cases where 204 No Content might return empty data
          setParkings(response.data || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching searched parking locations:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleVehicleChange = (locationId, vehicleType) => {
    setSelections((prev) => ({
      ...prev,
      [locationId]: {
        ...prev[locationId],
        vehicleType,
      },
    }));
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
        <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
          <p className="text-xl font-semibold text-gray-100 mt-4 text-center">
            Searching Parkings ...
          </p>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-blue-400 animate-pulse-width"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Search Results for `{searchQuery}`
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.length > 0 ? (
            parkings.map((parking) => {
              const isFlashing = flashId === parking.locationId;
              const shouldBeDimmed = flashId !== null && !isFlashing;

              if (isFlashing) showError("Select one of the vehicle types");

              return (
                <div
                  key={parking.locationId}
                  className={`bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col justify-between ${
                    shouldBeDimmed ? "opacity-50 blur-[1px]" : ""
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-50 mb-1">
                      {parking.name}
                    </h3>

                    {/* Added Address Display directly from DTO */}
                    <div className="flex items-start gap-2 text-gray-400 text-sm mb-3">
                      <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-red-400" />
                      <p>
                        {parking.address}, {parking.city}, {parking.state}{" "}
                        {parking.zipCode}
                      </p>
                    </div>

                    <p className="text-gray-300 text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
                      Total Slots:{" "}
                      <span className="text-blue-400">
                        {parking.totalSlots}
                      </span>
                    </p>

                    {/* Vehicle Type Selection */}
                    <div className="mb-4">
                      <label
                        htmlFor={`vehicle-${parking.locationId}`}
                        className="block text-gray-300 font-semibold mb-2"
                      >
                        Available Parking:
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                        {[
                          {
                            type: "bike",
                            icon: FaMotorcycle,
                            color: "text-blue-400",
                            slots: parking.bikeSlots,
                          },
                          {
                            type: "sedan",
                            icon: FaCar,
                            color: "text-green-500",
                            slots: parking.sedanSlots,
                          },
                          {
                            type: "truck",
                            icon: FaTruck,
                            color: "text-red-500",
                            slots: parking.truckSlots,
                          },
                          {
                            type: "bus",
                            icon: FaBus,
                            color: "text-yellow-500",
                            slots: parking.busSlots,
                          },
                        ].map((v) => {
                          const isSelected =
                            selections[parking.locationId]?.vehicleType ===
                            v.type;
                          const Icon = v.icon;
                          return (
                            <button
                              key={v.type}
                              onClick={() =>
                                handleVehicleChange(parking.locationId, v.type)
                              }
                              disabled={v.slots === 0}
                              className={`flex items-center justify-center gap-2 p-2 rounded-lg transition duration-200 
                              ${
                                isSelected
                                  ? "bg-yellow-500 text-gray-900 shadow-lg"
                                  : v.slots === 0
                                    ? "bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed"
                                    : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                              } transition-all duration-300 ${
                                flashId === parking.locationId && v.slots > 0
                                  ? "animate-flash-glow border-2 border-yellow-500 rounded-lg scale-[1.05] shadow-2xl"
                                  : ""
                              }`}
                            >
                              <Icon
                                className={`${
                                  isSelected
                                    ? "text-gray-900"
                                    : v.slots === 0
                                      ? "text-gray-600"
                                      : v.color
                                } text-lg`}
                              />
                              <span className="capitalize">{v.type}</span>
                              <span
                                className={`${
                                  isSelected ? "text-gray-900" : "text-blue-500"
                                } font-bold`}
                              >
                                {v.slots}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-gray-400 text-lg font-semibold mb-2">
                      Features
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {/* EV Charging */}
                      <div className="flex items-center justify-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800">
                        <FaChargingStation className="text-blue-400 text-lg" />
                        <span className="text-sm">Charging:</span>
                        {parking.evCharging ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>

                      {/* CCTV Camera */}
                      <div className="flex items-center justify-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800">
                        <FaVideo className="text-yellow-500 text-lg" />
                        <span className="text-sm">CCTV:</span>
                        {parking.cctvCamera ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>

                      {/* Washing */}
                      <div className="flex items-center justify-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800">
                        <FaShower className="text-blue-300 text-lg" />
                        <span className="text-sm">Washing:</span>
                        {parking.washing ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>
                    </div>

                    {/* Updated User Info mapping from DTO */}
                    {parking.user && (
                      <div className="mb-6 bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">
                          <strong className="text-gray-300">Owner:</strong>{" "}
                          {parking.user.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          <strong className="text-gray-300">Email:</strong>{" "}
                          {parking.user.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className={`mt-auto font-bold py-3 px-4 rounded-lg transition-colors ${
                      parking.available
                        ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-md"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!parking.available}
                    onClick={() =>
                      handleBooking(parking.locationId, parking.name)
                    }
                  >
                    {parking.available ? "Park Here ..." : "Location Full"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-800 rounded-xl border border-gray-700">
              <FaMapMarkerAlt className="text-gray-600 text-5xl mb-4" />
              <p className="text-gray-300 text-xl font-semibold">
                No parking slots found
              </p>
              <p className="text-gray-500 mt-2 text-center max-w-md">
                We couldnt find any parking locations matching "{searchQuery}".
                Try searching for a different address or city.
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
