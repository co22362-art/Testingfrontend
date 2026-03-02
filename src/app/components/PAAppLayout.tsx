import { ReactNode, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard,
  Folder,
  Mail,
  Layers,
  Clock,
  Award,
  FolderOpen,
  Users,
  Video,
  FileText,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LucideIcon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarItem {
  id: string;
  icon: LucideIcon;
  path: string;
  label: string;
}

interface PAAppLayoutProps {
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  companyName?: string;
  companyInitials?: string;
  allowedModules?: string[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  hasNotifications?: boolean;
  onNotificationsClick?: () => void;
  onChangePassword?: () => void;
  onAbout?: () => void;
  onLogout?: () => void;
}

export default function PAAppLayout({ 
  children, 
  userName = 'User',
  userEmail = 'user@example.com',
  companyName = 'EGIS Group',
  companyInitials = 'EG',
  allowedModules,
  onSearch,
  searchPlaceholder = 'Search...',
  hasNotifications = false,
  onNotificationsClick,
  onChangePassword,
  onAbout,
  onLogout
}: PAAppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme, sidebarStyle } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(sidebarStyle === 'compact');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  // Determine if sidebar should be expanded (only via chevron click, not hover)
  const isExpanded = !isCollapsed;

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { id: 'project', icon: Folder, path: '/project', label: 'Project' },
    { id: 'mail', icon: Mail, path: '/mail', label: 'Mail' },
    { id: 'cadmanager', icon: Layers, path: '/cadmanager', label: 'CAD Manager' },
    { id: 'timesheets', icon: Clock, path: '/timesheets', label: 'Time Sheets' },
    { id: 'daily-wins', icon: Award, path: '/daily-wins', label: 'Daily Wins' },
    { id: 'project-group', icon: FolderOpen, path: '/project-group', label: 'Project Groups' },
    { id: 'people', icon: Users, path: '/people', label: 'People' },
    { id: 'tutorials', icon: Video, path: '/tutorials', label: 'Tutorials' },
    { id: 'forms', icon: FileText, path: '/forms', label: 'Forms' },
    { id: 'licenses', icon: ShieldCheck, path: '/licenses', label: 'Licenses' }
  ];

  // Filter sidebar items based on allowed modules
  const visibleItems = allowedModules
    ? sidebarItems.filter(item => allowedModules.includes(item.id))
    : sidebarItems;

  useEffect(() => {
    const currentRef = dropdownRef.current;
    const currentButtonRef = avatarButtonRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node) && currentButtonRef && !currentButtonRef.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Collapsible */}
      <aside 
        className={`bg-sidebar border-r border-sidebar-border flex flex-col py-6 shadow-sm transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo & Toggle - Always on same horizontal line */}
        <div className="flex items-center justify-between mb-8 px-4">
          {/* Company Logo & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0">
              <span className="text-white font-bold text-sm">{companyInitials}</span>
            </div>
            {isExpanded && (
              <span className="text-sidebar-foreground font-bold text-lg whitespace-nowrap truncate">{companyName}</span>
            )}
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className={`flex-1 flex flex-col gap-1 ${isExpanded ? 'px-4' : 'px-3'}`}>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className={`w-full h-12 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                    isExpanded ? 'px-3' : 'justify-center px-0'
                  } ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                  {isExpanded && (
                    <span className={`text-sm font-medium whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-sidebar-foreground'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </button>
                
                {/* Tooltip (only show when collapsed and not hovered) */}
                {!isExpanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none shadow-xl z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Toggle Button - Bottom of Sidebar */}
        <div className="mt-auto">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full h-12 border-t border-sidebar-border flex items-center text-muted-foreground hover:text-primary hover:bg-sidebar-accent transition-colors ${
              isExpanded ? 'px-4 gap-3' : 'justify-center'
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border h-16 px-6 flex items-center justify-between shadow-sm">
          {/* Search Bar - Left aligned with more space */}
          <div className="flex-1 max-w-3xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNotificationsClick}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {hasNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
              )}
            </button>
            
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' 
                ? <Moon className="w-5 h-5 text-muted-foreground" />
                : <Sun className="w-5 h-5 text-muted-foreground" />
              }
            </button>
            
            {/* Settings Icon - Navigate to Settings Page */}
            <button 
              onClick={() => navigate('/settings')}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                ref={avatarButtonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </button>

              {/* User Profile Dropdown */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-[220px] bg-card border border-border rounded-md shadow-lg z-50"
                >
                  {/* Section 1 - User Info */}
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-semibold text-card-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{userEmail}</p>
                  </div>

                  {/* Section 2 - Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onChangePassword?.();
                      }}
                      className="w-full h-10 px-3 flex items-center text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      Change password
                    </button>
                    
                    <div className="border-t border-border"></div>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onAbout?.();
                      }}
                      className="w-full h-10 px-3 flex items-center text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      About
                    </button>
                    
                    <div className="border-t border-border"></div>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full h-10 px-3 flex items-center text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}