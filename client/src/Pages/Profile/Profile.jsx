import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const handleEdit = () => {
    if (user?.userId) {
      navigate(`/edit-profile?userId=${user.userId}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      try {
        if (user.role === "parking host") {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/parking-locations/user/${
              user.userId
            }`
          );
          setParkings(response.data);
        } else if (user.role === "customer") {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/vehicles/user/${
              user.userId
            }`
          );
          setVehicles(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.userId, user?.role]);

  if (loading || !user) return <p>Loading profile...</p>;

  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="w-full bg-white shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">
        {/* Left - Profile Image */}
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-500">
            <img
              src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right - User Info */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-yellow-600">My Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <p className="text-lg font-semibold">Name:</p>
            <p className="text-lg">{user.name}</p>
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg">{user.email}</p>
            <p className="text-lg font-semibold">Phone:</p>
            <p className="text-lg">{user.phone}</p>
            <p className="text-lg font-semibold">Role:</p>
            <p className="text-lg capitalize">{user.role}</p>
          </div>

          {/* Conditionally Render Sections */}
          {user.role === "User" && (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                My Vehicles
              </h3>
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <div
                    key={v._id}
                    className="bg-gray-100 p-3 rounded-lg mt-2 border border-gray-200"
                  >
                    <p>
                      <strong>Type:</strong> {v.vehicleType}
                    </p>
                    <p>
                      <strong>License Plate:</strong> {v.licensePlate}
                    </p>
                    <p>
                      <strong>Company:</strong> {v.comapany}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No vehicles added yet.</p>
              )}
            </>
          )}

          {user.role === "parking host" && (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mt-8 mb-6 text-center">
                My Parkings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parkings.length > 0 ? (
                  parkings.map((parking) => (
                    <div
                      onClick={() =>
                        navigate(
                          `/upload-parking-slots?locationId=${parking.locationId}&name=${parking.name}`
                        )
                      }
                      key={parking.locationId}
                      className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          {parking.name}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span>{" "}
                        {parking.address}, {parking.city}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-medium">Total Slots:</span>{" "}
                        {parking.totalSlots}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">
                    No parkings found.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
