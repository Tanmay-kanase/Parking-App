import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ParkingCircle,
  CreditCard,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  QrCode,
  Headphones,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import Contact_Footer from "../components/Contact_Footer";
import Footer from "../components/Footer";
import HowItWorks from "../components/Howitworks";

// Use Tailwind CSS to define styles
const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isBackendReady, setIsBackendReady] = useState(false);
  // Use a custom modal for alerts
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const { status } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/health`
        );
        if (status === 200) setIsBackendReady(true);
        else setIsBackendReady(false);
      } catch (err) {
        console.error("Backend not ready:", err);
        setIsBackendReady(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  // 🔹 Loading screen while waiting for backend
  if (!isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid mx-auto"></div>
          <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Connecting to backend...
          </p>
        </div>
      </div>
    );
  }

  // Handles search for a specific location
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/show-parkings?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // This useEffect hook is the core of the dark mode fix.
  // It adds or removes the 'dark' class from the HTML element,
  // which enables all Tailwind CSS 'dark:' variants.
  // useEffect(() => {
  //   console.log("USe Efffect called");

  //   const htmlElement = document.documentElement;
  //   if (darkMode) {
  //     htmlElement.classList.add("dark");
  //   } else {
  //     htmlElement.classList.remove("dark");
  //   }
  // }, [darkMode]);

  // Handles finding nearby parking spots using geolocation
  const handleNearby = () => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate(`/show-parkings-nearby?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback or user-friendly message
          showAlert(
            "Unable to get your location. Please try again or search manually."
          );
        }
      );
    } else {
      showAlert("Geolocation is not supported by your browser.");
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className={`min-h-screen font-sans`}>
      {/* Alert Modal */}
      {isAlertVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Notification
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{alertMessage}</p>
            <button
              onClick={() => setIsAlertVisible(false)}
              className="mt-6 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 bg-white dark:bg-gray-900 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ParkingCircle className="text-yellow-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart<span className="text-yellow-500">Park</span>
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 border-b-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl px-4"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Find Your <span className="text-yellow-500">Perfect Spot</span>,
            Instantly.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Our smart parking solutions help you find, reserve, and pay for
            parking spots with ease, saving you time and stress.
          </p>

          {/* Combined Search Bar and Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            {/* Search Input Container */}
            <div className="relative flex-grow w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for a city, address, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={20}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white font-semibold rounded-xl shadow-lg transition duration-300 active:scale-95"
              >
                Search
              </button>
              <button
                onClick={handleNearby}
                className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold rounded-xl shadow-lg transition duration-300 active:scale-95"
              >
                <MapPin size={20} />
                Nearby
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 transition-colors duration-300">
        <div className="container mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white"
          >
            Why Choose <span className="text-yellow-500">Our App?</span>
          </motion.h2>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1: Smart Parking */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <CheckCircle2 size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                Smart Parking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Find and reserve your parking spot in seconds with AI-powered
                recommendations.
              </p>
            </motion.div>

            {/* Feature 2: Secure Payments */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <CreditCard size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Pay securely using multiple payment options with a quick,
                hassle-free checkout.
              </p>
            </motion.div>

            {/* Feature 3: Live Tracking */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <MapPin size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                Live Navigation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Get real-time directions and easily navigate to your reserved
                parking spot.
              </p>
            </motion.div>

            {/* Feature 4: 24/7 Support */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Headphones size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Our team is always available to help with any parking-related
                queries or issues.
              </p>
            </motion.div>

            {/* Feature 5: AI Predictions */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Clock size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                AI Predictions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Leverage AI-driven predictions for the best parking spots based
                on real-time data.
              </p>
            </motion.div>

            {/* Feature 6: Contactless Access */}
            <motion.div
              variants={featureVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <QrCode size={50} className="text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">
                Contactless Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Seamlessly enter and exit parking lots using QR codes or NFC
                technology.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <HowItWorks />
      <Footer />
    
    </div>
  );
};

export default Home;
