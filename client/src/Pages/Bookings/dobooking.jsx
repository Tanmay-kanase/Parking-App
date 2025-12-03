import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../config/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const DoBooking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Data passed from the previous page
  const locationId = params.get("locID");
  const name = params.get("name");

  const [message, setMessage] = useState("Processing your booking...");
  const [loadingbooking, setLoadingBooking] = useState(false);
  const [spots, setSpots] = useState([]); // Grouped slots by vehicle type
  const [selectedSpot, setSelectedSpot] = useState(null); // The slot selected in the UI grid
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  // DoBooking.jsx (Inside the DoBooking component, after the initial useEffect for vehicles)

  // --- Initial Form Data Calculation ---
  // This runs once on mount to populate formData based on initial filterData
  useEffect(() => {
    // 1. Get the initial values
    const startString = filterData.startTime;
    const duration = parseFloat(filterData.duration);

    // 2. Calculate End Time
    if (startString && duration > 0) {
      // Treat the local input string as UTC for accurate time calculation
      const start = new Date(`${startString}:00.000Z`);
      const endUTC = new Date(start.getTime() + duration * 60 * 60 * 1000);

      // Format for display (YYYY-MM-DDTHH:MM local string)
      const calculatedEndTime = endUTC.toISOString().slice(0, 16);

      // 3. Set the form data (important for the grid to become clickable)
      setFormData((prev) => ({
        ...prev,
        startTime: startString, // The local time string
        endTime: calculatedEndTime,
        time: filterData.duration, // Hours
      }));
    }

    // Dependency array is empty so it runs only once on mount
    // It depends on filterData being set in the initial state.
  }, []);
  const getInitialDateTimeLocal = () => {
    const now = new Date();

    // Format the date part (YYYY-MM-DD)
    const datePart =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    // Format the time part (HH:MM)
    const timePart =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    return `${datePart}T${timePart}`;
  };
  // 1. NEW STATE for filtering inputs (Top section)
  const [filterData, setFilterData] = useState({
    startTime: getInitialDateTimeLocal(),
    duration: "1", // Hours for booking
    vehicleType: params.get("vType"), // Used to filter the visible slot groups
  });

  // 2. NEW/UPDATED STATE for the final booking form data (used in the modal)
  const [formData, setFormData] = useState({
    time: "1", // duration in hours (kept for logic continuity)
    paymentMethod: "credit-card",
    vehicleNumber: "",
    startTime: "", // Calculated
    endTime: "", // Calculated
  });

  if (loading) {
    return <div>Loading user info...</div>;
  }

  // --- Vehicle Logic (Kept mostly unchanged) ---
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
  }, [user]);

  // --- Validation and Formatting (Kept unchanged) ---
  const validateVehicleNumber = (number) => {
    const regex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
    if (!regex.test(number)) {
      setError("Invalid format! Use: MH-43-AR-0707");
    } else {
      setError("");
    }
  };

  const formatVehicleNumber = (input) => {
    let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = "";

    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += "-" + cleaned.substring(2, 4);
    if (cleaned.length > 4) formatted += "-" + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += "-" + cleaned.substring(6, 10);

    return formatted;
  };

  // --- Payment Handlers (Kept unchanged) ---
  const handlePaymentClick = () => {
    // Check if essential data is set before payment
    if (!selectedSpot || !formData.startTime || !formData.vehicleNumber) {
      alert(
        "Please select a slot, specify a vehicle number, and set the booking time."
      );
      return;
    }
    setShowPopup(true);
    setError("");
  };

  const handleDonePayment = async () => {
    const transactionIdPattern = /^\d{8}$/;

    if (!transactionIdPattern.test(transactionId)) {
      setError("Transaction ID must be an 8-digit number.");
      return;
    }

    // Safety check for null times
    if (!formData.startTime || !formData.endTime) {
      setError(
        "Booking times are missing. Please set Start Time and Duration."
      );
      return;
    }

    try {
      setLoadingBooking(true);
      setMessage("Reserving your slot...");

      // 1. Update slot availability (assuming this API handles the time-based reservation check on the server)
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-slots/${
          selectedSpot.slotId
        }`,
        {
          available: false, // Update availability status
        }
      );

      // 2. Post to Parking History
      setMessage("Saving parking history...");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parking-history`,
        {
          userId: user.userId,
          vehicleId: formData.vehicleNumber,
          parking_lot_id: locationId,
          slotId: selectedSpot.slotNumber,
          paymentId: transactionId,
          entryTime: formData.startTime,
          exitTime: formData.endTime,
          amountPaid: (
            selectedSpot.pricePerHour * parseFloat(formData.time)
          ).toFixed(2),
        }
      );

      // 3. Post to Payments
      setMessage("Processing payment...");
      await axios.post("/api/payments", {
        userId: user.userId,
        paymentMethod: formData.paymentMethod,
        status: "completed",
        paymentTime: new Date().toISOString(),
        amount: selectedSpot.pricePerHour * parseFloat(formData.time),
      });

      // 4. Create final Booking record
      setMessage("Finalizing booking...");
      const BookingData = {
        userId: user.userId,
        email: user.email,
        slotId: selectedSpot.slotId,
        slotNumber: selectedSpot.slotNumber,
        location: selectedSpot.location,
        amountPaid: selectedSpot.pricePerHour * parseFloat(formData.time),
        startTime: formData.startTime,
        endTime: formData.endTime,
        licensePlate: formData.vehicleNumber,
        vehicleType: selectedSpot.vehicleType,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "Completed",
        transactionId: transactionId,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
        BookingData
      );

      navigate("/booking");
      window.location.reload();
    } catch (error) {
      console.error("Error during booking process:", error);
      setMessage("Error occurred while booking. Please try again.");
    }

    setLoadingBooking(false);
  };

  // --- Slot Fetching and Filtering Logic (Updated) ---
  useEffect(() => {
    const fetchAndFilterParkingSlots = async () => {
      // 1. **Early Exit for Incomplete Data**
      if (!locationId || !filterData.startTime || !filterData.duration) {
        // If critical filter data is missing, we don't fetch.
        // The client-side will show "No slots found" until a time is set.
        setSpots([]); // Clear spots if we can't search correctly
        return;
      }

      setLoadingBooking(true);

      // --- CHANGE START ---
      // 1. Get the local time string from state (e.g., "2025-12-03T14:00")
      const localStartString = filterData.startTime;

      // 2. Treat the local string as a UTC time by appending Z (e.g., "2025-12-03T14:00:00.000Z")
      const utcStart = new Date(`${localStartString}:00.000Z`);
      const durationHours = parseFloat(filterData.duration);

      // 3. Calculate the end time in UTC
      const utcEnd = new Date(
        utcStart.getTime() + durationHours * 60 * 60 * 1000
      );

      // 4. Create the final ISO strings for the API
      const startTimeISO = utcStart.toISOString(); // e.g., 2025-12-03T14:00:00.000Z
      const endTimeISO = utcEnd.toISOString(); // e.g., 2025-12-03T16:00:00.000Z
      // --- CHANGE END ---
      // Construct the URL with all query parameters
      const apiUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/parking-slots/availableByVehicle?parkingId=${locationId}&vehicleType=${
        filterData.vehicleType
      }&startTime=${startTimeISO}&endTime=${endTimeISO}`;

      try {
        // 2. **Updated API Call**
        const response = await axios.get(apiUrl);

        // **3. Simplified grouping now that the backend filters by time/availability**
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
        setSpots([]); // Clear slots on error
      } finally {
        setLoadingBooking(false);
      }
    };

    if (locationId) {
      // Fetch only when locationId and essential filter parameters change
      fetchAndFilterParkingSlots();
    }
    // **4. Updated Dependencies to trigger fetch on filter changes**
  }, [
    locationId,
    filterData.vehicleType,
    filterData.startTime,
    filterData.duration,
  ]);
  // --- Input Change Handlers (Updated) ---

  // 3. Handle filtering input changes (Start Time, Duration, Vehicle Type)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilterData((prevFilter) => {
      const updatedFilter = {
        ...prevFilter,
        [name]: value,
      };

      const start = updatedFilter.startTime
        ? new Date(updatedFilter.startTime)
        : null;
      const duration = parseFloat(updatedFilter.duration);

      if (
        start instanceof Date &&
        !isNaN(start.getTime()) &&
        !isNaN(duration) &&
        duration > 0
      ) {
        // Calculate end time
        const endUTC = new Date(start.getTime() + duration * 60 * 60 * 1000);
        const localEndTime = new Date(
          endUTC.getTime() - endUTC.getTimezoneOffset() * 60000
        );
        const calculatedEndTime = localEndTime.toISOString().slice(0, 16);

        // Update the final booking form data
        setFormData({
          ...formData,
          startTime: updatedFilter.startTime,
          endTime: calculatedEndTime,
          time: updatedFilter.duration, // Hours
        });
      } else {
        // Clear times if input is invalid
        setFormData({
          ...formData,
          startTime: updatedFilter.startTime,
          endTime: "",
          time: updatedFilter.duration,
        });
      }

      return updatedFilter;
    });
  };

  // 4. Handle form changes only for non-time/duration fields in the modal (e.g., payment)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- UI Render ---
  if (loadingbooking)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-lg transition-opacity duration-300">
        <div className="flex flex-col items-center p-6 sm:p-8 max-w-sm mx-4 bg-gray-800 rounded-xl shadow-2xl space-y-4">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
          <p className="text-lg sm:text-xl font-semibold text-gray-100 mt-4 text-center">
            {message}
          </p>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-blue-400 animate-pulse-width"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-6">
          Booking for Location: {name}
        </h2>

        {/* 5. Time and Vehicle Selection Area (NEW) */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Select Date & Time 
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={filterData.startTime}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            {/* Duration (Hours) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (Hours)
              </label>
              <input
                type="number"
                name="duration"
                min="1"
                step="0.5"
                value={filterData.duration}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            {/* Vehicle Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Type Filter
              </label>
              <select
                name="vehicleType"
                value={filterData.vehicleType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Types</option>
                <option value="bike">Bike</option>
                <option value="sedan">Sedan</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
              </select>
            </div>
            {/* Calculated End Time Display */}
            <div className="flex flex-col justify-end">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <p className="w-full p-2 font-semibold text-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                {formData.endTime
                  ? new Date(formData.endTime).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "---"}
              </p>
            </div>
          </div>
        </div>

        {/* 6. Slot Grid Display (Updated to show all slots and allow selection) */}
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Select an Available Slot
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {spots.length > 0 ? (
            spots.map((group) => {
              const { vehicleType, slots } = group;
              const availableCount = slots.length;

              return (
                <div
                  key={vehicleType}
                  className="col-span-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
                >
                  <h4 className="text-lg font-bold text-blue-500 dark:text-blue-400 mt-0 mb-4 capitalize">
                    {vehicleType} Slots ({availableCount} Available)
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {slots.map(
                      (
                        slot // Show ALL slots
                      ) => (
                        <div
                          key={slot.slotId}
                          className={`p-3 text-center rounded-lg shadow-sm border bg-green-500 text-white cursor-pointer hover:bg-green-600
                                 
                                    
                                    ${
                                      selectedSpot?.slotId === slot.slotId
                                        ? "ring-4 ring-yellow-400"
                                        : ""
                                    }
                                `}
                          onClick={() => {
                            if (formData.startTime) {
                              setSelectedSpot(slot);
                            } else if (!formData.startTime) {
                              alert(
                                "Please select a Start Time and Duration first."
                              );
                            }
                          }}
                        >
                          <span className="font-semibold text-sm block">
                            {slot.slotNumber}
                          </span>
                          <span className="text-xs">
                            {`$${slot.pricePerHour}/hr`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No slots found for the selected criteria.
            </p>
          )}
        </div>

        {/* 7. Booking Form Modal/Section (UPDATED) */}
        {selectedSpot && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePaymentClick();
              }}
              className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Confirm Booking: Slot {selectedSpot.slotNumber}
              </h3>

              {/* Display Confirmed Times/Duration */}
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration:
                  <span className="font-bold text-yellow-500 ml-2">
                    {formData.time} Hours
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time:
                  <span className="font-bold ml-2">
                    {new Date(formData.startTime).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time:
                  <span className="font-bold ml-2">
                    {new Date(formData.endTime).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Form fields (Vehicle Number & Payment Method) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vehicle Number
                  </label>
                  {vehicles.length === 0 ? (
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter your vehicle number"
                      required
                    />
                  ) : vehicles.length === 1 ? (
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  ) : (
                    <>
                      <select
                        name="vehicleNumber"
                        value={selectedVehicle || ""}
                        onChange={(e) => {
                          const selected = e.target.value;
                          setSelectedVehicle(selected);

                          if (selected !== "manual") {
                            setFormData({
                              ...formData,
                              vehicleNumber: selected,
                            });
                          } else {
                            setFormData({ ...formData, vehicleNumber: "" });
                          }
                        }}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                          <option
                            key={vehicle._id || vehicle.licensePlate}
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
                            placeholder="MH-43-AR-0707"
                            className={`border p-2 rounded-lg mt-2 ${
                              error ? "border-red-500" : "border-gray-300"
                            }`}
                            value={formData.vehicleNumber}
                            onChange={(e) => {
                              const formatted = formatVehicleNumber(
                                e.target.value
                              );
                              setFormData({
                                ...formData,
                                vehicleNumber: formatted,
                              });
                              validateVehicleNumber(formatted);
                            }}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Amount
                  </label>
                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 mt-2">
                    $
                    {(
                      selectedSpot.pricePerHour * parseFloat(formData.time || 1)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setSelectedSpot(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment QR Code Popup (Remains unchanged) */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm sm:max-w-md shadow-lg text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Scan QR & Pay
              </h2>
              <img
                src="public/5aad3715-5a2d-47da-992c-18ac3f6799dd_GooglePay_QR.png"
                alt="QR Code for Payment"
                className="mx-auto mb-4 w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-lg"
              />

              <div className="mb-4 text-left">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-1 border rounded w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 8-digit Transaction ID"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full sm:w-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonePayment}
                  className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Done Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoBooking;
