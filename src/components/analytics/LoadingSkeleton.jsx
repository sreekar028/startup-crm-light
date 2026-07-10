import React, { memo } from 'react';

const Sk = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

const LoadingSkeleton = memo(() => (
  <div className="space-y-6">
    {/* KPI */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="crm-card p-5 space-y-3">
          <div className="flex items-start justify-between"><Sk className="h-3 w-16" /><Sk className="h-8 w-8 rounded-xl" /></div>
          <Sk className="h-7 w-20" /><Sk className="h-3 w-24" />
        </div>
      ))}
    </div>
    {/* Chart rows */}
    {[1, 2, 3, 4].map(row => (
      <div key={row} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map(col => (
          <div key={col} className="crm-card p-6 space-y-4">
            <Sk className="h-4 w-36" /><Sk className="h-3 w-24" /><Sk className="h-52 w-full" />
          </div>
        ))}
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';
export default LoadingSkeleton;
