import { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fade,
  CircularProgress,
  Alert,
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { styled } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import gallery1 from '../assets/figure1.jpg';
import gallery2 from '../assets/figure2.jpg';
import gallery3 from '../assets/figure3.jpg';
import video1 from '../assets/vid1.mp4';
import video2 from '../assets/vid2.mp4';
import video3 from '../assets/vid3.mp4';
import video4 from '../assets/vid4.mp4';
import video5 from '../assets/vid5.mp4';
import video6 from '../assets/vid6.mp4';

const galleryItems = [
  { type: 'image', src: gallery1, alt: 'Kegiatan Dakwah 1' },
  { type: 'image', src: gallery2, alt: 'Kegiatan Dakwah 2' },
  { type: 'image', src: gallery3, alt: 'Kegiatan Dakwah 3' },
  { type: 'video', src: video1, alt: 'Video Kegiatan Dakwah 1' },
  { type: 'video', src: video2, alt: 'Video Kegiatan Dakwah 2' },
  { type: 'video', src: video3, alt: 'Video Kegiatan Dakwah 2' },
  { type: 'video', src: video4, alt: 'Video Kegiatan Dakwah 2' },
  { type: 'video', src: video5, alt: 'Video Kegiatan Dakwah 2' },
  { type: 'video', src: video6, alt: 'Video Kegiatan Dakwah 2' },
];

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiTab-root': {
    fontWeight: 500,
    textTransform: 'none',
    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
    padding: theme.spacing(1, 2),
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  backgroundColor: theme.palette.background.paper,
  maxHeight: 400,
  overflowY: 'auto',
  [theme.breakpoints.down('sm')]: {
    maxHeight: 300,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledNewsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

function InfoTabs() {
  const [activeTab, setActiveTab] = useState('description');
  const [donors, setDonors] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState({ donors: true, news: true });
  const [error, setError] = useState({ donors: null, news: null });

  useEffect(() => {
    let isMounted = true;

    // Fetch donors
    const donorsQuery = query(collection(db, 'donors'), orderBy('date', 'desc'), limit(20));
    const unsubscribeDonors = onSnapshot(
      donorsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const donorList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDonors(donorList);
        setLoading((prev) => ({ ...prev, donors: false }));
      },
      (err) => {
        if (!isMounted) return;
        console.error('Error fetching donors:', err.message);
        setError((prev) => ({ ...prev, donors: 'Gagal memuat daftar donatur.' }));
        setLoading((prev) => ({ ...prev, donors: false }));
      }
    );

    // Fetch news
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(6));
    const unsubscribeNews = onSnapshot(
      newsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const newsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNews(newsList);
        setLoading((prev) => ({ ...prev, news: false }));
      },
      (err) => {
        if (!isMounted) return;
        console.error('Error fetching news:', err.message);
        setError((prev) => ({ ...prev, news: 'Gagal memuat berita.' }));
        setLoading((prev) => ({ ...prev, news: false }));
      }
    );

    return () => {
      isMounted = false;
      unsubscribeDonors();
      unsubscribeNews();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading.donors || loading.news) {
    return (
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </StyledCard>
    );
  }

  if (error.donors || error.news) {
    return (
      <StyledCard>
        <CardContent>
          <Alert severity="error">{error.donors || error.news}</Alert>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Info Tabs"
        >
          <Tab icon={<InfoIcon />} label="Deskripsi" value="description" />
          <Tab icon={<PeopleIcon />} label="Donatur" value="donors" />
          <Tab icon={<PhotoLibraryIcon />} label="Galeri" value="gallery" />
          <Tab icon={<NewspaperIcon />} label="Berita" value="news" />
        </StyledTabs>
        <Fade in timeout={600}>
          <Box>
            {activeTab === 'description' && (
              <Box>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Mengapa Infak Syiar Dakwah Islam?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, mb: { xs: 2, md: 3 } }}
                >
                  Dakwah adalah jantung umat Islam.
Melalui infak Anda, kami membangun masjid, menyebarkan Al-Qur'an, dan mengedukasi generasi muda tentang nilai-nilai Islam. Setiap rupiah yang Anda titipkan adalah langkah nyata menuju kebaikan abadi.

Teruntuk yatim, dhuafa, dan anak-anak terlantar,
infak Anda adalah cahaya harapan—membuka akses pendidikan, menguatkan iman, dan membangun masa depan yang lebih baik.


                </Typography>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Bagaimana Anda Dapat Berkontribusi?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, mb: { xs: 2, md: 3 } }}
                >
                  Dengan donasi mulai dari Rp 2.000, Anda bisa menjadi bagian dari misi suci ini. Pilih metode pembayaran yang mudah via QRIS, atau transfer BRI, dan lihat dampak nyata dari kebaikan Anda!
                </Typography>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Berkat Infak Anda
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, mb: { xs: 2, md: 3 } }}
                >
                  Ribuan Al-Qur’an telah tersebar, rumah ibadah berdiri, dan jutaan hati tersentuh oleh pesan damai Islam.
