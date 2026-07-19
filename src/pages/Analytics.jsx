import React, { Suspense } from 'react';
import useAnalytics from '../hooks/useAnalytics';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import DailySalesGantt from '../components/analytics/DailySalesGantt';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import ForecastCard from '../components/analytics/ForecastCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Advanced Analytics Dashboard — matches the dark SaaS design in the screenshot.
 * Responsive design grid columns layout:
 * - Mobile: Stacks vertically (grid-cols-1)
 * - Tablet & Desktop: Side by side (md:grid-cols-2)
 */
export default function Analytics() {
  const {
    leads,
    allLeads,
    dateFilter,
    handleFilterChange,
    kpis,
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    salesVelocity,
    prevSalesVelocity,
    forecast,
    topPerformers,
  } = useAnalytics();

  const safeAllLeads = Array.isArray(allLeads) ? allLeads : [];
  const safeLeads = Array.isArray(leads) ? leads : [];
  const hasLeads = safeAllLeads.length > 0;
  const safeStatusDistribution = Array.isArray(statusDistribution) ? statusDistribution : [];
  const safeMonthlyLeads = Array.isArray(monthlyLeads) ? monthlyLeads : [];
  const safeConversionByMonth = Array.isArray(conversionByMonth) ? conversionByMonth : [];
  const safeRevenueByMonth = Array.isArray(revenueByMonth) ? revenueByMonth : [];
  const safeLeadSourceStats = Array.isArray(leadSourceStats) ? leadSourceStats : [];
  const safeFunnelData = Array.isArray(funnelData) ? funnelData : [];
  const safeTopPerformers = Array.isArray(topPerformers) ? topPerformers : [];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Track sales performance and pipeline trends.</p>
        </div>
        {hasLeads && (
          <AnalyticsFilters activeFilter={dateFilter} onFilterChange={handleFilterChange} />
        )}
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {!hasLeads ? (
        <EmptyAnalyticsState />
      ) : (
        <Suspense fallback={<LoadingSkeleton />}>

          {/* ── 1. KPI Strip ────────────────────────────────────────────────── */}
          <StatsCards kpis={kpis} />

          {/* ── 2. Distribution | Funnel ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartCard data={safeStatusDistribution} />
            <FunnelChartCard data={safeFunnelData} />
          </div>

          {/* ── 3. Bar | Line ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChartCard data={safeMonthlyLeads} />
            <LineChartCard data={safeConversionByMonth} />
          </div>

          {/* ── 4. Revenue | Sources ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChartCard data={safeRevenueByMonth} />
            <LeadSourceChart data={safeLeadSourceStats} />
          </div>

          {/* ── 5. Gantt | Top Performers ───────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailySalesGantt leads={leads} />
            <TopPerformersCard data={safeTopPerformers} />
          </div>

          {/* ── 6. Forecast | Velocity ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ForecastCard forecast={forecast} />
            <SalesVelocityCard
              velocity={salesVelocity}
              prevVelocity={prevSalesVelocity}
              leads={leads}
            />
          </div>

          {/* Footer */}
          <div className="text-center pb-2">
            <p className="text-[11px] text-slate-700">
              Analytics calculated in real-time from {safeLeads.length} lead{safeLeads.length !== 1 ? 's' : ''} in the current period.
            </p>
          </div>

        </Suspense>
      )}
    </div>
  );
}
