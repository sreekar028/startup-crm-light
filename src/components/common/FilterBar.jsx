import React from 'react';

/**
 * FilterBar component for filtering leads by sales stage.
 * 
 * @param {Object} props
 * @param {string} props.activeFilter - The currently selected filter
 * @param {Function} props.onFilterChange - Callback when filter is clicked
 * @param {Array} props.leads - Leads array used to calculate counts per status
 */
export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // Count leads matching each filter
  const getCount = (filterName) => {
    if (filterName === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filterName).length;
  };

  return (
    <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const count = getCount(filter);
          
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold select-none border transition-all ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              <span>{filter}</span>
              <span
                className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
