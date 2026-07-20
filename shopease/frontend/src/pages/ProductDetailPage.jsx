import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { StarRating } from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  HiStar,
  HiOutlineStar,
  HiOutlineShoppingCart,
  HiOutlineArrowLeft,
  HiOutlineTag,
  HiOutlineBadgeCheck,
  HiOutlineCube,
  HiOutlinePlus,
  HiOutlineMinus,
} from 'react-icons/hi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load product details'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      });
      showToast(`${product.name} added to cart`, 'success');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage({ type: '', text: '' });
    setReviewLoading(true);

    try {
      await API.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });
      setReviewMessage({ type: 'success', text: 'Review submitted successfully!' });
      showToast('Review submitted!', 'success');
      setComment('');
      setRating(5);

      // Refresh product to show new review
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const hasUserReviewed =
    user && product?.reviews?.some(
      (r) => (r.user?._id || r.user)?.toString() === user._id?.toString()
    );

  if (loading) return <Loader size="lg" />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Message variant="error">{error}</Message>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 mt-6 text-primary-400 hover:text-primary-300 transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="product-detail-page">
      {/* Breadcrumb */}
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 text-dark-200 hover:text-primary-400 transition-colors mb-8"
        id="back-to-products"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </Link>

      {/* ============ PRODUCT INFO ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl bg-dark-700/50 border border-dark-400/30">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover aspect-square"
          />
          {product.countInStock === 0 && (
            <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Category & Brand */}
          <div className="flex items-center space-x-3 mb-3">
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/30 text-primary-300 text-xs font-medium">
              <HiOutlineTag className="w-3 h-3" />
              <span>{product.category}</span>
            </span>
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-dark-700/50 border border-dark-400/30 text-dark-100 text-xs font-medium">
              <HiOutlineBadgeCheck className="w-3 h-3" />
              <span>{product.brand}</span>
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-3 mb-6">
            <StarRating rating={product.ratings} size="md" />
            <span className="text-sm text-dark-200">
              {product.ratings.toFixed(1)} ({product.numReviews}{' '}
              {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold gradient-text">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-dark-200 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 mb-6">
            <HiOutlineCube className={`w-5 h-5 ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          {product.countInStock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-dark-400/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-dark-200 hover:text-white hover:bg-dark-600 transition-all"
                  id="qty-decrease"
                >
                  <HiOutlineMinus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 text-white font-semibold bg-dark-700/50 min-w-[50px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.countInStock, q + 1))
                  }
                  className="p-3 text-dark-200 hover:text-white hover:bg-dark-600 transition-all"
                  id="qty-increase"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02]"
                id="add-to-cart-btn"
              >
                <HiOutlineShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============ REVIEWS SECTION ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10" id="reviews-section">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6">Write a Review</h2>

          {!user ? (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-dark-200 mb-4">
                Please sign in to write a review
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white font-medium transition-all"
              >
                <span>Sign In</span>
              </Link>
            </div>
          ) : hasUserReviewed ? (
            <div className="glass rounded-2xl p-6">
              <Message variant="info">
                You have already reviewed this product
              </Message>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6">
              {reviewMessage.text && (
                <div className="mb-4">
                  <Message variant={reviewMessage.type}>
                    {reviewMessage.text}
                  </Message>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-0.5 transition-transform hover:scale-125"
                      >
                        {star <= rating ? (
                          <HiStar className="w-7 h-7 text-amber-400" />
                        ) : (
                          <HiOutlineStar className="w-7 h-7 text-dark-300 hover:text-amber-400" />
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-dark-200">
                      {rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-sm font-medium text-dark-100 mb-2"
                  >
                    Comment
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading || !comment.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-500 hover:to-accent-600 text-white font-semibold shadow-lg shadow-accent-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  id="submit-review"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">
            Customer Reviews
            <span className="text-dark-300 font-normal text-base ml-2">
              ({product.reviews.length})
            </span>
          </h2>

          {product.reviews.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-dark-200">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((review) => (
                  <div
                    key={review._id}
                    className="glass rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {review.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {review.name}
                          </p>
                          <p className="text-dark-300 text-xs">
                            {new Date(review.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-dark-200 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
