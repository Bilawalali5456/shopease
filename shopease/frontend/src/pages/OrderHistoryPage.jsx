import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { HiOutlineDocumentText, HiOutlineEye } from 'react-icons/hi';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="order-history-page">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Order <span className="gradient-text">History</span>
        </h1>
        <p className="text-dark-200">Track and view your past purchases</p>
      </div>

      {loading ? (
        <div className="py-24"><Loader size="lg" /></div>
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-700/50 rounded-full flex items-center justify-center">
            <HiOutlineDocumentText className="w-10 h-10 text-dark-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Orders Yet</h2>
          <p className="text-dark-200 mb-8 max-w-md mx-auto">
            You haven&apos;t placed any orders yet. Start exploring our catalogue and find something amazing!
          </p>
          <Link
            to="/products"
            className="inline-flex px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-lg hover:from-primary-500 hover:to-primary-600 transition-all text-sm uppercase tracking-wider"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-dark-400/50 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-dark-700/30 border-b border-dark-400/50 text-dark-100 text-sm uppercase tracking-wider font-semibold">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Total</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-400/30">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-dark-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-white">#{order._id.substring(18).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 text-dark-200 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">PKR {order.totalPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-primary-400 hover:text-primary-300 font-medium text-sm transition-all"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                        <span>Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
