import React from 'react';
import { SearchX, Inbox, RefreshCw } from 'lucide-react';

/**
 * EmptyState component displayed when there is no lead data to show.
 * 
 * @param {Object} props
 * @param {boolean} props.hasTotalLeads - If the database has leads in general
 * @param {Function} [props.onReset] - Action callback to reset filters/search
 */
export default function EmptyState({ hasTotalLeads, onReset }) {
  return (
    <div className="glass-panel py-16 px-6 text-center rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/40 flex flex-col items-center justify-center space-y-5 animate-fade-in">
      {hasTotalLeads ? (
        // Case 1: Search or filter results are empty
        <>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
            <SearchX size={36} />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No matching leads found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your keywords or clearing the active pipeline filter.
            </p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 dark:text-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all"
            >
              <RefreshCw size={12} />
              Reset Filters
            </button>
          )}
        </>
      ) : (
        // Case 2: CRM is completely empty (no leads at all)
        <>
          <div className="p-4 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-2xl">
            <Inbox size={36} />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Your CRM database is empty
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get started by creating your first potential sales lead.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
