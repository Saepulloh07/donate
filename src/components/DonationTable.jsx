import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock'; // Add missing import
import DownloadIcon from '@mui/icons-material/Download'; // Add missing import
import StyledButton from './StyledButton';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  overflowX: 'auto',
}));

const DonationTable = ({
  pendingDonations,
  handleApprove,
  handleReject,
  handleDownloadPDF,
  handlePasswordDialogOpen,
}) => {
  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Daftar Donasi Pending
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<LockIcon />}
            onClick={handlePasswordDialogOpen}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Ganti Password
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Download Rekap PDF
          </StyledButton>
        </Box>
      </Box>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Nama
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Jumlah
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Nomor Telepon
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Metode
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Tanggal
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  py: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingDonations.map((donation) => (
              <TableRow key={donation.id} sx={{ '&:hover': { bgcolor: 'grey.100' } }}>
                <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 1 }}>
                  {donation.name || 'N/A'}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 1 }}>
                  Rp {(donation.amount || 0).toLocaleString('id-ID')}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 1 }}>
                  {donation.phone || donation.email || 'N/A'}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 1 }}>
                  {(donation.method || 'N/A').charAt(0).toUpperCase() +
                    (donation.method || '').slice(1)}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 1 }}>
                  {donation.date && donation.date.seconds
                    ? new Date(donation.date.seconds * 1000).toLocaleDateString('id-ID')
                    : 'N/A'}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <StyledButton
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(donation.id)}
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, px: 1.5, py: 0.5 }}
                    >
                      Setujui
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleReject(donation.id)}
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, px: 1.5, py: 0.5 }}
                    >
                      Tolak
                    </StyledButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {pendingDonations.length === 0 && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 3, color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Tidak ada donasi pending saat ini.
        </Typography>
      )}
    </>
  );
};

export default DonationTable;