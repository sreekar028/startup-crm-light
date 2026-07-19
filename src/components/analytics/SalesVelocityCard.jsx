import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { formatRupees, calcGrowth, getPipelineValue, getAverageSalesCycle, getWonRevenue } from '../../utils/analyticsHelpers';

/**
 * Sales velocity widget matching screenshot with detailed metrics breakdown.
 */
const SalesVelocityCard = memo(({ velocity = 0, prevVelocity = 0, leads = [] }) => {
  const growth = calcGrowth(velocity, prevVelocity);
  const isPos = growth >= 0;
  const safeLeads = Array.isArray(leads) ? leads : [];

  const openDeals = safeLeads.filter(l => !['Won', 'Lost'].includes(l.status)).length;
  const wonLeads = safeLeads.filter(l => l.status === 'Won');
  const avgDeal = wonLeads.length
    ? Math.round(wonLeads.reduce((s, l) => s + (Number(l.value) || 0), 0) / wonLeads.length)
    : 0;
  const estClosed30 = Math.round(velocity * 30);

  return (
    <div className="crm-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">Sales Velocity Widget</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Estimated revenue flowrate through your sales funnel daily.</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)' }}>
          <Zap size={16} className="text-warning" />
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {/* Current velocity */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Current Sales Velocity
          </p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{formatRupees(velocity)}<span className="text-base font-semibold text-slate-400">/day</span></p>
          <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-bold ${isPos ? 'text-success' : 'text-danger'}`}>
            {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPos ? '+' : ''}{growth}% vs previous 30 days
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3" style={{ background: '#111D40', border: '1px solid #1A2850' }}>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Open Deals</p>
            <p className="text-lg font-extrabold text-white">{openDeals}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: '#111D40', border: '1px solid #1A2850' }}>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Deal Value</p>
            <p className="text-sm font-extrabold text-white">{formatRupees(avgDeal)}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: '#111D40', border: '1px solid #1A2850' }}>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Closed 30d</p>
            <p className="text-sm font-extrabold text-white">{formatRupees(estClosed30)}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

SalesVelocityCard.displayName = 'SalesVelocityCard';
export default SalesVelocityCard;
