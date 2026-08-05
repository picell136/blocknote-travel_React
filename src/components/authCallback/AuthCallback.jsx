// src/components/authCallback/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = sessionStorage.getItem('yandex_oauth_state');

    if (!code || !state || state !== savedState) {
      navigate('/login?error=invalid_state');
      return;
    }

    sessionStorage.removeItem('yandex_oauth_state');

    // ⚠️ Здесь должен быть запрос на ваш backend для обмена code на token
    // Для демонстрации пока просто имитируем успешный вход
    // В реальном проекте замените на fetch('/api/auth/yandex/callback', ...)

    const mockUser = {
      id: '123',
      first_name: 'Иван',
      last_name: 'Петров',
      avatar_url: null, // или URL аватара из Яндекса
    };

    localStorage.setItem('yandex_user', JSON.stringify(mockUser));
    navigate('/');
  }, [navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      Завершаем вход через Яндекс...
    </div>
  );
}