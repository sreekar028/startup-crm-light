import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Animated toggle button for light/dark mode.
 */
export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-between w-14 h-8 px-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer transition-colors duration-300 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label="Toggle dark mode"
    >
      {/* Icons */}
      <Sun size={14} className="text-amber-500 z-10" />
      <Moon size={14} className="text-blue-400 z-10" />

      {/* Sliding Knob */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-slate-950 rounded-full shadow-md transition-transform duration-300 ease-out transform ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
