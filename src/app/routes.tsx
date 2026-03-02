import { createBrowserRouter, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import NotFoundPage from './modules/errors/NotFoundPage';
import PAAppLayout from './components/PAAppLayout';

const LoginPage = lazy(() => import('./modules/3000_user_login/LoginPage'));
const DashboardPage = lazy(() => import('./modules/3001_homepage/DashboardPage'));
const ProjectsPage = lazy(() => import('./modules/3002_projects/ProjectsPage'));
const MailPage = lazy(() => import('./modules/3003_mail/MailPage'));
const DailyWinsPage = lazy(() => import('./modules/3010_daily_wins/DailyWinsPage'));
const ProjectGroupPage = lazy(() => import('./modules/3011_project_groups/ProjectGroupPage'));
const PeoplePage = lazy(() => import('./modules/3012_people/PeoplePage'));
const TutorialsPage = lazy(() => import('./modules/3013_tutorials/TutorialsPage'));
const SettingsPage = lazy(() => import('./modules/3014_settings/SettingsPage'));
const LicensesPage = lazy(() => import('./modules/3021_licenses/LicensesPage'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">
    Loading...
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withSuspense(LoginPage) },
      { path: 'dashboard', element: withSuspense(DashboardPage) },
      { path: 'home', element: <PAAppLayout><div className="p-6 text-muted-foreground">Home — coming soon</div></PAAppLayout> },
      { path: 'project', element: withSuspense(ProjectsPage) },
      { path: 'mail', element: <Suspense fallback={<LoadingFallback />}><PAAppLayout><MailPage /></PAAppLayout></Suspense> },
      { path: 'cadmanager', element: <PAAppLayout><div className="p-6 text-muted-foreground">CAD Manager — coming soon</div></PAAppLayout> },
      { path: 'timesheets', element: <PAAppLayout><div className="p-6 text-muted-foreground">Time Sheets — coming soon</div></PAAppLayout> },
      { path: 'daily-wins', element: withSuspense(DailyWinsPage) },
      { path: 'project-group', element: withSuspense(ProjectGroupPage) },
      { path: 'people', element: withSuspense(PeoplePage) },
      { path: 'tutorials', element: withSuspense(TutorialsPage) },
      { path: 'forms', element: <PAAppLayout><div className="p-6 text-muted-foreground">Forms — coming soon</div></PAAppLayout> },
      { path: 'licenses', element: withSuspense(LicensesPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);