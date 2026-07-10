import React from 'react';

/**
 * PipelineOverview component to show distribution of leads across sales stages.
 * 
 * @param {Object} props
 * @param {Array} props.leads - Array of all lead objects
 */
export default function PipelineOverview({ leads = [] }) {
  const totalLeads = leads.length;

  // Lead status stages mapping with color codes
  const stages = [
    { name: 'New', color: 'bg-slate-400 dark:bg-slate-500', text: 'text-slate-400' },
    { name: 'Contacted', color: 'bg-primary', text: 'text-primary' },
    { name: 'Meeting Scheduled', color: 'bg-warning', text: 'text-warning' },
    { name: 'Proposal Sent', color: 'bg-purple-500', text: 'text-purple-500' },
    { name: 'Won', color: 'bg-success', text: 'text-success' },
    { name: 'Lost', color: 'bg-danger', text: 'text-danger' },
  ];

  // Count leads per status
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentage and data for each stage
  const pipelineData = stages.map((stage) => {
    const count = statusCounts[stage.name] || 0;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return { ...stage, count, percentage };
  });

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Pipeline Stage Distribution
        </h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {totalLeads} Active Leads
        </span>
      </div>

      {totalLeads === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No leads available to calculate pipeline stages.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Segmented Pipeline Bar */}
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden shadow-inner">
            {pipelineData.map((stage) => {
              if (stage.count === 0) return null;
              return (
                <div
                  key={stage.name}
                  className={`${stage.color} h-full transition-all duration-500 hover:opacity-90`}
                  style={{ width: `${stage.percentage}%` }}
                  title={`${stage.name}: ${stage.count} leads (${stage.percentage}%)`}
                />
              );
            })}
          </div>

          {/* Grid Legend with details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {pipelineData.map((stage) => (
              <div
                key={stage.name}
                className="flex flex-col p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <span className="truncate">{stage.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {stage.count}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    ({stage.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
