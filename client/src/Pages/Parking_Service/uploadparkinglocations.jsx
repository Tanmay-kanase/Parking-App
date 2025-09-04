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
    // Main container with responsive padding and dark mode theming
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Parkings
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-colors"
          >
            Add Parking
          </button>
        </div>

        {/* Modal for Adding/Editing Parking */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Parking Location
              </h3>

              {/* Form fields with labels for better accessibility and responsiveness */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Parking Name
                </label>
                <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                  <FaHome
                    className="text-gray-400 dark:text-gray-500 mr-3"
                    size={20}
                  />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="e.g., Downtown Secure Park"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address
                </label>
                <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                  <MapPin
                    className="text-gray-400 dark:text-gray-500 mr-3"
                    size={20}
                  />
                  <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Responsive container for paired inputs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    City
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                    <FaCity
                      className="text-gray-400 dark:text-gray-500 mr-3"
                      size={20}
                    />
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Pune"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    State
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                    <Building
                      className="text-gray-400 dark:text-gray-500 mr-3"
                      size={20}
                    />
                    <input
                      id="state"
                      type="text"
                      name="state"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ZIP Code
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                    <FaHashtag
                      className="text-gray-400 dark:text-gray-500 mr-3"
                      size={20}
                    />
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      placeholder="411001"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="totalSlots"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Total Slots
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent">
                    <FaWarehouse
                      className="text-gray-400 dark:text-gray-500 mr-3"
                      size={20}
                    />
                    <input
                      id="totalSlots"
                      type="number"
                      name="totalSlots"
                      placeholder="150"
                      value={formData.totalSlots}
                      onChange={handleChange}
                      className="w-full bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Features Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  Additional Features
                </h4>
                <div className="mt-2 flex flex-wrap gap-4">
                  {["evCharging", "cctvCamera", "washing"].map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={feature}
                        checked={formData[feature] || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [feature]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                        {feature.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Slot Distribution */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  Slot Distribution
                </h4>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["bike", "sedan", "truck", "bus"].map((type) => (
                    <div key={type}>
                      <label
                        htmlFor={`${type}Slots`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                      >
                        {type} Slots
                      </label>
                      <input
                        id={`${type}Slots`}
                        type="number"
                        name={`${type}Slots`}
                        placeholder="0"
                        value={formData[`${type}Slots`]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 bg-yellow-500 text-white p-3 rounded-lg text-md font-semibold hover:bg-yellow-600 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Location"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-lg text-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Parking Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.length > 0 ? (
            parkings.map((parking) => (
              <div
                key={parking.locationId}
                onClick={() =>
                  navigate(
                    `/upload-parking-slots?locationId=${parking.locationId}&name=${parking.name}`
                  )
                }
                className="bg-white dark:bg-gray-700 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:ring-2 hover:ring-yellow-500 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {parking.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {parking.address}, {parking.city}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <span className="font-medium">Total Slots:</span>{" "}
                  {parking.totalSlots}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
              No parkings found. Click &quot;Add Parking&quot; to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
