/**
 * Spinner Loader
 */
const Loader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center py-12" id="loader">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-4 border-dark-500 border-t-primary-500 animate-spin`}
        ></div>
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full border-4 border-transparent border-b-accent-500 animate-spin`}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Skeleton Card — shimmer placeholder matching ProductCard dimensions
 */
const SkeletonCard = () => {
  return (
    <div className="bg-dark-700/50 border border-dark-400/30 rounded-2xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-dark-600/80"></div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="w-16 h-3 bg-dark-500 rounded-full"></div>
        {/* Name */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-dark-500 rounded-full"></div>
          <div className="w-3/4 h-4 bg-dark-500 rounded-full"></div>
        </div>
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-dark-500 rounded-full"></div>
          ))}
          <div className="w-8 h-3 bg-dark-500 rounded-full ml-2"></div>
        </div>
        {/* Price + buttons */}
        <div className="pt-3 border-t border-dark-400/30 flex items-center justify-between">
          <div className="w-20 h-5 bg-dark-500 rounded-full"></div>
          <div className="flex space-x-2">
            <div className="w-16 h-8 bg-dark-500 rounded-lg"></div>
            <div className="w-8 h-8 bg-dark-500 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Grid — renders N skeleton cards in a product grid layout
 */
const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonGrid };
export default Loader;
