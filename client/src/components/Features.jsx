import { ParkingCircle, CreditCard, Map } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <ParkingCircle size={50} className="text-yellow-400" />,
    title: "Smart Parking",
    description:
      "Find and reserve your parking spot in seconds with AI-powered recommendations.",
  },
  {
    icon: <CreditCard size={50} className="text-yellow-400" />,
    title: "Secure Payment",
    description:
      "Pay securely using multiple payment options with one-tap checkout.",
  },
  {
    icon: <Map size={50} className="text-yellow-400" />,
    title: "Live Tracking",
    description: "Track your parking spot in real time and navigate with ease.",
  },
];

const Features = () => {
  return (
    <section className="bg-[#f4f4e7] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Why Choose <span className="text-yellow-400">Our Parking App?</span>
        </motion.h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-12 mt-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
