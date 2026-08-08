import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Outlet, useNavigate } from 'react-router-dom';

import styles from "../../styles/Layout.module.css";
import myJourneyLogo from '../../images/my_journey_.png';


const YANDEX_CLIENT_ID = 'c49b3c44d22e4ed2a4653b74253643d6';
const REDIRECT_URI = `${window.location.origin}/blocknote-travel_React/auth/callback`;

const Layout = () => {
  const navigate = useNavigate();

  // Состояние пользователя (пока храним в localStorage для простоты)
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('yandex_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Состояния для меню
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Функция входа через Яндекс
  const handleYandexLogin = () => {
    handleCloseUserMenu();

    const state = crypto.randomUUID();
    sessionStorage.setItem('yandex_oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: YANDEX_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state,
    });

    window.location.href = `https://oauth.yandex.ru/authorize?${params}`;
  };

  // Функция выхода
  const handleLogout = () => {
    handleCloseUserMenu();
    localStorage.removeItem('yandex_user');
    setUser(null);
    navigate('/');
  };

  // Формируем пункты меню в зависимости от авторизации
  const userMenuItems = user
    ? [
        { label: 'Профиль', action: () => { handleCloseUserMenu(); navigate('/profile'); } },
        { label: 'Выйти', action: handleLogout },
      ]
    : [
        { label: 'Войти через Яндекс', action: handleYandexLogin },
      ];

  return (
    <div className={styles.layout}>
      <img className={styles.bigLogo} src={myJourneyLogo} alt="My Journey" />
      <AppBar 
        position="sticky" 
      sx={{
        top: '25px', 
        margin: '0 auto',
        left: 0,     
        right: 0,    
        width: '95%',
        border: '1px solid rgba(255, 255, 255, 0.55)',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.35)',
        boxShadow: '0 12px 40px rgba(10, 40, 70, 0.25)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        backdropFilter: 'blur(14px) saturate(1.2)',
        color: '#041b4d', 
      }}
        >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters
          >
            {/* Логотип для десктопа */}
            <img className={styles.logo} src={myJourneyLogo} alt="My Journey" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MY_JOURNEY
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MY_JOURNEY
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />

            {/* Аватар / Кнопка пользователя */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user ? `Вы вошли как ${user.first_name}` : 'Открыть меню'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user ? user.first_name : 'Гость'}
                    src={user?.avatar_url || '/static/images/avatar/2.jpg'}
                  />
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
        <div className={styles.subcontainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;