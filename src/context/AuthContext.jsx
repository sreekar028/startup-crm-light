import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * AuthProvider — stores logged-in user state and manages JWT token lifecycle.
 * On mount, checks localStorage for an existing token and restores the session.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('crm-token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await authService.getProfile();
        setUser(result);
      } catch (err) {
        // Token invalid or expired — clear it
        localStorage.removeItem('crm-token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  /**
   * Login user with email and password.
   * Saves token to localStorage and updates user state.
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      const { token: newToken, user: newUser } = result;
      localStorage.setItem('crm-token', newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome back, ${newUser.name}!`);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Register a new user account.
   */
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, password);
      const { token: newToken, user: newUser } = result;
      localStorage.setItem('crm-token', newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome to Startup CRM, ${newUser.name}!`);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Logout user — clears token and session state.
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
    navigate('/login');
  }, [navigate]);

  const updateProfile = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.updateProfile(data);
      const updatedUser = result;
      setUser(updatedUser);
      toast.success('Profile updated successfully.');
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update your profile right now.';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
  }), [user, token, isLoading, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume AuthContext.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}

export default AuthContext;
