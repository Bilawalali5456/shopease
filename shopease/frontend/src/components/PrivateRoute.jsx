import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * PrivateRoute wrapper component
 * Redirects to /login if no authenticated user; otherwise renders children
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loader while checking auth state
  if (loading) {
    return <Loader size="lg" />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
