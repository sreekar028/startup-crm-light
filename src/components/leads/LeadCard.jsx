import React, { memo } from 'react';
import { Mail, Phone, Tag, Edit, Trash } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * LeadCard component representing a single lead in card view.
 * Touch-friendly padding (min 44x44px target) and memoized with React.memo.
 * 
 * @param {Object} props
 * @param {Object} props.lead - The lead object
 * @param {Function} props.onEdit - Callback when edit is clicked
 * @param {Function} props.onDelete - Callback when delete is clicked
 */
function LeadCard({ lead, onEdit, onDelete }) {
  const handleEdit = () => {
    if (onEdit) onEdit(lead);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(lead.id);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/60 dark:border-slate-800/40 relative group">
      {/* Card Header (Name, Company, Status) */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {lead.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {lead.company}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {/* Card Body (Contact Information) */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-400 shrink-0" />
          <a
            href={`mailto:${lead.email}`}
            className="hover:text-primary dark:hover:text-primary-light hover:underline truncate"
            title={lead.email}
          >
            {lead.email}
          </a>
        </div>

        {/* Phone */}
        {lead.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-slate-400 shrink-0" />
            <a
              href={`tel:${lead.phone}`}
              className="hover:text-primary dark:hover:text-primary-light hover:underline"
            >
              {lead.phone}
            </a>
          </div>
        )}

        {/* Source */}
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-500 dark:text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[10px]">
            Source: {lead.source}
          </span>
        </div>
      </div>

      {/* Card Footer (Actions) */}
      <div className="flex items-center justify-end gap-1.5 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className="p-3 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Edit Lead"
          aria-label={`Edit lead ${lead.name}`}
        >
          <Edit size={15} />
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-3 text-slate-500 hover:text-danger dark:text-slate-400 dark:hover:text-danger-light hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Delete Lead"
          aria-label={`Delete lead ${lead.name}`}
        >
          <Trash size={15} />
        </button>
      </div>
    </div>
  );
}

export default memo(LeadCard);
