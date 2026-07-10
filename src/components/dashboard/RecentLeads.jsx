import React, { memo, useMemo } from 'react';
import StatusBadge from '../leads/StatusBadge';

/**
 * RecentLeads component displaying the most recently added leads.
 * Optimized with useMemo for sorting/slicing and React.memo.
 * 
 * @param {Object} props
 * @param {Array} props.leads - Array of all lead objects
 */
function RecentLeads({ leads = [] }) {
  // Sort leads by creation date descending and take top 5
  const recent = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [leads]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Leads
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
          Last 5 leads added
        </span>
      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No leads found. Use "Add Lead" to get started.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 pr-4">Lead Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {recent.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">
                      {lead.name}
                    </td>
                    {/* Company */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                      {lead.company}
                    </td>
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    {/* Date */}
                    <td className="py-3.5 pl-4 text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RecentLeads);
