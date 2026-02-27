import { ReactNode, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard,
  Award,
  Mail,
  Users,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: LucideIcon;
  path: string;
  label: string;
}

interface PAAppLayoutProps {
  children: ReactNode;
  activePage?: string;
  userName?: string;
  userEmail?: string;
  onChangePassword?: () => void;
  onAbout?: () => void;
  onLogout?: () => void;
}

export default function PAAppLayout({ 
  children, 
  activePage = '',
  userName = 'User',
  userEmail = 'user@example.com',
  onChangePassword,
  onAbout,
  onLogout
}: PAAppLayoutProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  // Determine if sidebar should be expanded (only via chevron click, not hover)
  const isExpanded = !isCollapsed;

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { id: 'daily-wins', icon: Award, path: '/daily-wins', label: 'Daily Wins' },
    { id: 'mail', icon: Mail, path: '#', label: 'Mail' },
    { id: 'people', icon: Users, path: '/people', label: 'People' }
  ];

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#1565C0] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0">
              <span className="text-white font-bold text-sm">EG</span>
            </div>
            {isExpanded && (
              <span className="text-sidebar-foreground font-bold text-lg whitespace-nowrap truncate">EGIS Group</span>
            )}
          </div>
          
          {/* Toggle Button - Always visible, always inline */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-primary flex-shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Section Header - MAIN */}
        {isExpanded && (
          <div className="px-4 mb-3">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Main</span>
          </div>
        )}
        
        {/* Navigation Items */}
        <nav className={`flex-1 flex flex-col gap-1 ${isExpanded ? 'px-4' : 'px-3'}`}>
          {sidebarItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
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
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none shadow-xl z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Section Header - PRODUCTIVITY */}
          {isExpanded && (
            <div className="mt-6 mb-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Productivity</span>
            </div>
          )}

          {sidebarItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
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
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none shadow-xl z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
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
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
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
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#1565C0] flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
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