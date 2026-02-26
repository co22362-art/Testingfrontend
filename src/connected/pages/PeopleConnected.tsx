/**
 * PEOPLE CONNECTED PAGE
 * ─────────────────────────────────────────────────────────
 * OUR ZONE: Real employee data from pa_3012_people backend.
 *
 * Atoms from Figma used here:
 *   PAAppLayout  → src/app/components/PAAppLayout.tsx
 *   
 * Visual reference: src/app/modules/people/PeoplePage.tsx
 *   (DO NOT EDIT THAT FILE — Figma owns it)
 * ─────────────────────────────────────────────────────────
 */
import { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Download, Upload, Settings, Search, Loader2 } from 'lucide-react';
import PAAppLayout from '../../app/components/PAAppLayout';
import GroupPermissionsModal from '../../app/modules/people/components/GroupPermissionsModal';
import { getEmployees, Employee } from '../../services/people';

// Map API shape → table row shape
function toRow(e: Employee, i: number) {
    return {
        id: i + 1,
        empCode: e.employee_code || '—',
        name: e.name || '—',
        email: e.email || '—',
        role: e.role_title || '—',
        department: e.department || '—',
        classification: e.classification || '—',
        status: (e.status || 'INACTIVE') as 'ACTIVE' | 'INACTIVE',
    };
}

export default function PeopleConnected() {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [filters, setFilters] = useState({ status: 'All', role: 'All', department: 'All', classification: 'All', supervisor: 'All', lineManager: 'All' });

    // ── Real data from pa_3012_people (port 3012 via Vite proxy) ──
    const [users, setUsers] = useState<ReturnType<typeof toRow>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getEmployees().then(employees => {
            setUsers(employees.map(toRow));
            setIsLoading(false);
        });
    }, []);
    // ─────────────────────────────────────────────────────────────

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) =>
        setSelectedIds(e.target.checked ? users.map(u => u.id) : []);

    const handleSelectUser = (id: number) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const filteredUsers = users.filter(u => {
        const q = searchTerm.toLowerCase();
        if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.empCode.toLowerCase().includes(q)) return false;
        if (filters.status !== 'All' && u.status !== filters.status) return false;
        return true;
    });

    return (
        <PAAppLayout activePage="people">
            <div className="flex-1 overflow-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#111827] mb-1">People Management</h1>
                    <p className="text-sm text-[#6B7280]">Manage users and access control</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
                        <span className="ml-3 text-[#6B7280]">Loading employees...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-sm">
                        {/* Action Bar */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                            <button className="h-9 px-4 bg-[#1976D2] text-white rounded-lg font-medium hover:bg-[#1565C0] transition-colors flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add User
                            </button>
                            <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                onClick={() => setIsPermissionsOpen(true)}>Group Permissions</button>
                            <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Confirm Permissions</button>
                            <button className="h-9 px-4 bg-gray-100 border border-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed" disabled>Edit User</button>
                        </div>

                        {/* Filter Bar */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                            <div className="flex-1 max-w-md relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
                                <input type="text" placeholder="Search by name, email, or code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full h-9 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2]" />
                            </div>
                            <div className="flex items-center gap-2 flex-1 justify-end">
                                {(['status', 'role', 'department', 'classification'] as const).map(key => (
                                    <select key={key} value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                                        className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none capitalize">
                                        <option>All</option>
                                        {key === 'status' && <><option>ACTIVE</option><option>INACTIVE</option></>}
                                    </select>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F9FAFB] border-b border-gray-200">
                                    <tr>
                                        <th className="w-12 px-4 py-3">
                                            <input type="checkbox" checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0} onChange={handleSelectAll}
                                                className="w-4 h-4 text-[#1976D2] border-gray-300 rounded" />
                                        </th>
                                        {['#', 'Status', 'Emp Code', 'Name', 'Email', 'Role', 'Dept', 'Classification'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                            <td className="px-4 py-3">
                                                <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleSelectUser(user.id)}
                                                    className="w-4 h-4 text-[#1976D2] border-gray-300 rounded" />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    {user.status === 'INACTIVE' && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                                                    {user.id}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.empCode}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.name}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.email}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.role}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.department}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{user.classification}</td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">No employees found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-[#9E9E9E]">Showing {filteredUsers.length} of {users.length} users</div>
                            <div className="flex items-center gap-2">
                                {[Upload, Download, Settings].map((Icon, i) => (
                                    <button key={i} className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {['IMPORT', 'EXPORT', 'SETTINGS'][i]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <GroupPermissionsModal isOpen={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} />
        </PAAppLayout>
    );
}
