import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, User, Mail, Lock, Eye, EyeOff, UserPlus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Register page — account creation form with validation.
 */
export default function Register() {
  const { register, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setErrors({ server: message });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mb-4 flex w-full max-w-md justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/40 mb-4">
          <Rocket size={28} className="text-white" />
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Startup CRM Lite</h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create your free account</p>
      </div>

      {/* Card */}
      <div className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
        <h2 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Get started</h2>

        {/* Server error */}
        {errors.server && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${isDarkMode ? 'border-red-900/40 bg-red-950/30 text-red-400' : 'border-red-200 bg-red-50 text-red-600'}`}>
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Full Name
            </label>
            <div className="relative">
              <User size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Verma"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.name
                    ? isDarkMode ? 'border-red-500' : 'border-red-500'
                    : isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-400 font-semibold">{errors.name}</p>}
          </div>

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
                placeholder="you@company.com"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.email
                    ? isDarkMode ? 'border-red-500' : 'border-red-500'
                    : isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400 font-semibold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Password <span className={`font-normal ${isDarkMode ? 'text-slate-600' : 'text-slate-500'}`}>(min 6 characters)</span>
            </label>
            <div className="relative">
              <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-10 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.password
                    ? isDarkMode ? 'border-red-500' : 'border-red-500'
                    : isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                }`}
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
            {errors.password && <p className="text-[11px] text-red-400 font-semibold">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 pl-9 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.confirmPassword
                    ? isDarkMode ? 'border-red-500' : 'border-red-500'
                    : isDarkMode ? 'border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-400 font-semibold">{errors.confirmPassword}</p>
            )}
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
                <UserPlus size={15} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className={`mt-6 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
            Sign in
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
