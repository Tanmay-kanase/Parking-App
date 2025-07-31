import React from "react";

const steps = [
  {
    title: "Download & Register",
    description: "Download our app and create your account in minutes.",
  },
  {
    title: "Search Location",
    description: "Enter your destination to find nearby parking spots.",
  },
  {
    title: "Book & Pay",
    description: "Select your spot and complete payment securely.",
  },
  {
    title: "Park & Go",
    description: "Follow navigation and show your digital ticket.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-900 text-white py-16" id="howitworks">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-gray-400 mt-2">
          Simple steps to find and secure your parking spot
        </p>
      </div>

      <div className="relative mt-12 flex flex-col items-center">
        {/* Vertical Line (Centered Properly) */}
        <div className="absolute w-1 bg-blue-600 h-full left-1/2 transform -translate-x-1/2"></div>

        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center w-full max-w-3xl ${
              index % 2 === 0 ? "" : "flex-row-reverse"
            }`}
          >
            <div className="w-1/2 p-4">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>

            {/* Step Number (Now Touching the Line) */}
            <div className="relative">
              <div
                className="absolute bg-blue-600 w-10 h-10 text-white flex items-center justify-center rounded-full font-bold 
                left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold">
          Get Started Now →
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
