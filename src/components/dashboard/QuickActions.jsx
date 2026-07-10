import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Download } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * QuickActions component providing dashboard utility buttons.
 * Optimized with useCallback for handers and React.memo.
 * 
 * @param {Object} props
 * @param {Array} props.leads - Array of all lead objects (for exporting)
 */
function QuickActions({ leads = [] }) {
  const navigate = useNavigate();

  // Export lead list to client-side JSON download
  const handleExportData = useCallback(() => {
    if (leads.length === 0) {
      toast.error('There are no leads to export.');
      return;
    }

    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `startup-crm-leads-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Leads database exported successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export leads.');
    }
  }, [leads]);

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-2.5">
        {/* Add Lead */}
        <button
          onClick={() => navigate('/leads', { state: { openModal: true } })}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/15 transition-all active:scale-[0.98] min-h-[44px]"
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>

        {/* View All Leads */}
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all active:scale-[0.98] min-h-[44px]"
        >
          <Users size={16} />
          <span>View All Leads</span>
        </button>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-all active:scale-[0.98] min-h-[44px]"
        >
          <Download size={16} />
          <span>Export Database</span>
        </button>
      </div>
    </div>
  );
}

export default memo(QuickActions);
