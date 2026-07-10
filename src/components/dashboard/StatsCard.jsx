import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard component to display a single sales KPI.
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the metric
 * @param {string|number} props.value - Current value of the metric
 * @param {React.ComponentType} props.icon - Lucide React Icon component
 * @param {number} props.change - Percentage change (positive or negative)
 * @param {string} props.color - Accent color for the icon background (e.g. 'primary', 'success', 'warning', 'danger')
 */
export default function StatsCard({ title, value, icon: Icon, change, color = 'primary' }) {
  const isPositive = change >= 0;
  
  // Custom color mappings for background and border glow
  const colorMap = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light',
    success: 'bg-success/10 text-success dark:bg-success/20 dark:text-success-light',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning-light',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light',
  };

  const badgeColor = colorMap[color] || colorMap.primary;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        {/* Metric Label & Value */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Container */}
        <div className={`p-3 rounded-xl ${badgeColor}`}>
          <Icon size={22} />
        </div>
      </div>

      {/* Growth/Trend indicator */}
      <div className="flex items-center gap-1.5 mt-4">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? 'bg-success/10 text-success dark:bg-success/20 dark:text-success-light'
              : 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light'
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          vs last month
        </span>
      </div>
    </div>
  );
}
