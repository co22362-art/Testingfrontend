/**
 * AUTH SERVICE — OUR ZONE (src/connected/services/)
 * ──────────────────────────────────────────────────
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3000
 */
export interface SignInResult {
    success: boolean;
    message?: string;
    user?: { name?: string; email?: string; company?: string };
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
    const res = await fetch('/api/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || 'Login failed' };
    return { success: true, user: json.user };
}

export async function signOut(): Promise<void> {
    await fetch('/api/signout', { method: 'POST', credentials: 'include' });
}
