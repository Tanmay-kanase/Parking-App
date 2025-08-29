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
} from "react-icons/fa";

const ShowParkings = () => {
  const navigate = useNavigate();

  const handleBooking = (parkingId, name) => {
    navigate(`/dobooking?locID=${parkingId}&name=${name}`);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get("query");

  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/parking-locations/city/${searchLocation}`
      )
      .then((response) => {
        setParkings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parking locations:", error);
      });
  }, [searchLocation]);
  console.log(parkings);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-gray-800 shadow-lg rounded-2xl p-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600"
        >
          Add Parking Slots
        </button>

        {showModal && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 p-6 rounded-xl shadow mt-6"
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
                className="border p-3 rounded-lg text-lg col-span-2 md:col-span-1 bg-gray-700 border-gray-600 text-gray-100"
                required
              />
            ) : (
              <>
                <input
                  type="text"
                  name="slotPrefix"
                  placeholder="Slot Prefix (e.g. B)"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg bg-gray-700 border-gray-600 text-gray-100"
                  required
                />
                <input
                  type="number"
                  name="startNumber"
                  placeholder="Start Number"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg bg-gray-700 border-gray-600 text-gray-100"
                  required
                />
                <input
                  type="number"
                  name="endNumber"
                  placeholder="End Number"
                  onChange={handleChange}
                  className="border p-3 rounded-lg text-lg bg-gray-700 border-gray-600 text-gray-100"
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
              className="border p-3 rounded-lg text-lg bg-gray-700 border-gray-600 text-gray-100"
              required
            />

            {/* Vehicle Type */}
            <div className="col-span-2">
              <p className="text-lg font-semibold text-gray-300 mb-2">
                Select Vehicle Type:
              </p>
              <div className="flex gap-4 flex-wrap">
                {[
                  {
                    type: "bike",
                    icon: <FaMotorcycle className="text-2xl text-gray-100" />,
                  },
                  {
                    type: "compact",
                    icon: <FaCar className="text-2xl text-gray-100" />,
                  },
                  {
                    type: "sedan",
                    icon: <FaCar className="text-2xl text-gray-100" />,
                  },
                  {
                    type: "SUV",
                    icon: <FaTruck className="text-2xl text-gray-100" />,
                  },
                  {
                    type: "truck",
                    icon: <FaBus className="text-2xl text-gray-100" />,
                  },
                ].map(({ type, icon }) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                      formData.vehicleType === type
                        ? "bg-gray-700 border border-yellow-500"
                        : "bg-gray-700 border border-gray-600"
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
                    <span className="capitalize text-lg text-gray-100">
                      {type}
                    </span>
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
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
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
                className="bg-red-600 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-red-700"
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
                  className="bg-gray-600 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2">Slot Number</th>
                <th className="border border-gray-600 p-2">Location</th>
                <th className="border border-gray-600 p-2">Price</th>
                <th className="border border-gray-600 p-2">Vehicle Type</th>
                <th className="border border-gray-600 p-2">Availability</th>
                <th className="border border-gray-600 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.id} className="text-center bg-gray-800">
                  <td className="border border-gray-700 p-2">
                    {spot.slotNumber}
                  </td>
                  <td className="border border-gray-700 p-2">
                    {spot.location}
                  </td>
                  <td className="border border-gray-700 p-2">
                    ${spot.pricePerHour}
                  </td>
                  <td className="border border-gray-700 p-2 capitalize">
                    {spot.vehicleType}
                  </td>
                  <td
                    className={`border border-gray-700 p-2 font-bold ${
                      spot.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {spot.available ? "Available" : "Not Available"}
                  </td>
                  <td className="border border-gray-700 p-2 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(spot)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(spot.slotId)}
                      className="text-red-400 hover:underline items-center"
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

export default ShowParkings;
