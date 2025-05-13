import { useState } from 'react'; // Add useState import
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import useDonations from '../hooks/useDashboard';
import useTarget from '../hooks/useTarget';
import DonationTable from './DonationTable';
import DonationSummary from './DonationSummary';
import TargetForm from './TargetForm';
import PasswordDialog from './PasswordDialog';
import StyledAppBar from './StyledAppBar';

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: '#ffffff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const {
    donations,
    fetchLoading,
    snackbar,
    handleApprove,
    handleReject,
    handleDownloadPDF,
    pendingDonations,
    approvedDonations,
    totalDonations,
    pieChartData,
    handleCloseSnackbar,
  } = useDonations();
  const { target, newTarget, setNewTarget, handleUpdateTarget } = useTarget();
  // Manage password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

  const isAdmin = user && user.email && user.email.match(/.*@admin\.com/);

  if (loading || fetchLoading) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
        <StyledPaper sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'error.main' }}>
            Akses Ditolak
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Anda harus login sebagai admin untuk mengakses dashboard ini.
          </Typography>
          <StyledButton variant="contained" color="primary" onClick={() => navigate('/admin/login')}>
            Login sebagai Admin
          </StyledButton>
        </StyledPaper>
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

  const progress = target > 0 ? Math.min((totalDonations / target) * 100, 100) : 0;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <StyledAppBar
        logout={logout}
        navigate={navigate}
        setSnackbar={(value) => setSnackbar(value)} // Pass setSnackbar
      />
      <Box sx={{ pt: 10, pb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        <StyledPaper sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}
            >
              Dashboard Admin
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Kelola donasi, atur target, dan pantau progres dengan antarmuka yang intuitif dan aman.
            </Typography>
            <Divider sx={{ mb: 5, bgcolor: 'grey.200' }} />
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} md={4}>
                <DonationSummary
                  totalDonations={totalDonations}
                  target={target}
                  progress={progress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DonationSummary pieChartData={pieChartData} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TargetForm
                  newTarget={newTarget}
                  setNewTarget={setNewTarget}
                  handleUpdateTarget={handleUpdateTarget}
                />
              </Grid>
            </Grid>
            <DonationTable
              pendingDonations={pendingDonations}
              handleApprove={handleApprove}
              handleReject={handleReject}
              handleDownloadPDF={() => handleDownloadPDF(target)} // Pass target
              handlePasswordDialogOpen={() => setPasswordDialogOpen(true)}
            />
          </Box>
        </StyledPaper>
      </Box>
      <PasswordDialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        setSnackbar={(value) => setSnackbar(value)} // Pass setSnackbar
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', maxWidth: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;