import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Car,
  User,
  MapPinPlusInside,
  History,
  Wallet, // Changed from RussianRuble for better clarity/iconography
  Bookmark,
  Moon,
  Sun,
  LogIn, // Icon for Get Started
  Settings, // Icon for Settings
  ShieldCheck, // Icon for Verify
} from "lucide-react";
// Removed useSelector and useAuth from original, adding back useAuth as it's needed
import { useAuth } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu open/close
  const [dropdownOpen, setDropdownOpen] = useState(false); // Profile dropdown open/close
  const { logout, user } = useAuth(); // Assuming useAuth provides user object and logout function
  const toggleDarkMode = () => setDarkMode(!darkMode);
  // Log user object for debugging (can be removed in production)
  // console.log(user);

  // Links for Parking Owner
  const parkingOwnerLinks = [
    {
      name: "Verify",
      href: "verify",
      icon: <ShieldCheck size={20} />,
      role: "parking_owner",
    },
    {
      name: "My Parkings",
      href: "upload-parking-location",
      icon: <MapPinPlusInside size={20} />,
      role: "parking_owner",
    },
    {
      name: "Payments",
      href: "payments",
      icon: <Wallet size={20} />,
      role: "parking_owner",
    },
  ];

  // Links for General User
  const userLinks = [
    {
      name: "Parking History",
      href: "park-history",
      icon: <History size={20} />,
      role: "user",
    },
    {
      name: "My Bookings",
      href: "mybookings",
      icon: <Bookmark size={20} />,
      role: "user",
    },
    {
      name: "Payments",
      href: "payments",
      icon: <Wallet size={20} />,
      role: "user",
    },
  ];

  // Combine and filter links based on user role
  const getNavLinks = () => {
    if (!user) {
      return []; // No links if not logged in (besides Get Started)
    }
    if (user.role === "parking_owner") {
      return parkingOwnerLinks;
    }
    // Default to userLinks if role is 'user' or undefined (for generic authenticated users)
    return userLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-md font-inter w-full sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Icon */}
          <a href="/" className="flex items-center space-x-3 md:space-x-4">
            {" "}
            {/* Changed div to a and added href */}
            <Car size={36} className="text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              ParkEase
            </span>{" "}
            {/* Changed name for modern feel */}
          </a>

          {/* Desktop Menu - Centered and Larger */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative group py-2" // Added py-2 for bigger click area
              >
                {link.icon}
                <span>{link.name}</span>
                {/* Modern Underline Effect */}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100 rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop Right Side: Dark Mode, Signin / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Signin / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1.5 transition duration-300"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-600 transition duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-full border-2 border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 transition duration-300">
                      <User size={24} />
                    </div>
                  )}
                  <span className="text-gray-900 dark:text-white font-medium hidden lg:inline">
                    {" "}
                    {/* Show username on larger desktops */}
                    {user.name || "Profile"}
                  </span>
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-10 animate-fade-in-down transform origin-top-right ring-1 ring-black ring-opacity-5">
                    <a
                      href="profile"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={18} className="mr-2" /> My Account
                    </a>
                    <a
                      href="settings"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={18} className="mr-2" /> Settings
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 mt-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="signin"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <LogIn size={20} className="mr-2" />
                <span>Get Started</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md transition duration-300"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Full Width Overlay */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-xl py-4 overflow-hidden transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{ height: isOpen ? "auto" : "0px" }} // Control height for smooth collapse
      >
        <div className="px-4 pt-2 pb-3 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 flex items-center space-x-3"
              onClick={() => setIsOpen(false)} // Close menu on link click
            >
              {link.icon}
              <span>{link.name}</span>
            </a>
          ))}

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* Mobile Signin / Profile Section */}
          {user ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
              <a
                href="profile"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                <User size={24} />
                <span>My Account</span>
              </a>
              <a
                href="settings"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={24} />
                <span>Settings</span>
              </a>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="signin"
              className="mt-4 w-full text-center inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={20} className="mr-2" />
              <span>Get Started</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
