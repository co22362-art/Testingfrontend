import { createBrowserRouter, Outlet } from 'react-router';
import NotFoundPage from './modules/errors/NotFoundPage';
import LoginPage from './modules/auth/LoginPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import DailyWinsPage from './modules/daily-wins/DailyWinsPage';
import PeoplePage from './modules/people/PeoplePage';

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
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
