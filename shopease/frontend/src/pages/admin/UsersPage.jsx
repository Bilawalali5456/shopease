import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from 'react-icons/hi';

const UsersPage = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/users');
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (u) => {
    setEditingId(u._id);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditIsAdmin(u.isAdmin);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const saveEdit = async (id) => {
    setEditLoading(true);
    setEditError('');
    try {
      const { data } = await API.put(`/users/${id}`, {
        name: editName,
        email: editEmail,
        isAdmin: editIsAdmin,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...data } : u))
      );
      setEditingId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDeleteLoading(id);
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Client-side filter
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const isSelf = (id) => id === currentUser?._id;

  return (
    <div id="admin-users-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            User <span className="gradient-text">Management</span>
          </h1>
          <p className="text-dark-200 mt-1">{users.length} registered users</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <HiOutlineSearch className="w-4 h-4 text-dark-300" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white text-sm placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            id="user-search"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24"><Loader size="lg" /></div>
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredUsers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <HiOutlineUsers className="w-12 h-12 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {search ? 'No matching users' : 'No users yet'}
          </h2>
          <p className="text-dark-200">
            {search
              ? `No users found matching "${search}"`
              : 'Users will appear here when they register.'}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {editError && (
            <div className="px-6 pt-4">
              <Message variant="error">{editError}</Message>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-400/40">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-400/20">
                {filteredUsers.map((u) => {
                  const editing = editingId === u._id;
                  const self = isSelf(u._id);

                  return (
                    <tr
                      key={u._id}
                      className={`hover:bg-dark-700/20 transition-colors ${
                        editing ? 'bg-dark-700/30' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        {editing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-dark-600 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {u.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-white font-medium text-sm">
                              {u.name}
                              {self && (
                                <span className="ml-2 text-xs text-primary-400">(You)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        {editing ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-3 py-1.5 bg-dark-600 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        ) : (
                          <span className="text-dark-200 text-sm">{u.email}</span>
                        )}
                      </td>

                      {/* Admin Badge */}
                      <td className="px-6 py-4">
                        {editing ? (
                          <button
                            onClick={() => !self && setEditIsAdmin(!editIsAdmin)}
                            disabled={self}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              editIsAdmin
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-dark-600 text-dark-300 border-dark-400/50'
                            } ${self ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                          >
                            {editIsAdmin ? 'Admin' : 'User'}
                          </button>
                        ) : u.isAdmin ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold">
                            <HiOutlineShieldCheck className="w-3 h-3" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-dark-600 text-dark-300 border border-dark-400/40 text-xs font-bold">
                            User
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-dark-200 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          {editing ? (
                            <>
                              <button
                                onClick={() => saveEdit(u._id)}
                                disabled={editLoading}
                                className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                                title="Save"
                              >
                                <HiOutlineCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 rounded-lg bg-dark-600 text-dark-200 hover:text-white transition-all"
                                title="Cancel"
                              >
                                <HiOutlineX className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(u)}
                                className="p-2 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-600/50 transition-all"
                                title="Edit"
                              >
                                <HiOutlinePencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(u._id, u.name)}
                                disabled={self || deleteLoading === u._id}
                                className="p-2 rounded-lg text-dark-300 hover:text-red-400 hover:bg-dark-600/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                title={self ? "Can't delete yourself" : 'Delete'}
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
