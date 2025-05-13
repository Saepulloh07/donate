// src/hooks/useDonation.js
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function useDonation({ donationData, proof, setSnackbar, setDialogOpen, setLoading }) {
  const navigate = useNavigate();
  const [loading, setLoadingState] = useState(false);

  const handleTryPayRedirect = useCallback(() => {
    setSnackbar({
      open: true,
      message: `Mengalihkan ke TryPay untuk pembayaran Rp ${donationData.amount.toLocaleString('id-ID')}...`,
      severity: 'info',
    });
    // In production: window.location.href = `https://trypay.com/pay?amount=${donationData.amount}&name=${encodeURIComponent(donationData.name)}&phone=${encodeURIComponent(donationData.phone)}`;
  }, [donationData, setSnackbar]);

  const validateDonationData = () => {
    // Validate amount
    if (typeof donationData.amount !== 'number' || donationData.amount < 2000) {
      return 'Jumlah donasi harus minimal Rp 10.000.';
    }
    // Validate string fields
    if (typeof donationData.name !== 'string' || donationData.name.trim() === '') {
      return 'Nama donatur harus diisi.';
    }
    if (typeof donationData.phone !== 'string' || donationData.phone.trim() === '') {
      return 'Nomor telepon harus diisi.';
    }
    if (typeof donationData.method !== 'string' || donationData.method.trim() === '') {
      return 'Metode pembayaran harus dipilih.';
    }
    return null; // No validation errors
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!proof && donationData.method !== 'trypay') {
        setSnackbar({
          open: true,
          message: 'Mohon unggah bukti pembayaran.',
          severity: 'warning',
        });
        return;
      }

      // Validate donation data before proceeding
      const validationError = validateDonationData();
      if (validationError) {
        setSnackbar({
          open: true,
          message: validationError,
          severity: 'warning',
        });
        return;
      }

      if (donationData.method !== 'trypay') {
        setDialogOpen(true);
      } else {
        setLoadingState(true);
        try {
          const status = donationData.amount <= 1000000 ? 'approved' : 'pending';
          await addDoc(collection(db, 'donors'), {
            name: donationData.name,
            amount: donationData.amount,
            phone: donationData.phone,
            method: donationData.method,
            date: new Date(),
            status,
          });
          setSnackbar({
            open: true,
            message: 'Donasi berhasil disimpan. Lanjutkan pembayaran di TryPay.',
            severity: 'success',
          });
          setTimeout(() => handleTryPayRedirect(), 2000);
        } catch (error) {
          console.error('Error processing donation:', error.message);
          setSnackbar({
            open: true,
            message: 'Terjadi kesalahan saat menyimpan donasi: ' + error.message,
            severity: 'error',
          });
        } finally {
          setLoadingState(false);
        }
      }
    },
    [proof, donationData, handleTryPayRedirect, setSnackbar, setDialogOpen]
  );

  const handleConfirmWhatsApp = useCallback(async () => {
    setLoadingState(true);
    setDialogOpen(false);

    // Validate donation data before proceeding
    const validationError = validateDonationData();
    if (validationError) {
      setLoadingState(false);
      setSnackbar({
        open: true,
        message: validationError,
        severity: 'warning',
      });
      return;
    }

    try {
      const status = donationData.amount <= 1000000 ? 'approved' : 'pending';
      await addDoc(collection(db, 'donors'), {
        name: donationData.name,
        amount: donationData.amount,
        phone: donationData.phone,
        method: donationData.method,
        date: new Date(),
        status,
      });

      const message = `Bukti Transfer Donasi\nNama: ${donationData.name}\nNomor Telepon: ${donationData.phone}\nJumlah: Rp ${donationData.amount.toLocaleString('id-ID')}\nMetode: ${donationData.method.charAt(0).toUpperCase() + donationData.method.slice(1)}\n\n Mohon lampirkan file bukti pembayaran (JPG, PNG, atau PDF) dalam chat ini.`;
      const whatsappUrl = `https://wa.me/6281296337953?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setSnackbar({
        open: true,
        message: 'Donasi berhasil disimpan. Silakan kirim bukti via WhatsApp.',
        severity: 'success',
      });
      navigate(
        `/?showDownloadDialog=true&name=${encodeURIComponent(donationData.name)}&amount=${donationData.amount}&phone=${encodeURIComponent(donationData.phone)}&method=${encodeURIComponent(donationData.method)}`
      );
    } catch (error) {
      console.error('Error processing donation:', error.message);
      setSnackbar({
        open: true,
        message: 'Terjadi kesalahan saat menyimpan donasi: ' + error.message,
        severity: 'error',
      });
    } finally {
      setLoadingState(false);
    }
  }, [donationData, navigate, setSnackbar, setDialogOpen]);

  return { loading, handleSubmit, handleTryPayRedirect, handleConfirmWhatsApp };
}

export default useDonation;