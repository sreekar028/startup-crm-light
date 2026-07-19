import React, { memo, useState, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';

const renderActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value }) => (
  <g>
    <text x={cx} y={cy - 10} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: 28, fontWeight: 800 }}>{value}</text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748B" style={{ fontSize: 11, fontWeight: 600 }}>Total Leads</text>
    <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.4} />
  </g>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = d.total || 1;
  return (
    <div className="crm-card px-3.5 py-2.5 text-xs shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span className="font-bold text-white">{d.name}</span>
      </div>
      <div className="text-slate-400">{d.value} Leads</div>
      <div className="text-slate-500">{Math.round((d.value / total) * 100)}%</div>
    </div>
  );
};

const PieChartCard = memo(({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const total = safeData.reduce((s, d) => s + (Number(d?.value) || 0), 0);
  const enriched = safeData.map(d => ({ ...d, total }));
  const onEnter = useCallback((_, i) => setActiveIndex(i), []);

  return (
    <div className="crm-card p-6">
      <div className="mb-1">
        <h3 className="text-sm font-bold text-white">Lead Status Distribution</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Proportional breakdown of current leads in pipeline stages.</p>
      </div>

      {total === 0 ? (
        <div className="flex items-center justify-center h-52 text-xs text-slate-600">No data available</div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <div className="w-full sm:w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie activeIndex={activeIndex} activeShape={renderActiveShape}
                  data={enriched} cx="50%" cy="50%" innerRadius={56} outerRadius={76}
                  paddingAngle={2} dataKey="value" onMouseEnter={onEnter} animationDuration={600}>
                  {enriched.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 min-w-0">
            {enriched.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: '1px solid #1A2850' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-300 font-medium">{d.name}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-white">{d.value}</span>
                  <span className="text-slate-500">({Math.round((d.value / total) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

PieChartCard.displayName = 'PieChartCard';
export default PieChartCard;
