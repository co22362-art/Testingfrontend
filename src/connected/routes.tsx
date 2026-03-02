/**
 * CONNECTED ROUTES
 * ─────────────────────────────────────────────────────────
 * OUR ZONE: This file is never touched by Figma Make.
 *
 * All authenticated routes are wrapped with ProtectedRoute.
 * Login is public. Everything else requires valid session.
 * ─────────────────────────────────────────────────────────
 */
import { createBrowserRouter, Outlet } from 'react-router';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginConnected from './pages/LoginConnected';
import DashboardConnected from './pages/DashboardConnected';
import ProjectsConnected from './pages/ProjectsConnected';
import MailConnected from './pages/MailConnected';
import PeopleConnected from './pages/PeopleConnected';
import DailyWinsConnected from './pages/DailyWinsConnected';
import ProjectGroupsConnected from './pages/ProjectGroupsConnected';
import TutorialsConnected from './pages/TutorialsConnected';
import SettingsConnected from './pages/SettingsConnected';
import LicensesConnected from './pages/LicensesConnected';
import CadManagerConnected from './pages/CadManagerConnected';
import NotFoundPage from '../app/modules/errors/NotFoundPage';

const protect = (element: React.ReactNode) => (
    <ProtectedRoute>{element}</ProtectedRoute>
);

export const connectedRouter = createBrowserRouter([
    {
        path: '/',
        Component: () => <Outlet />,
        errorElement: <NotFoundPage />,
        children: [
            // Public
            { index: true, element: <LoginConnected /> },
            { path: 'login', element: <LoginConnected /> },

            // Protected modules
            { path: 'dashboard', element: protect(<DashboardConnected />) },
            { path: 'projects', element: protect(<ProjectsConnected />) },
            { path: 'project', element: protect(<ProjectsConnected />) },
            { path: 'mails', element: protect(<MailConnected />) },
            { path: 'mail', element: protect(<MailConnected />) },
            { path: 'people', element: protect(<PeopleConnected />) },
            { path: 'daily-wins', element: protect(<DailyWinsConnected />) },
            { path: 'project-groups', element: protect(<ProjectGroupsConnected />) },
            { path: 'project-group', element: protect(<ProjectGroupsConnected />) },
            { path: 'tutorials', element: protect(<TutorialsConnected />) },
            { path: 'settings', element: protect(<SettingsConnected />) },
            { path: 'license-management', element: protect(<LicensesConnected />) },
            { path: 'licenses', element: protect(<LicensesConnected />) },
            { path: 'cadmanager', element: protect(<CadManagerConnected />) },

            // Catch-all
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
