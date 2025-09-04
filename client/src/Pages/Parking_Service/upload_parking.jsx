import { useEffect, useState } from "react";
import { FaCar, FaTruck, FaMotorcycle, FaBus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const UploadParkingSpots = () => {
  const [spots, setSpots] = useState([]);
  const location = useLocation();
  const userId = "68866839d42a605a36c6b368";
  const params = new URLSearchParams(location.search);
  const locationId = params.get("locationId");
  const name = params.get("name");
  const [showModal, setShowModal] = useState(false);
  const [uploadMode, setUploadMode] = useState("single"); // "single" or "multiple"
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);

  const [formData, setFormData] = useState({
    slotNumber: "",
    parkingId: `${locationId}`,
    location: `${name}`,
    userId: `${userId}`,
    pricePerHour: "",
    vehicleType: "", // Updated for multiple selections
    available: true, // Default to available
  });

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-slots/parking/${locationId}`
        );
        setSpots(response.data); // Storing response data in 'spots'
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };

    fetchParkingSlots();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.id === "available") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const handleVehicleType = (type) => {
    setFormData({ ...formData, vehicleType: type });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log(formData);

  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots`,
  //       formData
  //     );

  //     console.log("Parking slot uploaded:", response.data);
  //     setShowModal(false);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error uploading parking slot:", error);
  //   }
  // };

  const handleEdit = (spot) => {
    setIsEditMode(true);
    setShowModal(true);
    setEditingSlotId(spot.slotId);
    setUploadMode("single"); // Only single edit allowed

    setFormData({
      slotNumber: spot.slotNumber,
      parkingId: spot.parkingId,
      location: spot.location,
      userId: spot.userId,
      pricePerHour: spot.pricePerHour,
      vehicleType: spot.vehicleType,
      available: spot.available,
    });
  };

  const handleDelete = async (slotId) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/${slotId}`
      );
      setSpots((prev) => prev.filter((slot) => slot.slotId !== slotId));
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-slots/${editingSlotId}`,
          formData
        );
        const updatedSlot = response.data;

        setSpots((prev) =>
          prev.map((slot) =>
            slot.slotId === editingSlotId ? updatedSlot : slot
          )
        );

        setIsEditMode(false);
        setEditingSlotId(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error updating slot:", error);
      }
      return;
    }

    // Original Add Logic
    let payload = [];

    if (uploadMode === "single") {
      payload.push({
        slotNumber: formData.slotNumber,
        parkingId: locationId,
        location: name,
        userId: userId,
        pricePerHour: formData.pricePerHour,
        vehicleType: formData.vehicleType,
        available: formData.available,
      });
    } else {
      for (
        let i = parseInt(formData.startNumber);
        i <= parseInt(formData.endNumber);
        i++
      ) {
        payload.push({
          slotNumber: `${formData.slotPrefix}${i}`,
          parkingId: locationId,
          location: name,
          userId: userId,
          pricePerHour: formData.pricePerHour,
          vehicleType: formData.vehicleType,
          available: formData.available,
        });
      }
    }

    console.log(payload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/batch`,
        payload
      );
      const newSlots = response.data;
      setSpots((prev) => [...prev, ...newSlots]);
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading slots:", error);
    }
  };

  return (
    // Main container with responsive padding and dark mode theming
    <div className="min-h-screen bg-yellow-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-colors"
        >
          Add Parking Slots
        </button>

        {/* Modal for adding/editing slots */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {isEditMode ? "Edit Parking Slot" : "Add New Parking Slots"}
              </h2>

              {/* Form content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full flex gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="single"
                      checked={uploadMode === "single"}
                      onChange={() => setUploadMode("single")}
                      className="text-yellow-500 focus:ring-yellow-400"
                    />
                    Single Slot
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="multiple"
                      checked={uploadMode === "multiple"}
                      onChange={() => setUploadMode("multiple")}
                      className="text-yellow-500 focus:ring-yellow-400"
                    />
                    Multiple Slots
                  </label>
                </div>

                {uploadMode === "single" ? (
                  <div className="col-span-full">
                    <label
                      htmlFor="slotNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Slot Number
                    </label>
                    <input
                      id="slotNumber"
                      type="text"
                      name="slotNumber"
                      placeholder="e.g., A101"
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="slotPrefix"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Slot Prefix
                      </label>
                      <input
                        id="slotPrefix"
                        type="text"
                        name="slotPrefix"
                        placeholder="e.g., A"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="startNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Start Number
                      </label>
                      <input
                        id="startNumber"
                        type="number"
                        name="startNumber"
                        placeholder="e.g., 101"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div className="col-span-full md:col-span-1">
                      <label
                        htmlFor="endNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        End Number
                      </label>
                      <input
                        id="endNumber"
                        type="number"
                        name="endNumber"
                        placeholder="e.g., 120"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-span-full md:col-span-1">
                  <label
                    htmlFor="pricePerHour"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Price Per Hour ($)
                  </label>
                  <input
                    id="pricePerHour"
                    type="number"
                    name="pricePerHour"
                    placeholder="e.g., 5.50"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div className="col-span-full">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vehicle Type
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { type: "bike", icon: <FaMotorcycle /> },
                      { type: "compact", icon: <FaCar /> },
                      { type: "sedan", icon: <FaCar /> },
                      { type: "SUV", icon: <FaTruck /> },
                      { type: "truck", icon: <FaBus /> },
                    ].map(({ type, icon }) => (
                      <label
                        key={type}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          formData.vehicleType === type
                            ? "bg-yellow-200 dark:bg-yellow-700 ring-2 ring-yellow-500"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type}
                          checked={formData.vehicleType === type}
                          onChange={() => handleVehicleType(type)}
                          className="hidden"
                        />
                        <span className="text-xl">{icon}</span>
                        <span className="capitalize text-sm font-medium">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="available"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Availability:
                    </span>
                    <input
                      onChange={handleChange}
                      checked={formData.available}
                      type="checkbox"
                      id="available"
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        formData.available
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {formData.available ? "Available" : "Not Available"}
                    </span>
                  </label>
                </div>

                {/* Responsive buttons: stack on mobile, side-by-side on larger screens */}
                <div className="col-span-full flex flex-col sm:flex-row gap-4 justify-start pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    {isEditMode ? "Update Slot" : "Add Slot"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Container for responsive data display */}
        <div className="mt-8">
          {/* --- Mobile Card View --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {spots.map((spot) => (
              <div
                key={spot.slotId}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">{spot.slotNumber}</p>
                  <p
                    className={`font-bold text-sm px-2 py-1 rounded-full ${
                      spot.available
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {spot.available ? "Available" : "Taken"}
                  </p>
                </div>
                <div>
                  <strong>Location:</strong> {spot.location}
                </div>
                <div>
                  <strong>Price:</strong> ${spot.pricePerHour}/hr
                </div>
                <div className="capitalize">
                  <strong>Type:</strong> {spot.vehicleType}
                </div>
                <div className="flex justify-end gap-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleEdit(spot)}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(spot.slotId)}
                    className="font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- Desktop Table View --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-100 dark:bg-gray-700 text-left">
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Slot Number
                  </th>
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Location
                  </th>
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Price/hr
                  </th>
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Vehicle Type
                  </th>
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Availability
                  </th>
                  <th className="p-3 font-bold border-b-2 border-gray-200 dark:border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr
                    key={spot.slotId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                      {spot.slotNumber}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                      {spot.location}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                      ${spot.pricePerHour}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600 capitalize">
                      {spot.vehicleType}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                      <span
                        className={`font-bold px-2 py-1 rounded-full text-xs ${
                          spot.available
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {spot.available ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600 flex gap-4">
                      <button
                        onClick={() => handleEdit(spot)}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(spot.slotId)}
                        className="font-semibold text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadParkingSpots;
