// src/components/DonationDetails.jsx
import { Box, Typography, Divider } from '@mui/material';

function DonationDetails({ donationData }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Detail Donasi
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        Nama: {donationData.name}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        Jumlah: Rp {donationData.amount.toLocaleString('id-ID')}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        Nomor Telepon: {donationData.phone}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        Metode Pembayaran: {donationData.method.charAt(0).toUpperCase() + donationData.method.slice(1)}
      </Typography>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
}

export default DonationDetails;