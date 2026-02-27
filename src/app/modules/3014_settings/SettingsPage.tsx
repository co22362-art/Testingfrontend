import { Check } from 'lucide-react';
import PAAppLayout from '../../components/PAAppLayout';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsTab {
  id: string;
  label: string;
}

interface SettingsPageProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  userName?: string;
  userEmail?: string;
  onChangePassword?: () => void;
  onAbout?: () => void;
  onLogout?: () => void;
}

const settingsTabs: SettingsTab[] = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
];

const accentColors: { id: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink'; color: string; name: string }[] = [
  { id: 'blue', color: '#1976D2', name: 'Blue' },
  { id: 'purple', color: '#6200EE', name: 'Purple' },
  { id: 'green', color: '#16A34A', name: 'Green' },
  { id: 'orange', color: '#EA580C', name: 'Orange' },
  { id: 'red', color: '#DC2626', name: 'Red' },
  { id: 'pink', color: '#DB2777', name: 'Pink' },
];

export default function SettingsPage({
  activeTab = 'appearance',
  onTabChange,
  userName,
  userEmail,
  onChangePassword,
  onAbout,
  onLogout,
}: SettingsPageProps) {
  const { theme, accentColor, sidebarStyle, setTheme, setAccentColor, setSidebarStyle, resetToDefaults } = useTheme();

  return (
    <PAAppLayout
      activePage="settings"
      userName={userName}
      userEmail={userEmail}
      onChangePassword={onChangePassword}
      onAbout={onAbout}
      onLogout={onLogout}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Navigation */}
        <aside className="w-64 bg-card border-r border-border p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground mb-6">Settings</h2>
          <nav className="flex flex-col gap-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`w-full px-4 h-10 rounded-lg text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Settings Content */}
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="max-w-4xl">
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                {/* Page Header */}
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Appearance</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Customize the look and feel of your workspace
                  </p>
                </div>

                {/* Theme Selector Section */}
                <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground">Theme</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your preferred interface theme
                    </p>
                  </div>

                  {/* Theme Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Light Theme Card */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-accent shadow-md'
                          : 'border-border hover:border-primary/50 shadow-sm'
                      }`}
                    >
                      {/* Theme Preview */}
                      <div className="h-[120px] bg-[#F4F6F9] p-3">
                        {/* Mini sidebar */}
                        <div className="flex gap-2 h-full">
                          <div className="w-8 bg-[#E5E7EB] rounded"></div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="h-2 bg-[#D1D5DB] rounded w-3/4"></div>
                            <div className="h-2 bg-[#D1D5DB] rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Checkmark Badge */}
                      {theme === 'light' && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Label */}
                      <div className="px-3 py-3 border-t border-border bg-card">
                        <p className="text-[13px] font-medium text-foreground">Light</p>
                      </div>
                    </button>

                    {/* Dark Theme Card */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-accent shadow-md'
                          : 'border-border hover:border-primary/50 shadow-sm'
                      }`}
                    >
                      {/* Theme Preview */}
                      <div className="h-[120px] bg-[#0F1117] p-3">
                        {/* Mini sidebar */}
                        <div className="flex gap-2 h-full">
                          <div className="w-8 bg-[#2D3148] rounded"></div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="h-2 bg-[#4B5563] rounded w-3/4"></div>
                            <div className="h-2 bg-[#4B5563] rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Checkmark Badge */}
                      {theme === 'dark' && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Label */}
                      <div className="px-3 py-3 bg-card border-t border-border">
                        <p className="text-[13px] font-medium text-foreground">Dark</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Accent Color Section */}
                <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground">Accent Color</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select your preferred accent color
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {accentColors.map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => setAccentColor(accent.id)}
                        className={`relative w-12 h-12 rounded-lg transition-all ${
                          accentColor === accent.id
                            ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-background'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: accent.color }}
                        title={accent.name}
                      >
                        {accentColor === accent.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Style Section */}
                <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground">Sidebar Style</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your default sidebar appearance
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setSidebarStyle('compact')}
                      className={`flex-1 px-6 h-12 rounded-lg text-sm font-medium transition-all ${
                        sidebarStyle === 'compact'
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => setSidebarStyle('expanded')}
                      className={`flex-1 px-6 h-12 rounded-lg text-sm font-medium transition-all ${
                        sidebarStyle === 'expanded'
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      Expanded Default
                    </button>
                  </div>
                </div>

                {/* Reset to Defaults Button */}
                <div className="flex justify-end">
                  <button
                    onClick={resetToDefaults}
                    className="px-6 h-12 rounded-lg text-sm font-medium bg-card border-2 border-border text-muted-foreground hover:bg-accent hover:border-primary hover:text-primary transition-all"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            )}

            {/* Other Tabs - Placeholder */}
            {activeTab === 'general' && (
              <div>
                <h1 className="text-2xl font-semibold text-foreground">General</h1>
                <p className="text-sm text-muted-foreground mt-2">General settings coming soon...</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Notification settings coming soon...
                </p>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Security</h1>
                <p className="text-sm text-muted-foreground mt-2">Security settings coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </PAAppLayout>
  );
}