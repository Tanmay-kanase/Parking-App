import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../../config/axiosInstance";

const formatVehicleNumber = (input) => {
  let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let formatted = "";

  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
  if (cleaned.length > 2) formatted += "-" + cleaned.substring(2, 4);
  if (cleaned.length > 4) formatted += "-" + cleaned.substring(4, 6);
  if (cleaned.length > 6) formatted += "-" + cleaned.substring(6, 10);

  return formatted;
};

const validateVehicleNumber = (number) => {
  const regex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
  return regex.test(number);
};

const DoBooking = () => {
  const userId = localStorage.getItem("userId");
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [BookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({
    time: "1",
    paymentMethod: "credit-card",
  });
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  // Fetch vehicles from the backend using userId from localStorage
  // Handle vehicle selection change

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
    setFormData((prev) => ({
      ...prev,
      vehicleNumber: e.target.value,
    }));
  };

  let email = "";

  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/email`)
    .then((response) => (email = response.data)) // Store the email in the variable
    .catch((error) => console.error("Error fetching email:", error));

  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/user/${userId}`)
        .then((response) => {
          const data = response.data;
          setVehicles(data);
          // If only one vehicle, set it automatically
          if (data.length === 1) {
            setSelectedVehicle(data[0].licensePlate);
            setFormData((prev) => ({
              ...prev,
              vehicleNumber: data[0].licensePlate,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching vehicles:", error);
        });
    }
  }, []);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get("locID");
  const name = params.get("name");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  const handlePaymentClick = () => {
    setShowPopup(true);
    setError("");
  };

  const handleDonePayment = async () => {
    const transactionIdPattern = /^\d{8}$/;

    if (!transactionIdPattern.test(transactionId)) {
      setError("Transaction ID must be an 8-digit number.");
      return;
    }

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

      const BookingData = {
        userId: localStorage.getItem("userId"),
        email: email,
        slotId: selectedSpot.slotId,
        slotNumber: selectedSpot.slotNumber,
        location: selectedSpot.location,
        amountPaid: selectedSpot.pricePerHour * formData.time,
        startTime: formData.startTime, // Added start time
        endTime: formData.endTime, // Added end time
        licensePlate: formData.vehicleNumber,
        vehicleType: selectedSpot.vehicleType,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "Completed",
        transactionId: transactionId,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
          BookingData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Booking created:", response.data);
        navigate("/booking");
        window.location.reload();
        return response.data;
      } catch (error) {
        console.error("Error creating booking:", error);
      }
    } catch (error) {
      console.error("Error updating slot availability:", error);
      alert("Failed to book slot. Please try again.");
    }

    console.log("Booking Confirmed", {
      ...formData,
      slotId: selectedSpot.slotId,
    });
  };

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
    console.log("Spots : ", spots);

    if (locationId) {
      fetchParkingSlots();
    }
  }, [locationId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };

      const start = updatedForm.startTime
        ? new Date(updatedForm.startTime)
        : null;
      const duration = parseFloat(updatedForm.time);

      if (
        start instanceof Date &&
        !isNaN(start.getTime()) &&
        !isNaN(duration)
      ) {
        // Calculate end time in UTC
        const endUTC = new Date(start.getTime() + duration * 60 * 60 * 1000);

        // Convert to local time by adjusting for the user's timezone offset
        const localEndTime = new Date(
          endUTC.getTime() - endUTC.getTimezoneOffset() * 60000
        );

        // Format the local end time as 'YYYY-MM-DDTHH:MM' to set in the input field
        updatedForm.endTime = localEndTime.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
      }

      return updatedForm;
    });
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
      // navigate("/booking");

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
    
    //setSelectedSpot(null); // Close form after submission
  };
  console.log("Selected Spots");
  console.log(selectedSpot);
  console.log("User Id", userId);
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
          onSubmit={(e) => {
            e.preventDefault();
            handlePaymentClick();
          }}
        >
          <h3 className="text-xl font-semibold mb-4">
            Booking Slot {selectedSpot.slotNumber}
          </h3>

          {/* Start Time Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Start Time:</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* End Time Input */}
          <div className="mb-4">
            <label className="block text-gray-700">End Time:</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Time (in hours) */}
          <div className="mb-4">
            <label className="block text-gray-700">Time (Hours):</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <label className="block text-gray-700">Total Amount:</label>
            <p className="font-semibold">
              ${selectedSpot.pricePerHour * (formData.time || 1)}
            </p>
          </div>

          {/* Vehicle Number Selection */}
          <div className="mb-4">
            <label className="block text-gray-700">Vehicle Number:</label>

            {/* Case 1: No vehicles */}
            {vehicles.length === 0 ? (
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your vehicle number"
                required
              />
            ) : vehicles.length === 1 ? (
              // Case 2: Only one vehicle - prefill the input
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            ) : (
              // Case 3: Multiple vehicles - show dropdown and allow manual entry
              <>
                <select
                  name="vehicleNumber"
                  value={selectedVehicle}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedVehicle(selected);
                    setFormData({ ...formData, vehicleNumber: selected });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.licensePlate}
                      value={vehicle.licensePlate}
                    >
                      {vehicle.licensePlate}
                    </option>
                  ))}
                  <option value="manual">Enter manually</option>
                </select>

                {selectedVehicle === "manual" && (
                  <>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={(e) => {
                        const formatted = formatVehicleNumber(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          vehicleNumber: formatted,
                        }));

                        if (!validateVehicleNumber(formatted)) {
                          setError("Invalid format! Use: MH-43-AR-0707");
                        } else {
                          setError("");
                        }
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your vehicle number"
                      required
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Payment Method */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
          >
            Proceed to Payment
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            className="ml-4 bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
            onClick={() => setSelectedSpot(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Scan QR & Pay
            </h2>
            <img
              src={
                "public/5aad3715-5a2d-47da-992c-18ac3f6799dd_GooglePay_QR.png"
              }
              alt="QR Code"
              className="mx-auto mb-4 w-[300px] h-[300px] object-contain"
            />

            <div className="mb-4">
              <label className="block font-semibold">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="border rounded w-full px-3 py-2 mt-1"
                placeholder="Enter 8-digit Transaction ID"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleDonePayment}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Done Payment
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoBooking;
