import { useState, ChangeEvent } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Settings,
  Search
} from 'lucide-react';
import PAAppLayout from '../../components/PAAppLayout';
import GroupPermissionsModal from './components/GroupPermissionsModal';

export interface User {
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

interface PeoplePageProps {
  users?: User[];
  isLoading?: boolean;
  onAddUser?: () => void;
  onEditUser?: (userId: number) => void;
  onImport?: () => void;
  onExport?: () => void;
  onSettingsClick?: () => void;
}

// Default mock data for Figma preview
const DEFAULT_USERS: User[] = [
  { id: 1, empCode: 'E002', name: 'Aditya EGIS', email: 'scipl_pc_001@outlook.com', role: 'Testing', department: 'Quality Testing', classification: 'QLT', status: 'ACTIVE' },
  { id: 2, empCode: 'E001', name: 'Aman EGIS', email: 'aman.spannovation@gmail.com', role: 'Director', department: 'Quality Testing', classification: 'Manager', status: 'ACTIVE' },
  { id: 3, empCode: 'INT-006', name: 'Aryan Rawat', email: 'aryanrawat4044@gmail.com', role: 'Programming', department: 'CSE', classification: 'ENG', status: 'ACTIVE' },
  { id: 4, empCode: 'INT-001', name: 'Jaspreet Kaur', email: 'jaspreet4143@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 5, empCode: 'INT-002', name: 'Jaspreet Kaur', email: 'jaspreetkaur786@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 6, empCode: 'INT-003', name: 'Nancy _', email: 'nancygujar012@gmail.com', role: 'Drafting', department: 'Drafting', classification: 'Draftsman', status: 'ACTIVE' },
  { id: 7, empCode: 'M001', name: 'Preeti Garg', email: 'mgmt.spannovation@gmail.com', role: 'Director', department: 'ENG', classification: 'Manager', status: 'ACTIVE' },
  { id: 8, empCode: 'INT-005', name: 'Shaurya Katna', email: 'shauryakatna7@gmail.com', role: 'Programming', department: 'CSE', classification: 'ENG', status: 'ACTIVE' },
  { id: 9, empCode: 'E003', name: 'Shivani Shukla', email: 'sshukla.structure@gmail.com', role: 'Testing', department: 'Quality Testing', classification: 'QLT', status: 'ACTIVE' },
  { id: 10, empCode: 'Try001', name: 'try', email: 'asing1@egscif.in', role: '—', department: '—', classification: '—', status: 'INACTIVE' },
];

export default function PeoplePage({
  users = DEFAULT_USERS,
  isLoading = false,
  onAddUser,
  onEditUser,
  onImport,
  onExport,
  onSettingsClick
}: PeoplePageProps) {
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

  if (isLoading) {
    return (
      <PAAppLayout activePage="people">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </PAAppLayout>
    );
  }

  return (
    <PAAppLayout activePage="people">
      {/* User Management Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-1">People Management</h1>
          <p className="text-sm text-muted-foreground">Manage users and access control</p>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          {/* Top Action Bar */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <button 
              onClick={onAddUser}
              className="h-9 px-4 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
            <button 
              className="h-9 px-4 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              onClick={() => setIsPermissionsModalOpen(true)}
            >
              Group Permissions
            </button>
            <button className="h-9 px-4 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors">
              Confirm Permissions
            </button>
            <button 
              onClick={() => selectedUsers.length > 0 && onEditUser?.(selectedUsers[0])}
              disabled={selectedUsers.length === 0}
              className={`h-9 px-4 rounded-lg font-medium border ${
                selectedUsers.length === 0
                  ? 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                  : 'bg-card border-border text-foreground hover:bg-accent'
              }`}
            >
              Edit User
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option>All</option>
                <option>ACTIVE</option>
                <option>INACTIVE</option>
              </select>

              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              >
                <option>All</option>
                <option>Director</option>
                <option>Testing</option>
                <option>Programming</option>
                <option>Drafting</option>
              </select>

              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option>All</option>
                <option>Quality Testing</option>
                <option>CSE</option>
                <option>Drafting</option>
                <option>ENG</option>
              </select>

              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.classification}
                onChange={(e) => setFilters({...filters, classification: e.target.value})}
              >
                <option>All</option>
                <option>QLT</option>
                <option>Manager</option>
                <option>ENG</option>
                <option>Draftsman</option>
              </select>

              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.supervisor}
                onChange={(e) => setFilters({...filters, supervisor: e.target.value})}
              >
                <option>All</option>
              </select>

              <select 
                className="h-9 px-3 pr-8 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.lineManager}
                onChange={(e) => setFilters({...filters, lineManager: e.target.value})}
              >
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Emp Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">Classification</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/30'} hover:bg-accent transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        {user.status === 'INACTIVE' && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        {user.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.empCode}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.role}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.department}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{user.classification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing 1-{users.length} of {users.length} users
            </div>
            
            <div className="flex items-center gap-2">
              {/* Pagination */}
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-medium text-sm">
                1
              </button>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={onImport}
                  className="h-9 px-4 bg-card border border-border text-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  IMPORT
                </button>
                <button 
                  onClick={onExport}
                  className="h-9 px-4 bg-card border border-border text-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  EXPORT
                </button>
                <button 
                  onClick={onSettingsClick}
                  className="h-9 px-4 bg-card border border-border text-foreground rounded-lg font-medium text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  SETTINGS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Permissions Modal */}
      <GroupPermissionsModal 
        isOpen={isPermissionsModalOpen} 
        onClose={() => setIsPermissionsModalOpen(false)} 
      />
    </PAAppLayout>
  );
}