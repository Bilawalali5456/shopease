import { Link } from 'react-router-dom';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-dark-400/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold gradient-text">ShopEase</span>
            </Link>
            <p className="text-sm text-dark-200 leading-relaxed">
              Your one-stop premium destination for quality products. We deliver
              excellence at unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/cart', label: 'Cart' },
                { to: '/profile', label: 'My Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-dark-200 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Shipping Policy', path: '/shipping-policy' },
                { label: 'Return Policy', path: '/return-policy' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Terms of Service', path: '/terms' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-dark-200 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-dark-200">
                <HiOutlineMail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:support@shopease.com" className="hover:text-primary-400 transition-colors">support@shopease.com</a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-dark-200">
                <HiOutlinePhone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+923087224354" className="hover:text-primary-400 transition-colors">+92 308 7224354</a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-dark-200">
                <HiOutlineLocationMarker className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Lahore, Punjab, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-400/30 py-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-dark-300">
            &copy; {currentYear} ShopEase. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <Link
              to="/privacy"
              className="text-xs text-dark-300 hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-dark-400">|</span>
            <Link
              to="/terms"
              className="text-xs text-dark-300 hover:text-primary-400 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
