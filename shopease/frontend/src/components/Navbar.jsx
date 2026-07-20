import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineChevronDown,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: HiOutlineHome },
    { path: '/products', label: 'Products', icon: HiOutlineCollection },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-xl border-b border-dark-400/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" id="navbar-logo">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">ShopEase</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'text-primary-400 bg-primary-600/10'
                      : 'text-dark-100 hover:text-white hover:bg-dark-500/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {/* Cart */}
            <Link
              to="/cart"
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isActive('/cart')
                  ? 'text-primary-400 bg-primary-600/10'
                  : 'text-dark-100 hover:text-white hover:bg-dark-500/50'
              }`}
              id="nav-cart"
            >
              <div className="relative">
                <HiOutlineShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center leading-none shadow-lg shadow-red-900/40">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-500/50 transition-all"
                  id="nav-user-menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-dark-50 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <HiOutlineChevronDown
                    className={`w-3.5 h-3.5 text-dark-300 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-xl border border-dark-400/40 bg-dark-800/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right ${
                    dropdownOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-dark-400/30">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-dark-300 truncate">{user.email}</p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-dark-500/50 transition-all"
                      id="nav-profile"
                    >
                      <HiOutlineUser className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-dark-500/50 transition-all"
                      id="nav-orders"
                    >
                      <HiOutlineDocumentText className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-dark-500/50 transition-all"
                        id="nav-admin"
                      >
                        <HiOutlineCog className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-dark-400/30 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-500/50 transition-all"
                      id="nav-logout"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-medium text-sm shadow-lg shadow-primary-900/30 transition-all transform hover:scale-105"
                id="nav-login"
              >
                <HiOutlineUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2" id="mobile-cart-icon">
              <HiOutlineShoppingCart className="w-6 h-6 text-dark-100" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center leading-none shadow-lg">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 transition-all"
              id="mobile-menu-toggle"
            >
              {mobileOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] border-t border-dark-400/40' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-primary-400 bg-primary-600/10'
                    : 'text-dark-100 hover:text-white hover:bg-dark-500/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            to="/cart"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 font-medium transition-all"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>

          <hr className="border-dark-400/40 my-2" />

          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 font-medium transition-all">
                <HiOutlineUser className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 font-medium transition-all">
                <HiOutlineDocumentText className="w-5 h-5" />
                <span>Orders</span>
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-dark-100 hover:text-white hover:bg-dark-500/50 font-medium transition-all">
                  <HiOutlineCog className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-dark-500/50 font-medium transition-all"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium transition-all"
            >
              <HiOutlineUser className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
