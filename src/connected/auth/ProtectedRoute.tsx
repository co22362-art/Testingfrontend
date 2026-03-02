/**
 * PROTECTED ROUTE — OUR ZONE
 * ─────────────────────────────────────────────────────────
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * Shows a loading spinner while session is being recovered.
 */
import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Checking session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
