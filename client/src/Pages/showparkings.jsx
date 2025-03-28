import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    const fetchParkings = async () => {
      try {
        // Step 1: Fetch parking slots
        const parkingResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots?location=${searchLocation}`
        );

        const parkingData = parkingResponse.data;
        console.log(parkingData);


        // Step 2: Extract unique user IDs
        const userIds = [...new Set(parkingData.map((p) => p.userId))].filter(
          (id) => id
        );

        console.log(userIds);


        // Step 3: Fetch user details
        const userResponses = await Promise.all(
          userIds.map((id) =>
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`)
          )
        );

        // Convert users array into an object for quick lookup
        const usersData = userResponses.reduce((acc, res) => {
          acc[res.data.userId] = res.data;
          return acc;
        }, {});

        // Step 4: Merge user details into parking slots
        const mergedData = parkingData.map((p) => ({
          ...p,
          user: usersData[p.userId] || null, // Attach user data if available
        }));
        console.log(mergedData);
        setParkings(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
                key={parking.slotId}
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
                    parking.available
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {parking.available ? "Available" : "Booked"}
                </p>
                {parking.user && (
                  <>
                    <p className="text-gray-600">
                      <strong>Owner:</strong> {parking.user.name}
                    </p>
                    <p className="text-gray-600">
                      <strong>Contact:</strong> {parking.user.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {parking.user.phone}
                    </p>
                  </>
                )}
                <button
                  className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  disabled={!parking.available}
                  onClick={() =>
                    handleBooking(parking.parkingId, parking.location)
                  }
                >
                  {parking.available ? "Book Now" : "Unavailable"}
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
