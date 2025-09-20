import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router';
import logo from "../../public/img/logo.png"; // Adjust the path as necessary

const drawerWidth = 240;

const navItems = [
  { name: 'Media', path: '/media' },
  { name: 'Press', path: '/press' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Article', path: '/article' },
  {
    name: 'Hakku Initiative',
    path: '',
    subItems: [
      { name: 'Videos', path: '/hakku/videos' },
      { name: 'Press Coverage', path: '/hakku/press_coverage' },
      { name: 'Press Release', path: '/hakku/press_release' }
    ]
  },
  {
    name: 'Rural Distress',
    path: '',
    subItems: [
      { name: 'Rural Distress', path: '/rural-distress' },
      { name: 'Photos', path: '/rural-distress/photos' },
      { name: 'Conference', path: '/rural-distress/conference' },
      { name: 'Books', path: '/rural-distress/books' },
      { name: 'Articles', path: '/rural-distress/articles' }
      // { name: 'Press Release', path: '/hakku/press_release' }
    ]
  },
  { name: 'National Politics', path: '/national_politics' },
  { name: "Today's Events", path: '/today_events' },
  { name: 'Policy Interventions', path: '/policy-interventions' },
  // { name: 'Rural Distribution', path: '/rural-distribution' },
  // { name: 'Initiatives', path: '/initiatives' },
  // { name: 'Awards', path: '/awards' },
  { name: 'Journalism', path: '/journalism' },
  // New Profile menu with sub-items
  {
    name: 'Profile',
    path: '',
    subItems: [
      { name: 'Bio', path: '/profile/bio' },
      { name: 'Photos', path: '/profile/photos' },
      { name: 'Articles', path: '/profile/articles' }
    ]
  },
  { name: 'Podcast', path: '/podcast' },

];

const DashboardLayout = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuToggle = (menuName) => {
    setOpenMenus(prevState => ({
      ...prevState,
      [menuName]: !prevState[menuName]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64 // Matching the AppBar height
      }}>
        {/* Logo Image */}
        <img
          src={logo}
          alt="Logo"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.name}>
            {item.subItems ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuToggle(item.name)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(118, 3, 15, 0.1)',
                        '& .MuiListItemText-primary': {
                          color: '#76030F',
                          fontWeight: 'bold'
                        }
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(118, 3, 15, 0.1)'
                      }
                    }}
                  >
                    <ListItemText primary={item.name} />
                    {openMenus[item.name] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openMenus[item.name]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.name}
                        selected={location.pathname === subItem.path}
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: 4,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(118, 3, 15, 0.1)',
                            '& .MuiListItemText-primary': {
                              color: '#76030F',
                              fontWeight: 'bold'
                            }
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(118, 3, 15, 0.1)'
                          }
                        }}
                      >
                        <ListItemText primary={subItem.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(118, 3, 15, 0.1)',
                      '& .MuiListItemText-primary': {
                        color: '#76030F',
                        fontWeight: 'bold'
                      }
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(118, 3, 15, 0.1)'
                    }
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: '#76030F',
            justifyContent: 'flex-start',
            textTransform: 'none'
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  // Rest of your component remains the same...
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#76030F' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0,0,0,0.1)'
                  }
                }
              }}
              sx={{
                width: isMobile ? '100%' : '400px',
                '& .MuiInputBase-input': {
                  color: '#76030F'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#76030F',
                  opacity: 1
                }
              }}
            />
          </Box>
          <IconButton>
            <Avatar sx={{ bgcolor: '#76030F' }}>U</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '1px 0 3px rgba(0,0,0,0.1)'
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { sm: 2, md: 4 },
          py: { sm: 2, md: 2 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f9f9f9',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;