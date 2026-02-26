import { useState, useEffect, ChangeEvent } from 'react';
import {
  Plus,
  Download,
  Upload,
  Settings,
  Search,
  Loader2
} from 'lucide-react';
import PAAppLayout from '../../components/PAAppLayout';
import GroupPermissionsModal from './components/GroupPermissionsModal';
import { getEmployees, Employee } from '../../../services/people';

interface User {
  id: number;
  empCode: string;
  name: string;
  email: string;
  role: string;
  department: string;
  classification: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Filters {
  status: string;
  role: string;
  department: string;
  classification: string;
  supervisor: string;
  lineManager: string;
}

// Adapts API response fields to the shape the table expects
function toTableUser(e: Employee, index: number) {
  return {
    id: index + 1,
    empCode: e.employee_code || '—',
    name: e.name || '—',
    email: e.email || '—',
    role: e.role_title || '—',
    department: e.department || '—',
    classification: e.classification || '—',
    status: (e.status || 'INACTIVE') as 'ACTIVE' | 'INACTIVE',
  };
}

export default function PeoplePage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    status: 'All',
    role: 'All',
    department: 'All',
    classification: 'All',
    supervisor: 'All',
    lineManager: 'All'
  });

  // ---------------------------------------------------------------
  // Real data from pa_3012_people backend (port 3012 via Vite proxy)
  //
  // Flow: component mounts → getEmployees() → GET /api/employees
  //   → Vite proxy → http://localhost:3012/api/employees
  //   → backend reads company_id from cookie → queries Supabase
  //   → returns real employees
  // ---------------------------------------------------------------
  const [users, setUsers] = useState<ReturnType<typeof toTableUser>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployees().then((employees) => {
      setUsers(employees.map(toTableUser));
      setIsLoading(false);
    });
  }, []);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <PAAppLayout activePage="people">
      {/* User Management Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">People Management</h1>
          <p className="text-sm text-[#6B7280]">Manage users and access control</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
            <span className="ml-3 text-[#6B7280]">Loading employees...</span>
          </div>
        )}

        {!isLoading && (
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-sm">
            {/* Top Action Bar */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <button className="h-9 px-4 bg-[#1976D2] text-white rounded-lg font-medium hover:bg-[#1565C0] transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </button>
              <button
                className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setIsPermissionsModalOpen(true)}
              >
                Group Permissions
              </button>
              <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Confirm Permissions
              </button>
              <button className="h-9 px-4 bg-gray-100 border border-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed" disabled>
                Edit User
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
                <input
                  type="text"
                  placeholder="Search by name, email, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option>All</option>
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </select>

                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option>All</option>
                  <option>Director</option>
                  <option>Testing</option>
                  <option>Programming</option>
                  <option>Drafting</option>
                </select>

                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                >
                  <option>All</option>
                  <option>Quality Testing</option>
                  <option>CSE</option>
                  <option>Drafting</option>
                  <option>ENG</option>
                </select>

                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.classification}
                  onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                >
                  <option>All</option>
                  <option>QLT</option>
                  <option>Manager</option>
                  <option>ENG</option>
                  <option>Draftsman</option>
                </select>

                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.supervisor}
                  onChange={(e) => setFilters({ ...filters, supervisor: e.target.value })}
                >
                  <option>All</option>
                </select>

                <select
                  className="h-9 px-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1976D2] appearance-none cursor-pointer"
                  value={filters.lineManager}
                  onChange={(e) => setFilters({ ...filters, lineManager: e.target.value })}
                >
                  <option>All</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#1976D2] border-gray-300 rounded focus:ring-[#1976D2]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Emp Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Dept</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1976D2] uppercase tracking-wider">Classification</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 text-[#1976D2] border-gray-300 rounded focus:ring-[#1976D2]"
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        <div className="flex items-center gap-2">
                          {user.status === 'INACTIVE' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {user.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.empCode}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.role}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.department}</td>
                      <td className="px-4 py-3 text-xs text-gray-900">{user.classification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer with Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-[#9E9E9E]">
                Showing 1-{users.length} of {users.length} users
              </div>

              <div className="flex items-center gap-2">
                {/* Pagination */}
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1976D2] text-white font-medium text-sm">
                  1
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    IMPORT
                  </button>
                  <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    EXPORT
                  </button>
                  <button className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    SETTINGS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Group Permissions Modal */}
      <GroupPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
      />
    </PAAppLayout>
  );
}