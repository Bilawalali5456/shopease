import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';
import { HiOutlineShoppingCart, HiStar, HiOutlineStar } from 'react-icons/hi';

/**
 * Star rating display component
 */
const StarRating = ({ rating, size = 'sm' }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const sizeClass = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {rating >= star ? (
            <HiStar className={`${sizeClass} text-amber-400`} />
          ) : rating >= star - 0.5 ? (
            <HiStar className={`${sizeClass} text-amber-400/50`} />
          ) : (
            <HiOutlineStar className={`${sizeClass} text-dark-300`} />
          )}
        </span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const isOutOfStock = product.countInStock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
      showToast(`${product.name} added to cart`, 'success');
    }
  };

  return (
    <div className="group bg-dark-700/50 border border-dark-400/30 rounded-2xl overflow-hidden hover:border-primary-700/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 flex flex-col">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden aspect-[4/3]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-dark-900/70 backdrop-blur-sm text-dark-100 text-xs font-medium px-2.5 py-1 rounded-full">
          {product.category}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        <span className="text-xs text-primary-400 font-medium uppercase tracking-wider mb-1">
          {product.brand}
        </span>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <StarRating rating={product.ratings} />
          <span className="text-xs text-dark-300">
            ({product.numReviews})
          </span>
        </div>

        {/* Spacer */}
        <div className="mt-auto"></div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-400/30">
          <span className="text-lg font-bold text-white">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center space-x-2">
            <Link
              to={`/product/${product._id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-dark-100 hover:text-white border border-dark-400/50 hover:border-primary-500 transition-all"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded-lg transition-all ${
                isOutOfStock
                  ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                  : 'bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white'
              }`}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <HiOutlineShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StarRating };
export default ProductCard;
