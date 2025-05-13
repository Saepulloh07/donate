// src/components/ProofUpload.jsx
import { Box, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Document, Page, pdfjs } from 'react-pdf';
import CircularProgress from '@mui/material/CircularProgress';

// Set up react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: 200,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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

function ProofUpload({
  proof,
  previewUrl,
  isPdf,
  pdfLoadError,
  loading,
  handleProofChange,
  handleSubmit,
}) {
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Unggah Bukti Pembayaran
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Unggah bukti pembayaran Anda (JPG, PNG, atau PDF). Bukti akan dikirim ke WhatsApp admin untuk verifikasi.
      </Typography>
      <TextField
        fullWidth
        type="file"
        label="Bukti Pembayaran"
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: 'image/jpeg,image/png,application/pdf' }}
        onChange={handleProofChange}
        required
        margin="normal"
        variant="outlined"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: 'primary.main' },
          },
        }}
        disabled={loading}
      />
      {previewUrl && !isPdf && <PreviewImage src={previewUrl} alt="Preview" />}
      {previewUrl && isPdf && !pdfLoadError && (
        <Box sx={{ mt: 2, maxWidth: 300 }}>
          <Document
            file={previewUrl}
            onLoadError={(error) => {
              console.error('Failed to load PDF:', error.message);
              setPdfLoadError(true);
            }}
          >
            <Page pageNumber={1} width={300} />
          </Document>
        </Box>
      )}
      <StyledButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Memproses...' : 'Kirim Bukti ke WhatsApp'}
      </StyledButton>
    </Box>
  );
}

export default ProofUpload;