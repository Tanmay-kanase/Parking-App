import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Hero = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [location, setLocation] = useState("");
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#eeeedb] text-white overflow-hidden">
      {/* Background Grid of Parking Images */}
      {/* <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-4 rotate-[-29deg]">
        {[
          "https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          "https://images.pexels.com/photos/2417466/pexels-photo-2417466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          "https://images.pexels.com/photos/938580/pexels-photo-938580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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
      </div> */}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <p className="text-4xl md:text-6xl font-extrabold leading-tight text-black">
          Revolutionizing <span className="text-yellow-400">Parking</span>, One
          Spot at a Time!
        </p>
        <p className="text-lg md:text-xl text-black mt-4">
          Smart parking solutions that save time, reduce stress, and optimize
          space.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <div className="p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-yellow-400 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300 hover:bg-yellow-500">
            <div className="flex items-center justify-center ">
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
              className="outline-none text-[20px]  w-full text-white font-normal px-4"
            />
          </div>

          <button className="w-[110px] h-10 flex items-center justify-start gap-2 bg-yellow-400 rounded-full text-white font-semibold border-none relative cursor-pointer shadow-md pl-2 transition-all duration-500 hover:bg-yellow-500 active:scale-95">
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
            Get nearby location
          </button>
        </div>
      </div>
      {/* Car Animation - Moving and Parking */}
    </section>
  );
};

export default Hero;
