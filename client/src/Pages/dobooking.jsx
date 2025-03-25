import { useState } from "react";
import {
  FaCar,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaParking,
} from "react-icons/fa";

const DoBookings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    vehicleNumber: "",
    vehicleType: "",
    slotId: "",
    location: "",
    startTime: "",
    endTime: "",
    amountPaid: "",
    totalCost: "",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Data:", formData);
    alert("Booking Confirmed!");
    setFormData({
      fullName: "",
      contactNumber: "",
      email: "",
      vehicleNumber: "",
      vehicleType: "",
      slotId: "",
      location: "",
      startTime: "",
      endTime: "",
      amountPaid: "",
      totalCost: "",
      additionalNotes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 to-yellow-600 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Parking Slot Booking
        </h2>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Full Name */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaUser className="text-gray-600 mr-2" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaPhone className="text-gray-600 mr-2" />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaUser className="text-gray-600 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Vehicle Number */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaCar className="text-gray-600 mr-2" />
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaCar className="text-gray-600 mr-2" />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Slot ID */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaParking className="text-gray-600 mr-2" />
            <input
              type="text"
              name="slotId"
              placeholder="Slot ID"
              value={formData.slotId}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Location */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaMapMarkerAlt className="text-gray-600 mr-2" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Start Time */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaClock className="text-gray-600 mr-2" />
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* End Time */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaClock className="text-gray-600 mr-2" />
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Amount Paid */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaDollarSign className="text-gray-600 mr-2" />
            <input
              type="number"
              name="amountPaid"
              placeholder="Amount Paid"
              value={formData.amountPaid}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Total Cost */}
          <div className="flex items-center border p-3 rounded-md bg-gray-50">
            <FaDollarSign className="text-gray-600 mr-2" />
            <input
              type="number"
              name="totalCost"
              placeholder="Total Cost"
              value={formData.totalCost}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="col-span-2 flex items-center border p-3 rounded-md bg-gray-50">
            <FaCalendarAlt className="text-gray-600 mr-2" />
            <textarea
              name="additionalNotes"
              placeholder="Additional Notes (Optional)"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-2 bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-yellow-700 transition duration-300"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoBookings;
