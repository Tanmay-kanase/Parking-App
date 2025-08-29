import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";

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
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("Processing your booking...");
  const [loadingbooking, setLoadingBooking] = useState(false);
  if (loading) {
    return <div>Loading user info...</div>;
  }

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

  let email = user.email;

  useEffect(() => {
    if (!user || !user.userId) return;
    if (user.userId) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/user/${user.userId}`
        )
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
      setLoadingBooking(true);
      setMessage("Reserving your slot...");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/${
          selectedSpot.slotId
        }`,
        {
          available: false, // Update availability status
        }
      );
      // Post to Parking History
      try {
        setMessage("Saving parking history...");

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/parking-history`,
          {
            userId: user.userId,
            vehicleId: formData.vehicleNumber, // Assuming license plate as ID if not available
            parking_lot_id: locationId,
            slotId: selectedSpot.slotNumber,
            paymentId: transactionId,
            entryTime: formData.startTime,
            exitTime: formData.endTime,
            amountPaid: (selectedSpot.pricePerHour * formData.time).toFixed(2),
          }
        );
        console.log("Parking history recorded.");
      } catch (historyError) {
        console.log("Error saving parking history:", historyError);
      }
      try {
        setMessage("Processing payment...");

        await axios.post("/api/payments", {
          userId: user.userId,
          paymentMethod: formData.paymentMethod,
          status: "completed",
          paymentTime: new Date().toISOString(),
          amount: selectedSpot.pricePerHour * formData.time,
        });
      } catch (error) {
        console.log("Error in adding payment history", error);
      }

      const BookingData = {
        userId: user.userId,
        email: user.email,
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
        setMessage("Finalizing booking...");

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
          BookingData
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
      setMessage("Error occurred while booking. Please try again.");
    }

    console.log("Booking Confirmed", {
      ...formData,
      slotId: selectedSpot.slotId,
    });
    setLoadingBooking(false);
  };

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-slots/parking/${locationId}`
        );

        const grouped = response.data.reduce((acc, slot) => {
          const type = slot.vehicleType;
          if (!acc[type]) {
            acc[type] = {
              vehicleType: type,
              slots: [],
            };
          }
          acc[type].slots.push(slot);
          return acc;
        }, {});

        setSpots(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };

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
  console.log("User Id", user.userId);
  if (loadingbooking)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-lg transition-opacity duration-300">
        <div className="flex flex-col items-center p-6 sm:p-8 max-w-sm mx-4 bg-gray-800 rounded-xl shadow-2xl space-y-4">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>

          {/* Loading Message */}
          <p className="text-lg sm:text-xl font-semibold text-gray-100 mt-4 text-center">
            {message}
          </p>

          {/* Optional: Add a subtle loading bar for perceived progress, if actual progress is not available */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-blue-400 animate-pulse-width"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="p-10 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Booking for Location {name}
      </h2>

      {/* Cards instead of Table for responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {spots.map((group) => {
          const { vehicleType, slots } = group;
          const availableCount = slots.filter((s) => s.available).length;
          const totalCount = slots.length;
          const avgPrice = (
            slots.reduce((sum, s) => sum + s.pricePerHour, 0) / totalCount
          ).toFixed(2);

          return (
            <div
              key={vehicleType}
              className="flex flex-col p-6 rounded-xl shadow-lg border-2 bg-gray-800 border-blue-600 transition-transform transform hover:scale-105"
            >
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2 capitalize">
                  Vehicle Type: {vehicleType}
                </h3>
                <p className="text-gray-400">
                  <span className="font-semibold">Total Slots:</span>{" "}
                  {totalCount}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Available Slots:</span>{" "}
                  {availableCount}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Avg. Price:</span> ${avgPrice}{" "}
                  / hr
                </p>
              </div>

              <div className="mt-4 text-center">
                {availableCount > 0 ? (
                  <button
                    className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                    onClick={() => {
                      // Pick first available slot from this group
                      const firstAvailable = slots.find((s) => s.available);
                      if (firstAvailable) {
                        setSelectedSpot(firstAvailable);
                      }
                    }}
                  >
                    Book Now
                  </button>
                ) : (
                  <span className="text-red-500 font-bold">
                    No Slots Available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form */}
      {selectedSpot && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePaymentClick();
          }}
          className="mt-8 p-6 bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-100">
            Booking Slot {selectedSpot.slotNumber}
          </h3>

          {/* Start Time Input */}
          <div className="mb-4">
            <label className="block text-gray-300">Start Time:</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
              required
            />
          </div>

          {/* End Time Input */}
          <div className="mb-4">
            <label className="block text-gray-300">End Time:</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
              required
            />
          </div>

          {/* Time (in hours) */}
          <div className="mb-4">
            <label className="block text-gray-300">Time (Hours):</label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
              required
            />
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <label className="block text-gray-300">Total Amount:</label>
            <p className="font-semibold text-gray-100">
              ${selectedSpot.pricePerHour * (formData.time || 1)}
            </p>
          </div>

          {/* Vehicle Number Selection */}
          <div className="mb-4">
            <label className="block text-gray-300">Vehicle Number:</label>

            {/* Case 1: No vehicles */}
            {vehicles.length === 0 ? (
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
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
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
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
                  className="w-full p-2 border border-gray-600 rounded-lg mb-2 bg-gray-700 text-gray-100"
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
                      className={`w-full p-2 border rounded-lg bg-gray-700 text-gray-100 ${
                        error ? "border-red-500" : "border-gray-600"
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
            <label className="block text-gray-300">Payment Method:</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
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
            className="ml-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"
            onClick={() => setSelectedSpot(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-100">
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
              <label className="block font-semibold text-gray-300">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="border rounded w-full px-3 py-2 mt-1 bg-gray-700 text-gray-100 border-gray-600"
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
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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
