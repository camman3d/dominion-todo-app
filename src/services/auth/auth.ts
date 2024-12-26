import {User} from "./AuthContext.tsx";

const AuthStorage = localStorage;

interface Jwt {
    sub: string,
    email: string,
    name: string,
    exp: number,
}

type AuthResponse = {
    data?: User,
    error?: string,
}

function parseToken(token: string): User | null {
    if (token) {
        try {
            const payloadJson = atob(token.split('.')[1]);
            const jwt = JSON.parse(payloadJson) as Jwt;
            // Check expiration
            const now = new Date().getTime() / 1000;
            if (jwt && jwt.exp > now) {
                return {id: Number(jwt.sub), email: jwt.email, name: jwt.name};
            }
        } catch (e) {
            console.error('Could not parse JWT');
            console.error(e);
        }
    }
    return null;
}

export function authHeader() {
    return {'Authorization': `Bearer ${AuthStorage.getItem('session')}`,}
}

const auth = {
    getSession(): User | null {
        const token = AuthStorage.getItem('session');
        return parseToken(token ?? '');
    },

    // TODO: Refresh token

    async signUp(email: string, password: string): Promise<AuthResponse> {
        const url = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/users';
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (!response.ok) {
                return {error: result.detail};
            }
            return {data: result};
        } catch (e: unknown) {
            return {error: (e as Error).message}
        }
    },

    async signIn(email: string, password: string): Promise<AuthResponse> {
        const url = import.meta.env.VITE_API_HOST + '/token';
        const body = new FormData();
        body.set('username', email);
        body.set('password', password);
        try {
            const response = await fetch(url, {
                method: 'POST',
                body,
            });
            const result = await response.json();
            if (!response.ok) {
                return {error: result.detail};
            }
            if (result.token_type !== 'bearer') {
                console.error('Unsupported token type: ' + result.token_type);
                return {error: 'Could not log in'};
            }

            // Save to session
            const token = result.access_token;
            AuthStorage.setItem('session', token);
            const user = parseToken(token);
            if (!user)
                return {error: 'Could not log in'};
            return {data: result};
        } catch (e: unknown) {
            return {error: (e as Error).message}
        }
    },

    signOut() {
        AuthStorage.removeItem('session');
    }
}
export default auth;