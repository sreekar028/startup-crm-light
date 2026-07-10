import React, { memo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = memo(() => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
        <BarChart3 size={48} className="text-primary" />
      </div>
      <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">No analytics available yet</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
        Add your first lead to start tracking business performance, conversion rates, and revenue trends.
      </p>
      <button
        onClick={() => navigate('/leads', { state: { openModal: true } })}
        className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-blue-700 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        Add Lead
      </button>
    </div>
  );
});

EmptyAnalyticsState.displayName = 'EmptyAnalyticsState';
export default EmptyAnalyticsState;
