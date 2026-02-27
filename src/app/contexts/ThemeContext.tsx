import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';
export type SidebarStyle = 'compact' | 'expanded';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  sidebarStyle: SidebarStyle;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: Theme = 'light';
const DEFAULT_ACCENT_COLOR: AccentColor = 'blue';
const DEFAULT_SIDEBAR_STYLE: SidebarStyle = 'compact';

// Accent color mappings
const ACCENT_COLORS = {
  blue: '#1976D2',
  purple: '#6200EE',
  green: '#16A34A',
  orange: '#EA580C',
  red: '#DC2626',
  pink: '#DB2777',
};

const ACCENT_COLORS_HOVER_LIGHT = {
  blue: '#1565C0',
  purple: '#5200C6',
  green: '#15803D',
  orange: '#C2410C',
  red: '#B91C1C',
  pink: '#BE185D',
};

const ACCENT_COLORS_HOVER_DARK = {
  blue: '#42A5F5',
  purple: '#7C4DFF',
  green: '#22C55E',
  orange: '#FB923C',
  red: '#EF4444',
  pink: '#EC4899',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('pa-theme');
    return (saved as Theme) || DEFAULT_THEME;
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('pa-accent-color');
    return (saved as AccentColor) || DEFAULT_ACCENT_COLOR;
  });

  const [sidebarStyle, setSidebarStyleState] = useState<SidebarStyle>(() => {
    const saved = localStorage.getItem('pa-sidebar-style');
    return (saved as SidebarStyle) || DEFAULT_SIDEBAR_STYLE;
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('pa-theme', theme);
  }, [theme]);

  // Apply accent color to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    // Set the primary color based on accent
    root.style.setProperty('--pa-blue-primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--color-primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--sidebar-primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--color-sidebar-primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--ring', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--color-ring', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--color-border-focus-light', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--color-border-focus-dark', ACCENT_COLORS[accentColor]);
    
    // Set hover colors
    if (isDark) {
      root.style.setProperty('--pa-blue-hover-dark', ACCENT_COLORS_HOVER_DARK[accentColor]);
    } else {
      root.style.setProperty('--pa-blue-hover-light', ACCENT_COLORS_HOVER_LIGHT[accentColor]);
    }
    
    // Save to localStorage
    localStorage.setItem('pa-accent-color', accentColor);
  }, [accentColor, theme]);

  // Save sidebar style to localStorage
  useEffect(() => {
    localStorage.setItem('pa-sidebar-style', sidebarStyle);
  }, [sidebarStyle]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const setSidebarStyle = (style: SidebarStyle) => {
    setSidebarStyleState(style);
  };

  const resetToDefaults = () => {
    setThemeState(DEFAULT_THEME);
    setAccentColorState(DEFAULT_ACCENT_COLOR);
    setSidebarStyleState(DEFAULT_SIDEBAR_STYLE);
    localStorage.removeItem('pa-theme');
    localStorage.removeItem('pa-accent-color');
    localStorage.removeItem('pa-sidebar-style');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        sidebarStyle,
        setTheme,
        setAccentColor,
        setSidebarStyle,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}