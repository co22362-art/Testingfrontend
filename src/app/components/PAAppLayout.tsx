import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard,
  Award,
  Mail,
  Users,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
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
}

export default function PAAppLayout({ children, activePage = '' }: PAAppLayoutProps) {
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { id: 'daily-wins', icon: Award, path: '/daily-wins', label: 'Daily Wins' },
    { id: 'mail', icon: Mail, path: '#', label: 'Mail' },
    { id: 'people', icon: Users, path: '/people', label: 'People' },
    { id: 'settings', icon: Settings, path: '#', label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Left Sidebar - Improved Design */}
      <aside className="w-20 bg-white border-r border-[#E5E7EB] flex flex-col items-center py-6 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <span className="text-white font-bold text-base">PA</span>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col items-center gap-2 w-full px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <div key={item.id} className="relative group w-full">
                <button
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className={`w-full h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#1976D2] to-[#1565C0] text-white shadow-md scale-105' 
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1976D2] hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`}>
                    {item.label.split(' ')[0]}
                  </span>
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none shadow-xl z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </div>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-[#E5E7EB] w-full px-3">
          <button
            onClick={() => navigate('/')}
            className="w-full h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105 group"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-semibold text-[#9CA3AF] group-hover:text-red-600">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E5E7EB] h-16 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#111827] text-lg">EGIS Group</span>
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#1976D2] focus:bg-white focus:ring-2 focus:ring-[#1976D2]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors relative">
              <Bell className="w-5 h-5 text-[#6B7280]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors">
              <Settings className="w-5 h-5 text-[#6B7280]" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1976D2] to-[#1565C0] flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <span className="text-white text-sm font-semibold">SA</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
