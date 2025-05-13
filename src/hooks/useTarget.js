import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const useTarget = () => {
  const [target, setTarget] = useState(0);
  const [newTarget, setNewTarget] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    let isMounted = true;

    const fetchTarget = async () => {
      try {
        const targetDoc = await getDoc(doc(db, 'settings', 'target'));
        if (isMounted) {
          if (targetDoc.exists()) {
            setTarget(targetDoc.data().amount || 0);
          } else {
            await setDoc(doc(db, 'settings', 'target'), { amount: 0 });
            setTarget(0);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching target:', error.message);
        setSnackbar({
          open: true,
          message:
            error.code === 'permission-denied'
              ? 'Akses ditolak: Anda tidak memiliki izin untuk mengakses data.'
              : 'Gagal memuat target: ' + error.message,
          severity: 'error',
        });
      }
    };

    fetchTarget();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateTarget = async (e) => {
    e.preventDefault();
    const targetAmount = parseInt(newTarget);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      setSnackbar({
        open: true,
        message: 'Target donasi harus berupa angka positif.',
        severity: 'error',
      });
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'target'), { amount: targetAmount });
      setTarget(targetAmount);
      setNewTarget('');
      setSnackbar({
        open: true,
        message: 'Target donasi berhasil diperbarui.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating target:', error.message);
      setSnackbar({
        open: true,
        message:
          error.code === 'permission-denied'
            ? 'Akses ditolak: Anda tidak memiliki izin untuk memperbarui target.'
            : 'Gagal memperbarui target donasi: ' + error.message,
        severity: 'error',
      });
    }
  };

  return { target, newTarget, setNewTarget, handleUpdateTarget, setSnackbar };
};

export default useTarget;