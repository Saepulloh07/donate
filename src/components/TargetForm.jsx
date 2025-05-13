import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import StyledButton from './StyledButton';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const TargetForm = ({ newTarget, setNewTarget, handleUpdateTarget }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Atur Target Donasi
        </Typography>
        <Box component="form" onSubmit={handleUpdateTarget}>
          <TextField
            fullWidth
            label="Target Donasi (Rp)"
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            margin="normal"
            variant="outlined"
            inputProps={{ min: 0 }}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            Simpan Target
          </StyledButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TargetForm;