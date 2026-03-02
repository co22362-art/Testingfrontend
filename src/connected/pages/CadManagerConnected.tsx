/**
 * CAD MANAGER CONNECTED
 * ─────────────────────────────────────────────────────────
 * Since Figma hasn't generated a CAD Manager UI module yet,
 * we render a functional page that fetches real data from
 * the /api/cad/* endpoints (pa_3004_cad_manager backend).
 */
import { useState, useEffect } from 'react';
import PAAppLayout from '../../app/components/PAAppLayout';
import { getCadProjects, getCadRegisters, type CadProject, type DrawingRegister } from '../services/cadManager';

export default function CadManagerConnected() {
    const [projects, setProjects] = useState<CadProject[]>([]);
    const [registers, setRegisters] = useState<DrawingRegister[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load projects on mount
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const projectData = await getCadProjects();
            setProjects(projectData);
            // Load all registers initially
            const registerData = await getCadRegisters();
            setRegisters(registerData);
            setIsLoading(false);
        })();
    }, []);

    // When a project is selected, filter registers
    useEffect(() => {
        if (selectedProject === null) return;
        (async () => {
            const registerData = await getCadRegisters(selectedProject);
            setRegisters(registerData);
        })();
    }, [selectedProject]);

    return (
        <PAAppLayout>
            <div className="flex-1 overflow-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">CAD Manager</h1>
                    <p className="text-sm text-muted-foreground">Manage drawing registers and revisions</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-muted-foreground">Loading CAD data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6">
                        {/* Project Sidebar */}
                        <div className="col-span-3">
                            <div className="bg-card rounded-lg border border-border overflow-hidden">
                                <div className="px-4 py-3 border-b border-border bg-muted">
                                    <h2 className="text-sm font-semibold text-foreground">Projects ({projects.length})</h2>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto">
                                    {projects.length === 0 ? (
                                        <div className="p-4 text-sm text-muted-foreground text-center">No projects found</div>
                                    ) : (
                                        projects.map(project => (
                                            <button
                                                key={project.id}
                                                onClick={() => setSelectedProject(project.id)}
                                                className={`w-full text-left px-4 py-3 border-b border-border text-sm hover:bg-accent transition-colors ${selectedProject === project.id ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                                                    }`}
                                            >
                                                <div className="font-medium">{project.project_name}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{project.project_code}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Drawing Registers Table */}
                        <div className="col-span-9">
                            <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                                <div className="px-6 py-3 border-b border-border bg-muted flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-foreground">
                                        Drawing Registers ({registers.length})
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50 border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">#</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Drawing No.</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Series</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Ref No.</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Title</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Rev.</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {registers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                                                        {selectedProject ? 'No drawings found for this project' : 'Select a project to view drawings'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                registers.map((reg, i) => (
                                                    <tr key={reg.id} className={`${i % 2 === 0 ? 'bg-card' : 'bg-muted/30'} hover:bg-accent transition-colors`}>
                                                        <td className="px-4 py-3 text-xs text-foreground">{i + 1}</td>
                                                        <td className="px-4 py-3 text-xs text-foreground font-medium">{reg.drawing_number}</td>
                                                        <td className="px-4 py-3 text-xs text-foreground">{reg.drawing_series_code}</td>
                                                        <td className="px-4 py-3 text-xs text-foreground">{reg.ref_no}</td>
                                                        <td className="px-4 py-3 text-xs text-foreground">{reg.drawing_title || '—'}</td>
                                                        <td className="px-4 py-3 text-xs text-foreground">{reg.current_revision_code || '—'}</td>
                                                        <td className="px-4 py-3 text-xs">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                                                {reg.status || 'Active'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PAAppLayout>
    );
}