Infak Anda bukan sekadar pemberian—ia adalah benih kebaikan yang tumbuh dan memberi manfaat tanpa henti.

Bagi para yatim, dhuafa, dan anak-anak terlantar,
infak Anda menghadirkan harapan: pelita di tengah gelap, ilmu yang membimbing, dan kasih sayang yang menguatkan.
                </Typography>
              </Box>
            )}
            {activeTab === 'donors' && (
              <Box>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Daftar Donatur
                </Typography>
                {donors.length > 0 ? (
                  <StyledTableContainer component={Paper}>
                    <Table stickyHeader aria-label="Tabel Donatur">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <StyledTableCell sx={{ color: 'black', fontWeight: 600 }}>Nama</StyledTableCell>
                          <StyledTableCell sx={{ color: 'black', fontWeight: 600 }}>Jumlah</StyledTableCell>
                          <StyledTableCell sx={{ color: 'black', fontWeight: 600 }}>Tanggal</StyledTableCell>
                          <StyledTableCell sx={{ color: 'black', fontWeight: 600 }}>Status</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {donors.map((donor, index) => (
                          <TableRow
                            key={donor.id}
                            sx={{
                              '&:hover': { bgcolor: 'grey.100' },
                              bgcolor: index % 2 === 0 ? 'background.default' : 'grey.50',
                            }}
                          >
                            <StyledTableCell>{donor.name || 'Anonim'}</StyledTableCell>
                            <StyledTableCell>Rp {donor.amount.toLocaleString('id-ID')}</StyledTableCell>
                            <StyledTableCell>
                              {donor.date && donor.date.toDate
                                ? new Date(donor.date.toDate()).toLocaleDateString('id-ID')
                                : 'N/A'}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: donor.status === 'approved' ? 'success.main' : 'warning.main',
                                  fontWeight: 500,
                                }}
                              >
                                {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    Belum ada donatur. Jadilah yang pertama!
                  </Typography>
                )}
              </Box>
            )}
            {activeTab === 'gallery' && (
              <Box>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Galeri Kegiatan
                </Typography>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  {galleryItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '100%',
                        height: { xs: 150, sm: 180, md: 220 },
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.4s, box-shadow 0.4s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {item.type === 'image' ? (
                        <Box
                          component="img"
                          src={item.src}
                          alt={item.alt}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box
                          component="video"
                          src={item.src}
                          alt={item.alt}
                          controls
                          muted
                          autoPlay
                          loop
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Grid>
              </Box>
            )}
            {activeTab === 'news' && (
              <Box>
                <Typography
                  variant={{ xs: 'h5', md: 'h3' }}
                  gutterBottom
                  fontWeight={600}
                  sx={{ mb: { xs: 2, md: 3 } }}
                >
                  Berita Terkini
                </Typography>
                {news.length > 0 ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      },
                      gap: { xs: 1, sm: 2 },
                    }}
                  >
                    {news.map((article) => (
                      <StyledNewsCard key={article.id}>
                        <CardContent>
                          <Typography
                            variant={{ xs: 'h6', md: 'h5' }}
                            fontWeight={600}
                            sx={{ mb: 1 }}
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, fontSize: { xs: '0.85rem', md: '0.9rem' } }}
                          >
                            {article.summary}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', md: '0.8rem' } }}
                          >
                            {article.date && article.date.toDate
                              ? new Date(article.date.toDate()).toLocaleDateString('id-ID')
                              : 'N/A'}
                          </Typography>
                        </CardContent>
                      </StyledNewsCard>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    Belum ada berita tersedia.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Fade>
      </CardContent>
    </StyledCard>
  );
}

export default InfoTabs;