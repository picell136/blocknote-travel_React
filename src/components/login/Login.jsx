const CLIENT_ID = 'c49b3c44d22e4ed2a4653b74253643d6';

const REDIRECT_URI = `${window.location.origin}/blocknote-travel_React/auth/callback`;

export default function Login() {
    const handleLogin = () => {
        const state = crypto.randomUUID();

        sessionStorage.setItem('yandex_oauth_state', state);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            state,
        });

        window.location.href = `https://oauth.yandex.ru/authorize?${params}`;
    };

    return (
        <button onClick={handleLogin}>
            Войти через Яндекс
        </button>
    );
}