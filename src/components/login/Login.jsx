import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, register } from '../../auth';
import styles from '../../styles/Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const isRegistration = mode === 'register';

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (isRegistration && form.name.trim().length < 2) {
      setError('Введите имя длиной не менее 2 символов.');
      return;
    }

    if (form.password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistration) {
        await register(form);
      } else {
        await login(form);
      }
      navigate('/', { replace: true });
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isRegistration ? 'login' : 'register');
    setError('');
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <h1 id="auth-title">{isRegistration ? 'Регистрация' : 'Вход'}</h1>
        <p className={styles.description}>
          {isRegistration ? 'Создайте учётную запись для путевых заметок.' : 'Войдите в свою учётную запись.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isRegistration && (
            <label>
              Имя
              <input name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
          </label>
          <label>
            Пароль
            <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete={isRegistration ? 'new-password' : 'current-password'} required />
          </label>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Подождите…' : isRegistration ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <button type="button" className={styles.switchButton} onClick={switchMode}>
          {isRegistration ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </section>
    </main>
  );
}