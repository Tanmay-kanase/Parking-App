import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCity,
  FaHome,
  FaHashtag,
  FaWarehouse,
  FaEdit, // Added
  FaTrash,
} from "react-icons/fa";
import { MapPin, Building, Upload } from "lucide-react";
import axios from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function UploadParkingLocations() {
  const [parkings, setParkings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
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
            "Failed to get your location. Please enable location services.",
          );
        },
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
          }`,
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

      if (isEditing) {
        // Edit Existing (PUT Request)
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations/${editId}`,
          formData,
        );
        // Update the item in the local state array
        setParkings(
          parkings.map((p) => (p.locationId === editId ? response.data : p)),
        );
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create New (POST Request)
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations`,
          formData,
        );
        setParkings([...parkings, response.data]);
        navigate(
          `/upload-parking-slots?locationId=${response.data.locationId}&name=${response.data.name}`,
        );
      }
    } catch (error) {
      console.error(
        "Error saving parking location:",
        error.response?.data || error.message,
      );
    } finally {
      setUploading(false);
    }
  };

  console.log(formData);
  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      userId: user?.userId || "",
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
    setLocationVerified(false);
    setShowModal(true);
  };
  const handleEdit = (e, parking) => {
    e.stopPropagation(); // Prevents triggering the card's navigation onClick
    setIsEditing(true);
    setEditId(parking.locationId); // Ensure this matches your backend ID field
    setFormData(parking); // Populate the form with existing data
    setLocationVerified(true); // Assuming existing locations have valid coords
    setShowModal(true);
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents triggering the card's navigation onClick
    if (
      !window.confirm("Are you sure you want to delete this parking location?")
    )
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations/${id}`,
      );
      // Remove the deleted item from UI
      setParkings(parkings.filter((p) => p.locationId !== id));
    } catch (error) {
      console.error("Error deleting parking location:", error);
      alert("Failed to delete parking location.");
    }
  };
  return (
    // Main container with responsive padding and dark mode theming
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Parkings
          </h2>
          <button
            onClick={handleAddNew}
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
                    `/upload-parking-slots?locationId=${parking.locationId}&name=${parking.name}`,
                  )
                }
                className="bg-white dark:bg-gray-700 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:ring-2 hover:ring-yellow-500 cursor-pointer transition relative"
              >
                {/* Edit and Delete Buttons */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={(e) => handleEdit(e, parking)}
                    className="p-2 text-blue-500 bg-blue-50 dark:bg-gray-600 rounded-full hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, parking.locationId)}
                    className="p-2 text-red-500 bg-red-50 dark:bg-gray-600 rounded-full hover:bg-red-100 dark:hover:bg-gray-500 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-2 pr-16">
                  {" "}
                  {/* added pr-16 to avoid text overlapping buttons */}
                  <FaMapMarkerAlt className="text-red-500 text-xl flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
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
