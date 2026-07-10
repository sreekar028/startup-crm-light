import React, { memo } from 'react';
import { RefreshCw } from 'lucide-react';

const FILTERS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom Range', value: 'custom' },
];

const AnalyticsFilters = memo(({ activeFilter, onFilterChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap" style={{ background: '#0D1533', border: '1px solid #1A2850' }}>
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilter === f.value
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
      <RefreshCw size={12} className="text-success" />
      Data updated: Just now
    </div>
  </div>
));

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;
