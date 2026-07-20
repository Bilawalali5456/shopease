import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  HiOutlineLocationMarker,
  HiOutlineShoppingBag,
  HiOutlineReceiptTax,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, clearCart, subtotal } = useCart();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate Prices exactly like backend
  const shippingPrice = subtotal > 5000 ? 0 : 200;
  const taxPrice = Number((0.17 * subtotal).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [shippingAddress, cartItems, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
      });
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="place-order-page">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Review & Place <span className="gradient-text">Order</span>
        </h1>
        <p className="text-dark-200">Please review your items and shipping details</p>
      </div>

      {error && <Message variant="error" className="mb-6">{error}</Message>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Summary */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <HiOutlineLocationMarker className="w-5 h-5 text-primary-400" />
              <span>Shipping details</span>
            </h2>
            <div className="bg-dark-700/30 rounded-xl p-4 border border-dark-400/30">
              <p className="text-white text-base">
                <span className="font-semibold text-dark-100 mr-2">Address:</span>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <div className="mt-3">
                <Link to="/shipping" className="text-primary-400 text-sm hover:underline font-medium">Edit shipping details</Link>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <HiOutlineShoppingBag className="w-5 h-5 text-accent-400" />
              <span>Order Items</span>
            </h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-dark-400/30 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`} className="text-white font-medium hover:text-primary-400 line-clamp-1 text-sm sm:text-base">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-dark-200 text-sm">{item.qty} × PKR {item.price}</p>
                    <p className="text-white font-bold mt-0.5">PKR {(item.qty * item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-dark-400/30">
                <Link to="/cart" className="text-primary-400 text-sm hover:underline font-medium">Edit cart items</Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200 flex items-center space-x-2">
                  <HiOutlineCurrencyDollar className="w-4 h-4" />
                  <span>Items</span>
                </span>
                <span className="text-white font-medium">PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200 flex items-center space-x-2">
                  <HiOutlineTruck className="w-4 h-4" />
                  <span>Shipping</span>
                </span>
                <span className="text-white font-medium">
                  {shippingPrice === 0 ? 'FREE' : `PKR ${shippingPrice}`}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200 flex items-center space-x-2">
                  <HiOutlineReceiptTax className="w-4 h-4" />
                  <span>Tax (17% GST)</span>
                </span>
                <span className="text-white font-medium">PKR {taxPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-xl font-bold gradient-text">PKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={loading || cartItems.length === 0}
              className="w-full mt-8 py-3.5 rounded-xl flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              id="place-order-btn"
            >
              {loading ? <Loader size="sm" /> : (
                <>
                  <HiOutlineCheckCircle className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-center text-dark-300">
              * Payment will be collected securely after placing the order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
