import { useState } from 'react';
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: { xs: '0.9rem', sm: '1rem' },
  borderRadius: '30px',
  textTransform: 'none',
  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  '&:disabled': {
    background: theme.palette.grey[400],
    color: theme.palette.grey[700],
  },
}));

function NewsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.summary.trim()) newErrors.summary = 'Ringkasan wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
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
      await addDoc(collection(db, 'news'), {
        title: formData.title,
        summary: formData.summary,
        date: serverTimestamp(),
      });
      setSnackbar({
        open: true,
        message: 'Berita berhasil ditambahkan.',
        severity: 'success',
      });
      setFormData({ title: '', summary: '' });
      setTimeout(() => navigate('/admin/dashboard'), 2000); // Redirect after success
    } catch (error) {
      console.error('Error adding news:', error.message);
      setSnackbar({
        open: true,
        message: `Gagal menambahkan berita: ${error.message}`,
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
              <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1.5 }} />
              <Typography
                variant={{ xs: 'h5', md: 'h4' }}
                align="center"
                sx={{ fontWeight: 700 }}
              >
                Tambah Berita
              </Typography>
            </Box>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Tambahkan berita baru untuk ditampilkan di halaman utama.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Judul Berita"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                margin="normal"
                variant="outlined"
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Ringkasan Berita"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                error={!!errors.summary}
                helperText={errors.summary}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                disabled={loading}
              />
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Menyimpan...' : 'Simpan Berita'}
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NewsForm;