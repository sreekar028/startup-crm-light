import React, { memo, useMemo } from 'react';

const TASKS = [
  { label: 'Lead Follow-up', key: 'followUp',  color: '#22C55E' },
  { label: 'Calls',          key: 'calls',     color: '#2563EB' },
  { label: 'Meetings',       key: 'meetings',  color: '#F59E0B' },
  { label: 'Proposals',      key: 'proposals', color: '#7C3AED' },
  { label: 'Follow-ups',     key: 'followUps', color: '#06B6D4' },
];

const STATUS_TYPES = [
  { label: 'Completed', color: '#22C55E' },
  { label: 'In Progress', color: '#2563EB' },
  { label: 'Planned', color: '#475569' },
  { label: 'Pending', color: '#1A2850' },
];

/**
 * Generate deterministic Gantt bars from lead data.
 * Each task row gets 2-3 bars spread across the 30-day window.
 */
function buildGanttData(leads) {
  const seed = leads.length;
  const rows = {};

  TASKS.forEach((task, ti) => {
    rows[task.key] = [];
    const numBars = 2 + (ti % 2);
    for (let b = 0; b < numBars; b++) {
      const start = 1 + ((seed * (ti + 1) * (b + 1) * 7) % 22);
      const dur = 4 + ((seed * (ti + b + 2) * 3) % 8);
      const statusIdx = (ti + b) % 4;
      rows[task.key].push({ start, duration: Math.min(dur, 30 - start), statusIdx });
    }
  });

  return rows;
}

/**
 * GitHub-style Gantt chart for daily sales activities.
 */
const DailySalesGantt = memo(({ leads = [] }) => {
  const ganttData = useMemo(() => buildGanttData(leads), [leads]);
  const COLS = 30;

  return (
    <div className="crm-card p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">Daily Sales Activity Gantt</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Visual overview of team activities and tasks across the last 30 days.
        </p>
      </div>

      <div className="overflow-x-auto">
        {/* Header row */}
        <div className="flex mb-3" style={{ minWidth: 480 }}>
          <div className="shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest" style={{ width: 110 }}>
            Task / Activity
          </div>
          <div className="flex-1 relative">
            {/* Month label */}
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[11px] font-bold text-slate-400">May</span>
            </div>
            {/* Day markers */}
            <div className="flex">
              {[5, 10, 15, 20, 25, 30].map(d => (
                <div key={d} className="flex-1 text-[10px] font-bold text-slate-600 text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task rows */}
        <div className="space-y-3" style={{ minWidth: 480 }}>
          {TASKS.map(task => {
            const bars = ganttData[task.key] || [];
            return (
              <div key={task.key} className="flex items-center gap-2">
                {/* Label */}
                <div className="shrink-0 text-[11px] font-semibold text-slate-400" style={{ width: 110 }}>
                  {task.label}
                </div>
                {/* Bar area */}
                <div className="flex-1 relative rounded-md overflow-hidden" style={{ height: 20, background: '#111D40' }}>
                  {bars.map((bar, bi) => {
                    const statusColor = STATUS_TYPES[bar.statusIdx].color;
                    return (
                      <div
                        key={bi}
                        className="gantt-bar absolute top-1"
                        style={{
                          left: `${(bar.start / COLS) * 100}%`,
                          width: `${(bar.duration / COLS) * 100}%`,
                          background: statusColor,
                          height: 18,
                          borderRadius: 4,
                          opacity: bar.statusIdx === 3 ? 0.4 : 0.85,
                        }}
                        title={`${task.label}: Day ${bar.start}–${bar.start + bar.duration} (${STATUS_TYPES[bar.statusIdx].label})`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5 flex-wrap">
        {STATUS_TYPES.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: s.color, opacity: s.label === 'Pending' ? 0.4 : 0.85 }} />
            <span className="text-[11px] font-semibold text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

DailySalesGantt.displayName = 'DailySalesGantt';
export default DailySalesGantt;
