import React, { useState } from "react";

// Define content for both user roles
const content = {
  user: {
    title: "How It Works for Drivers",
    subtitle: "Simple steps to find and secure your parking spot.",
    steps: [
      {
        title: "Download & Register",
        description: "Get the app and create your account in minutes.",
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
        description: "Follow navigation and show your digital ticket to enter.",
      },
    ],
  },
  parking_owner: {
    title: "How It Works for Owners",
    subtitle: "Monetize your empty space with a few simple steps.",
    steps: [
      {
        title: "List Your Space",
        description: "Register and provide details about your parking spot.",
      },
      {
        title: "Set Availability",
        description:
          "Define the schedule and pricing for your available space.",
      },
      {
        title: "Accept Bookings",
        description:
          "Receive and manage incoming booking requests from drivers.",
      },
      {
        title: "Get Paid Securely",
        description: "Receive your earnings safely through our platform.",
      },
    ],
  },
};

const HowItWorks = () => {
  // State to manage the active role ('user' or 'parking_owner')
  const [activeRole, setActiveRole] = useState("user");

  // Get the correct content based on the active role
  const { title, subtitle, steps } = content[activeRole];

  return (
    <section
      className="bg-white text-gray-800 py-16 dark:bg-gray-900 dark:text-white"
      id="howitworks"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Dynamic Title and Subtitle */}
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-gray-600 mt-2 dark:text-gray-400">{subtitle}</p>

        {/* Role Switcher */}
        <div className="mt-8 flex justify-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setActiveRole("user")}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
              activeRole === "user"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            For Drivers
          </button>
          <button
            onClick={() => setActiveRole("parking_owner")}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
              activeRole === "parking_owner"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            For Parking Owners
          </button>
        </div>
      </div>

      <div className="relative mt-12 flex flex-col items-center">
        {/* Vertical Line */}
        <div className="absolute w-1 bg-blue-600 h-full left-1/2 transform -translate-x-1/2"></div>

        {/* Dynamic Steps Mapping */}
        {steps.map((step, index) => {
          // Determine whether to reverse based on role
          const isReversed =
            activeRole === "user" ? index % 2 !== 0 : index % 2 === 0;

          return (
            <div
              key={index}
              className={`flex items-center w-full max-w-3xl px-4 ${
                isReversed ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-1/2 p-4">
                {/* Step Card */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Step Number */}
              <div className="relative">
                <div
                  className="absolute bg-blue-600 w-10 h-10 text-white flex items-center justify-center rounded-full font-bold
          left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-transform transform hover:scale-105">
          Get Started Now →
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
