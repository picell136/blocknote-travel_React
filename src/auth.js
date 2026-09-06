const USERS_KEY = 'my_journey_users';
const CURRENT_USER_KEY = 'my_journey_user';

function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function hashPassword(password, salt) {
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Пользователь с таким email уже зарегистрирован.');
  }

  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash,
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  return currentUser;
}

export async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === normalizedEmail);

  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error('Неверный email или пароль.');
  }

  const currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  return currentUser;
}
