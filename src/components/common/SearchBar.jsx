import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component with automatic 300ms debounce.
 * 
 * @param {Object} props
 * @param {string} props.value - The parent search query state
 * @param {Function} props.onChange - Parent callback when search changes (after debounce)
 */
export default function SearchBar({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value);

  // Sync state if changed externally (e.g. cleared)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce the callback to parent state
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
        placeholder="Search by name, company, or email..."
        aria-label="Search leads"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350"
          type="button"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
