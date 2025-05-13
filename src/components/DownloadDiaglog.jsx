import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '../assets/logo.png';
import signatureImage from '../assets/ttd.png';
import certificateImage from '../assets/certificate.jpg';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: 500,
    width: '90%',
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 600,
  color: '#fff',
  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    transform: 'translateY(-2px)',
  },
  margin: theme.spacing(1),
}));

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const dialogVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
};

// Helper function to convert number to Indonesian words
const numberToWords = (num) => {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  const thousands = ['', 'ribu', 'juta', 'miliar', 'triliun'];

  if (num === 0) return 'nol';

  const convertChunk = (n) => {
    let result = '';
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' ratus';
      n %= 100;
      if (n > 0) result += ' ';
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += ' ' + units[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }
    return result;
  };

  let result = '';
  let chunkIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      let chunkText = convertChunk(chunk);
      if (chunkIndex > 0) {
        if (chunk === 1 && chunkIndex === 1) {
          chunkText = 'seribu';
        } else {
          chunkText += ' ' + thousands[chunkIndex];
        }
        result = chunkText + (result ? ' ' + result : '');
      } else {
        result = chunkText;
      }
    }
    num = Math.floor(num / 1000);
    chunkIndex++;
  }

  return result + ' rupiah';
};

// Helper function to convert month to Roman numeral
const toRomanNumeral = (month) => {
  const romanMap = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romanMap[month - 1];
};

// Helper function to generate a random 4-digit number
const generateRandomInvoiceNumber = () => {
  const randomNum = Math.floor(Math.random() * (9999 - 1 + 1)) + 1; // Random number between 1 and 9999
  return String(randomNum).padStart(4, '0'); // Format as 4 digits (e.g., 0001 to 9999)
};

function DownloadDialog({ open, onClose, donationData }) {
  const handleDownloadInvoice = () => {
    try {
      // Set paper to landscape
      const doc = new jsPDF({ orientation: 'landscape' });

      // Generate random invoice number
      const formattedCounter = generateRandomInvoiceNumber();
      const currentDate = new Date();
      const monthRoman = toRomanNumeral(currentDate.getMonth() + 1);
      const year = currentDate.getFullYear();
      const invoiceNumber = `${formattedCounter}/${monthRoman}/${year}`;

      // Header: Organization Details on the right with smaller logo
      doc.addImage(logoImage, 'PNG', 230, 10, 30, 30); // Adjusted logo size and position for landscape
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('RUMAH QUR\'AN', 150, 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('SAYYIDAH NAFISAH', 150, 22, { align: 'center' });
      doc.text('TERUNTUK ANAK YATIM & DHU\'AFA', 150, 29, { align: 'center' });
      doc.text('rqs-office@gmail.com', 150, 36, { align: 'center' });

      // Invoice Title and Details on the left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Invoice', 15, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Number: ${invoiceNumber}`, 15, 30);
      doc.text(`Date: ${currentDate.toLocaleDateString('id-ID')}`, 15, 37);

      // Purchaser Information
      doc.setFontSize(10);
      doc.text('Purchaser Information', 15, 50);
      doc.text(`Name: ${donationData.name}`, 15, 57);
      doc.text(`Contact: ${donationData.contact || 'Not provided'}`, 15, 64);

      // Admin Information
      doc.text('Admin Nadzir', 150, 50, { align: 'center' });
      doc.text('Ahmad Sarmadi', 150, 57, { align: 'center' });
      doc.text('Rumah Quran Assyaidah Nafisah', 150, 64, { align: 'center' });

      // Line separator
      doc.setLineWidth(0.5);
      doc.setDrawColor(200);
      doc.line(15, 70, 275, 70);

      // Determine table content based on donation amount
      const tableBody = donationData.amount > 1000000
        ? [['Wakaf Uang', '1', `Rp ${donationData.amount.toLocaleString('id-ID')}`]]
        : [['Donasi', '1', `Rp ${donationData.amount.toLocaleString('id-ID')}`]];

      // Donation Table
      autoTable(doc, {
        startY: 75,
        head: [['Description', 'Quantity', 'Amount']],
        body: tableBody,
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 4,
          textColor: [33, 33, 33],
          fillColor: [245, 245, 245],
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [66, 165, 245],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        margin: { left: 15, right: 15 },
      });

      // Note and Signature Section
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text(`Terbilang: ${numberToWords(donationData.amount)}`, 15, finalY);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Sesungguhnya Tuhanmu melapangkan rezeki bagi siapa yang dikehendaki-Nya di antara hamba-hamba-Nya dan menyempitkan bagi (siapa yang dikehendaki-Nya). Dan barang apa saja yang kamu nafkahkan, maka Allah akan menggantinya dan Dialah Pemberi rezeki yang sebaik-baiknya.',
        15,
        finalY + 10,
        { maxWidth: 120 }
      );
      doc.text('Thank you', 15, finalY + 40);

      // Date and Signature on the right
      doc.text(`Serang, ${currentDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, 230, finalY, { align: 'center' });
      doc.addImage(signatureImage, 'PNG', 200, finalY + 5, 60, 30, null, 'FAST', 1);
      doc.text('Ahmad Sarmadi, S.E., M.Si', 230, finalY + 40, { align: 'center' });

      // Save PDF
      doc.save(`Invoice_${donationData.name}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Terjadi kesalahan saat membuat invoice. Silakan coba lagi.');
    }
  };

  const handleDownloadCertificate = () => {
    try {
      const link = document.createElement('a');
      link.href = certificateImage;
      link.download = `Certificate_${donationData.name}_${Date.now()}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Sertifikat tidak tersedia. Silakan hubungi dukungan di info@rumahquran.org.');
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div variants={dialogVariants} initial="hidden" animate={open ? 'visible' : 'exit'}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 1 }}>
          <DownloadIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={700} component="div">
            Unduh Dokumen Donasi
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Silakan unduh invoice dan sertifikat donasi Anda.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <StyledButton variant="contained" onClick={handleDownloadInvoice}>
                Unduh Invoice
              </StyledButton>
            </motion.div>
            {donationData.amount > 1000000 && (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <StyledButton variant="contained" onClick={handleDownloadCertificate}>
                  Unduh Sertifikat
                </StyledButton>
              </motion.div>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={onClose}
            color="secondary"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </motion.div>
    </StyledDialog>
  );
}

export default DownloadDialog;