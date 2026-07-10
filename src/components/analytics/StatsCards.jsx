import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Minus,
  Users, CheckCircle2, IndianRupee, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { formatRupees } from '../../utils/analyticsHelpers';

const CARD_DEFS = [
  { key: 'totalLeads',      label: 'TOTAL LEADS',      icon: Users,          iconBg: 'rgba(37,99,235,0.15)',  iconColor: '#3B82F6', format: v => String(v) },
  { key: 'conversionRate',  label: 'CONVERSION RATE',  icon: CheckCircle2,   iconBg: 'rgba(34,197,94,0.15)',  iconColor: '#22C55E', format: v => `${v}%`   },
  { key: 'pipelineValue',   label: 'PIPELINE VALUE',   icon: IndianRupee,    iconBg: 'rgba(245,158,11,0.15)', iconColor: '#F59E0B', format: formatRupees   },
  { key: 'wonRevenue',      label: 'WON REVENUE',      icon: Trophy,         iconBg: 'rgba(34,197,94,0.12)',  iconColor: '#22C55E', format: formatRupees   },
  { key: 'avgSalesCycle',   label: 'AVG SALES CYCLE',  icon: Clock,          iconBg: 'rgba(6,182,212,0.15)',  iconColor: '#06B6D4', format: v => `${v}`,   suffix: ' Days' },
  { key: 'lostRate',        label: 'LOST RATE',        icon: AlertTriangle,  iconBg: 'rgba(239,68,68,0.15)',  iconColor: '#EF4444', format: v => `${v}%`   },
];

const TrendBadge = memo(({ growth, invert }) => {
  if (!growth) return (
    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-0.5">
      <Minus size={10} /> 0%
    </span>
  );
  const positive = invert ? growth < 0 : growth > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={`text-[11px] font-bold flex items-center gap-0.5 ${positive ? 'text-success' : 'text-danger'}`}>
      <Icon size={10} />
      {Math.abs(growth)}% vs previous {' '}
      <span className="text-slate-500 font-normal">30 days</span>
    </span>
  );
});
TrendBadge.displayName = 'TrendBadge';

const StatsCards = memo(({ kpis }) => {
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {CARD_DEFS.map(card => {
        const Icon = card.icon;
        const kpi = kpis[card.key] || { value: 0, growth: 0 };
        const display = card.format(kpi.value) + (card.suffix || '');
        return (
          <div key={card.key} className="kpi-card p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-bold tracking-widest text-slate-500">{card.label}</p>
              <div className="p-2 rounded-lg" style={{ background: card.iconBg }}>
                <Icon size={15} style={{ color: card.iconColor }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">{display}</p>
            <TrendBadge growth={kpi.growth} invert={card.key === 'lostRate'} />
          </div>
        );
      })}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;
