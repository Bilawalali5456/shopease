import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { 
  HiOutlineDocumentText, 
  HiOutlineUser, 
  HiOutlineLocationMarker, 
  HiOutlineCreditCard, 
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setActionLoading(true);
    try {
      await API.put(`/orders/${id}/cancel`);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    setActionLoading(true);
    try {
      await API.put(`/orders/${id}/deliver`);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as delivered');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="py-24"><Loader size="lg" /></div>;
  if (error) return <div className="max-w-4xl mx-auto py-12 px-4"><Message variant="error">{error}</Message></div>;
  if (!order) return null;

  // Status badge styling
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="order-detail-page">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-3">
            <HiOutlineDocumentText className="w-8 h-8 text-primary-500" />
            <span>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
          </h1>
          <p className="text-dark-200 mt-2 text-sm">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-dark-600 text-white'}`}>
            {order.status}
          </span>
          
          {order.status === 'pending' && !user.isAdmin && (
            <button 
              onClick={handleCancelOrder}
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors border border-red-500/30 text-sm font-medium disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}

          {user.isAdmin && !order.isDelivered && order.status !== 'cancelled' && (
             <button 
             onClick={handleMarkDelivered}
             disabled={actionLoading}
             className="px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white transition-colors border border-green-500/30 text-sm font-medium disabled:opacity-50"
           >
             Mark Delivered
           </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COMPACT COLUMN - Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* User & Shipping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <HiOutlineUser className="w-5 h-5 text-primary-400" />
                <span>Customer</span>
              </h3>
              <p className="text-white font-medium">{order.user.name}</p>
              <p className="text-dark-200 text-sm mt-1">
                <a href={`mailto:${order.user.email}`} className="hover:text-primary-400">{order.user.email}</a>
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-accent-400" />
                <span>Shipping Address</span>
              </h3>
              <p className="text-white text-sm leading-relaxed">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
              
              <div className="mt-4 pt-4 border-t border-dark-400/30">
                {order.isDelivered ? (
                  <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-yellow-500 text-sm font-medium">
                    <HiOutlineTruck className="w-5 h-5" />
                    <span>Delivery Pending</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="glass rounded-2xl p-6">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <HiOutlineCreditCard className="w-5 h-5 text-emerald-400" />
                <span>Payment</span>
              </h3>
              <p className="text-dark-200 text-sm mb-4">Payment Method: <span className="text-white font-medium">Cash on Delivery / Pending</span></p>
              
              {order.isPaid ? (
                  <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-medium">
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span>Paid on {new Date(order.paidAt).toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-4 py-2 rounded-lg text-sm font-medium">
                    <HiOutlineXCircle className="w-5 h-5" />
                    <span>Payment Pending</span>
                  </div>
                )}
          </div>

          {/* Order Items Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-dark-400/50">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Order Items</span>
                <span className="text-sm font-normal text-dark-300">{order.orderItems.length} items</span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-dark-400/30 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`} className="text-white font-medium hover:text-primary-400 line-clamp-1 text-sm sm:text-base">
                        {item.name}
                      </Link>
                      <p className="text-dark-300 text-sm mt-1">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold">PKR {(item.qty * item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200">Items Subtotal</span>
                <span className="text-white">PKR {order.itemsPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200">Shipping</span>
                <span className="text-white">
                  {order.shippingPrice === 0 ? 'FREE' : `PKR ${order.shippingPrice}`}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-dark-400/30">
                <span className="text-dark-200">Tax</span>
                <span className="text-white">PKR {order.taxPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-xl font-bold gradient-text">PKR {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {order.status === 'pending' && !user.isAdmin && (
               <div className="mt-8 p-4 rounded-xl bg-primary-900/20 border border-primary-500/20">
                  <p className="text-primary-300 text-sm text-center font-medium">
                    Please prepare the exact amount of <br/><span className="text-white font-bold block mt-1">PKR {order.totalPrice.toLocaleString()}</span> <br/>for cash on delivery.
                  </p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
