import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, CircularProgress, Alert } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';

function DonationProgress() {
  const [progressData, setProgressData] = useState({
    collectedAmount: 0,
    targetAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeDonors = () => {};
    let unsubscribeTarget = () => {};

    const fetchData = () => {
      try {
        // Fetch targetAmount from settings/target
        const targetRef = doc(db, 'settings', 'target');
        unsubscribeTarget = onSnapshot(
          targetRef,
          (docSnap) => {
            if (!isMounted) return;
            const targetAmount = docSnap.exists() && docSnap.data().amount ? docSnap.data().amount : 0;
            setProgressData((prev) => ({ ...prev, targetAmount }));
          },
          (err) => {
            if (!isMounted) return;
            console.error('Error fetching target amount:', err.message);
            setError('Gagal memuat target donasi.');
            setLoading(false);
          }
        );

        // Fetch collectedAmount from approved donors
        const donorsQuery = query(collection(db, 'donors'), where('status', '==', 'approved'));
        unsubscribeDonors = onSnapshot(
          donorsQuery,
          (snapshot) => {
            if (!isMounted) return;
            let collectedAmount = 0;
            snapshot.forEach((doc) => {
              collectedAmount += doc.data().amount || 0;
            });
            setProgressData((prev) => ({ ...prev, collectedAmount }));
            setLoading(false);
          },
          (err) => {
            if (!isMounted) return;
            console.error('Error fetching donations:', err.message);
            setError('Gagal memuat data donasi.');
            setLoading(false);
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.error('Unexpected error:', err.message);
        setError('Terjadi kesalahan saat memuat data.');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      unsubscribeDonors();
      unsubscribeTarget();
    };
  }, []);

  const { collectedAmount = 0, targetAmount = 0 } = progressData;
  const progress = targetAmount > 0 ? Math.min((collectedAmount / targetAmount) * 100, 100) : 0;

  if (loading) {
    return (
      <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <MonetizationOnIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h2" align="center">
            Pengumpulan Donasi
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Typography variant="body1" fontWeight={500}>
            Target: Rp {targetAmount.toLocaleString('id-ID')}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            Terkumpul: Rp <span id="collected">{collectedAmount.toLocaleString('id-ID')}</span>
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 20,
            borderRadius: 10,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', transition: 'width 1s ease-in-out' },
          }}
        />
        <Typography variant="caption" align="center" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
          {progress.toFixed(1)}% dari target tercapai
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DonationProgress;