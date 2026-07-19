import React, { memo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="crm-card px-3.5 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-bold" style={{ color: '#22C55E' }}>{payload[0].value}%</p>
    </div>
  );
};

const LineChartCard = memo(({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const avg = safeData.length ? Math.round(safeData.reduce((s, d) => s + (Number(d?.['Conversion Rate']) || 0), 0) / safeData.length) : 0;
  return (
    <div className="crm-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Monthly Conversion Trend</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Rate of won opportunities over total opportunities each month.</p>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData} margin={{ top: 10, right: 15, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2850" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]}
              tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} />
            {avg > 0 && <ReferenceLine y={avg} stroke="#1E3A6E" strokeDasharray="4 4" />}
            <Line type="monotone" dataKey="Conversion Rate" stroke="#22C55E" strokeWidth={2.5}
              dot={{ r: 4, fill: '#22C55E', stroke: '#0D1533', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22C55E' }} animationDuration={600} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;
