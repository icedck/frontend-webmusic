import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true; // Mặc định là Dark Mode
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentTheme = {
    // Primary colors (Teal)
    primary: isDarkMode ? 'bg-primary-500' : 'bg-primary-600',
    primaryHover: isDarkMode ? 'hover:bg-primary-600' : 'hover:bg-primary-700',

    // Background colors (Slate)
    bg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
    bgSecondary: isDarkMode ? 'bg-slate-800' : 'bg-slate-100',
    bgCard: isDarkMode ? 'bg-slate-800' : 'bg-white',
    bgHover: isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200',

    // Text colors (Slate & Primary)
    text: isDarkMode ? 'text-slate-100' : 'text-slate-800',
    textSecondary: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    textMuted: isDarkMode ? 'text-slate-500' : 'text-slate-400',
    textPrimary: isDarkMode ? 'text-primary-400' : 'text-primary-600', // Bổ sung màu text primary

    // Border colors (Slate)
    border: isDarkMode ? 'border-slate-700' : 'border-slate-200',
    borderHover: isDarkMode ? 'hover:border-primary-500' : 'hover:border-primary-500',

    // Focus states
    focusRing: isDarkMode ? 'focus:ring-primary-500' : 'focus:ring-primary-500',

    // Audio player theme
    audioPlayer: {
      bg: isDarkMode ? 'bg-slate-800' : 'bg-white',
      border: isDarkMode ? 'border-slate-700' : 'border-slate-200',
      progress: isDarkMode ? 'bg-slate-700' : 'bg-slate-200',
      progressFill: 'bg-primary-500'
    },

    // Music card theme
    musicCard: {
      bg: isDarkMode ? 'bg-slate-800' : 'bg-white',
      border: isDarkMode ? 'border-slate-700' : 'border-slate-200',
      hover: isDarkMode ? 'hover:border-primary-500' : 'hover:border-primary-500',
      shadow: 'shadow-lg shadow-slate-900/5'
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    currentTheme
  };

  return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
  );
};