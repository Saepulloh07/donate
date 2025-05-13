// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import DonationProgress from '../components/DonationProgress';
import InfoTabs from '../components/InfoTabs';
import DonationForm from '../components/DonationForm';
import DownloadDialog from '../components/DownloadDiaglog'; // New import
import { motion } from 'framer-motion';

function ErrorBoundary({ children, componentName }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Terjadi kesalahan pada {componentName}. Silakan muat ulang halaman atau hubungi dukungan.
        </Typography>
      </Box>
    );
  }

  return children;
}

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  // Parse query parameters for donation data
  const query = new URLSearchParams(location.search);
  const donationData = {
    name: query.get('name') || '',
    amount: parseInt(query.get('amount')) || 0,
    phone: query.get('phone') || '',
    method: query.get('method') || '',
  };

  // Check if donation data is present to open dialog
  useEffect(() => {
    if (query.get('showDownloadDialog') === 'true' && donationData.name && donationData.amount) {
      setDownloadDialogOpen(true);
    }
  }, [location.search, donationData]);

  // Handle dialog close and clear query parameters
  const handleCloseDownloadDialog = () => {
    setDownloadDialogOpen(false);
    // Clear query parameters to prevent dialog from reopening
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <HeroCarousel />
      <Container sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ErrorBoundary componentName="DonationProgress">
            <DonationProgress />
          </ErrorBoundary>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ErrorBoundary componentName="InfoTabs">
            <InfoTabs />
          </ErrorBoundary>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ErrorBoundary componentName="DonationForm">
            <DonationForm />
          </ErrorBoundary>
        </motion.div>
      </Container>
      <DownloadDialog
        open={downloadDialogOpen}
        onClose={handleCloseDownloadDialog}
        donationData={donationData}
      />
    </Box>
  );
}

export default Home;