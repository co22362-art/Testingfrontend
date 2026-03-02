import { useState, useEffect, useRef } from 'react';
import PAAppLayout from '../../components/PAAppLayout';
import PASidebarHeader from '../../components/ui/PASidebarHeader';
import PASidebarCard from '../../components/ui/PASidebarCard';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Check,
  X,
  Calendar,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { Checkbox } from '../../components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import PAButton from '../../components/ui/PAButton';
import PAInput from '../../components/ui/PAInput';
import {
  mockCompanies,
  mockSoftware,
  mockEmployees,
  mockModuleAccess,
  type Company,
  type Software,
  type Employee,
  type ModuleAccess
} from '@/app/data/mockLicenseData';

const STORAGE_KEY = 'licenses-sidebar-width';
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 220;
const MAX_WIDTH = 600;

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function LicensesPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [killSwitchExpanded, setKillSwitchExpanded] = useState(true);
  const [softwareList, setSoftwareList] = useState<Software[]>(mockSoftware);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
  });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  
  // Modal states
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [deleteCompanyOpen, setDeleteCompanyOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  // Form states
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');

  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const handleToggleSoftware = (softwareId: string) => {
    setSoftwareList(prev =>
      prev.map(sw => sw.id === softwareId ? { ...sw, enabled: !sw.enabled } : sw)
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleCancelChanges = () => {
    setSoftwareList(mockSoftware);
    setHasUnsavedChanges(false);
  };

  const handleSelectEmployee = (employee: Employee) => {
    if (selectedEmployee?.id === employee.id) {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(employee);
    }
  };

  const handleCheckEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.length === mockEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(mockEmployees.map(e => e.id));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'revoked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAddCompany = () => {
    // Mock implementation
    console.log('Adding company:', { newCompanyName, newAdminEmail, newAdminName });
    setAddCompanyOpen(false);
    setNewCompanyName('');
    setNewAdminEmail('');
    setNewAdminName('');
  };

  const handleEditCompany = () => {
    // Mock implementation
    console.log('Editing company:', editCompanyName);
    setEditCompanyOpen(false);
    setEditCompanyName('');
  };

  const handleDeleteCompany = () => {
    // Mock implementation
    console.log('Deleting company:', companyToDelete?.name);
    setDeleteCompanyOpen(false);
    setCompanyToDelete(null);
    setSelectedCompany(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth.current + delta));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, sidebarWidth]);

  return (
    <PAAppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Company List */}
        <div 
          style={{ width: `${sidebarWidth}px` }}
          className="border-r border-border flex flex-col bg-card relative"
        >
          {/* Header */}
          <PASidebarHeader
            title="Companies"
            searchValue={companySearch}
            onSearchChange={setCompanySearch}
            onAdd={() => setAddCompanyOpen(true)}
          />
            
          {/* Company List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No companies found
              </div>
            ) : (
              <div className="p-2">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="relative">
                    <PASidebarCard
                      initials={getInitials(company.name)}
                      title={company.name}
                      subtitle={`${company.employeeCount} employees`}
                      isSelected={selectedCompany?.id === company.id}
                      tags={company.pendingApprovals > 0 ? [{ label: `${company.pendingApprovals} pending`, variant: 'warning' }] : []}
                      onClick={() => setSelectedCompany(company)}
                      actions={
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-accent text-muted-foreground transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditCompanyName(company.name);
                                setEditCompanyOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompanyToDelete(company);
                                setDeleteCompanyOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-border hover:bg-primary/40 transition-colors z-10"
          />
        </div>

        {/* RIGHT PANEL - Company Detail */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {!selectedCompany ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a company to view details</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1 - Kill Switches Panel */}
              <div className="border-b border-border bg-card">
                <div
                  onClick={() => setKillSwitchExpanded(!killSwitchExpanded)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-foreground">{selectedCompany.name}</h2>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground">
                    {killSwitchExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {killSwitchExpanded && (
                  <div className="px-4 pb-4">
                    <div className="space-y-3">
                      {softwareList.map((software) => (
                        <div
                          key={software.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">
                                {software.displayName}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {software.softwareKey}
                            </p>
                          </div>
                          <Switch
                            checked={software.enabled}
                            onCheckedChange={() => handleToggleSoftware(software.id)}
                          />
                        </div>
                      ))}
                    </div>

                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <PAButton
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="gap-2"
                        >
                          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                          Save Changes
                        </PAButton>
                        <PAButton
                          variant="ghost"
                          onClick={handleCancelChanges}
                          disabled={isSaving}
                        >
                          Cancel
                        </PAButton>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 2 - Employees & Module Access */}
              <div className="flex-1 flex overflow-hidden">
                {/* LEFT HALF - Employee Table */}
                <div className={`flex flex-col border-r border-border bg-card transition-all ${
                  selectedEmployee ? 'w-1/2' : 'w-full'
                }`}>
                  {/* Toolbar */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-foreground">Employees</h3>
                      {selectedEmployees.length > 0 && (
                        <div className="flex items-center gap-2">
                          <PAButton size="sm" variant="outline">
                            Approve Selected
                          </PAButton>
                          <PAButton size="sm" variant="outline">
                            Revoke Selected
                          </PAButton>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedEmployees.length === mockEmployees.length}
                              onCheckedChange={handleSelectAllEmployees}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Valid Upto</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockEmployees.map((employee) => (
                          <TableRow
                            key={employee.id}
                            onClick={() => handleSelectEmployee(employee)}
                            className={`cursor-pointer ${
                              selectedEmployee?.id === employee.id ? 'bg-accent' : ''
                            }`}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedEmployees.includes(employee.id)}
                                onCheckedChange={() => handleCheckEmployee(employee.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(employee.status)}>
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {employee.validUpto || '-'}
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                {employee.status !== 'approved' && (
                                  <button
                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {employee.status === 'approved' && (
                                  <button
                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Revoke"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* RIGHT HALF - Module Access Panel */}
                {selectedEmployee && (
                  <div className="w-1/2 flex flex-col bg-card">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-base font-semibold text-foreground">
                        {selectedEmployee.name}
                      </h3>
                      <button
                        onClick={() => setSelectedEmployee(null)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Module Access Tree */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {mockModuleAccess.map((software, idx) => (
                          <div key={idx} className="border border-border rounded-lg overflow-hidden">
                            <div className="bg-secondary px-3 py-2">
                              <h4 className="text-sm font-semibold text-foreground">
                                {software.softwareName}
                              </h4>
                            </div>
                            <div className="p-3 space-y-2">
                              {software.modules.map((module, modIdx) => (
                                <div key={modIdx} className="flex items-center gap-2">
                                  <Checkbox defaultChecked />
                                  <span className="text-sm text-foreground">{module}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Company Modal */}
      <Dialog open={addCompanyOpen} onOpenChange={setAddCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>
              Create a new company and assign an administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <PAInput
              label="Company Name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
            <PAInput
              label="Admin Name"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              placeholder="Enter admin name"
            />
            <PAInput
              label="Admin Email"
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>
          <DialogFooter>
            <PAButton variant="ghost" onClick={() => setAddCompanyOpen(false)}>
              Cancel
            </PAButton>
            <PAButton onClick={handleAddCompany}>
              Create
            </PAButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Modal */}
      <Dialog open={editCompanyOpen} onOpenChange={setEditCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PAInput
              label="Company Name"
              value={editCompanyName}
              onChange={(e) => setEditCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <DialogFooter>
            <PAButton variant="ghost" onClick={() => setEditCompanyOpen(false)}>
              Cancel
            </PAButton>
            <PAButton onClick={handleEditCompany}>
              Save
            </PAButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Modal */}
      <Dialog open={deleteCompanyOpen} onOpenChange={setDeleteCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <PAButton variant="ghost" onClick={() => setDeleteCompanyOpen(false)}>
              Cancel
            </PAButton>
            <PAButton variant="destructive" onClick={handleDeleteCompany}>
              Delete
            </PAButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PAAppLayout>
  );
}