/**
 * PROJECTS CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `ProjectsPage` component.
 * ProjectsPage currently manages its own state internally.
 * This wrapper exists for future API integration.
 */
import ProjectsPage from '../../app/modules/3002_projects/ProjectsPage';

export default function ProjectsConnected() {
    return <ProjectsPage />;
}
