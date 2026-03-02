/**
 * LOGIN CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `LoginPage` component, using AuthContext for login.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import LoginPage from '../../app/modules/3000_user_login/LoginPage';
import { useAuth } from '../auth/AuthContext';

export default function LoginConnected() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const handleSubmit = async (credentials: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await login(credentials.email, credentials.password);
            if (!result.success) {
                setError(result.message || 'Login failed. Please check your credentials.');
                return;
            }
            navigate('/dashboard');
        } catch {
            setError('Unable to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoginPage
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
        />
    );
}
