import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
        {/* Header & Filters Placeholder */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/2 sm:w-64" />
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-32" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-32" />
          </div>
        </div>

        {/* Parking Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-4"
            >
              {/* Image/Map Thumbnail */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />

              {/* Card Details */}
              <div className="space-y-3">
                {/* Title & Status Badge Row */}
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                </div>

                {/* Address/Subtext */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

                {/* Price & Distance Row */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>

                {/* 'Book Now' Button Placeholder */}
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
