const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
        {/* Header Placeholder */}
        <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-4 space-y-4"
            >
              <div className="h-40 bg-gray-300 rounded-xl" />
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
