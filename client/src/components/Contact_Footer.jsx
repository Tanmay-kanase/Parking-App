import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact_Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left"
      >
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">🚗 ParkEase</h2>
          <p className="mt-2 text-gray-400">
            Making parking effortless and stress-free. Find, reserve, and park
            in seconds!
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold text-blue-400">Contact Us</h3>
          <div className="mt-3 space-y-2 text-gray-300">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <FaMapMarkerAlt /> A-8/3-5 , Om Sadguru Soc , CHS , Sec-24 , Nerul
              Navi Mumbai- 400 706
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <FaPhone /> +91 9702210707
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope /> tanmaykanase07@gmail.com
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-blue-400">Follow Us</h3>
          <div className="flex justify-center md:justify-start mt-3 space-x-4">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaFacebook size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaTwitter size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaInstagram size={24} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Contact_Footer;
