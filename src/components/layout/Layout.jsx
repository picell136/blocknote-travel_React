import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AUTH_CHANGE_EVENT, getCurrentUser, logout } from '../../auth';
import styles from "../../styles/Layout.module.css";
import myJourneyLogo from '../../images/my_journey_.png';

const Layout = () => {

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  const navigate = useNavigate();

  const [user, setUser] = React.useState(getCurrentUser);

  // Состояния для меню
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  React.useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());

    window.addEventListener(AUTH_CHANGE_EVENT, updateUser);
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogin = () => {
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    setUser(null);
    navigate('/login');
  };

  const userMenuItems = user
    ? [
        { label: 'Выйти', action: handleLogout },
      ]
    : [
        { label: 'Войти', action: handleLogin },
      ];

  return (
    <div className={styles.layout}>
      <Box
        component="img"
        className={styles.bigLogo}
        src={myJourneyLogo}
        alt="My Journey"
        sx={{ display: { xs: 'none', lg: 'block' } }}
      />
      <AppBar 
        position="sticky" 
      sx={{
        top: { xs: '10px', md: '25px' },
        margin: '0 auto',
        left: 0,     
        right: 0,    
        width: { xs: '98%', md: '95%' },
        border: '1px solid rgba(255, 255, 255, 0.55)',
        borderRadius: { xs: '16px', md: '24px' },
        background: 'rgba(255, 255, 255, 0.35)',
        boxShadow: '0 12px 40px rgba(10, 40, 70, 0.25)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        backdropFilter: 'blur(14px) saturate(1.2)',
        color: '#041b4d', 
      }}
        >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar 
            disableGutters
            sx={{ minHeight: { xs: 56, md: 64 }, py: { xs: 0.5, md: 0 } }}
          >
            {/* Логотип для десктопа */}
            <img className={styles.logo} src={myJourneyLogo} alt="My Journey" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/blocknote-travel_React/"
              sx={{
                mr: 2,
                display: { md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MY_JOURNEY
            </Typography>

            <Box sx={{ flexGrow: 1, display: { md: 'flex' } }} />

            {/* Аватар / Кнопка пользователя */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user ? `Вы вошли как ${user.name}` : 'Открыть меню'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || 'Гость'}
                  >
                    {user ? user.name.charAt(0).toUpperCase() : 'Г'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenuItems.map((item) => (
                  <MenuItem key={item.label} onClick={item.action}>
                    <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <div className={styles.container}>
        {isLoginPage ? (
          <Outlet />
        ) : (
          <div className={styles.subcontainer}>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;