import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const imageUri =
    "https://media.istockphoto.com/id/2192670569/vector/parking-lots-or-car-parking-space-or-parking-zone-in-the-city-from-aerial-view.jpg?s=612x612&w=0&k=20&c=-hpByat3FtLcer1jem2RAVeRYd5v325Fgfq5WSIlqrM=";

  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-[90vh] flex items-center">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-400/20 dark:bg-yellow-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide mb-6 border border-blue-200 dark:border-blue-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Application v2.0 is Live
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            Find, Book, and Park. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500 dark:from-blue-400 dark:to-yellow-400">
              Reserve your parking in advance
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Say goodbye to circling the block. Reserve your parking slot in
            advance, manage your vehicles, and pay seamlessly with our smart
            parking network.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
              <FaArrowRight className="text-sm" />
            </Link>

            <Link
              to="/booking"
              className="w-full sm:w-auto flex justify-center items-center px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              View Available Slots
            </Link>
          </div>
        </div>

        {/* UI Mockup Container */}
        <div className="mt-16 relative max-w-5xl mx-auto group">
          {/* Outer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          {/* Fixed Layout: Flex Column ensures header and image stack properly */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
            {/* Fake Browser Window Header (Now sits securely at the top) */}
            <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2 shrink-0 z-10">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            {/* Content area for your actual app image */}
            <div className="w-full aspect-video relative overflow-hidden bg-gray-900">
              <img
                src={imageUri}
                alt="Parking Dashboard Mockup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              {/* Subtle UI Overlays to make it look like an "App" */}
              <div className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg shadow-xl border border-white/20 z-10">
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                  Occupancy
                </div>
                <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  84% Full
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
