import { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';
import hero1 from '../assets/figure2.jpg';
import hero2 from '../assets/figure3.jpg';
import hero3 from '../assets/figure1.jpg';

const images = [
  { src: hero1, alt: 'Dakwah Islam: Masjid dan Komunitas' },
  { src: hero2, alt: 'Dakwah Islam: Penyebaran Al-Qur\'an' },
  { src: hero3, alt: 'Dakwah Islam: Edukasi Generasi Muda' },
];

const carouselStyles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    maxHeight: '900px', // Membatasi tinggi maksimum untuk layar besar
  },
  slider: {
    display: 'flex',
    width: `${images.length * 100}%`,
    height: '100%',
    transition: 'transform 0.8s ease-in-out',
  },
  slide: {
    width: `${100 / images.length}%`,
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(65%)',
    loading: 'lazy',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    bgcolor: 'rgba(0,0,0,0.7)',
    color: 'white',
    '&:hover': {
      bgcolor: 'rgba(0,0,0,0.9)',
      transform: 'translateY(-50%) scale(1.1)',
    },
    borderRadius: '50%',
    p: { xs: 0.5, sm: 1 },
    fontSize: { xs: '0.8rem', sm: '1rem' },
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    textShadow: '0 3px 6px rgba(0,0,0,0.6)',
    width: { xs: '90%', sm: '80%', md: '70%' },
    px: { xs: 1, sm: 2 },
  },
  ctaButton: {
    mt: { xs: 1, sm: 2, md: 3 },
    bgcolor: 'primary.main',
    color: 'white',
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 0.5, sm: 1, md: 1.5 },
    borderRadius: '30px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
    '&:hover': {
      bgcolor: 'primary.dark',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      transform: 'translateY(-3px)',
    },
  },
  dotsContainer: {
    position: 'absolute',
    bottom: { xs: 15, sm: 20, md: 30 },
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: { xs: 0.5, sm: 1 },
  },
  dot: {
    width: { xs: 8, sm: 10 },
    height: { xs: 8, sm: 10 },
    borderRadius: '50%',
    bgcolor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  activeDot: {
    bgcolor: 'white',
  },
};

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleDonateClick = () => {
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
      donationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  return (
    <Box sx={carouselStyles.container} {...swipeHandlers}>
      <Box sx={{ ...carouselStyles.slider, transform: `translateX(-${currentIndex * (100 / images.length)}%)` }}>
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image.src}
            alt={image.alt}
            sx={carouselStyles.slide}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/1200x675?text=Gambar+Gagal+Dimuat')}
          />
        ))}
      </Box>
      <IconButton
        sx={{ ...carouselStyles.navButton, left: { xs: 10, sm: 15, md: 20 } }}
        onClick={handlePrev}
        aria-label="Slide sebelumnya"
      >
        <ArrowBackIos fontSize="inherit" />
      </IconButton>
      <IconButton
        sx={{ ...carouselStyles.navButton, right: { xs: 10, sm: 15, md: 20 } }}
        onClick={handleNext}
        aria-label="Slide berikutnya"
      >
        <ArrowForwardIos fontSize="inherit" />
      </IconButton>
      <Box sx={carouselStyles.textOverlay}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, mb: { xs: 1, sm: 2 } }}
        >
          Lembaga Kesejahteraan Sosial "RQSN"
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }, mb: { xs: 1, sm: 2 } }}
        >
          Pesan Damai Islam Menjalar Luas! Bersama, wujudkan dakwah yang berdampak! 🙌
        </Typography>
        <Button
          onClick={handleDonateClick}
          sx={carouselStyles.ctaButton}
          variant="contained"
        >
          Donasi Sekarang
        </Button>
      </Box>
      <Box sx={carouselStyles.dotsContainer}>
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              ...carouselStyles.dot,
              ...(index === currentIndex ? carouselStyles.activeDot : {}),
            }}
            onClick={() => handleDotClick(index)}
            aria-label={`Pilih slide ${index + 1}`}
          />
        ))}
      </Box>
    </Box>
  );
}

export default HeroCarousel;