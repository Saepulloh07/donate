// src/components/ConfirmationDialog.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Konfirmasi Pengiriman Bukti</DialogTitle>
      <DialogContent>
        <Typography>
          Anda akan mengirim bukti pembayaran ke WhatsApp admin. Pastikan file yang diunggah benar. Lanjutkan?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Batal
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Kirim
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;