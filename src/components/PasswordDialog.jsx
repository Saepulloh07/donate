import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import StyledButton from './StyledButton';

const PasswordDialog = ({ open, onClose, passwordData, setPasswordData, setSnackbar }) => {
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Password baru dan konfirmasi tidak cocok.',
        severity: 'error',
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password baru harus minimal 6 karakter.',
        severity: 'error',
      });
      return;
    }
    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      onClose();
      setSnackbar({
        open: true,
        message: 'Password berhasil diperbarui.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error changing password:', error.message);
      setSnackbar({
        open: true,
        message: 'Gagal mengganti password: ' + error.message,
        severity: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
        Ganti Password
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Password Baru"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Konfirmasi Password"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
          }
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <StyledButton onClick={onClose} color="secondary">
          Batal
        </StyledButton>
        <StyledButton onClick={handleChangePassword} color="primary" variant="contained">
          Simpan
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;