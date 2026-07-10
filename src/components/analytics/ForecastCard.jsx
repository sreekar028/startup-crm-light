import React, { memo } from 'react';
import { TrendingUp, ShieldCheck, Target } from 'lucide-react';
import { formatRupees } from '../../utils/analyticsHelpers';

const ForecastCard = memo(({ forecast = { forecast: 0, confidence: 0, trend: 0 } }) => {
  const { forecast: revenue, confidence, trend } = forecast;
  const confLabel = confidence >= 80 ? 'High Confidence' : confidence >= 60 ? 'Medium Confidence' : 'Low Confidence';
  const confColor = confidence >= 80 ? '#22C55E' : confidence >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="crm-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">Revenue Growth Forecast</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Data-driven sales forecast based on the upcoming quarter trends.</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.12)' }}>
          <TrendingUp size={16} className="text-primary" />
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {/* Predicted revenue */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Predicted Revenue (Next 90 Days)
          </p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{formatRupees(revenue)}</p>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Based on current trends and pipeline.</p>
        </div>

        {/* Trend badge */}
        {trend > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-success" />
            <span className="text-xs font-bold text-success">+{trend}%</span>
            <span className="text-xs text-slate-500">projected growth</span>
          </div>
        )}

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} style={{ color: confColor }} />
              <span className="text-xs font-bold text-slate-400">Forecast Confidence</span>
            </div>
            <span className="text-xs font-extrabold" style={{ color: confColor }}>
              {confLabel} ({confidence}%)
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#111D40' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${confidence}%`, background: confColor }} />
          </div>
        </div>
      </div>
    </div>
  );
});

ForecastCard.displayName = 'ForecastCard';
export default ForecastCard;
