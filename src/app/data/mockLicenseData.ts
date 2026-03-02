// Types
export interface Company {
  id: string;
  name: string;
  employeeCount: number;
  pendingApprovals: number;
}

export interface Software {
  id: string;
  displayName: string;
  softwareKey: string;
  enabled: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  status: 'approved' | 'pending' | 'revoked';
  validUpto: string | null;
}

export interface ModuleAccess {
  softwareName: string;
  modules: string[];
}

// Mock Data - Companies
export const mockCompanies: Company[] = [
  { id: '1', name: 'structIQe Technologies', employeeCount: 12, pendingApprovals: 3 },
  { id: '2', name: 'EGIS Group', employeeCount: 8, pendingApprovals: 0 },
  { id: '3', name: 'Spannovation Group', employeeCount: 15, pendingApprovals: 1 },
  { id: '4', name: 'AmanCompany', employeeCount: 5, pendingApprovals: 0 },
];

// Mock Data - Software (Kill Switches)
export const mockSoftware: Software[] = [
  { id: '1', displayName: 'PROJECT Assist Desktop', softwareKey: 'PA_DESKTOP_V2', enabled: true },
  { id: '2', displayName: 'PROJECT Assist', softwareKey: 'PA_WEB_V2', enabled: true },
  { id: '3', displayName: 'CAD Assist', softwareKey: 'CAD_ASSIST_V1', enabled: true },
  { id: '4', displayName: 'STRUCT Assist', softwareKey: 'STRUCT_ASSIST_V1', enabled: true },
  { id: '5', displayName: 'License Management', softwareKey: 'LICENSE_MGMT_V1', enabled: false },
];

// Mock Data - Employees
export const mockEmployees: Employee[] = [
  { id: '1', name: 'Varun Garg', email: 'vgarg@structiqe.com', status: 'approved', validUpto: '2027-02-10' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@structiqe.com', status: 'pending', validUpto: null },
  { id: '3', name: 'Michael Chen', email: 'mchen@structiqe.com', status: 'approved', validUpto: '2026-12-31' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily.r@structiqe.com', status: 'revoked', validUpto: '2025-06-15' },
];

// Mock Data - Module Access Permissions
export const mockModuleAccess: ModuleAccess[] = [
  { 
    softwareName: 'PROJECT Assist Desktop', 
    modules: ['Project Group Manager', 'Project Manager', 'Mail Manager', 'IT Manager', 'User Manager'] 
  },
  { 
    softwareName: 'PROJECT Assist', 
    modules: ['Project Group Manager', 'Project Manager', 'Mail Manager', 'Timesheets', 'CAD Manager'] 
  },
];
