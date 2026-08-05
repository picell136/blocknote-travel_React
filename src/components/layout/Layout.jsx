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
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
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
      <AppBar position="static" sx={{ margin: 0, width: '100%' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Логотип для десктопа */}
            <img className={styles.logo} src={myJourneyLogo} alt="My Journey" />
            <img className={styles.logo2} src={myJourneyLogo} alt="My Journey" />
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

            {/* Мобильное меню (бургер) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {/* Здесь можно добавить навигационные пункты */}
              </Menu>
            </Box>

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