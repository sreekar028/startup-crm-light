import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create Theme Context
const ThemeContext = createContext(null);

/**
 * ThemeProvider component that wraps the application to manage light/dark modes.
 */
export function ThemeProvider({ children }) {
  // Use custom useLocalStorage hook to persist dark mode state, default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false);

  // Sync theme changes with document.documentElement class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle theme mode
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, [setIsDarkMode]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleTheme
  }), [isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom React hook to consume ThemeContext.
 * 
 * @returns {Object} Theme context values (isDarkMode, toggleTheme)
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}
