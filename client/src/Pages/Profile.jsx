import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
const Profile = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/edit-profile?userId=${userId}`);
  };
  const handleLogout = () => {
    localStorage.removeItem("userId"); // Clear user data
    dispatch(logout());
    navigate("/"); // Redirect to login
    window.location.reload();
  };

  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/parking-locations/user/${userId}`
        );
        setParkings(response.data); // Set the parking data
      } catch (error) {
        console.error("Error fetching parking locations:", error);
      }
    };

    if (userId) fetchParkings();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log("Error fetching user details:", error);
        });
    }
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <div className=" bg-gray-50 text-gray-900 ">
      <div className="w-full bg-white shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">
        {/* Left Side - Profile Image (Full Width on Mobile) */}
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-500">
            <img
              src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
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
            <p className="text-lg">{user.name}</p>
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg">{user.email}</p>
            <p className="text-lg font-semibold">Phone:</p>
            <p className="text-lg">{user.phone}</p>
            <p className="text-lg font-semibold">Role:</p>
            <p className="text-lg capitalize">{user.role}</p>
          </div>

          {/* My Parkings Section */}
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
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
                  className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition"
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
