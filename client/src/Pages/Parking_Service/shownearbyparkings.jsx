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
} from "react-icons/fa";

export default function Shownearbyparkings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2); // rounded to 2 decimals
  }

  const handleBooking = (parkingId, name) => {
    navigate(`/do-booking?locID=${parkingId}&name=${name}`);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get("query");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (lat && lng) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-locations/nearby?lat=${lat}&lng=${lng}`,
          { withCredentials: true }
        )
        .then((response) => {
          const withDistance = response.data.map((parking) => ({
            ...parking,
            distance: getDistanceFromLatLng(lat, lng, parking.lat, parking.lng),
          }));

          const sorted = withDistance.sort((a, b) => a.distance - b.distance);
          setParkings(sorted);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching nearby parking locations:", error);
          setLoading(false)
        });
    }
  }, [lat, lng]);

  console.log(parkings);

  if (loading)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
        <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-4">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>

          {/* Loading Message */}
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4 text-center">
            Loading Parking ...
          </p>

          {/* Optional: Add a subtle loading bar for perceived progress, if actual progress is not available */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-blue-400 animate-pulse-width"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-600 mb-6">
          Available Parkings in {searchLocation}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.length > 0 ? (
            parkings.map((parking) => (
              <div
                key={parking.slotId}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between"
              >
                <h3 className="text-xl font-semibold text-emerald-950">
                  {parking.name}
                </h3>

                <p className="text-gray-600 text-lg font-semibold">
                  📍 {parking.distance} km away
                </p>

                <p className="text-gray-600 text-lg font-semibold">
                  Total Slots: {parking.totalSlots}
                </p>

                <p className="text-gray-600 text-lg font-semibold">
                  Avail Slots :
                </p>
                {/* 🚗 Vehicle Slots Grid (2x2) */}
                <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaMotorcycle className="text-blue-600 text-lg" />
                    <span>
                      Bike:{" "}
                      <span className="text-blue-700 font-bold">
                        {parking.bikeSlots}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaCar className="text-green-600 text-lg" />
                    <span>Sedan: {parking.sedanSlots}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaTruck className="text-red-600 text-lg" />
                    <span>Truck: {parking.truckSlots}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaBus className="text-yellow-600 text-lg" />
                    <span>Bus: {parking.busSlots}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg font-semibold mb-2">
                  Features
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* ⚡ EV Charging */}
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaChargingStation className="text-blue-600 text-lg" />
                    <span>Charging:</span>
                    {parking.evCharging ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-lg" />
                    )}
                  </div>

                  {/* 📹 CCTV Camera */}
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaVideo className="text-yellow-600 text-lg" />
                    <span>CCTV:</span>
                    {parking.cctvCamera ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-lg" />
                    )}
                  </div>

                  {/* 🚿 Washing */}
                  <div className="flex items-center justify-center gap-2 border p-2 rounded-lg">
                    <FaShower className="text-blue-400 text-lg" />
                    <span>Washing:</span>
                    {parking.washing ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-lg" />
                    )}
                  </div>
                </div>

                {parking.user && (
                  <>
                    <p className="text-gray-600">
                      <strong>Owner:</strong> {parking.user.name}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {parking.user.phone}
                    </p>
                  </>
                )}
                <button
                  className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  // disabled={!parking.available}
                  onClick={() =>
                    handleBooking(parking.locationId, parking.name)
                  }
                >
                  Park Here ...
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-700 col-span-full">
              No parking slots available at this location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
