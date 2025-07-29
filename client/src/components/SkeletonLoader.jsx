// components/SkeletonLoader.jsx
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="animate-pulse space-y-4 w-full max-w-xl px-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
