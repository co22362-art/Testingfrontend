/**
 * CONNECTED ROUTES
 * ─────────────────────────────────────────────────────────
 * OUR ZONE: This file is never touched by Figma Make.
 *
 * All routes point to connected pages in ./pages/
 * which wire real backend data into Figma's UI atoms.
 *
 * Figma's own routing lives in src/app/routes.tsx and is
 * kept purely as visual reference — it is never rendered
 * in the actual application.
 * ─────────────────────────────────────────────────────────
 */
import { createBrowserRouter } from 'react-router';
import LoginConnected from './pages/LoginConnected';
import PeopleConnected from './pages/PeopleConnected';
import DailyWinsConnected from './pages/DailyWinsConnected';

export const connectedRouter = createBrowserRouter([
    { path: '/', element: <LoginConnected /> },
    { path: '/people', element: <PeopleConnected /> },
    { path: '/daily-wins', element: <DailyWinsConnected /> },
]);
