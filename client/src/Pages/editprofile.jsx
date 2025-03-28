import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; // To get userId from URL
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import axios from "axios";

const EditProfile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [vehicles, setVehicles] = useState([]);

  const handleVehicleChange = (index, field, value) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle, i) =>
        i === index ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  const [error, setError] = useState("");

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

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      { vehicleType: "", licensePlate: "", company: "", userId: `${userId}` },
    ]);
  };

  const submitVehicles = async () => {
    try {
      const vehiclesWithUserId = vehicles.map((vehicle) => ({
        ...vehicle,
        userId,
      }));
      console.log(vehicles);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/add`,
        vehiclesWithUserId, // Directly passing the data object
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Vehicles added:", response.data);
    } catch (error) {
      console.error(
        "Error adding vehicles:",
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
          </div>

          {/* Vehicles Section */}
          <h3 className="text-2xl font-bold text-gray-800 mt-8">My Vehicles</h3>
          <div className="space-y-4 mt-4">
            {vehicles.map((vehicle, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg"
              >
                {/* Vehicle Type */}
                <select
                  className="border p-2 rounded-lg"
                  value={vehicle.vehicleType}
                  onChange={(e) =>
                    handleVehicleChange(index, "type", e.target.value)
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
                  className={`border p-2 rounded-lg ${error ? "border-red-500" : "border-gray-300"
                    }`}
                  value={vehicle.licensePlate}
                  onChange={(e) => {
                    const formattedValue = formatVehicleNumber(e.target.value);
                    handleVehicleChange(index, "number", formattedValue);
                    validateVehicleNumber(formattedValue);
                  }}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Company */}
                <input
                  type="text"
                  placeholder="Company"
                  className="border p-2 rounded-lg"
                  value={vehicle.company}
                  onChange={(e) =>
                    handleVehicleChange(index, "company", e.target.value)
                  }
                />
              </div>
            ))}

            {/* Add Vehicle Button */}
            <button
              type="button"
              onClick={addVehicle}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <FaPlus /> Add Vehicle
            </button>

            {/* Submit Button */}
            {vehicles.length > 0 && (
              <button
                type="button"
                onClick={submitVehicles}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Submit Vehicles
              </button>
            )}
          </div>

          {/* My Parkings Section */}
          <h3 className="text-2xl font-bold text-gray-800 mt-8">My Parkings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-100 shadow-md rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-800">Spot #101</h3>
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-600">Location: Downtown Parking</p>
              <p className="text-gray-500">Total Slots: 5</p>
            </div>
            <div className="bg-gray-100 shadow-md rounded-xl p-4">
              <h3 className="text-xl font-semibold text-gray-800">Spot #202</h3>
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-600">Location: City Mall Parking</p>
              <p className="text-gray-500">Total Slots: 3</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
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
