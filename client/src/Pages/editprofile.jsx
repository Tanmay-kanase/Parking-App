import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // To get userId from URL
import { FaLock, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import axios from "axios";

const EditProfile = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState({
    vehicleType: "",
    licensePlate: "",
    comapany: "",
  });
  const handleVehicleChange = (field, value) => {
    setVehicle((prev) => ({ ...prev, [field]: value }));
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        user
      );
      console.log("User updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      alert("Failed to update profile!");
    }
  };
  // Function to format input automatically
  const formatVehicleNumber = (input) => {
    let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Remove invalid characters
    let formatted = "";

    if (cleaned.length > 0) formatted += cleaned.substring(0, 2); // First 2 letters (State code)
    if (cleaned.length > 2) formatted += "-" + cleaned.substring(2, 4); // Next 2 digits (RTO code)
    if (cleaned.length > 4) formatted += "-" + cleaned.substring(4, 6); // Next 2 letters (Series)
    if (cleaned.length > 6) formatted += "-" + cleaned.substring(6, 10); // Last 4 digits (Number)

    return formatted;
  };

  // Function to validate vehicle number
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/add`,
        { ...vehicle, userId }
      );

      console.log("Vehicle added:", response.data);
    } catch (error) {
      console.error(
        "Error adding vehicle:",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`
        );
        const data = await response.json();
        setUser(data); // Set user state with API response
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-locations/user/${userId}`
        );
        setParkings(response.data); // Set the parking data
      } catch (error) {
        console.error("Error fetching parking locations:", error);
      }
    };

    if (userId) fetchParkings();
  }, [userId]);

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/user/${userId}`
        );
        setVehicles(response.data);
      } catch (error) {
        console.error(
          "Error fetching vehicles:",
          error.response?.data || error.message
        );
      }
    };

    fetchVehicles();
  }, [userId]);

  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="w-full bg-white shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">
        {/* Left Side - Profile Image */}
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-500">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side - User Details */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-yellow-600">My Profile</h2>

          {/* User Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <p className="text-lg font-semibold">Name:</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border p-2 rounded-lg text-lg"
            />

            <p className="text-lg font-semibold">Email:</p>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border p-2 rounded-lg text-lg"
            />

            <p className="text-lg font-semibold">Phone:</p>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full border p-2 rounded-lg text-lg"
            />

            <p className="text-lg font-semibold">Password:</p>
            <input
              type="password"
              name="phone"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full border p-2 rounded-lg text-lg"
            />

            <p className="text-lg font-semibold">Role:</p>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
              <FaLock className="text-gray-500" />
              <select
                name="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full ml-2 outline-none bg-transparent cursor-pointer"
              >
                <option value="customer">Customer</option>
                <option value="parking host">Parking Host</option>
              </select>
            </div>
          </div>
          {/* Vehicles Section */}
          <h3 className="text-2xl font-bold text-gray-800 mt-8">My Vehicle</h3>
          <div className="space-y-4 mt-4 bg-gray-100 p-3 rounded-lg">
            <select
              className="border p-2 rounded-lg"
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

            {/* Vehicle Number */}
            <input
              type="text"
              placeholder="MH-43-AR-0707"
              className={`border p-2 rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              value={vehicle.licensePlate}
              onChange={(e) => {
                const formattedValue = formatVehicleNumber(e.target.value);
                handleVehicleChange("licensePlate", formattedValue);
                validateVehicleNumber(formattedValue);
              }}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="text"
              placeholder="Company"
              className="border p-2 rounded-lg"
              value={vehicle.comapany} // Ensure value is controlled
              onChange={(e) => handleVehicleChange("comapany", e.target.value)}
            />

            <button
              type="button"
              onClick={submitVehicle}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Submit Vehicle
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8">My Vehicles</h3>
          {vehicles.length > 0 ? (
            vehicles.map((v) => (
              <div key={v._id} className="bg-gray-100 p-3 rounded-lg mt-2">
                <p>
                  <strong>Type:</strong> {v.vehicleType}
                </p>
                <p>
                  <strong>License Plate:</strong> {v.licensePlate}
                </p>
                <p>
                  <strong>company:</strong> {v.comapany}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No vehicles added yet.</p>
          )}

          {/* My Parkings Section */}
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

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={updateUser}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
