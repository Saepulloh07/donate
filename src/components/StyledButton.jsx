import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '24px',
  textTransform: 'none',
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  transition: 'background-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.8, 2),
    fontSize: '0.85rem',
  },
}));

export default StyledButton;