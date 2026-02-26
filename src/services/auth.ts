/**
 * AUTH SERVICE
 * Connects to pa_3000_user_login (port 3000) via Vite proxy.
 * All requests use credentials: 'include' so the browser
 * automatically sends/receives the HttpOnly auth cookies
 * (sb_access, sb_refresh) set by the backend.
 */

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    company_id: string | null;
    company_name: string | null;
}

export interface SignInResponse {
    success: boolean;
    user?: AuthUser;
    access?: Record<string, boolean>;
    allowedModules?: { id: string; to: string; label: string }[];
    message?: string;
}

/**
 * Sign in with email + password.
 * Backend sets sb_access and sb_refresh cookies on success.
 */
export async function signIn(email: string, password: string): Promise<SignInResponse> {
    const res = await fetch('/api/signin', {
        method: 'POST',
        credentials: 'include',          // ← sends/receives cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

/**
 * Get the currently logged-in user from the session cookie.
 * Returns null if not authenticated.
 */
export async function getMe(): Promise<AuthUser | null> {
    try {
        const res = await fetch('/api/me', {
            credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.user : null;
    } catch {
        return null;
    }
}

/**
 * Sign out — clears auth cookies on the backend.
 */
export async function signOut(): Promise<void> {
    await fetch('/api/signout', {
        method: 'POST',
        credentials: 'include',
    });
}
