import { createBrowserRouter, Outlet } from 'react-router';
import NotFoundPage from './modules/errors/NotFoundPage';
import LoginPage from './modules/3000_user_login/LoginPage';
import DashboardPage from './modules/3001_homepage/DashboardPage';
import DailyWinsPage from './modules/3010_daily_wins/DailyWinsPage';
import PeoplePage from './modules/3012_people/PeoplePage';
import SettingsPage from './modules/3014_settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, Component: LoginPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'daily-wins', Component: DailyWinsPage },
      { path: 'people', Component: PeoplePage },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);