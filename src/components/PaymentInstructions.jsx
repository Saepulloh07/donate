// src/components/PaymentInstructions.jsx
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import qrisImage from '../assets/qris.jpg';

const PaymentInfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
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

function PaymentInstructions({ donationData, handleTryPayRedirect }) {
  switch (donationData.method) {
    case 'qris':
      return (
        <PaymentInfoBox>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instruksi Pembayaran QRIS 📱
          </Typography>
          <Typography variant="body1" paragraph>
            Scan kode QR di bawah menggunakan aplikasi pembayaran yang mendukung QRIS untuk mentransfer Rp{' '}
            {donationData.amount.toLocaleString('id-ID')}.
          </Typography>
          <Box
            component="img"
            src={qrisImage}
            alt="QRIS Code"
            sx={{ maxWidth: 250, borderRadius: 2, my: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
        </PaymentInfoBox>
      );
    case 'bri':
      return (
        <PaymentInfoBox>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instruksi Pembayaran BRI 🏦
          </Typography>
          <Typography variant="body1" paragraph>
            Transfer Rp {donationData.amount.toLocaleString('id-ID')} ke rekening berikut:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            Nomor Rekening: 2074-0100-0368-560
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            Atas Nama: Yayasan Ahmad Sarmadi Indonesia
          </Typography>
        </PaymentInfoBox>
      );
    case 'trypay':
      return (
        <PaymentInfoBox>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instruksi Pembayaran TryPay 💳
          </Typography>
          <Typography variant="body1" paragraph>
            Klik tombol di bawah untuk diarahkan ke halaman pembayaran TryPay.
          </Typography>
          <StyledButton variant="contained" onClick={handleTryPayRedirect}>
            Lanjutkan ke TryPay
          </StyledButton>
        </PaymentInfoBox>
      );
    default:
      return null;
  }
}

export default PaymentInstructions;