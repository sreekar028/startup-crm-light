import React, { memo } from 'react';
import { Crown, Trophy, Medal, Star } from 'lucide-react';
import { formatRupees } from '../../utils/analyticsHelpers';

const RANK_META = [
  { Icon: Crown,  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: '1st' },
  { Icon: Trophy, color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', label: '2nd' },
  { Icon: Medal,  color: '#F97316', bg: 'rgba(249,115,22,0.10)', label: '3rd' },
  { Icon: Star,   color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', label: '4th' },
  { Icon: Star,   color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  label: '5th' },
];

const BAR_COLORS = ['#F59E0B', '#94A3B8', '#F97316', '#7C3AED', '#2563EB'];

const TopPerformersCard = memo(({ data = [] }) => {
  const maxRev = data[0]?.revenue || 1;

  return (
    <div className="crm-card p-6 h-full flex flex-col">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">Top Performers Leaderboard</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Ranking sales representatives by closed won deal revenue.</p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-600">No closed deals yet</div>
      ) : (
        <div className="flex-1 space-y-4">
          {data.map((rep, i) => {
            const meta = RANK_META[i] || RANK_META[4];
            const Icon = meta.Icon;
            const barPct = Math.max(10, Math.round((rep.revenue / maxRev) * 100));
            return (
              <div key={rep.name}>
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-5 text-center">
                    <span className="text-xs font-extrabold text-slate-500">{i + 1}</span>
                  </div>
                  <div className="p-1.5 rounded-lg" style={{ background: meta.bg }}>
                    <Icon size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{rep.name}</p>
                    <p className="text-[10px] text-slate-500">{rep.deals} deal{rep.deals !== 1 ? 's' : ''} closed</p>
                  </div>
                  <span className="text-xs font-extrabold text-white shrink-0">{formatRupees(rep.revenue)}</span>
                </div>
                {/* Revenue bar */}
                <div className="ml-8 h-1.5 rounded-full overflow-hidden" style={{ background: '#111D40' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barPct}%`, background: BAR_COLORS[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;
