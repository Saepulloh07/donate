import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';

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

const DonationSummary = ({ totalDonations, target, progress, pieChartData }) => {
  return (
    <StyledCard>
      <CardContent>
        {totalDonations !== undefined ? (
          <>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total Donasi Terkumpul
            </Typography>
            <Typography
              variant="h4"
              color="primary.main"
              sx={{ fontWeight: 700, mb: 1.5 }}
            >
              Rp {totalDonations.toLocaleString('id-ID')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              dari target Rp {target.toLocaleString('id-ID')}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 5 },
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontWeight: 500 }}
            >
              {progress.toFixed(2)}% tercapai
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Distribusi Status Donasi
            </Typography>
            {pieChartData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    innerRadius: 30,
                    outerRadius: 80,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={180}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'center' },
                    padding: 0,
                  },
                }}
                sx={{
                  ...pieChartData, // If pieChartData contains sx props, merge them
                  '& .MuiChartsLegend-root': {
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  },
                }}
              />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: 'center' }}
              >
                Tidak ada data donasi untuk ditampilkan.
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default DonationSummary;