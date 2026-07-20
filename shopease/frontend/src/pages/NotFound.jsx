import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineEmojiSad } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in" id="not-found-page">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <span className="text-[10rem] md:text-[14rem] font-black text-dark-700/50 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <HiOutlineEmojiSad className="w-20 h-20 text-primary-400 animate-pulse-soft" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-dark-200 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-105"
          id="go-home-btn"
        >
          <HiOutlineHome className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
