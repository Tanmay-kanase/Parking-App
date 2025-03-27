import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCity,
  FaHome,
  FaHashtag,
  FaWarehouse,
} from "react-icons/fa";
import { MapPin, Building, Upload } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function UploadParkingLocations() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: `${userId}`,
    name: "Downtown Parking Lot",
    address: "123 Main Street",
    city: "Los Angeles",
    state: "California",
    zipCode: "90001",
    totalSlots: "150",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8088/api/parking-locations",
        formData
      );
      console.log("Parking location uploaded successfully:", response.data);
      navigate(
        `/upload-parking-slots?locationId=${response.data.locationId}&name=${response.data.name}`
      );
    } catch (error) {
      console.error(
        "Error uploading parking location:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fefae0] flex items-center justify-center p-10">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
          <FaMapMarkerAlt className="text-yellow-500 mr-3" size={35} />
          Upload Parking Location
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parking Name */}
          <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
            <FaHome className="text-gray-500 mr-4" size={26} />
            <input
              type="text"
              name="name"
              placeholder="Parking Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Address */}
          <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg">
            <MapPin className="text-gray-500 mr-4" size={26} />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* City & State */}
          <div className="flex space-x-4">
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
              <FaCity className="text-gray-500 mr-4" size={26} />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
              <Building className="text-gray-500 mr-4" size={26} />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* ZIP Code & Total Slots */}
          <div className="flex space-x-4">
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
              <FaHashtag className="text-gray-500 mr-4" size={26} />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center border border-gray-400 rounded-xl p-4 text-lg w-1/2">
              <FaWarehouse className="text-gray-500 mr-4" size={26} />
              <input
                type="number"
                name="totalSlots"
                placeholder="Total Slots"
                value={formData.totalSlots}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-yellow-500 text-white p-4 rounded-xl text-xl font-semibold hover:bg-yellow-600 transition duration-300"
          >
            <Upload className="mr-3" size={26} />
            Upload Location
          </button>
        </form>
      </div>
    </div>
  );
}
