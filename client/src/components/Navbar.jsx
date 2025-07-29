import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Car,
  User,
  List,
  DollarSign,
  HelpCircle,
  Info,
  MapPinPlusInside,
  History,
  RussianRuble,
  Bookmark,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const isTokenExpired = () => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // If token expired
    } catch (err) {
      return true;
    }
  };

  return (
    <nav className="bg-[#F8FBFF] text-gray-900 shadow-lg font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Icon */}
          <div className="flex items-center">
            <Car size={30} className="text-gray-900" /> {/* Parking Car Icon */}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Home */}
            <a href="/" className="flex flex-col items-center group">
              <Home
                size={24}
                className="group-hover:text-yellow-400 transition duration-300"
              />
              <span className="text-sm relative group-hover:text-yellow-400">
                Home
                <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
              </span>
            </a>

            {user ? (
              <>
                {/* Parking History */}
                <a
                  href="park-history"
                  className="flex flex-col items-center group"
                >
                  <History
                    size={24}
                    className="group-hover:text-yellow-400 transition duration-300"
                  />
                  <span className="text-sm relative">
                    Parking History
                    <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                  </span>
                </a>

                {/* Payments */}
                <a href="payments" className="flex flex-col items-center group">
                  <RussianRuble
                    size={24}
                    className="group-hover:text-yellow-400 transition duration-300"
                  />
                  <span className="text-sm relative">
                    Payments
                    <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                  </span>
                </a>

                {/* My Parkings */}
                <a
                  href="upload-parking-location"
                  className="flex flex-col items-center group"
                >
                  <MapPinPlusInside
                    size={24}
                    className="group-hover:text-yellow-400 transition duration-300"
                  />
                  <span className="text-sm relative">
                    MyParkings
                    <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                  </span>
                </a>

                {/* My Bookings */}
                <a
                  href="mybookings"
                  className="flex flex-col items-center group"
                >
                  <Bookmark
                    size={24}
                    className="group-hover:text-yellow-400 transition duration-300"
                  />
                  <span className="text-sm relative">
                    MyBookings
                    <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                  </span>
                </a>
              </>
            ) : null}

            {/* Always Visible: How It Works */}
            <a href="#howitworks" className="flex flex-col items-center group">
              <HelpCircle
                size={24}
                className="group-hover:text-yellow-400 transition duration-300"
              />
              <span className="text-sm relative">
                How it Works
                <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
              </span>
            </a>

            {/* Signin / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex flex-col items-center group"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-yellow-400 group-hover:border-yellow-500 transition duration-300"
                    />
                  ) : (
                    <a href="profile">
                      <User
                        size={24}
                        className="group-hover:text-yellow-400 transition duration-300"
                      />
                    </a>
                  )}
                  <a href="profile">
                    <span className="text-sm relative">
                      Profile
                      <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                    </span>
                  </a>
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700">
                      My Account
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700">
                      Settings
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-red-500">
                      Logout
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="get-started"
                className="flex flex-col items-center group"
              >
                <Info
                  size={24}
                  className="group-hover:text-yellow-400 transition duration-300"
                />
                <span className="text-sm relative">
                  Signin
                  <span className="absolute left-0 right-0 bottom-0 top-7 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-200 transition-transform duration-500"></span>
                </span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <Home size={24} className="mb-1" />
            Home
          </a>
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <List size={24} className="mb-1" />
            Features
          </a>
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <DollarSign size={24} className="mb-1" />
            Pricing
          </a>
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <HelpCircle size={24} className="mb-1" />
            Support
          </a>
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <Info size={24} className="mb-1" />
            About
          </a>
          <a
            href="#"
            className="block py-3 px-4 hover:bg-yellow-400 flex flex-col items-center"
          >
            <User size={24} className="mb-1" />
            Profile
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
