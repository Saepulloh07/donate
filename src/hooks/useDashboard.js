import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [fetchLoading, setFetchLoading] = useState(true);

  // Derived data using useMemo
  const { pendingDonations, approvedDonations, totalDonations, pieChartData } = useMemo(() => {
    const pending = donations.filter((d) => d.status === 'pending');
    const approved = donations.filter((d) => d.status === 'approved');
    const total = approved.reduce((sum, doc) => sum + (doc.amount || 0), 0);
    return {
      pendingDonations: pending,
      approvedDonations: approved,
      totalDonations: total,
      pieChartData: [
        { id: 0, value: approved.length, label: 'Approved', color: '#4caf50' },
        { id: 1, value: pending.length, label: 'Pending', color: '#ff9800' },
      ],
    };
  }, [donations]);

  // Fetch donations
  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    const fetchDonations = async () => {
      try {
        const donationsQuery = query(collection(db, 'donors'));
        unsubscribe = onSnapshot(
          donationsQuery,
          (snapshot) => {
            if (!isMounted) return;
            const donationList = snapshot.docs.map((doc) => {
              const data = doc.data();
              // Auto-approve donations ≤ 1,000,000 IDR
              const status = data.amount <= 1000000 ? 'approved' : data.status || 'pending';
              return {
                id: doc.id,
                ...data,
                status,
              };
            });
            setDonations(donationList);
            setFetchLoading(false);
          },
          (error) => {
            if (!isMounted) return;
            console.error('Error fetching donations:', error.message);
            setSnackbar({
              open: true,
              message:
                error.code === 'permission-denied'
                  ? 'Akses ditolak: Anda tidak memiliki izin untuk melihat donasi.'
                  : 'Gagal memuat donasi: ' + error.message,
              severity: 'error',
            });
            setFetchLoading(false);
          }
        );
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching donations:', error.message);
        setSnackbar({
          open: true,
          message:
            error.code === 'permission-denied'
              ? 'Akses ditolak: Anda tidak memiliki izin untuk mengakses data.'
              : 'Gagal memuat data: ' + error.message,
          severity: 'error',
        });
        setFetchLoading(false);
      }
    };

    fetchDonations();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Handle approve donation
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'donors', id), { status: 'approved' });
      setSnackbar({
        open: true,
        message: 'Donasi berhasil disetujui.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error approving donation:', error.message);
      setSnackbar({
        open: true,
        message:
          error.code === 'permission-denied'
            ? 'Akses ditolak: Anda tidak memiliki izin untuk memperbarui donasi.'
            : 'Gagal menyetujui donasi: ' + error.message,
        severity: 'error',
      });
    }
  };

  // Handle reject donation
  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'donors', id));
      setSnackbar({
        open: true,
        message: 'Donasi telah ditolak dan dihapus.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error rejecting donation:', error.message);
      setSnackbar({
        open: true,
        message:
          error.code === 'permission-denied'
            ? 'Akses ditolak: Anda tidak memiliki izin untuk menghapus donasi.'
            : 'Gagal menolak donasi: ' + error.message,
        severity: 'error',
      });
    }
  };

  // Handle download PDF
  const handleDownloadPDF = (target) => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const percentage = target > 0 ? ((totalDonations / target) * 100).toFixed(2) : 0;

      // Header
      doc.setFontSize(18);
      doc.setTextColor(25, 118, 210);
      doc.text('Rekapitulasi Donasi', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Lembaga Kesejahteraan Sosial "RQSN" - ${currentDate}`, 105, 30, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.setDrawColor(25, 118, 210);
      doc.line(20, 35, 190, 35);

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Ringkasan Donasi', 20, 50);
      doc.setFontSize(10);
      doc.text(`Total Donasi Terkumpul: Rp ${totalDonations.toLocaleString('id-ID')}`, 20, 60);
      doc.text(`Target Donasi: Rp ${target.toLocaleString('id-ID')}`, 20, 68);
      doc.text(`Persentase Pencapaian: ${percentage}%`, 20, 76);

      // Donations Table
      doc.setFontSize(12);
      doc.text('Data Donasi', 20, 90);
      const columns = ['Nama', 'Jumlah', 'Nomor Telepon', 'Metode', 'Tanggal', 'Status'];
      const rows = donations.map((donation) => [
        donation.name || 'N/A',
        `Rp ${(donation.amount || 0).toLocaleString('id-ID')}`,
        donation.phone || donation.email || 'N/A',
        (donation.method || 'N/A').charAt(0).toUpperCase() + (donation.method || '').slice(1),
        donation.date && donation.date.seconds
          ? new Date(donation.date.seconds * 1000).toLocaleDateString('id-ID')
          : 'N/A',
        donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
      ]);

      doc.autoTable({
        head: [columns],
        body: rows.length ? rows : [['Tidak ada data donasi', '', '', '', '', '']],
        startY: 95,
        theme: 'grid',
        headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
        margin: { left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
        },
      });

      // Footer
      const lastTableY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        'Dokumen ini dibuat oleh sistem manajemen donasi Wakaf.',
        105,
        lastTableY,
        { align: 'center' }
      );
      doc.text(
        'Hubungi: +62 812-9633-7953 | rqsn.org',
        105,
        lastTableY + 5,
        { align: 'center' }
      );

      doc.save(`Rekapitulasi_Donasi_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      setSnackbar({
        open: true,
        message: `Gagal menghasilkan PDF: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    donations,
    fetchLoading,
    snackbar,
    handleApprove,
    handleReject,
    handleDownloadPDF,
    pendingDonations,
    approvedDonations,
    totalDonations,
    pieChartData,
    handleCloseSnackbar,
    setSnackbar, // Export setSnackbar
  };
};

export default useDonations;