/**
 * CONNECTED APP
 * OUR ZONE — uses our connected router, not Figma's.
 * main.tsx renders this instead of src/app/App.tsx
 */
import { RouterProvider } from 'react-router';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import { AuthProvider } from './auth/AuthContext';
import { connectedRouter } from './routes';

export default function ConnectedApp() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={connectedRouter} />
            </AuthProvider>
        </ThemeProvider>
    );
}
