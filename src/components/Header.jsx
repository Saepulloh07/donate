import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user && user.email && user.email.match(/.*@admin\.com/);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Memanggil fungsi logout dari AuthContext
      navigate('/'); // Mengarahkan ke halaman utama setelah logout
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const menuItems = isAdmin
    ? [
        { text: 'Tambah Berita', path: '/admin/news' },
        { text: 'Dashboard', path: '/admin/dashboard' },
        { text: 'Logout', action: handleLogout },
      ]
    : [{ text: 'Login Dashboard', path: '/admin/login' }];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'primary.main', height: '100%', color: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
                setMobileOpen(false);
              }}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          RQSN
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              onClick={item.action ? item.action : () => navigate(item.path)}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;