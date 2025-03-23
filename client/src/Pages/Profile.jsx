import { FaMapMarkerAlt } from "react-icons/fa";

const Profile = () => {
  return (
    <div className=" bg-gray-50 text-gray-900 ">
      <div className="w-full bg-white shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start">

        {/* Left Side - Profile Image (Full Width on Mobile) */}
        <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
          <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-500">
            <img
              src="https://via.placeholder.com/300"
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
            <p className="text-lg">John Doe</p>
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg">johndoe@example.com</p>
            <p className="text-lg font-semibold">Phone:</p>
            <p className="text-lg">+1 234 567 890</p>
            <p className="text-lg font-semibold">Total Parkings:</p>
            <p className="text-lg">2</p>
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

export default Profile;
