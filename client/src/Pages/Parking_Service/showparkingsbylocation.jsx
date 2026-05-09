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
  FaSearch, // <-- Added FaSearch icon
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SearchParkings() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query") || "";
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Added local state for the input field
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [loading, setLoading] = useState(false); // Default to false until query exists
  const [parkings, setParkings] = useState([]);
  const fetchSuggestions = async (query) => {
    try {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const res = await axios.get(
        `api/parking-locations/search?searchLoc=${query}`,
      );

      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  };
  // Sync input field if the user uses the browser back/forward buttons
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleBooking = (parkingId, name) => {
    navigate(`/do-booking?locID=${parkingId}&name=${name}`);
  };

  // Handle the new search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Update the URL, which automatically triggers the useEffect below
      navigate(`?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      axios
        .get(
          `api/parking-locations/getLocationsByAddress?address=${searchQuery}`,
        )
        .then((response) => {
          setParkings(response.data || []);
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching searched parking locations:", error);
          setLoading(false);
        });
    } else {
      setParkings([]);
      setLoading(false);
    }
  }, [searchQuery]);

  if (loading)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
        <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
          <p className="text-xl font-semibold text-gray-100 mt-4 text-center">
            Searching for `{searchQuery}`...
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
        {/* NEW: Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto"
        >
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search by address, city, or zip code..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-all text-lg shadow-inner"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                {suggestions.map((item) => (
                  <div
                    key={item.locationId}
                    onClick={() => {
                      setShowSuggestions(false);

                      navigate(`/searchParking?query=${item.address}`);
                    }}
                    className="px-4 py-3 hover:bg-yellow-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <p className="text-sm text-gray-800 dark:text-white">
                      {item.address}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-yellow-500/20 active:scale-95"
          >
            Search
          </button>
        </form>

        {searchQuery && (
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">
            Search Results for `${searchQuery}`
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!searchQuery ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
              <FaSearch className="text-gray-600 text-5xl mb-4" />
              <p className="text-gray-300 text-xl font-semibold">
                Enter a location to find parking
              </p>
            </div>
          ) : parkings.length > 0 ? (
            parkings.map((parking) => {
              return (
                <div
                  key={parking.locationId}
                  className="bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-50 mb-1">
                      {parking.name}
                    </h3>

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

                    <div className="mb-4">
                      <p className="block text-gray-300 font-semibold mb-2">
                        Available Parking:
                      </p>
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
                          const Icon = v.icon;
                          return (
                            <div
                              key={v.type}
                              className={`flex items-center justify-center gap-2 p-2 rounded-lg 
                              ${
                                v.slots === 0
                                  ? "bg-gray-800 text-gray-600 border border-gray-700"
                                  : "bg-gray-700 text-gray-300 border border-gray-600"
                              }`}
                            >
                              <Icon
                                className={`${
                                  v.slots === 0 ? "text-gray-600" : v.color
                                } text-lg`}
                              />
                              <span className="capitalize">{v.type}</span>
                              <span className="text-blue-500 font-bold">
                                {v.slots}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-gray-400 text-lg font-semibold mb-2">
                      Features
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center justify-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800">
                        <FaChargingStation className="text-blue-400 text-lg" />
                        <span className="text-sm">Charging:</span>
                        {parking.evCharging ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800">
                        <FaVideo className="text-yellow-500 text-lg" />
                        <span className="text-sm">CCTV:</span>
                        {parking.cctvCamera ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>

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

                    {parking.user && (
                      <div className="mb-6 bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">
                          <strong className="text-gray-300">Owner:</strong>{" "}
                          {parking.user.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className="mt-4 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
                    onClick={() =>
                      handleBooking(parking.locationId, parking.name)
                    }
                  >
                    Park Here ...
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
                We couldn find any parking locations matching "{searchQuery}".
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
