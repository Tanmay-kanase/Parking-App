import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../config/axiosInstance";
import stompClient from "../../config/socket";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const DoBooking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const locationId = params.get("locID");
  const name = params.get("name");

  const getInitialDateTimeLocal = () => {
    const now = new Date();

    const datePart =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const timePart =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    return `${datePart}T${timePart}`;
  };

  // ----- State (declared up front so no hook below ever runs conditionally) -----
  const [message, setMessage] = useState("Getting Parkings ...");
  const [loadingbooking, setLoadingBooking] = useState(false);
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [lockedSlots, setLockedSlots] = useState({});

  const [filterData, setFilterData] = useState({
    startTime: getInitialDateTimeLocal(),
    duration: "1",
    vehicleType: params.get("vType") || "",
  });

  const [formData, setFormData] = useState({
    time: "1",
    paymentMethod: "credit-card",
    vehicleNumber: "",
    startTime: "",
    endTime: "",
  });

  // ----- Effects (all hooks live above any early return) -----
  useEffect(() => {
    const startString = filterData.startTime;
    const duration = parseFloat(filterData.duration);

    if (startString && duration > 0) {
      const start = new Date(startString);
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

      setFormData((prev) => ({
        ...prev,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        time: filterData.duration,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user || !user.userId) return;

    axios
      .get(`/api/vehicles/user/${user.userId}`)
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
  }, [user]);

  useEffect(() => {
    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/slot-updates", (message) => {
        const data = JSON.parse(message.body);

        if (data.status === "LOCKED") {
          setLockedSlots((prev) => ({
            ...prev,
            [data.slotId]: true,
          }));
        }

        if (data.status === "UNLOCKED") {
          setLockedSlots((prev) => {
            const updated = { ...prev };
            delete updated[data.slotId];
            return updated;
          });
        }

        if (data.status === "BOOKED") {
          setLockedSlots((prev) => {
            const updated = { ...prev };
            delete updated[data.slotId];
            return updated;
          });

          setSpots((prevSpots) =>
            prevSpots
              .map((group) => ({
                ...group,
                slots: group.slots.filter(
                  (slot) => slot.slotId !== data.slotId,
                ),
              }))
              .filter((group) => group.slots.length > 0),
          );
        }
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const fetchAndFilterParkingSlots = async () => {
      setMessage("Getting Parkings ...");

      if (!locationId || !filterData.startTime || !filterData.duration) {
        setSpots([]);
        return;
      }

      setLoadingBooking(true);

      const start = new Date(filterData.startTime);
      const duration = parseFloat(filterData.duration);
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

      const startUTC = encodeURIComponent(start.toISOString());
      const endUTC = encodeURIComponent(end.toISOString());

      const apiUrl = `/api/parking-slots/availableByVehicle?parkingId=${locationId}&startTime=${startUTC}&endTime=${endUTC}`;

      try {
        const response = await axios.get(apiUrl);
        let filteredSlots = response.data;

        if (filterData.vehicleType) {
          filteredSlots = response.data.filter(
            (slot) =>
              slot.vehicleType.toLowerCase() ===
              filterData.vehicleType.toLowerCase(),
          );
        }

        const grouped = filteredSlots.reduce((acc, slot) => {
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
        setSpots([]);
      } finally {
        setLoadingBooking(false);
      }
    };

    if (locationId) {
      fetchAndFilterParkingSlots();
    }
  }, [
    locationId,
    filterData.vehicleType,
    filterData.startTime,
    filterData.duration,
  ]);

  // ----- Helpers / handlers (regular functions, safe to define anywhere) -----
  const lockSlot = async (slot) => {
    try {
      const response = await axios.post(`/api/slots/lock`, {
        slotId: slot.slotId,
        userId: user.userId,
      });

      if (response.data.success) {
        setSelectedSpot(slot);
        toast.success("Slot locked successfully");
      } else {
        toast.error("Slot already locked");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to lock slot");
    }
  };

  const unlockSlot = async (slotId) => {
    try {
      await axios.post(`/api/slots/unlock`, {
        slotId,
        userId: user.userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async () => {
    try {
      const totalAmount =
        selectedSpot.pricePerHour * parseFloat(formData.time || 1);

      const response = await axios.post(`/api/payments/create-order`, {
        amount: totalAmount,
      });

      const order = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEYID,
        amount: order.amount,
        currency: "INR",
        name: "Parking App",
        description: "Parking Slot Booking",
        order_id: order.id,
        handler: async function (response) {
          setShowPopup(false);
          setMessage("Booking in progress...");
          setLoadingBooking(true);

          const bookingPayload = {
            userId: user.userId,
            email: user.email,
            slotId: selectedSpot.slotId,
            slotNumber: selectedSpot.slotNumber,
            location: selectedSpot.location,
            vehicleNumber: formData.vehicleNumber,
            vehicleType: selectedSpot.vehicleType,
            paymentMethod: formData.paymentMethod,
            transactionId: response.razorpay_payment_id,
            amount: order.amount,
            startTime: formData.startTime,
            endTime: formData.endTime,
            locationId: params.get("locID"),
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          try {
            await axios.post(`/api/bookings/complete`, bookingPayload);
            await unlockSlot(selectedSpot.slotId);
            setMessage("Booking Successful! Redirecting...");
            setTimeout(() => {
              navigate("/booking");
            }, 500);
          } catch (backendError) {
            console.error("Backend booking settlement failed:", backendError);
            setLoadingBooking(false);
            alert(
              "Payment received, but booking confirmation failed. Please contact support.",
            );
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#FACC15",
        },
        modal: {
          ondismiss: async function () {
            try {
              if (selectedSpot) {
                await unlockSlot(selectedSpot.slotId);
              }
            } catch (unlockErr) {
              console.error("Failed to unlock slot on dismiss:", unlockErr);
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async function (response) {
        if (selectedSpot) {
          await unlockSlot(selectedSpot.slotId);
        }
        console.error("Payment failed:", response.error);
        alert(response.error.description);
      });
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment Failed");
    }
  };

  const handlePaymentClick = () => {
    if (!selectedSpot || !formData.startTime || !formData.vehicleNumber) {
      alert(
        "Please select a slot, specify a vehicle number, and set the booking time.",
      );
      return;
    }
    setShowPopup(true);
    setError("");
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilterData((prevFilter) => {
      const updatedFilter = { ...prevFilter, [name]: value };
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
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        setFormData((prevForm) => ({
          ...prevForm,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          time: updatedFilter.duration,
        }));
      } else {
        setFormData((prevForm) => ({
          ...prevForm,
          startTime: "",
          endTime: "",
          time: updatedFilter.duration,
        }));
      }
      return updatedFilter;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----- Early returns (safe here: every hook above has already run) -----
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300">
          <svg
            className="animate-spin h-8 w-8 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Loading user info...</span>
        </div>
      </div>
    );
  }

  if (loadingbooking)
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-200/70 dark:bg-gray-900/70 backdrop-blur-lg transition-opacity duration-300">
        <div className="flex flex-col items-center p-6 sm:p-8 max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-4 border border-gray-200 dark:border-gray-700">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>

          <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4 text-center">
            {message}
          </p>

          <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-blue-500 dark:bg-blue-400 animate-pulse-width"></div>
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

        {/* Time and Vehicle Selection Area */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Select Date & Time
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Slot Grid Display */}
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Select an Available Slot{" "}
          <span className="text-sm italic">
            * Only slots not booked by anyone shows
          </span>
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
                    {slots.map((slot) => (
                      <div
                        key={slot.slotId}
                        className={`p-3 text-center rounded-lg shadow-sm border text-white transition-all ${
                          lockedSlots[slot.slotId]
                            ? "bg-yellow-500 cursor-not-allowed opacity-70"
                            : "bg-green-500 cursor-pointer hover:bg-green-600"
                        } ${selectedSpot?.slotId === slot.slotId ? "ring-4 ring-yellow-400" : ""}`}
                        onClick={() => {
                          if (!formData.startTime) {
                            toast.error("Please select Start Time first");
                            return;
                          }
                          if (lockedSlots[slot.slotId]) {
                            toast.warning("Slot temporarily reserved");
                            return;
                          }
                          lockSlot(slot);
                        }}
                      >
                        <span className="font-semibold text-sm block">
                          {slot.slotNumber}
                        </span>
                        <span className="text-xs block">
                          ₹{slot.pricePerHour}/hr
                        </span>
                        <span className="text-[10px] font-bold">
                          {lockedSlots[slot.slotId] ? "LOCKED" : "AVAILABLE"}
                        </span>
                      </div>
                    ))}
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

        {/* Booking Form Modal */}
        {selectedSpot && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
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
                            className={`border p-2 rounded-lg mt-2 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                              error
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                            value={formData.vehicleNumber}
                            onChange={(e) => {
                              const formatted = formatVehicleNumber(
                                e.target.value,
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
                    ₹
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
                  onClick={async () => {
                    if (selectedSpot) {
                      await unlockSlot(selectedSpot.slotId);
                    }
                    setSelectedSpot(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Proceed to Payments
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment QR Code Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm sm:max-w-md shadow-lg text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Scan QR & Pay
              </h2>
              <img
                src="/5aad3715-5a2d-47da-992c-18ac3f6799dd_GooglePay_QR.png"
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
                <button className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
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
