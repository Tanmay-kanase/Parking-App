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
  Moon,
  Sun,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  console.log(user);
  const isTokenExpired = () => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  };

  const navLinks = [];

  const userLinks = [
    {
      name: "Parking History",
      href: "park-history",
      icon: <History size={20} />,
    },
    { name: "Payments", href: "payments", icon: <RussianRuble size={20} /> },
    {
      name: "My Parkings",
      href: "upload-parking-location",
      icon: <MapPinPlusInside size={20} />,
    },
    { name: "My Bookings", href: "mybookings", icon: <Bookmark size={20} /> },
  ];

  return (
    <nav className="bg-white text-gray-800 shadow-lg font-sans w-full sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Icon */}
          <div className="flex items-center space-x-2">
            <Car size={32} className="text-teal-600" />
            <span className="text-xl font-bold text-gray-900">ParkMe</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {user && (
              <>
                {userLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition duration-300 relative group"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    <span className="absolute top-8 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 origin-left transition-transform duration-600 group-hover:scale-x-100"></span>
                  </a>
                ))}
              </>
            )}
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Signin / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-full p-1"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-teal-500 hover:border-teal-700 transition duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full border-2 border-gray-300 hover:border-teal-500 transition duration-300">
                      <User size={24} />
                    </div>
                  )}
                  <span className="text-gray-900 font-medium hidden md:inline">
                    {user.displayName || "Profile"}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 transform translate-y-2 transition-all duration-300">
                    <a
                      href="profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </a>
                    <a
                      href="profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="get-started"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition duration-300"
              >
                <Info size={20} className="mr-2" />
                <span>Get Started</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 rounded-md transition duration-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } absolute top-20 left-0 w-full bg-white shadow-xl py-4`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition duration-300 flex items-center space-x-2"
            >
              {link.icon}
              <span>{link.name}</span>
            </a>
          ))}

          {user && (
            <>
              {userLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition duration-300 flex items-center space-x-2"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </>
          )}

          {/* Mobile Signin / Profile */}
          {user ? (
            <div className="border-t pt-4 mt-4">
              <a
                href="profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
              >
                <User size={24} />
                <span>Profile</span>
              </a>
              <button
                onClick={logout}
                className="mt-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="get-started"
              className="mt-2 w-full text-center inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 transition duration-300"
            >
              <Info size={20} className="mr-2" />
              <span>Get Started</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
