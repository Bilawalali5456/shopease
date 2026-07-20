import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Loader';
import Message from '../components/Message';
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineChatAlt2,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?limit=8&sort=newest'),
          API.get('/products/categories'),
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: HiOutlineTruck,
      title: 'Fast Delivery',
      desc: 'Free shipping on orders over PKR 5,000. Fast & reliable delivery across Pakistan.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Secure Payment',
      desc: 'Your transactions are protected with industry-standard encryption.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: HiOutlineRefresh,
      title: 'Easy Returns',
      desc: 'Not satisfied? Return within 30 days for a full refund, no questions asked.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: HiOutlineChatAlt2,
      title: '24/7 Support',
      desc: 'Our customer support team is here to help you anytime, day or night.',
      gradient: 'from-purple-500 to-violet-500',
    },
  ];

  return (
    <div className="animate-fade-in" id="home-page">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/20 mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse-soft"></span>
              <span className="text-primary-300 text-sm font-medium">New Collection 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
              Discover{' '}
              <span className="gradient-text">Premium</span>{' '}
              Products
            </h1>

            <p className="text-lg md:text-xl text-dark-200 mb-10 max-w-xl leading-relaxed">
              Explore thousands of curated products from top brands worldwide.
              Enjoy unbeatable prices, free shipping, and a seamless shopping experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold text-lg shadow-xl shadow-primary-900/30 transition-all transform hover:scale-[1.03]"
                id="hero-shop-now"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 rounded-xl border border-dark-400/60 text-dark-50 hover:text-white hover:border-primary-500/50 font-semibold text-lg transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-dark-200">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="px-6 py-3 rounded-xl bg-dark-700/50 border border-dark-400/40 text-dark-100 hover:text-white hover:border-primary-500/50 hover:bg-primary-600/10 font-medium transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-dark-200">Our newest arrivals, handpicked for you</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center space-x-1.5 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            <span>View All</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-200">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white font-medium transition-all"
          >
            <span>View All Products</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════ WHY SHOP WITH US ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Why Shop With <span className="gradient-text">Us</span>
          </h2>
          <p className="text-dark-200">We go the extra mile to make your experience exceptional</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 text-center group hover:border-primary-500/30 transition-all"
              >
                <div className={`w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-dark-200 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
