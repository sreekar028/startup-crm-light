import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Login page — styled to match the dark navy SaaS theme.
 */
export default function Login() {
  const { login, isLoading } = useAuth();
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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#06091A' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/40 mb-4">
          <Rocket size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Startup CRM Lite</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{ background: '#0D1533', border: '1px solid #1A2850' }}
      >
        <h2 className="text-lg font-bold text-white mb-6">Welcome back</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-950/30 border border-red-900/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm text-white bg-slate-800/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-sm text-white bg-slate-800/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-light transition-colors">
            Create one free
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-[11px] text-slate-700">
        © 2025 Startup CRM Lite. All rights reserved.
      </p>
    </div>
  );
}
