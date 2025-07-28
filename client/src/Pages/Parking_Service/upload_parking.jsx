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
    <div className="min-h-screen bg-yellow-50 text-gray-900 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600"
        >
          Add Parking Slots
        </button>

        {showModal && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow"
          >
            {/* Upload Mode Selection */}
            <div className="col-span-2 flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="single"
                  checked={uploadMode === "single"}
                  onChange={() => setUploadMode("single")}
                />
                Single Slot
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="multiple"
                  checked={uploadMode === "multiple"}
                  onChange={() => setUploadMode("multiple")}
                />
                Multiple Slots
              </label>
            </div>

            {/* Conditional Inputs */}
            {uploadMode === "single" ? (
              <input
                type="text"
                name="slotNumber"
                placeholder="Slot Number (e.g. B1)"
                onChange={handleChange}
                className="border p-3 rounded-lg text-lg col-span-2 md:col-span-1"
                required
              />
            ) : (
              <>
                <input
                  type="text"
                  name="slotPrefix"
                  placeholder="Slot Prefix (e.g. B)"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg"
                  required
                />
                <input
                  type="number"
                  name="startNumber"
                  placeholder="Start Number"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg"
                  required
                />
                <input
                  type="number"
                  name="endNumber"
                  placeholder="End Number"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg"
                  required
                />
              </>
            )}

            {/* Price */}
            <input
              type="number"
              name="pricePerHour"
              placeholder="Price Per Hour ($)"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="border p-3 rounded-lg text-lg"
              required
            />

            {/* Vehicle Type */}
            <div className="col-span-2">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Select Vehicle Type:
              </p>
              <div className="flex gap-4 flex-wrap">
                {[
                  { type: "bike", icon: <FaMotorcycle className="text-2xl" /> },
                  { type: "compact", icon: <FaCar className="text-2xl" /> },
                  { type: "sedan", icon: <FaCar className="text-2xl" /> },
                  { type: "SUV", icon: <FaTruck className="text-2xl" /> },
                  { type: "truck", icon: <FaBus className="text-2xl" /> },
                ].map(({ type, icon }) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                      formData.vehicleType === type
                        ? "bg-gray-300"
                        : "bg-gray-100"
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
                    {icon}
                    <span className="capitalize text-lg">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="col-span-2 flex items-center">
              <label className="flex items-center gap-3">
                <input
                  onChange={handleChange}
                  checked={formData.available}
                  type="checkbox"
                  id="available"
                  className="hidden"
                />
                <span
                  className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                    formData.available
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {formData.available ? "Available" : "Not Available"}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex flex-wrap gap-4 justify-start mt-4">
              <button
                type="submit"
                className="bg-yellow-500 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-yellow-600"
              >
                {isEditMode ? "Update Parking Slot" : "Add Parking Slot"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditingSlotId(null);
                }}
                className="bg-red-500 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingSlotId(null);
                  }}
                  className="bg-gray-300 text-black font-bold text-lg px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-yellow-100">
                <th className="border p-2">Slot Number</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Vehicle Type</th>
                <th className="border p-2">Availability</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.id} className="text-center">
                  <td className="border p-2">{spot.slotNumber}</td>
                  <td className="border p-2">{spot.location}</td>
                  <td className="border p-2">${spot.pricePerHour}</td>
                  <td className="border p-2 capitalize">{spot.vehicleType}</td>
                  <td
                    className={`border p-2 font-bold ${
                      spot.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {spot.available ? "Available" : "Not Available"}
                  </td>
                  <td className="border p-2 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(spot)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(spot.slotId)}
                      className="text-red-600 hover:underline items-center"
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
  );
};

export default UploadParkingSpots;
