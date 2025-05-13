import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StyledButton from './StyledButton';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1e88e5 0%, #4fc3f7 100%)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  },
}));

const AppBarComponent = ({ logout, navigate, setSnackbar }) => {
  const handleLogout = async () => {
    try {
      await logout();
      setSnackbar({
        open: true,
        message: 'Logout berhasil. Mengalihkan ke beranda...',
        severity: 'success',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
      setSnackbar({
        open: true,
        message: 'Gagal logout: ' + error.message,
        severity: 'error',
      });
    }
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
        >
          "RQSN" Dashboard
        </Typography>
        <StyledButton
          color="inherit"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 1 }}
        >
          Home
        </StyledButton>
        <StyledButton
          color="inherit"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </StyledButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBarComponent;