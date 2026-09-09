import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { soundEngine } from '../utils/audio';

export type ThemeMode = 'dark' | 'light' | 'hacker';

interface ThemeContextType {
  theme: ThemeMode;
  isHackerMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleHackerMode: () => void;
  exitHackerMode: () => void;
  hackerNotification: string | null;
  clearHackerNotification: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portal_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'hacker') {
        return saved;
      }
    }
    return 'dark';
  });

  const previousThemeRef = useRef<'dark' | 'light'>('dark');
  const [hackerNotification, setHackerNotification] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (theme === 'hacker') {
      root.classList.remove('theme-light', 'dark');
      root.classList.add('theme-hacker');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#020502');
    } else if (theme === 'light') {
      root.classList.remove('theme-hacker', 'dark');
      root.classList.add('theme-light');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#f8fafc');
    } else {
      root.classList.remove('theme-hacker', 'theme-light');
      root.classList.add('dark');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#0a0e17');
    }

    if (theme !== 'hacker') {
      localStorage.setItem('portal_theme', theme);
      previousThemeRef.current = theme;
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'hacker') {
        return 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleHackerMode = () => {
    if (theme === 'hacker') {
      exitHackerMode();
    } else {
      previousThemeRef.current = theme === 'light' ? 'light' : 'dark';
      setThemeState('hacker');
      soundEngine.playHackerAccess();
      setHackerNotification('>>> HACKER_MODE // ACTIVATED: Classic Green-on-Black Matrix Terminal');
      setTimeout(() => setHackerNotification(null), 5000);
    }
  };

  const exitHackerMode = () => {
    const restored = previousThemeRef.current || 'dark';
    setThemeState(restored);
    soundEngine.playSelect();
    setHackerNotification('>>> HACKER_MODE // DEACTIVATED: Restored Standard Protocol');
    setTimeout(() => setHackerNotification(null), 4000);
  };

  const clearHackerNotification = () => {
    setHackerNotification(null);
  };

  // Hidden Konami Code listener (↑ ↑ ↓ ↓ ← → ← → B A)
  useKonamiCode(() => {
    toggleHackerMode();
  });

  // ESC key quick-exit when in hacker mode
  useEffect(() => {
    if (theme !== 'hacker') return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Only exit if no modal is currently focused
        const modal = document.querySelector('[role="dialog"]');
        if (!modal) {
          exitHackerMode();
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isHackerMode: theme === 'hacker',
        toggleTheme,
        setTheme,
        toggleHackerMode,
        exitHackerMode,
        hackerNotification,
        clearHackerNotification,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
