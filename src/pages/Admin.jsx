import { useContext, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Admin() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Debug log to check auth state
  useEffect(() => {
    console.log('Admin.jsx - User:', user, 'Loading:', loading);
  }, [user, loading]);

  if (loading) return null; // Wait for auth state
  if (user && user.email && user.email.match(/.*@admin\.com/)) {
    return <Navigate to="/admin/dashboard" state={{ from: location }} />;
  }
  return <AdminLogin />;
}

export default Admin;