import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import NewsForm from './components/NewsForm'; // New component
import { CssBaseline } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import DonationForm from './components/DonationForm';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; 
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!user.email || !user.email.match(/.*@admin\.com/)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;