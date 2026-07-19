import React, { memo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatRupees } from '../../utils/analyticsHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="crm-card px-3.5 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{label} Revenue</p>
      <p className="font-bold text-success">{formatRupees(payload[0].value)}</p>
    </div>
  );
};

const RevenueChartCard = memo(({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((s, d) => s + (Number(d?.Revenue) || 0), 0);
  return (
    <div className="crm-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Revenue Growth Trend</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Monthly won revenue from closed deals over the last 6 months.</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</p>
          <p className="text-sm font-extrabold text-success">{formatRupees(total)}</p>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={safeData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2850" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
            <YAxis axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
              tick={{ fontSize: 10, fontWeight: 600, fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Revenue" stroke="#22C55E" strokeWidth={2.5}
              fill="url(#revGrad)"
              dot={{ r: 4, fill: '#22C55E', stroke: '#0D1533', strokeWidth: 2 }}
              activeDot={{ r: 6 }} animationDuration={600} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RevenueChartCard.displayName = 'RevenueChartCard';
export default RevenueChartCard;
