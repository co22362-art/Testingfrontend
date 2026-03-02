/**
 * AUTH CONTEXT — OUR ZONE
 * ─────────────────────────────────────────────────────────
 * Global authentication state for the connected app.
 * 
 * On mount: calls /api/me to recover session from cookies.
 * On login: calls /api/signin, stores user + access + allowedModules.
 * On 401: attempts /api/refresh, retries once.
 * On logout: calls /api/signout, clears state, redirects to /.
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    company_id: string | null;
    company_name: string | null;
}

interface NavModule {
    id: string;
    to: string;
    label: string;
    perms: string[];
}

interface AuthContextType {
    user: User | null;
    access: Record<string, boolean>;
    allowedModules: NavModule[];
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Wrapper for fetch that auto-refreshes on 401 and retries once.
 */
async function fetchWithRefresh(url: string, options?: RequestInit): Promise<Response> {
    const res = await fetch(url, { ...options, credentials: 'include' });
    if (res.status === 401) {
        // Attempt refresh
        const refreshRes = await fetch('/api/refresh', { method: 'POST', credentials: 'include' });
        if (refreshRes.ok) {
            // Retry original request with new cookies
            return fetch(url, { ...options, credentials: 'include' });
        }
    }
    return res;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [access, setAccess] = useState<Record<string, boolean>>({});
    const [allowedModules, setAllowedModules] = useState<NavModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Recover session on mount via /api/me
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetchWithRefresh('/api/me');
                if (res.ok) {
                    const json = await res.json();
                    if (!cancelled && json.success) {
                        setUser(json.user);
                        setAccess(json.access || {});
                        setAllowedModules(json.allowedModules || []);
                    }
                }
            } catch {
                // No session — user needs to log in
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch('/api/signin', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                return { success: false, message: json.message || 'Login failed' };
            }
            setUser(json.user);
            setAccess(json.access || {});
            setAllowedModules(json.allowedModules || []);
            return { success: true };
        } catch {
            return { success: false, message: 'Unable to connect to the server.' };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch('/api/signout', { method: 'POST', credentials: 'include' });
        } catch { /* ignore */ }
        setUser(null);
        setAccess({});
        setAllowedModules([]);
        sessionStorage.removeItem('pa_user');
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            access,
            allowedModules,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
