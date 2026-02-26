/**
 * LOGIN CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `LoginPage` component and supply it with data.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import LoginPage from '../../app/modules/auth/LoginPage';
import { signIn } from '../services/auth';

export default function LoginConnected() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (credentials: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signIn(credentials.email, credentials.password);
            if (!result.success) {
                setError(result.message || 'Login failed. Please check your credentials.');
                return;
            }
            sessionStorage.setItem('pa_user', JSON.stringify(result.user));
            navigate('/people');
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
