import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants';

/**
 * LeadForm component for creating and editing sales leads.
 * Responsive modal design:
 * - Mobile: Full screen viewport height/width, no rounded corners, scrollable form body.
 * - Tablet+: Centered overlay modal with max-w-lg and rounded corners.
 * Accessibility optimized (associated labels, aria-labels) and consumes options constants.
 * 
 * @param {Object} props
 * @param {Object} [props.initialData] - The lead data if editing (optional)
 * @param {Function} props.onSubmit - Function called on form submit
 * @param {Function} props.onCancel - Function called to cancel/close the form
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  const [errors, setErrors] = useState({});

  // Populate form if in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center md:p-4 z-50 animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 w-full h-full md:h-auto md:max-w-lg md:rounded-2xl shadow-xl border-0 md:border md:border-slate-200 dark:md:border-slate-800 overflow-hidden transform transition-all animate-scale-up flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Lead Details' : 'Add New Potential Lead'}
          </h3>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close form modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto md:overflow-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lead Name */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="name" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                  errors.name ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-slate-200 dark:border-slate-700'
                }`}
                placeholder="e.g. Rahul Verma"
                aria-required="true"
              />
              {errors.name && <p className="text-[11px] font-semibold text-danger">{errors.name}</p>}
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label htmlFor="company" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Company <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                  errors.company ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-slate-200 dark:border-slate-700'
                }`}
                placeholder="e.g. Swiggy"
                aria-required="true"
              />
              {errors.company && <p className="text-[11px] font-semibold text-danger">{errors.company}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                  errors.email ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-slate-200 dark:border-slate-700'
                }`}
                placeholder="name@company.com"
                aria-required="true"
              />
              {errors.email && <p className="text-[11px] font-semibold text-danger">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="+91 99887 76655"
              />
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label htmlFor="source" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Lead Source
              </label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="status" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Sales Pipeline Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/10 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Check size={16} />
              <span>{isEditMode ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
