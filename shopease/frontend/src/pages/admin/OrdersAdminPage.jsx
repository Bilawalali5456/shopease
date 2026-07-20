import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineClipboardCopy,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const STATUS_LIST = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const ORDERS_PER_PAGE = 15;

const OrdersAdminPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Per-row loading state
  const [actionLoading, setActionLoading] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setAllOrders(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Status counts
  const statusCounts = allOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Filtered orders
  const filteredOrders =
    statusFilter === 'all'
      ? allOrders
      : allOrders.filter((o) => o.status === statusFilter);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      const { data } = await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      setAllOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    setActionLoading(orderId);
    try {
      const { data } = await API.put(`/orders/${orderId}/deliver`);
      setAllOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark delivered');
    } finally {
      setActionLoading(null);
    }
  };

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div id="admin-orders-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Order <span className="gradient-text">Management</span>
        </h1>
        <p className="text-dark-200 mt-1">
          {allOrders.length} total orders
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_LIST.map((status) => {
          const count =
            status === 'all' ? allOrders.length : statusCounts[status] || 0;
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'bg-dark-700/50 border border-dark-400/50 text-dark-200 hover:text-white hover:border-primary-500/50'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-dark-600 text-dark-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredOrders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-4xl mb-4 block">📋</span>
          <h2 className="text-xl font-bold text-white mb-2">No orders found</h2>
          <p className="text-dark-200">
            {statusFilter !== 'all'
              ? `No "${statusFilter}" orders. Try a different filter.`
              : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-400/40">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Paid</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-400/20">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-dark-700/20 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-dark-100 text-sm">
                          #{order._id.substring(18).toUpperCase()}
                        </span>
                        <button
                          onClick={() => copyOrderId(order._id)}
                          className="text-dark-400 hover:text-primary-400 transition-colors"
                          title="Copy full ID"
                        >
                          {copiedId === order._id ? (
                            <HiOutlineCheckCircle className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <HiOutlineClipboardCopy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3.5 text-white text-sm">
                      {order.user?.name || 'Deleted User'}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-dark-200 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-3.5 text-white font-semibold text-sm">
                      PKR {order.totalPrice.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={
                          actionLoading === order._id ||
                          order.status === 'cancelled'
                        }
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider bg-dark-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                          statusColors[order.status] || ''
                        }`}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    {/* Paid */}
                    <td className="px-5 py-3.5">
                      {order.isPaid ? (
                        <span className="inline-flex items-center space-x-1 text-green-400 text-xs font-bold">
                          <HiOutlineCheckCircle className="w-4 h-4" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-bold">
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/order/${order._id}`}
                          className="p-2 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-600/50 transition-all"
                          title="View order"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </Link>
                        {!order.isDelivered &&
                          order.status !== 'cancelled' && (
                            <button
                              onClick={() =>
                                handleMarkDelivered(order._id)
                              }
                              disabled={actionLoading === order._id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-500/30 transition-all disabled:opacity-50"
                              title="Mark as delivered"
                            >
                              Deliver
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-dark-400/30">
              <p className="text-dark-300 text-sm">
                Showing {(page - 1) * ORDERS_PER_PAGE + 1}–
                {Math.min(page * ORDERS_PER_PAGE, filteredOrders.length)} of{' '}
                {filteredOrders.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-dark-400/50 text-dark-200 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === num
                          ? 'bg-primary-600 text-white'
                          : 'text-dark-300 hover:text-white hover:bg-dark-600'
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-dark-400/50 text-dark-200 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdminPage;
