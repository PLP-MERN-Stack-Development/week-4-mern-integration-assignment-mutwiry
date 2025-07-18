import React from 'react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0} sx={{
      background: '#fff',
      borderRadius: 3,
      boxShadow: 3,
      mt: 2,
      mx: { xs: 1, sm: 2, md: 6 },
      px: 2
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 900,
              color: '#222',
              textDecoration: 'none',
              fontFamily: 'Pacifico, cursive',
              letterSpacing: 2,
              fontSize: '2rem',
              textShadow: '1px 2px 8px #fff8',
            }}
          >
            <span role="img" aria-label="blog">📝</span> Blog App
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              {user?.role === 'admin' && (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/create-post">
                  <Typography textAlign="center">Create Post</Typography>
                </MenuItem>
              )}
              {user?.role === 'admin' && (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/admin">
                  <Typography textAlign="center">Admin</Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/about">
                <Typography textAlign="center">About</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/contact">
                <Typography textAlign="center">Contact</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 900,
              color: '#222',
              textDecoration: 'none',
              fontFamily: 'Pacifico, cursive',
              letterSpacing: 2,
              fontSize: '1.5rem',
              textShadow: '1px 2px 8px #fff8',
            }}
          >
            <span role="img" aria-label="blog">📝</span> Blog App
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
            >
              Home
            </Button>
            {user?.role === 'admin' && (
              <Button
                component={RouterLink}
                to="/create-post"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
              >
                Create Post
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button
                component={RouterLink}
                to="/manage-categories"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
              >
                Manage Categories
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button
                component={RouterLink}
                to="/manage-users"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
              >
                Manage Users
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/about"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
            >
              About
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: '#222', display: 'block', fontWeight: 700, letterSpacing: 2 }}
            >
              Contact
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.username} src="/static/images/avatar/2.jpg" sx={{ border: '2px solid #43c6ac', boxShadow: 2 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  variant="outlined"
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  variant="contained"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 