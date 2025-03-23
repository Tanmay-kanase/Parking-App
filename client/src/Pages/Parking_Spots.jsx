import { useState } from "react";
import { FaCar, FaMotorcycle, FaTruck, FaChargingStation } from "react-icons/fa";

const ParkingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [formData, setFormData] = useState({
    spotNumber: "",
    location: "",
    description: "",
    vehicleTypes: [],
    pricePerHour: "",
    dimension: "",
    images: [],
    features: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleType = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleTypes: prevData.vehicleTypes.includes(type)
        ? prevData.vehicleTypes.filter((t) => t !== type)
        : [...prevData.vehicleTypes, type],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSpots([...spots, formData]);
    setFormData({
      spotNumber: "",
      location: "",
      description: "",
      vehicleTypes: [],
      pricePerHour: "",
      dimension: "",
      images: [],
    });
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-yellow-600 mb-6">Upload Your Parking Spot</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="spotNumber"
            placeholder="Spot Number"
            value={formData.spotNumber}
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
          <textarea
            name="description"
            placeholder="Describe your parking spot (e.g., Covered, near exit, security, etc.)"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded-lg text-lg col-span-2"
            rows="3"
          />
          <input
            type="text"
            name="dimension"
            placeholder="Dimension (e.g., 10x20 ft)"
            value={formData.dimension}
            onChange={handleChange}
            className="border p-3 rounded-lg text-lg"
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

          {/* Vehicle Type Selection */}
          <p className="col-span-2 text-lg font-semibold text-gray-700">Select Vehicle Type:</p>

          <div className="col-span-2 flex flex-wrap gap-4">
            {[
              { type: "car", icon: <FaCar className="text-2xl text-gray-600" /> },
              { type: "bike", icon: <FaMotorcycle className="text-2xl text-gray-600" /> },
              { type: "truck", icon: <FaTruck className="text-2xl text-gray-600" /> },
              { type: "EV", icon: <FaChargingStation className="text-2xl text-green-500" /> },
            ].map(({ type, icon }) => (
              <label key={type} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vehicleTypes.includes(type)}
                  onChange={() => handleVehicleType(type)}
                  className="hidden"
                />
                {icon}
                <span className="capitalize text-lg">{type}</span>
              </label>
            ))}
          </div>
          <p className="col-span-2 text-lg font-semibold text-gray-700">Select Additional Features:</p>

          <div className="col-span-2 flex flex-wrap gap-4">
            {[
              { name: "camera_security", label: "Camera Security" },
              { name: "ev_charging", label: "EV Charging" },
              { name: "washing_service", label: "Washing Service" },
              { name: "valet_parking", label: "Valet Parking" },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(name)}
                  onChange={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      features: prevData.features.includes(name)
                        ? prevData.features.filter((f) => f !== name)
                        : [...prevData.features, name],
                    }))
                  }
                  className="hidden"
                />
                <span className="text-lg">{label}</span>
              </label>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border p-3 rounded-lg text-lg col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-yellow-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-yellow-600"
          >
            Add Parking Spot
          </button>
        </form>
      </div>



      {/* Parking Spots Preview */}
      <div className="mt-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800">My Parking Spots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {spots.map((spot, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6">
              {spot.images.length > 0 && (
                <img src={spot.images[0]} alt="Parking Spot" className="w-full h-48 object-cover rounded-lg" />
              )}
              <h3 className="text-xl font-semibold text-gray-800 mt-3">{spot.spotNumber}</h3>
              <p className="text-gray-600">{spot.location}</p>
              <p className="text-gray-500">{spot.description}</p>
              <p className="text-gray-500 font-medium">Price: ${spot.pricePerHour} / hr</p>
              <p className="text-gray-500">Dimension: {spot.dimension}</p>


              <div className="flex gap-3 mt-3">
                {spot.vehicleTypes.includes("car") && <FaCar className="text-gray-600 text-xl" />}
                {spot.vehicleTypes.includes("bike") && <FaMotorcycle className="text-gray-600 text-xl" />}
                {spot.vehicleTypes.includes("truck") && <FaTruck className="text-gray-600 text-xl" />}
                {spot.vehicleTypes.includes("EV") && <FaChargingStation className="text-green-500 text-xl" />}
              </div>
              {spot.features.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-500 font-medium">Features:</p>
                  <ul className="text-gray-700 list-disc pl-5">
                    {spot.features.includes("camera_security") && <li>📷 Camera Security</li>}
                    {spot.features.includes("ev_charging") && <li>⚡ EV Charging</li>}
                    {spot.features.includes("washing_service") && <li>🧼 Washing Service</li>}
                    {spot.features.includes("valet_parking") && <li>🚗 Valet Parking</li>}
                  </ul>
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ParkingSpots;
