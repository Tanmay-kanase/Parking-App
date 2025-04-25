import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

const ShowParkings = () => {
  const navigate = useNavigate();

  const handleBooking = (parkingId, name) => {
    navigate(`/dobooking?locID=${parkingId}&name=${name}`);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get("query");

  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/parking-locations/city/${searchLocation}`
      )
      .then((response) => {
        setParkings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parking locations:", error);
      });
  }, [searchLocation]);
  console.log(parkings);
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
};

export default ShowParkings;
