/**
 * CONNECTED APP
 * OUR ZONE — uses our connected router, not Figma's.
 * main.tsx renders this instead of src/app/App.tsx
 */
import { RouterProvider } from 'react-router';
import { connectedRouter } from './routes';

export default function ConnectedApp() {
    return <RouterProvider router={connectedRouter} />;
}
