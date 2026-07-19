import React, { memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="crm-card px-3.5 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{payload[0].payload.name}</p>
      <span style={{ color: payload[0].fill }} className="font-bold">{payload[0].value}</span>
      <span className="text-slate-400"> leads</span>
    </div>
  );
};

const LeadSourceChart = memo(({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((s, d) => s + (Number(d?.count) || 0), 0);
  return (
    <div className="crm-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">Acquisition Channels</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Distribution of opportunities by source and generation channel.</p>
      </div>
      {safeData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-xs text-slate-600">No data</div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1A2850" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} width={66} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={16} animationDuration={600}
                label={{ position: 'right', fontSize: 11, fontWeight: 700, fill: '#94A3B8',
                  formatter: (v) => `${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)` }}>
                {safeData.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

LeadSourceChart.displayName = 'LeadSourceChart';
export default LeadSourceChart;
