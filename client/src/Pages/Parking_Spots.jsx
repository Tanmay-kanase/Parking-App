import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLatLng, getNearbyParkings } from "../services/mapService";
import { FaHeart, FaCheckCircle, FaCar, FaDirections } from "react-icons/fa";

const ParkingSpots = () => {
  const location = useLocation();
  const statuses = [
    "Open",
    "Limited Spots Available",
    "Some slots remaining",
    "Closed for Maintenance",
    "Parking is Free",
  ];
  const availabilityOptions = ["High", "Medium", "Low"];

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const [parkingLocations, setParkingLocations] = useState([]);
  const [map, setMap] = useState(null);
  const [search, setSearch] = useState(searchQuery);
  const [filters, setFilters] = useState({
    type: "",
    priceRange: "",
    availability: "",
  });
  const handleGetDirections = (place) => {
    if (!place || !place.vicinity) {
      alert("Location not found");
      return;
    }

    const query = encodeURIComponent(place.vicinity);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

    window.open(googleMapsUrl, "_blank");
  };

  useEffect(() => {
    if (searchQuery) {
      fetchParkingSpots();
    }
  }, [searchQuery]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const newMap = new window.google.maps.Map(
        document.getElementById("googleMap"),
        {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 12,
        }
      );
      setMap(newMap);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchParkingSpots = async () => {
    try {
      const { lat, lng } = await getLatLng(search);
      const parkings = await getNearbyParkings(lat, lng);
      setParkingLocations(parkings);

      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(14);

        parkings.forEach((location) => {
          new window.google.maps.Marker({
            position: location.geometry.location,
            map: map,
            title: location.name,
          });
        });
      }
    } catch (error) {
      console.error("Error fetching parking locations:", error);
    }
  };

  return (
    <div className="container mx-auto p-5 bg-[#eeeedb] text-black">
      <h2 className="text-center text-2xl font-bold mb-4">
        Available Parking Spots
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        <div className="p-4 border border-yellow-500 rounded-lg bg-[#eeeedb]">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <input
            type="text"
            className="border p-2 w-full mb-2 rounded-md bg-[#eeeedb] text-black border-yellow-500"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 w-full mb-2 rounded-md bg-[#eeeedb] text-black border-yellow-500"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="covered">Covered</option>
            <option value="open">Open</option>
          </select>
          <select
            className="border p-2 w-full mb-2 rounded-md bg-[#eeeedb] text-black border-yellow-500"
            value={filters.priceRange}
            onChange={(e) =>
              setFilters({ ...filters, priceRange: e.target.value })
            }
          >
            <option value="">Price Range</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="border p-2 w-full mb-2 rounded-md bg-[#eeeedb] text-black border-yellow-500"
            value={filters.availability}
            onChange={(e) =>
              setFilters({ ...filters, availability: e.target.value })
            }
          >
            <option value="">Availability</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            className="bg-yellow-500 text-black p-2 w-full rounded-md hover:bg-yellow-700"
            onClick={fetchParkingSpots}
          >
            Apply Filters
          </button>
        </div>
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkingLocations.map((location, index) => {
            const imageUrl = location.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                  location.photos[0].photo_reference
                }&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
              : "https://via.placeholder.com/400";

            return (
              <div
                key={index}
                className="border border-yellow-500 rounded-lg shadow-lg p-4 flex flex-col bg-[#eeeedb] text-black"
              >
                <img
                  src={imageUrl}
                  alt={location.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold truncate">
                  {location.name}
                </h3>
                <p className="line-clamp-1">
                  <strong>Address:</strong> {location.vicinity}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {statuses[Math.floor(Math.random() * statuses.length)]}
                </p>

                <p>
                  <strong>Available:</strong>{" "}
                  {
                    availabilityOptions[
                      Math.floor(Math.random() * availabilityOptions.length)
                    ]
                  }
                </p>

                <p>
                  <strong>Rating:</strong> {location.rating} ⭐
                </p>
                <p className="line-clamp-1">
                  <strong>Review:</strong>{" "}
                  {location.reviews?.[0]?.text || "No reviews available"}
                </p>
                <button
                  onClick={() => handleGetDirections(location)}
                  className="bg-yellow-500 text-black p-2 w-full rounded-lg hover:bg-yellow-700 mt-3 flex items-center justify-center"
                >
                  <FaDirections className="mr-2" /> Get Directions
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div
        id="googleMap"
        className="w-full h-[500px] rounded-lg mt-6 border border-yellow-500"
      ></div>
    </div>
  );
};

export default ParkingSpots;
