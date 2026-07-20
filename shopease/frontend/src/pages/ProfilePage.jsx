import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const ProfilePage = () => {
  const { user, login, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch latest profile data from server
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await API.get('/users/profile');
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to load profile',
        });
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate password match if changing password
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password && password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const { data } = await API.put('/users/profile', updateData);

      // Update auth context with new data
      login(data);

      // Clear password fields
      setPassword('');
      setConfirmPassword('');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      showToast('Profile updated!', 'success');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetching) {
    return <Loader size="lg" />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in" id="profile-page">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-900/30">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-dark-200 mt-2">Manage your account information</p>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-700/50 border border-dark-400/30">
            <HiOutlineCalendar className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-dark-200">
              Member since{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
          {user?.isAdmin && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-accent-900/30 border border-accent-700/30">
              <HiOutlineShieldCheck className="w-4 h-4 text-accent-400" />
              <span className="text-xs text-accent-300 font-medium">Admin</span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {message.text && (
            <div className="mb-6">
              <Message variant={message.type}>{message.text}</Message>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-dark-100 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HiOutlineUser className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-dark-100 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HiOutlineMail className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center py-2">
              <div className="flex-1 border-t border-dark-400/50"></div>
              <span className="px-4 text-xs text-dark-300 uppercase tracking-wider">
                Change Password
              </span>
              <div className="flex-1 border-t border-dark-400/50"></div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="profile-password"
                className="block text-sm font-medium text-dark-100 mb-2"
              >
                New Password
                <span className="text-dark-300 font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  id="profile-password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="profile-confirm-password"
                className="block text-sm font-medium text-dark-100 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  id="profile-confirm-password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-dark-700/50 border rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-500/50'
                      : 'border-dark-400/50'
                  }`}
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              id="profile-submit"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
