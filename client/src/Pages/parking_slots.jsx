import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCar, FaMotorcycle, FaTruck, FaChargingStation } from "react-icons/fa";

const ParkingSlots = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const spotNumber = params.get("spotNumber");
    const spotLocation = params.get("location");

    const [slotData, setSlotData] = useState({
        priceTwoWheeler: "",
        priceFourWheeler: "",
        priceTruck: "",
        priceEV: "",
        facilities: [],
        slotImages: [],
    });

    const handleChange = (e) => {
        setSlotData({ ...slotData, [e.target.name]: e.target.value });
    };

    const handleFacilitySelection = (facility) => {
        setSlotData((prev) => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter((f) => f !== facility)
                : [...prev.facilities, facility],
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        setSlotData({ ...slotData, slotImages: [...slotData.slotImages, ...files] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Slot Data Submitted:", slotData);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-10 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                    Add Parking Slot Details for {spotNumber} at {spotLocation}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Pricing Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <p>Two Wheeler Price ($/hr)</p>
                        <input
                            type="number"
                            name="priceTwoWheeler"
                            placeholder="2W Price (₹/hr)"
                            value={slotData.priceTwoWheeler}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                            required
                        />
                        <p>Four Wheeler Price ($/hr)</p>
                        <input
                            type="number"
                            name="priceFourWheeler"
                            placeholder="4W Price (₹/hr)"
                            value={slotData.priceFourWheeler}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                            required
                        />
                        <p>Truck Price ($/hr)</p>
                        <input
                            type="number"
                            name="priceTruck"
                            placeholder="Truck Price (₹/hr)"
                            value={slotData.priceTruck}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                        />
                        <p>EV Wheeler Price ($/hr)</p>
                        <input
                            type="number"
                            name="priceEV"
                            placeholder="EV Price (₹/hr)"
                            value={slotData.priceEV}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                        />
                        <p>Operating Hours</p>
                        <input
                            type="text"
                            name="operatingHours"
                            placeholder="(e.g., 6 AM - 11 PM) or 24/7"
                            value={slotData.operatingHours}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                            required
                        />
                        <p>Available spots</p>
                        <input
                            type="number"
                            name="totalAvailableSpots"
                            placeholder="Total Available Spots"
                            value={slotData.totalAvailableSpots}
                            onChange={handleChange}
                            className="border p-3 rounded-lg text-lg"
                            required
                        />
                    </div>

                    {/* Facility Selection */}
                    <p className="text-lg font-semibold text-gray-700">Select Available Facilities:</p>
                    <div className="grid grid-cols-2 gap-4">
                        {["Camera Security", "EV Charging", "Car Wash", "Valet Parking"].map((facility) => (
                            <label key={facility} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={slotData.facilities.includes(facility)}
                                    onChange={() => handleFacilitySelection(facility)}
                                    className="hidden"
                                />
                                <span className="text-lg">{facility}</span>
                            </label>
                        ))}
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-yellow-600"
                    >
                        Save Parking Slot
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ParkingSlots;
