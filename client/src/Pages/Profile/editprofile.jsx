import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaMapMarkerAlt } from "react-icons/fa";
import axios from "../../config/axiosInstance";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId"); // ✅ get userId from URL

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const [vehicle, setVehicle] = useState({
    vehicleType: "",
    licensePlate: "",
    comapany: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [error, setError] = useState("");

  const handleVehicleChange = (field, value) => {
    setVehicle((prev) => ({ ...prev, [field]: value }));
  };

  const formatVehicleNumber = (input) => {
    let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = "";

    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += "-" + cleaned.substring(2, 4);
    if (cleaned.length > 4) formatted += "-" + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += "-" + cleaned.substring(6, 10);

    return formatted;
  };

  const validateVehicleNumber = (number) => {
    const regex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
    if (!regex.test(number)) {
      setError("Invalid format! Use: MH-43-AR-0707");
    } else {
      setError("");
    }
  };

  const submitVehicle = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/add`, {
        ...vehicle,
        userId,
      });
      alert("Vehicle added!");
      setVehicle({ vehicleType: "", licensePlate: "", comapany: "" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        user
      );
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile!");
    }
  };

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/user/${userId}`
        );
        setVehicles(res.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [user.role, userId]);

  // Fetch parking locations
  useEffect(() => {
    if (user.role !== "parking_owner") return;

    const fetchParkings = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-locations/user/${userId}`
        );
        setParkings(res.data);
      } catch (error) {
        console.error("Error fetching parkings:", error);
      }
    };

    fetchParkings();
  }, [user.role, userId]);

  
  return (
    // Main container with dark mode background and text colors
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Main card with dark mode background */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">
        {/* Left Side */}
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-yellow-500">
            <img
              src={user.photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
            Edit Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="text-lg font-semibold dark:text-gray-200">
              Name:
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 rounded-lg text-lg text-gray-900 dark:text-gray-100"
            />
            <label className="text-lg font-semibold dark:text-gray-200">
              Email:
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 rounded-lg text-lg text-gray-900 dark:text-gray-100"
            />
            <label className="text-lg font-semibold dark:text-gray-200">
              Phone:
            </label>
            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 rounded-lg text-lg text-gray-900 dark:text-gray-100"
            />

            <label className="text-lg font-semibold dark:text-gray-200">
              Role:
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700">
              <FaLock className="text-gray-500 dark:text-gray-400" />
              <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full ml-2 outline-none bg-transparent cursor-pointer text-gray-900 dark:text-gray-100"
              >
                <option value="user">User</option>
                <option value="parking_owner">Parking Owner</option>
              </select>
            </div>
          </div>

          {/* Vehicle Section */}
          {user.role != "admin" && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8">
                My Vehicle
              </h3>
              <div className="space-y-4 mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <select
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded-lg text-gray-900 dark:text-gray-100"
                  value={vehicle.vehicleType}
                  onChange={(e) =>
                    handleVehicleChange("vehicleType", e.target.value)
                  }
                >
                  <option value="">Select Type</option>
                  <option value="car">🚗 Car</option>
                  <option value="bike">🏍️ Bike</option>
                  <option value="truck">🚛 Truck</option>
                </select>

                <input
                  type="text"
                  placeholder="MH-43-AR-0707"
                  className={`border p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    error
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  value={vehicle.licensePlate}
                  onChange={(e) => {
                    const formatted = formatVehicleNumber(e.target.value);
                    handleVehicleChange("licensePlate", formatted);
                    validateVehicleNumber(formatted);
                  }}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                  type="text"
                  placeholder="Company"
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded-lg text-gray-900 dark:text-gray-100"
                  value={vehicle.comapany}
                  onChange={(e) =>
                    handleVehicleChange("comapany", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={submitVehicle}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Submit Vehicle
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-6">
                My Vehicles
              </h3>
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <div
                    key={v._id}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mt-2 border border-gray-200 dark:border-gray-600"
                  >
                    <p>
                      <strong>Type:</strong> {v.vehicleType}
                    </p>
                    <p>
                      <strong>Plate:</strong> {v.licensePlate}
                    </p>
                    <p>
                      <strong>Company:</strong> {v.comapany}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No vehicles added yet.
                </p>
              )}
            </>
          )}

          {/* Parking Section */}
          {user.role === "parking host" && (
            <>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-6 text-center">
                My Parkings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parkings.length > 0 ? (
                  parkings.map((p) => (
                    <div
                      key={p.locationId}
                      onClick={() =>
                        navigate(
                          `/upload-parking-slots?locationId=${p.locationId}&name=${p.name}`
                        )
                      }
                      className="bg-white dark:bg-gray-700 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl dark:hover:bg-gray-600 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FaMapMarkerAlt className="text-red-500 dark:text-red-400 text-lg" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          {p.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Location:</strong> {p.address}, {p.city}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        <strong>Total Slots:</strong> {p.totalSlots}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                    No parkings found.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={updateUser}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
