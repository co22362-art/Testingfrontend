/**
 * DASHBOARD CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `DashboardPage` component and supply it with data.
 * TODO: Wire to a real dashboard API when available.
 */
import { useNavigate } from 'react-router';
import DashboardPage from '../../app/modules/3001_homepage/DashboardPage';

export default function DashboardConnected() {
    const navigate = useNavigate();

    const handleQuickAction = (path: string) => {
        navigate(path);
    };

    // Uses Figma's built-in default mock data for now.
    // When a real dashboard API exists, fetch stats/activity here
    // and pass them as props.
    return (
        <DashboardPage
            onQuickAction={handleQuickAction}
        />
    );
}
