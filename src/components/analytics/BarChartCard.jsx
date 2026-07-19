import React, { memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="crm-card px-3.5 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="text-white font-bold">{payload[0].value} <span className="text-slate-400 font-normal">Leads</span></p>
    </div>
  );
};

const BarChartCard = memo(({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const maxVal = safeData.length ? Math.max(...safeData.map(d => Number(d?.Leads) || 0), 0) : 0;
  return (
    <div className="crm-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Monthly Leads Trend</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Volume of new leads acquired each month.</p>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} margin={{ top: 10, right: 5, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2850" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
            <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
            <Bar dataKey="Leads" radius={[5, 5, 0, 0]} maxBarSize={32} animationDuration={600}>
              {safeData.map((d, i) => (
                <Cell key={i} fill={(Number(d?.Leads) || 0) === maxVal ? '#2563EB' : '#1E3A6E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;
