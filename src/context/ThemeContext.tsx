'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Fetch user's theme preference
    const fetchTheme = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const result = await response.json();
          setThemeState(result.data.theme || 'light');
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (selectedTheme: Theme) => {
      let appliedTheme: 'light' | 'dark' = 'light';

      if (selectedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        appliedTheme = systemTheme;
      } else {
        appliedTheme = selectedTheme;
      }

      setEffectiveTheme(appliedTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(appliedTheme);
      localStorage.setItem('theme', appliedTheme);
    };

    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
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
