import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ParkingCircle, CreditCard, Map } from "lucide-react";
import { useSelector } from "react-redux";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.GOOGLE_API_KEY; // Replace with your API Key
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.status === "OK" && data.results.length > 0) {
              // Extract the first relevant address component (e.g., locality, city)
              const addressComponents = data.results[0].address_components;
              let placeName = "";

              // Prioritize locality, sublocality, or a known area instead of full address
              for (const component of addressComponents) {
                if (
                  component.types.includes("locality") || // City
                  component.types.includes("sublocality") || // Area inside city
                  component.types.includes("neighborhood") // Neighborhood
                ) {
                  placeName = component.long_name;
                  break;
                }
              }

              // If no short name found, fallback to formatted address
              if (!placeName) {
                placeName = data.results[0].formatted_address.split(",")[0]; // Use only first part
              }

              navigate(`/parking-spots?query=${encodeURIComponent(placeName)}`);
            } else {
              alert("Unable to get location name. Try again.");
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            alert("Failed to fetch location name.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable GPS and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const user = useSelector((state) => state.auth.user);
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/parking-spots?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  console.log("User : " + user);
  const userId = useSelector((state) => state.auth.userId);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#eeeedb] text-white overflow-hidden">
      {/* Background Grid of Parking Images */}

      <div className="absolute inset-0 hidden sm:grid grid grid-cols-3 md:grid-cols-5 gap-4 rotate-[-29deg]">
        {[
          "https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          "https://images.pexels.com/photos/938580/pexels-photo-938580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          "https://images.pexels.com/photos/2417466/pexels-photo-2417466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          "https://images.pexels.com/photos/965877/pexels-photo-965877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        ].map((image, index) => (
          <motion.div
            key={index}
            className="w-48 h-48 bg-cover bg-center rounded-lg shadow-lg border-2 border-yellow-400"
            style={{ backgroundImage: `url(${image})` }}
            whileHover={{ scale: 1.1, rotate: [0, 55, -5, 0] }}
            animate={{ y: [0, -10, 0] }} // Floating effect
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl px-6 pt-40">
        <p className="text-4xl md:text-6xl font-extrabold leading-tight text-black">
          Revolutionizing <span className="text-yellow-400">Parking</span>, One
          Spot at a Time!
        </p>
        <p className="text-lg md:text-xl text-black mt-4">
          Smart parking solutions that save time, reduce stress, and optimize
          space.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          {/* Search Input */}
          <div className="p-5 overflow-hidden w-full sm:w-[60px] h-[60px] sm:hover:w-[270px] bg-yellow-400 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300 hover:bg-yellow-500">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Isolation_Mode"
                data-name="Isolation Mode"
                viewBox="0 0 24 24"
                width="22"
                height="22"
              >
                <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onClick={handleSearch}
              className="outline-none text-[18px] w-full text-white font-normal px-4 bg-transparent"
            />
          </div>

          {/* Get Nearby Location Button */}
          <button
            onClick={handleGetDirections}
            className="w-full sm:w-[110px] h-10 flex items-center justify-center gap-2 bg-yellow-400 rounded-full text-white font-semibold border-none relative cursor-pointer shadow-md pl-2 transition-all duration-500 hover:bg-yellow-500 active:scale-95"
          >
            <svg
              className="h-6 transition-transform duration-[1500ms] group-hover:rotate-[250deg]"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
              ></path>
            </svg>
            Get Nearby Location
          </button>
        </div>
      </div>
      <section className=" text-white py-16 px-6 pt-35">
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Header */}
          <motion.h2
            className="text-4xl font-bold mb-6 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Why Choose <span className="text-yellow-400">Our Parking App?</span>
          </motion.h2>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-12 mt-8">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ParkingCircle size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">Smart Parking</h3>
              <p className="text-gray-300 mt-2">
                Find and reserve your parking spot in seconds with AI-powered
                recommendations.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <CreditCard size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">Secure Payment</h3>
              <p className="text-gray-300 mt-2">
                Pay securely using multiple payment options with one-tap
                checkout.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Map size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">Live Tracking</h3>
              <p className="text-gray-300 mt-2">
                Track your parking spot in real-time and navigate with ease.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <ParkingCircle size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">AI Predictions</h3>
              <p className="text-gray-300 mt-2">
                Get AI-driven suggestions for the best parking spots based on
                real-time data.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <CreditCard size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">Contactless Access</h3>
              <p className="text-gray-300 mt-2">
                Enter and exit parking lots seamlessly with QR-based or NFC
                access.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Map size={50} className="text-yellow-400" />
              <h3 className="text-xl font-semibold mt-4">24/7 Support</h3>
              <p className="text-gray-300 mt-2">
                Get round-the-clock support for any parking-related queries or
                issues.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;

// value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)} onClick={handleSearch}
