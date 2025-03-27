import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ShowParkings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get("name");
  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8088/api/parking-slots?location=${searchLocation}`
        );
        setParkings(response.data);
      } catch (error) {
        console.error("Error fetching parkings:", error);
      }
    };

    if (searchLocation) {
      fetchParkings();
    }
  }, [searchLocation]);

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
                key={parking.id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  Slot {parking.slotNumber}
                </h3>
                <p className="text-gray-600">Location: {parking.location}</p>
                <p className="text-gray-600">
                  Price: ${parking.pricePerHour} / hr
                </p>
                <p
                  className={
                    parking.isAvailable
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {parking.isAvailable ? "Available" : "Booked"}
                </p>
                <p className="text-gray-600">
                  <strong>Owner:</strong> {parking.ownerName}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong> {parking.contact}
                </p>
                <p className="text-gray-600">
                  <strong>Description</strong> {parking.amenities}
                </p>

                <button
                  className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  disabled={!parking.isAvailable}
                >
                  {parking.isAvailable ? "Book Now" : "Unavailable"}
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
