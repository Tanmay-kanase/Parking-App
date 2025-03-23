import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCar, FaMotorcycle, FaTruck, FaPlus } from "react-icons/fa";
const EditProfile = () => {
    const [vehicles, setVehicles] = useState([]);

    const addVehicle = () => {
        setVehicles([...vehicles, { type: "", number: "" }]);
    };

    const handleVehicleChange = (index, field, value) => {
        const updatedVehicles = [...vehicles];
        updatedVehicles[index][field] = value;
        setVehicles(updatedVehicles);
    };
    return (
        <div className=" bg-gray-50 text-gray-900 ">
            <div className="w-full bg-white shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">

                {/* Left Side - Profile Image (Full Width on Mobile) */}
                <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-500">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>

                {/* Right Side - User Details (Takes Full Width on Mobile) */}
                <div className="w-full md:w-2/3">
                    <h2 className="text-3xl font-bold text-yellow-600">My Profile</h2>
                    {/* User Details in Grid Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">


                        <p className="text-lg font-semibold">Name:</p>
                        <input
                            type="text"
                            name="phone"
                            value={65677574}
                            className="w-full border p-2 rounded-lg text-lg"
                            required
                        />
                        <p className="text-lg font-semibold">Email:</p>
                        <input
                            type="text"
                            name="phone"
                            value={65677574}
                            className="w-full border p-2 rounded-lg text-lg"
                            required
                        />
                        <p className="text-lg font-semibold">Phone:</p>
                        <input
                            type="text"
                            name="phone"
                            value={65677574}
                            className="w-full border p-2 rounded-lg text-lg"
                            required
                        />


                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">My Vehicles</h3>
                    <div className="space-y-4 mt-4">
                        {vehicles.map((vehicle, index) => (
                            <div key={index} className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
                                <select
                                    className="border p-2 rounded-lg"
                                    value={vehicle.type}
                                    onChange={(e) => handleVehicleChange(index, "type", e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="car">🚗 Car</option>
                                    <option value="bike">🏍️ Bike</option>
                                    <option value="truck">🚛 Truck</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Vehicle Number"
                                    className="border p-2 rounded-lg"
                                    value={vehicle.number}
                                    onChange={(e) => handleVehicleChange(index, "number", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Vehicle Number"
                                    className="border p-2 rounded-lg"
                                    value={vehicle.number}
                                    onChange={(e) => handleVehicleChange(index, "number", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Vehicle Number"
                                    className="border p-2 rounded-lg"
                                    value={vehicle.number}
                                    onChange={(e) => handleVehicleChange(index, "number", e.target.value)}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addVehicle}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            <FaPlus /> Add Vehicle
                        </button>
                    </div>
                    {/* My Parkings Section */}
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">My Parkings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <h3 className="text-xl font-semibold text-gray-800">Spot #101</h3>
                            <FaMapMarkerAlt className="text-gray-500" />
                            <p className="text-gray-600">Location: Downtown Parking</p>
                            <p className="text-gray-500">Total Slots: 5</p>
                        </div>
                        <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <h3 className="text-xl font-semibold text-gray-800">Spot #202</h3>
                            <FaMapMarkerAlt className="text-gray-500" />
                            <p className="text-gray-600">Location: City Mall Parking</p>
                            <p className="text-gray-500">Total Slots: 3</p>
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4">
                            Edit Profile
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4">
                            Edit Profile
                        </button>

                    </div>


                </div>


            </div>
        </div>
    );
};

export default EditProfile;
