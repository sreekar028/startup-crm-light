import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Register page — account creation form with validation.
 */
export default function Register() {
  const { register, isLoading } = useAuth();
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
        <p className="text-sm text-slate-400 mt-1">Create your free account</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{ background: '#0D1533', border: '1px solid #1A2850' }}
      >
        <h2 className="text-lg font-bold text-white mb-6">Get started</h2>

        {/* Server error */}
        {errors.server && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-950/30 border border-red-900/40">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-semibold text-slate-400">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Verma"
                className={`w-full pl-9 pr-4 py-2.5 text-sm text-white bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600 ${
                  errors.name ? 'border-red-500' : 'border-slate-700'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-400 font-semibold">{errors.name}</p>}
          </div>

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
                placeholder="you@company.com"
                className={`w-full pl-9 pr-4 py-2.5 text-sm text-white bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600 ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400 font-semibold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-slate-400">
              Password <span className="text-slate-600 font-normal">(min 6 characters)</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 text-sm text-white bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600 ${
                  errors.password ? 'border-red-500' : 'border-slate-700'
                }`}
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
            {errors.password && <p className="text-[11px] text-red-400 font-semibold">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-4 py-2.5 text-sm text-white bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-600 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
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
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
            Sign in
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
