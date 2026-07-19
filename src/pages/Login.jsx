import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Lock, Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Login page — styled to match the dark navy SaaS theme.
 */
export default function Login() {
  const { login, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mb-4 flex w-full max-w-md justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          {isDarkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/40 mb-4">
          <Rocket size={28} className="text-white" />
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Startup CRM Lite</h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sign in to your account</p>
      </div>

      {/* Card */}
      <div className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
        <h2 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Welcome back</h2>

        {/* Error message */}
        {error && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-red-900/40 bg-red-950/30 text-red-400' : 'border-red-200 bg-red-50 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'}`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Password
            </label>
            <div className="relative">
              <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-10 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={15} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className={`mt-6 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-light transition-colors">
            Create one free
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className={`mt-8 text-[11px] ${isDarkMode ? 'text-slate-700' : 'text-slate-500'}`}>
        © 2025 Startup CRM Lite. All rights reserved.
      </p>
    </div>
  );
}
