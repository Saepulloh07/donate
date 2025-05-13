// src/pages/Checkout.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Fade, LinearProgress, Snackbar, Alert, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { styled } from '@mui/material/styles';
import DonationDetails from '../components/DonationDetails';
import PaymentInstructions from '../components/PaymentInstructions';
import ProofUpload from '../components/ProofUpload';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useDonation from '../hooks/useDonation';
import useProofUpload from '../hooks/useProofUpload';

const StyledCard = styled('div')(({ theme }) => ({
  maxWidth: 700,
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

function Checkout() {
  const location = useLocation();
  const [proof, setProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Parse query parameters
  const query = new URLSearchParams(location.search);
  const donationData = {
    name: query.get('name') || '',
    amount: parseInt(query.get('amount')) || 0,
    phone: query.get('phone') || '',
    method: query.get('method') || '',
  };

  const { loading, handleSubmit, handleTryPayRedirect, handleConfirmWhatsApp } = useDonation({
    donationData,
    proof,
    setSnackbar,
    setDialogOpen,
    setLoading: (value) => setLoading(value),
  });

  const { handleProofChange, handleCloseSnackbar } = useProofUpload({
    setProof,
    setPreviewUrl,
    setIsPdf,
    setPdfLoadError,
    setSnackbar,
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Fade in timeout={600}>
        <StyledCard>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1.5 }} />
            <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
              Konfirmasi Donasi
            </Typography>
          </Box>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Lengkapi pembayaran Anda dan unggah bukti untuk menyelesaikan donasi.
          </Typography>
          <DonationDetails donationData={donationData} />
          <PaymentInstructions donationData={donationData} handleTryPayRedirect={handleTryPayRedirect} />
          {donationData.method !== 'trypay' && (
            <ProofUpload
              proof={proof}
              previewUrl={previewUrl}
              isPdf={isPdf}
              pdfLoadError={pdfLoadError}
              loading={loading}
              handleProofChange={handleProofChange}
              handleSubmit={handleSubmit}
            />
          )}
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </StyledCard>
      </Fade>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmWhatsApp}
      />
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

export default Checkout;