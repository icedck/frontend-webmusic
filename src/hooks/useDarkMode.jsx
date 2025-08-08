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
      return saved ? JSON.parse(saved) : false;
    }
    return false;
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
    // Primary colors
    primary: isDarkMode ? 'bg-music-600' : 'bg-music-500',
    primaryHover: isDarkMode ? 'hover:bg-music-700' : 'hover:bg-music-600',
    
    // Background colors
    bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    bgSecondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    
    // Text colors
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    
    // Border colors
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderHover: isDarkMode ? 'hover:border-music-600' : 'hover:border-music-300',
    
    // Focus states
    focusRing: isDarkMode ? 'focus:ring-music-500' : 'focus:ring-music-400',
    
    // Audio player theme
    audioPlayer: {
      bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      progress: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
      progressFill: 'bg-gradient-to-r from-music-500 to-music-600'
    },
    
    // Music card theme
    musicCard: {
      bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
      border: isDarkMode ? 'border-gray-700' : 'border-gray-100',
      hover: isDarkMode ? 'hover:border-music-600' : 'hover:border-music-300',
      shadow: isDarkMode ? 'shadow-gray-900/10' : 'shadow-gray-900/5'
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
