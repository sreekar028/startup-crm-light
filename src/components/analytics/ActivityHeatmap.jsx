import React, { memo, useState } from 'react';
import { HEATMAP_COLORS } from '../../constants/analyticsColors';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getHeatColor(count) {
  if (count === 0) return HEATMAP_COLORS[0];
  if (count <= 2) return HEATMAP_COLORS[1];
  if (count <= 5) return HEATMAP_COLORS[2];
  if (count <= 8) return HEATMAP_COLORS[3];
  if (count <= 12) return HEATMAP_COLORS[4];
  return HEATMAP_COLORS[5];
}

/**
 * GitHub-style activity heatmap for CRM events.
 * Shows last 12 weeks of lead creation + meeting activity.
 */
const ActivityHeatmap = memo(({ data = { weeks: [], dayMap: {} } }) => {
  const [tooltip, setTooltip] = useState(null);
  const { weeks } = data;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activity Heatmap</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Lead creation &amp; meeting activity — last 12 weeks
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1.5 min-w-max relative">
          {/* Day labels */}
          <div className="flex flex-col gap-1.5 mr-1 pt-5">
            {DAYS.map((d, i) => (
              <div key={d} className={`h-4 text-[10px] font-semibold text-slate-400 flex items-center leading-none ${i % 2 !== 0 ? 'opacity-0' : ''}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {/* Month label spacer on first row */}
              <div className="h-4 text-[10px] font-bold text-slate-400 flex items-center leading-none">
                {wi % 3 === 0 && week[0] ? week[0].date.slice(5, 7) + '/' + week[0].date.slice(8, 10) : ''}
              </div>
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-4 h-4 rounded-sm cursor-pointer transition-transform hover:scale-125"
                  style={{ background: getHeatColor(day.count) }}
                  onMouseEnter={() => setTooltip({ date: day.date, count: day.count })}
                  onMouseLeave={() => setTooltip(null)}
                  title={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
            <span className="text-slate-400">{tooltip.date}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{tooltip.count} activities</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 text-[10px] font-semibold text-slate-400">
        <span>Less</span>
        {HEATMAP_COLORS.map((c, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;
