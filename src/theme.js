import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#28a745',
      dark: '#218838',
    },
    background: {
      default: '#f4f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontSize: '3.5rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    h3: { fontSize: '1.8rem', fontWeight: 600 },
    body1: { fontSize: '1.1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          padding: '12px 40px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;