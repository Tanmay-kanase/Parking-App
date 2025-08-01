import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCity,
  FaHome,
  FaHashtag,
  FaWarehouse,
} from "react-icons/fa";
import { MapPin, Building, Upload } from "lucide-react";
import axios from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function UploadParkingLocations() {
  const [parkings, setParkings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user, loading } = useAuth();
  const [loadingVerification, setLoadingVerification] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  useEffect(() => {
    if (!loading && user?.userId) {
      setFormData((prev) => ({ ...prev, userId: user.userId }));
    }
  }, [user, loading]);

  const handleVerifyLocation = () => {
    setLoadingVerification(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationVerified(true); // Set location as verified
          setLoadingVerification(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Failed to get your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoadingVerification(false);
    }
  };

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    totalSlots: "",
    evCharging: false,
    cctvCamera: false,
    washing: false,
    bikeSlots: "",
    sedanSlots: "",
    truckSlots: "",
    busSlots: "",
  });
  useEffect(() => {
    if (loading || !user?.userId) return;
    const fetchParkings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations/user/${
            user.userId
          }`
        );
        setParkings(response.data); // Set the parking data
      } catch (error) {
        console.error("Error fetching parking locations:", error);
      }
    };

    if (user) fetchParkings();
  }, [user, loading]);
  console.log(parkings);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations`,
        formData
      );
      console.log("Parking location uploaded successfully:", response.data);
      navigate(
        `/upload-parking-slots?locationId=${response.data.locationId}&name=${response.data.name}`
      );
    } catch (error) {
      setUploading(false);
      console.error(
        "Error uploading parking location:",
        error.response?.data || error.message
      );
    } finally {
      setUploading(false);
    }
  };
  console.log(formData);

  return (
    <div className="min-h-screen bg-[#fefae0] flex items-center justify-center p-10">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600"
        >
          Add Parking
        </button>
        {showModal && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parking Name */}
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
              <FaHome className="text-gray-500 mr-4" size={26} />
              <input
                type="text"
                name="name"
                placeholder="Parking Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>

            {/* Address */}
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
              <MapPin className="text-gray-500 mr-4" size={26} />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>

            {/* City & State */}
            <div className="flex space-x-4">
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
                <FaCity className="text-gray-500 mr-4" size={26} />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
                <Building className="text-gray-500 mr-4" size={26} />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* ZIP Code & Total Slots */}
            <div className="flex space-x-4">
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
                <FaHashtag className="text-gray-500 mr-4" size={26} />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
                <FaWarehouse className="text-gray-500 mr-4" size={26} />
                <input
                  type="number"
                  name="totalSlots"
                  placeholder="Total Slots"
                  value={formData.totalSlots}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleVerifyLocation}
              className="col-span-2 bg-yellow-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingVerification}
            >
              {loadingVerification && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loadingVerification ? "Verifying..." : "Verify Location"}
            </button>

            {!locationVerified && (
              <p className="col-span-2 text-lg text-gray-600">
                Please stand at the parking location to verify your location.
              </p>
            )}

            {locationVerified && (
              <p className="col-span-2 text-lg text-green-600">
                Location Verified
              </p>
            )}
            <h3 className="text-3xl font-bold text-gray-700">
              Additional Features
            </h3>
            {/* Additional Features */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="evCharging"
                  checked={formData.evCharging || false}
                  onChange={(e) =>
                    setFormData({ ...formData, evCharging: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">EV Charging</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="cctvCamera"
                  checked={formData.cctvCamera || false}
                  onChange={(e) =>
                    setFormData({ ...formData, cctvCamera: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">CCTV Camera</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="washing"
                  checked={formData.washing || false}
                  onChange={(e) =>
                    setFormData({ ...formData, washing: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Washing</span>
              </label>
            </div>

            {/* Slot Type Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
                <FaHashtag className="text-blue-500 mr-4" size={26} />
                <input
                  type="number"
                  name="bikeSlots"
                  placeholder="Bike Slots"
                  value={formData.bikeSlots}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
                <FaHashtag className="text-green-500 mr-4" size={26} />
                <input
                  type="number"
                  name="sedanSlots"
                  placeholder="Sedan Slots"
                  value={formData.sedanSlots}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
                <FaHashtag className="text-yellow-500 mr-4" size={26} />
                <input
                  type="number"
                  name="truckSlots"
                  placeholder="Truck Slots"
                  value={formData.truckSlots}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
                <FaHashtag className="text-red-500 mr-4" size={26} />
                <input
                  type="number"
                  name="busSlots"
                  placeholder="Bus Slots"
                  value={formData.busSlots}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-yellow-500 text-white p-4 rounded-xl text-xl font-semibold hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? (
                <svg
                  className="animate-spin h-6 w-6 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <Upload className="mr-3" size={26} />
              )}
              {uploading ? "Uploading..." : "Upload Location"}
            </button>
          </form>
        )}
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          My Parkings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.length > 0 ? (
            parkings.map((parking) => (
              <div
                onClick={() =>
                  navigate(
                    `/upload-parking-slots?locationId=${parking.locationId}&name=${parking.name}`
                  )
                }
                key={parking.locationId}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaMapMarkerAlt className="text-red-500 text-lg" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {parking.name}
                  </h3>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {parking.address}, {parking.city}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Total Slots:</span>{" "}
                  {parking.totalSlots}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No parkings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
