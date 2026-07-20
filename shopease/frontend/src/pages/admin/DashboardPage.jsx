import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineCollection,
  HiOutlineEye,
} from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const barColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/orders/stats');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-24"><Loader size="lg" /></div>;
  if (error) return <Message variant="error">{error}</Message>;
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      icon: HiOutlineCurrencyDollar,
      gradient: 'from-emerald-500 to-green-600',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: HiOutlineClipboardList,
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/10',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: HiOutlineCollection,
      gradient: 'from-purple-500 to-violet-600',
      bgGlow: 'bg-purple-500/10',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: HiOutlineUsers,
      gradient: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10',
    },
  ];

  // Calculate max for bar chart
  const statusEntries = Object.entries(stats.ordersByStatus);
  const maxStatusCount = Math.max(...statusEntries.map(([, c]) => c), 1);

  return (
    <div id="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-dark-200 mt-1">Overview of your store performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-primary-500/30 transition-all"
            >
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${card.bgGlow} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`}></div>
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-dark-300 text-xs uppercase tracking-wider font-semibold mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-dark-400/40 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-primary-400 text-sm hover:text-primary-300 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-dark-300">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-400/30">
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Total</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400/20">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-dark-700/20 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-sm text-dark-100">
                        #{order._id.substring(18).toUpperCase()}
                      </td>
                      <td className="px-6 py-3.5 text-white text-sm">
                        {order.user?.name || 'Deleted User'}
                      </td>
                      <td className="px-6 py-3.5 text-dark-200 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 text-white font-semibold text-sm">
                        PKR {order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-dark-300 hover:text-primary-400 transition-colors"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="xl:col-span-1 glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Orders by Status</h2>

          {statusEntries.length === 0 ? (
            <p className="text-dark-300 text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-4">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                const count = stats.ordersByStatus[status] || 0;
                if (count === 0) return null;
                const pct = Math.round((count / maxStatusCount) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm capitalize text-dark-100 font-medium">
                        {status}
                      </span>
                      <span className="text-sm text-white font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColors[status]} transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
