import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';
import {
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineBookmark,
  HiOutlineShoppingCart,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineReceiptTax,
} from 'react-icons/hi';

const CartPage = () => {
  const {
    cartItems,
    savedForLater,
    removeFromCart,
    updateQty,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    itemCount,
    subtotal,
  } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  // ─── Order Calculations ─────────────────────────────────────────────
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = Number((subtotal * 0.17).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handlePromoApply = () => {
    if (!promoCode.trim()) return;
    setPromoMessage('Invalid promo code. Please try again.');
  };

  // ─── Empty Cart State ───────────────────────────────────────────────
  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in" id="cart-empty">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700/50 border border-dark-400/30 flex items-center justify-center">
            <HiOutlineShoppingCart className="w-12 h-12 text-dark-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-dark-200 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
            Explore our products and find something you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02]"
            id="continue-shopping-empty"
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="cart-page">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Shopping <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-dark-200 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-dark-400/50 hover:border-red-500/50 text-dark-200 hover:text-red-400 transition-all text-sm"
            id="clear-cart-btn"
          >
            <HiOutlineTrash className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        )}
      </div>

      {/* ============ TWO-COLUMN LAYOUT ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-dark-200 mb-4">
                Your cart is empty, but you have items saved for later below.
              </p>
              <Link
                to="/products"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Browse Products →
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <Link
                  to={`/product/${item._id}`}
                  className="flex-shrink-0 w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-dark-700"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-2 text-sm sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="text-primary-400 font-bold mt-1">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-white font-bold whitespace-nowrap text-right">
                      PKR {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    {/* Qty Stepper */}
                    <div className="flex items-center border border-dark-400/50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <HiOutlineMinus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.countInStock}
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item._id, Number(e.target.value) || 1)
                        }
                        className="w-12 text-center bg-dark-700/50 text-white text-sm py-1.5 border-x border-dark-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <HiOutlinePlus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Save & Remove */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => saveForLater(item._id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-dark-200 hover:text-amber-400 hover:bg-dark-600/50 transition-all"
                        title="Save for later"
                      >
                        <HiOutlineBookmark className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-dark-200 hover:text-red-400 hover:bg-dark-600/50 transition-all"
                        title="Remove item"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ─── Saved For Later ──────────────────────────────────────── */}
          {savedForLater.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <HiOutlineBookmark className="w-5 h-5 text-amber-400" />
                <span>
                  Saved for Later{' '}
                  <span className="text-dark-300 font-normal">
                    ({savedForLater.length})
                  </span>
                </span>
              </h2>

              <div className="space-y-3">
                {savedForLater.map((item) => (
                  <div
                    key={item._id}
                    className="glass rounded-xl p-4 flex items-center gap-4"
                  >
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-dark-700"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-white text-sm font-medium hover:text-primary-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-primary-400 text-sm font-bold mt-0.5">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => moveToCart(item._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white transition-all"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeSavedItem(item._id)}
                        className="p-1.5 rounded-lg text-dark-300 hover:text-red-400 hover:bg-dark-600/50 transition-all"
                        title="Remove"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Order Summary */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6">
                Order Summary
              </h2>

              {/* Line Items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-dark-200 text-sm flex items-center space-x-2">
                    <HiOutlineShoppingBag className="w-4 h-4" />
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </span>
                  </span>
                  <span className="text-white font-medium">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-dark-200 text-sm flex items-center space-x-2">
                    <HiOutlineTruck className="w-4 h-4" />
                    <span>Shipping</span>
                  </span>
                  {shipping === 0 ? (
                    <span className="text-green-400 font-medium text-sm">
                      FREE
                    </span>
                  ) : (
                    <span className="text-white font-medium">
                      PKR {shipping.toLocaleString()}
                    </span>
                  )}
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-green-400/70 pl-6">
                    Free shipping on orders over PKR 5,000
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-dark-200 text-sm flex items-center space-x-2">
                    <HiOutlineReceiptTax className="w-4 h-4" />
                    <span>GST (17%)</span>
                  </span>
                  <span className="text-white font-medium">
                    PKR {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dark-400/50 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-xl font-bold gradient-text">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-xs text-dark-300 uppercase tracking-wider font-medium mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineTag className="w-4 h-4 text-dark-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoMessage('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white text-sm placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      id="promo-input"
                    />
                  </div>
                  <button
                    onClick={handlePromoApply}
                    className="px-4 py-2.5 rounded-xl border border-dark-400/50 hover:border-primary-500 text-dark-100 hover:text-white text-sm font-medium transition-all"
                    id="apply-promo"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className="mt-2 text-xs text-red-400">{promoMessage}</p>
                )}
              </div>

              {/* Checkout Button */}
              <Link
                to={user ? '/shipping' : '/login'}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02]"
                id="checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="w-full flex items-center justify-center space-x-2 mt-3 py-3 rounded-xl border border-dark-400/50 hover:border-primary-500 text-dark-100 hover:text-white text-sm font-medium transition-all"
                id="continue-shopping"
              >
                <HiOutlineShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              {/* Shipping note */}
              {subtotal > 0 && subtotal <= 5000 && (
                <div className="mt-4 p-3 rounded-xl bg-accent-900/20 border border-accent-700/20">
                  <p className="text-xs text-accent-300">
                    💡 Add PKR {(5000 - subtotal).toLocaleString()} more for{' '}
                    <span className="font-bold">FREE shipping!</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
