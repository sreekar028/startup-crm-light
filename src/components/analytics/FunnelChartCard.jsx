import React, { memo } from 'react';

/**
 * Proper triangular funnel chart matching the screenshot visual.
 * Each stage rendered as a tapering trapezoid strip.
 */
const FunnelChartCard = memo(({ data = [] }) => {
  const maxVal = data[0]?.value || 1;

  return (
    <div className="crm-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Sales Conversion Funnel</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Track the opportunities flow from top to closed won.</p>
      </div>

      {!maxVal ? (
        <div className="flex items-center justify-center h-48 text-xs text-slate-600">No data</div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Funnel visual */}
          <div className="w-full sm:w-1/2 flex flex-col items-center gap-0.5 py-2">
            {data.map((stage, i) => {
              const pct = Math.max(20, Math.round((stage.value / maxVal) * 100));
              const topW = i === 0 ? 100 : Math.max(20, Math.round((data[i - 1].value / maxVal) * 100));
              const clip = `polygon(${(100 - topW) / 2}% 0%, ${100 - (100 - topW) / 2}% 0%, ${100 - (100 - pct) / 2}% 100%, ${(100 - pct) / 2}% 100%)`;
              return (
                <div key={stage.name} className="w-full relative group" style={{ height: 36 }}>
                  <div
                    className="absolute inset-0 transition-all duration-500 cursor-pointer"
                    style={{ background: stage.color, clipPath: clip, opacity: 0.9 }}
                    title={`${stage.name}: ${stage.value}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow">{stage.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="w-full sm:w-1/2 space-y-2">
            {data.map((stage, i) => {
              const pct = stage.convRate ?? (i === 0 ? 100 : maxVal > 0 ? Math.round((stage.value / maxVal) * 100) : 0);
              return (
                <div key={stage.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
                    <span className="text-slate-300 font-medium">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-white">{stage.value}</span>
                    <span className="text-slate-500">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
