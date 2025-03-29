import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DoBooking = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [formData, setFormData] = useState({
    time: 1,
    paymentMethod: "credit-card",
  });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get("locID");
  const name = params.get("name");
  const navigate = useNavigate();

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
    console.log(spots);

    if (locationId) {
      fetchParkingSlots();
    }
  }, [locationId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/${
          selectedSpot.slotId
        }`,
        {
          available: false, // Update availability status
        }
      );

      alert("Booking Confirmed! Slot is now unavailable.");
      navigate("/booking");

      // Update UI to reflect changes
      setSpots((prevSpots) =>
        prevSpots.map((spot) =>
          spot.id === selectedSpot.id ? { ...spot, available: false } : spot
        )
      );

      //setSelectedSpot(null); // Close booking form
    } catch (error) {
      console.error("Error updating slot availability:", error);
      alert("Failed to book slot. Please try again.");
    }
    console.log("Booking Confirmed", {
      ...formData,
      slotId: selectedSpot.slotId,
    });
    alert("Booking Confirmed!");
    //setSelectedSpot(null); // Close form after submission
  };
  console.log(selectedSpot);
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-yellow-600 mb-6">
        Booking for Location {name}
      </h2>

      {/* Table */}
      <table className="w-full mt-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-yellow-100">
            <th className="border p-2">Slot Number</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Price (Per Hour)</th>
            <th className="border p-2">Vehicle Type</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Action</th>
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
              <td className="border p-2">
                {spot.available && (
                  <button
                    className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-yellow-600"
                    onClick={() => setSelectedSpot(spot)}
                  >
                    Book
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Booking Form */}
      {selectedSpot && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mt-6"
        >
          <h3 className="text-xl font-semibold mb-4">
            Booking Slot {selectedSpot.slotNumber}
          </h3>
          <div className="mb-4">
            <label className="block text-gray-700">Time (Hours):</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Total Amount:</label>
            <p className="font-semibold">
              ${selectedSpot.pricePerHour * (formData.time || 1)}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method:</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
          >
            Proceed to Payment
          </button>
          <button
            type="button"
            className="ml-4 bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
            onClick={() => setSelectedSpot(null)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default DoBooking;
