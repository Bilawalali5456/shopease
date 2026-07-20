import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineUpload,
} from 'react-icons/hi';

// ─── PRODUCT MODAL ──────────────────────────────────────────────────────
const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        brand: product.brand || '',
        countInStock: product.countInStock?.toString() || '',
        imageUrl: product.imageUrl || '',
      });
      setImagePreview(product.imageUrl || '');
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        imageUrl: '',
      });
      setImagePreview('');
    }
    setError('');
  }, [product, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      setImagePreview(data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
      };

      if (isEdit) {
        await API.put(`/products/${product._id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-400/40 sticky top-0 bg-dark-800/95 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-600 transition-all"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <Message variant="error">{error}</Message>}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              Product Image
            </label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-dark-700 border border-dark-400/50 flex items-center justify-center flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiOutlinePhotograph className="w-8 h-8 text-dark-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-dark-400/50 hover:border-primary-500/50 cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <span className="text-dark-200 text-sm">Uploading...</span>
                  ) : (
                    <>
                      <HiOutlineUpload className="w-4 h-4 text-dark-300" />
                      <span className="text-dark-200 text-sm">
                        Click to upload (JPG, PNG)
                      </span>
                    </>
                  )}
                </label>
                {/* Or paste URL */}
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste image URL"
                  className="w-full mt-2 px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. Wireless Bluetooth Headphones"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Price (PKR) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Count in Stock *
              </label>
              <input
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g. Electronics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g. Samsung"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-400/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-dark-400/50 text-dark-200 hover:text-white font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── PRODUCTS ADMIN PAGE ────────────────────────────────────────────────
const ProductsAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Delete loading
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=999');
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleteLoading(id);
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="admin-products-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Product <span className="gradient-text">Management</span>
          </h1>
          <p className="text-dark-200 mt-1">{products.length} products in catalogue</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02]"
          id="add-product-btn"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <HiOutlineSearch className="w-4 h-4 text-dark-300" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white text-sm placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          id="admin-product-search"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24"><Loader size="lg" /></div>
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredProducts.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-4xl mb-4 block">📦</span>
          <h2 className="text-xl font-bold text-white mb-2">
            {search ? 'No matching products' : 'No products yet'}
          </h2>
          <p className="text-dark-200 mb-6">
            {search
              ? `No products found matching "${search}"`
              : 'Click "Add Product" to create your first product.'}
          </p>
          {!search && (
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white font-medium transition-all"
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-400/40">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-400/20">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-dark-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiOutlinePhotograph className="w-5 h-5 text-dark-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate max-w-[200px]">
                            {p.name}
                          </p>
                          <p className="text-dark-300 text-xs">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-dark-600 text-dark-100 text-xs font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold text-sm">
                      PKR {p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${
                          p.countInStock === 0
                            ? 'text-red-400'
                            : p.countInStock < 10
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {p.countInStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-600/50 transition-all"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deleteLoading === p._id}
                          className="p-2 rounded-lg text-dark-300 hover:text-red-400 hover:bg-dark-600/50 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        onSave={fetchProducts}
        product={editProduct}
      />
    </div>
  );
};

export default ProductsAdminPage;
