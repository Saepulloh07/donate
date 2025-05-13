import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
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
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  '&:disabled': {
    background: 'grey.400',
    color: 'grey.700',
  },
}));

function DonationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    method: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    const phoneRegex = /^\+?62[0-9]{9,11}$/;
    if (!formData.phone.match(phoneRegex)) newErrors.phone = 'Nomor telepon tidak valid (contoh: +6281234567890)';
    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount < 2000) newErrors.amount = 'Jumlah minimal Rp 10.000';
    if (!formData.method) newErrors.method = 'Metode pembayaran wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validateForm()) {
        setSnackbar({
          open: true,
          message: 'Harap perbaiki kesalahan pada formulir.',
          severity: 'error',
        });
        return;
      }

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          name: formData.name,
          phone: formData.phone,
          amount: formData.amount,
          method: formData.method,
        }).toString();
        navigate(`/checkout?${queryParams}`);
      } catch (error) {
        console.error('Error navigating to checkout:', error.message);
        setSnackbar({
          open: true,
          message: 'Terjadi kesalahan saat menuju checkout: ' + error.message,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box id="donation-form" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Fade in timeout={600}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <VolunteerActivismIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                Formulir Donasi
              </Typography>
            </Box>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Isi detail donasi Anda untuk melanjutkan pengiriman donasi.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nama"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Nomor Telepon"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Jumlah Donasi (Rp)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                margin="normal"
                variant="outlined"
                inputProps={{ min: 2000 }}
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <TextField
                fullWidth
                select
                label="Metode Pembayaran"
                name="method"
                value={formData.method}
                onChange={handleChange}
                error={!!errors.method}
                helperText={errors.method}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              >
                <MenuItem value="qris">QRIS</MenuItem>
                <MenuItem value="bri">BRI</MenuItem>
                {/* <MenuItem value="trypay">TryPay</MenuItem> */}
              </TextField>
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Memproses...' : 'Kirim donasi'}
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

export default DonationForm;