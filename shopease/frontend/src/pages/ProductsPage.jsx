import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader, { SkeletonGrid } from '../components/Loader';
import Message from '../components/Message';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineSortDescending,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
} from 'react-icons/hi';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Debounce keyword input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Reset page on filter/sort change
  useEffect(() => {
    setPage(1);
  }, [category, sort]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', '12');
      if (debouncedKeyword) params.set('keyword', debouncedKeyword);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);

      // Sync URL params
      const urlParams = new URLSearchParams();
      if (debouncedKeyword) urlParams.set('keyword', debouncedKeyword);
      if (category) urlParams.set('category', category);
      if (sort && sort !== 'newest') urlParams.set('sort', sort);
      if (page > 1) urlParams.set('page', page);
      setSearchParams(urlParams, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword, category, sort, setSearchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setKeyword('');
    setDebouncedKeyword('');
    setCategory('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = debouncedKeyword || category || sort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="products-page">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Our <span className="gradient-text">Products</span>
        </h1>
        <p className="text-dark-200">
          {total > 0
            ? `Showing ${products.length} of ${total} products`
            : 'Browse our collection'}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-2xl p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <HiOutlineSearch className="w-5 h-5 text-dark-300" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              id="search-input"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-300 hover:text-white transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <HiOutlineFilter className="w-5 h-5 text-dark-300" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
              id="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <HiOutlineSortDescending className="w-5 h-5 text-dark-300" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
              id="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl border border-dark-400/50 hover:border-red-500/50 text-dark-200 hover:text-red-400 transition-all"
              id="clear-filters"
            >
              <HiOutlineX className="w-4 h-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={8} />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-700/50 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
          <p className="text-dark-200 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white font-medium transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-dark-400/50 text-dark-100 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dark-400/50"
                id="pagination-prev"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                  let pageNum;
                  if (pages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= pages - 3) {
                    pageNum = pages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                          : 'text-dark-200 hover:text-white hover:bg-dark-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-dark-400/50 text-dark-100 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dark-400/50"
                id="pagination-next"
              >
                <span className="text-sm font-medium hidden sm:inline">Next</span>
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
