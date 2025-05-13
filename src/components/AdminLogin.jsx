import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { AuthContext } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: 'auto',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  borderRadius: '30px',
  textTransform: 'none',
  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
  '&:hover': {
    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
}));

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email domain
    if (!formData.email.match(/.*@admin\.com$/)) {
      setSnackbar({
        open: true,
        message: 'Email harus menggunakan domain @admin.com',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setSnackbar({
        open: true,
        message: 'Login berhasil. Mengalihkan ke dashboard...',
        severity: 'success',
      });
      setFormData({ email: '', password: '' }); // Clear form
      navigate('/admin'); // Navigate to trigger Admin.jsx logic
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Fade in timeout={600}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <LockIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                Login Admin
              </Typography>
            </Box>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Masukkan kredensial admin untuk mengakses dashboard.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Memproses...' : 'Login'}
              </StyledButton>
            </Box>
          </CardContent>
        </StyledCard>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminLogin;