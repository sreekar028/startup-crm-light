import React from 'react';

/**
 * StatusBadge component to display lead status with semantic coloring.
 * 
 * @param {Object} props
 * @param {string} props.status - The lead status ('New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost')
 */
export default function StatusBadge({ status }) {
  // Define style mappings for each status stage
  const styles = {
    New: 'bg-slate-100 text-slate-700 border-slate-200/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
    Contacted: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    'Meeting Scheduled': 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    'Proposal Sent': 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30',
    Won: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    Lost: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30',
  };

  const currentStyle = styles[status] || styles.New;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm select-none ${currentStyle}`}>
      {status}
    </span>
  );
}
