import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

const DashboardHome = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{
                p: 4,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f5f5f5 100%)`,
                borderLeft: `4px solid #76030F`
            }}>
                <Typography variant="h4" component="h1" sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: '#76030F'
                }}>
                    Welcome to Admin Dashboard
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Manage your content efficiently with our intuitive dashboard. Get started by selecting an option from the sidebar.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/media')}
                        sx={{
                            backgroundColor: '#76030F',
                            '&:hover': { backgroundColor: '#5a020c' },
                            px: 4,
                            py: 1.5
                        }}
                    >
                        Manage Media
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/gallery')}
                        sx={{
                            color: '#76030F',
                            borderColor: '#76030F',
                            '&:hover': { borderColor: '#5a020c' },
                            px: 4,
                            py: 1.5
                        }}
                    >
                        Manage Gallery
                    </Button>
                </Box>
            </Paper>

            {/* Quick Stats Section */}
            <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap' }}>
                {[
                    { title: 'Total Media', value: '24', color: '#76030F' },
                    { title: 'Gallery Items', value: '56', color: '#1976d2' },
                    { title: 'Active Users', value: '3', color: '#388e3c' },
                ].map((stat, index) => (
                    <Paper key={index} sx={{
                        p: 3,
                        flex: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        borderTop: `4px solid ${stat.color}`
                    }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            color: stat.color,
                            mt: 1
                        }}>
                            {stat.value}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default DashboardHome;