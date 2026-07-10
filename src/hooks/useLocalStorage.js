import { useState, useEffect } from 'react';

/**
 * A custom React hook that syncs state with window.localStorage.
 * Works exactly like useState, but persists data.
 * 
 * @param {string} key - The key under which the data is stored in localStorage.
 * @param {any} initialValue - The fallback value if no data exists in localStorage.
 * @returns {[any, Function]} - Returns a stateful value and a function to update it.
 */
export default function useLocalStorage(key, initialValue) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g., localStorage is disabled or private mode), return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
