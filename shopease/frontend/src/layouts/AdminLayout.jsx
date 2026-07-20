import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineArrowLeft,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: HiOutlineChartBar, exact: true },
  { path: '/admin/products', label: 'Products', icon: HiOutlineCollection },
  { path: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
  { path: '/admin/users', label: 'Users', icon: HiOutlineUsers },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span className="gradient-text">Admin Panel</span>
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 transition-all"
        >
          {sidebarOpen ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Tab Bar */}
      {sidebarOpen && (
        <div className="lg:hidden glass rounded-xl mb-6 p-2 flex flex-wrap gap-2 animate-slide-down">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 min-w-[120px] justify-center ${
                  active
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                    : 'text-dark-200 hover:text-white hover:bg-dark-500/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass rounded-2xl p-5 sticky top-24">
            {/* Admin Info */}
            <div className="mb-6 pb-5 border-b border-dark-400/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs text-primary-400 font-medium">Administrator</p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                        : 'text-dark-200 hover:text-white hover:bg-dark-500/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-400' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Back to Store */}
            <div className="mt-6 pt-5 border-t border-dark-400/40">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-dark-300 hover:text-white hover:bg-dark-500/30 text-sm font-medium transition-all"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                <span>Back to Store</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
