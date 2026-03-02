/**
 * CAD MANAGER SERVICE — OUR ZONE (src/connected/services/)
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3004
 */

export interface CadProject {
    id: string;
    company_id: string;
    project_name: string;
    project_code: string;
    description?: string;
}

export interface DrawingRegister {
    id: string;
    company_id: string;
    project_id: string;
    project_group_id?: string;
    drawing_series_code: string;
    ref_no: string;
    drawing_number: string;
    drawing_title?: string;
    current_revision_code?: string;
    current_revision_date?: string;
    status?: string;
    attributes?: Record<string, unknown>;
}

export async function getCadProjects(): Promise<CadProject[]> {
    try {
        const res = await fetch('/api/cad/projects', { credentials: 'include' });
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data ?? []);
    } catch {
        return [];
    }
}

export async function getCadRegisters(projectId?: string): Promise<DrawingRegister[]> {
    try {
        let url = '/api/cad/registers';
        if (projectId) url += `?project_id=${projectId}`;
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data ?? []);
    } catch {
        return [];
    }
}
