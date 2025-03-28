import { useEffect, useState } from "react";
import { FaCar, FaTruck, FaMotorcycle, FaBus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UploadParkingSpots = () => {
  const [spots, setSpots] = useState([]);
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const params = new URLSearchParams(location.search);
  const locationId = params.get("locationId");
  const name = params.get("name");
  const [showModal, setShowModal] = useState(false);
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
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/user/${userId}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots`,
        formData
      );

      console.log("Parking slot uploaded:", response.data);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading parking slot:", error);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600"
        >
          Add Parking
        </button>

        <h2 className="text-3xl font-bold text-yellow-600 mb-6">
          Upload Your Parking Slot
        </h2>
        {showModal && (

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="slotNumber"
              placeholder="Slot Number"
              value={formData.slotNumber}
              onChange={handleChange}
              className="border p-3 rounded-lg text-lg"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-3 rounded-lg text-lg"
              required
            />
            <input
              type="number"
              name="pricePerHour"
              placeholder="Price Per Hour ($)"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="border p-3 rounded-lg text-lg"
              required
            />

            <p className="col-span-2 text-lg font-semibold text-gray-700">
              Select Vehicle Type:
            </p>
            <div className="col-span-2 flex gap-4 flex-wrap">
              {[
                { type: "bike", icon: <FaMotorcycle className="text-2xl" /> },
                { type: "compact", icon: <FaCar className="text-2xl" /> },
                { type: "sedan", icon: <FaCar className="text-2xl" /> },
                { type: "SUV", icon: <FaTruck className="text-2xl" /> },
                { type: "truck", icon: <FaBus className="text-2xl" /> },
              ].map(({ type, icon }) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${formData.vehicleType === type
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

            <div className="col-span-2 flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={handleChange}
                  checked={formData.available}
                  type="checkbox"
                  id="available"
                  className="hidden"
                />
                <span
                  className={`px-4 py-2 rounded-lg text-lg font-semibold ${formData.available
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}
                >
                  {formData.available ? "Available" : "Not Available"}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="col-span-2 bg-yellow-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-yellow-600"
            >
              Add Parking Slot
            </button>
          </form>
        )}
        <table className="w-full mt-6 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border p-2">Slot Number</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Vehicle Type</th>
              <th className="border p-2">Availability</th>
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
                  className={`border p-2 font-bold ${spot.available ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {spot.available ? "Available" : "Not Available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadParkingSpots;
