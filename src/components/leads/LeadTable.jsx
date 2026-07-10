import React, { memo } from 'react';
import { Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * LeadTable component for displaying leads in a structured spreadsheet format.
 * Responsive column hiding:
 * - Tablet (md): Shows Name, Company, Status, Actions.
 * - Desktop (lg): Adds Phone, Source, Date Added.
 * - Large Desktop (xl): Adds Email.
 * Optimized with React.memo.
 * 
 * @param {Object} props
 * @param {Array} props.leads - Array of lead objects
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 */
function LeadTable({ leads = [], onEdit, onDelete }) {
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

  const handleEdit = (lead) => {
    if (onEdit) onEdit(lead);
  };

  const handleDelete = (id) => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="glass-panel rounded-2xl shadow-sm overflow-hidden border border-slate-200/60 dark:border-slate-800/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-4.5 px-6">Name</th>
              <th className="py-4.5 px-4">Company</th>
              <th className="py-4.5 px-4">Status</th>
              <th className="py-4.5 px-4 hidden xl:table-cell">Email</th>
              <th className="py-4.5 px-4 hidden lg:table-cell">Phone</th>
              <th className="py-4.5 px-4 hidden lg:table-cell">Source</th>
              <th className="py-4.5 px-4 hidden lg:table-cell">Date Added</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/40 dark:bg-slate-900/10">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                {/* Name */}
                <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                  {lead.name}
                </td>
                {/* Company */}
                <td className="py-4 px-4 text-slate-600 dark:text-slate-350 font-medium">
                  {lead.company}
                </td>
                {/* Status */}
                <td className="py-4 px-4">
                  <StatusBadge status={lead.status} />
                </td>
                {/* Email (Visible only on xl) */}
                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium max-w-[180px] truncate hidden xl:table-cell">
                  <div className="flex items-center gap-1.5" title={lead.email}>
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary dark:hover:text-primary-light hover:underline truncate">
                      {lead.email}
                    </a>
                  </div>
                </td>
                {/* Phone (Visible only on lg+) */}
                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium hidden lg:table-cell">
                  {lead.phone ? (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <a href={`tel:${lead.phone}`} className="hover:text-primary dark:hover:text-primary-light hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>
                {/* Source (Visible only on lg+) */}
                <td className="py-4 px-4 hidden lg:table-cell">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/20">
                    {lead.source}
                  </span>
                </td>
                {/* Date Added (Visible only on lg+) */}
                <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium hidden lg:table-cell">
                  {formatDate(lead.createdAt)}
                </td>
                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(lead)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Edit Lead"
                      aria-label={`Edit lead ${lead.name}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Delete Lead"
                      aria-label={`Delete lead ${lead.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(LeadTable);
