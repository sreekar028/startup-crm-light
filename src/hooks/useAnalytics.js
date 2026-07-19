import { useMemo, useState, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import { sampleLeads } from '../data/sampleLeads';
import {
  filterLeadsByDate,
  getPreviousPeriodLeads,
  calcGrowth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers';

/**
 * useAnalytics hook centralizes all analytics data computations.
 * All expensive calculations are memoized so components never re-derive unnecessarily.
 */
export default function useAnalytics() {
  const { leads: allLeads } = useLeads();
  const normalizedAllLeads = Array.isArray(allLeads) ? allLeads : [];
  const leadSource = normalizedAllLeads.length > 0 ? normalizedAllLeads : sampleLeads;
  const safeLeadSource = Array.isArray(leadSource) ? leadSource : [];

  const [dateFilter, setDateFilter] = useState('all');
  const [customRange, setCustomRange] = useState(null);

  // Filtered leads for current period
  const leads = useMemo(
    () => filterLeadsByDate(safeLeadSource, dateFilter, customRange),
    [safeLeadSource, dateFilter, customRange]
  );

  // Previous period leads for growth comparison
  const prevLeads = useMemo(
    () => getPreviousPeriodLeads(safeLeadSource, dateFilter === 'all' ? '30d' : dateFilter),
    [safeLeadSource, dateFilter]
  );

  // ── KPI Summary ──────────────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    const safePrevLeads = Array.isArray(prevLeads) ? prevLeads : [];
    const total = safeLeads.length;
    const prevTotal = safePrevLeads.length;

    const won = safeLeads.filter(l => l.status === 'Won');
    const prevWon = safePrevLeads.filter(l => l.status === 'Won');

    const convRate = total ? Math.round((won.length / total) * 100) : 0;
    const prevConvRate = prevTotal ? Math.round((prevWon.length / prevTotal) * 100) : 0;

    const pipelineVal = getPipelineValue(safeLeads);
    const wonRev = getWonRevenue(safeLeads);
    const prevWonRev = getWonRevenue(safePrevLeads);

    const avgCycle = getAverageSalesCycle(safeLeads);
    const lostRate = getLostRate(safeLeads);

    return {
      totalLeads: { value: total, growth: calcGrowth(total, prevTotal) },
      conversionRate: { value: convRate, growth: calcGrowth(convRate, prevConvRate) },
      pipelineValue: { value: pipelineVal, growth: calcGrowth(pipelineVal, getPipelineValue(prevLeads)) },
      wonRevenue: { value: wonRev, growth: calcGrowth(wonRev, prevWonRev) },
      avgSalesCycle: { value: avgCycle, growth: 0 },
      lostRate: { value: lostRate, growth: 0 },
    };
  }, [leads, prevLeads]);

  // ── Chart Data ───────────────────────────────────────────────────────────────
  // Always guard with safeArr before passing to helper functions
  // This prevents crashes when leads transitions from undefined → array during API fetch

  const safeLeadsForCharts = useMemo(
    () => (Array.isArray(leads) ? leads : []),
    [leads]
  );

  const statusDistribution = useMemo(() => getStatusDistribution(safeLeadsForCharts), [safeLeadsForCharts]);
  const monthlyLeads = useMemo(() => getMonthlyLeads(safeLeadsForCharts), [safeLeadsForCharts]);
  const conversionByMonth = useMemo(() => getConversionByMonth(safeLeadsForCharts), [safeLeadsForCharts]);
  const revenueByMonth = useMemo(() => getRevenueByMonth(safeLeadsForCharts), [safeLeadsForCharts]);
  const leadSourceStats = useMemo(() => getLeadSourceStats(safeLeadsForCharts), [safeLeadsForCharts]);
  const funnelData = useMemo(() => getFunnelData(safeLeadsForCharts), [safeLeadsForCharts]);
  const salesVelocity = useMemo(() => getSalesVelocity(safeLeadsForCharts), [safeLeadsForCharts]);
  const prevSalesVelocity = useMemo(() => getSalesVelocity(Array.isArray(prevLeads) ? prevLeads : []), [prevLeads]);
  const forecast = useMemo(() => getForecastRevenue(safeLeadsForCharts), [safeLeadsForCharts]);
  const topPerformers = useMemo(() => getTopPerformers(safeLeadsForCharts), [safeLeadsForCharts]);
  const heatmapData = useMemo(() => getActivityHeatmapData(safeLeadsForCharts), [safeLeadsForCharts]);

  const handleFilterChange = useCallback((filter) => {
    setDateFilter(filter);
    if (filter !== 'custom') setCustomRange(null);
  }, []);

  const handleCustomRange = useCallback((range) => {
    setCustomRange(range);
    setDateFilter('custom');
  }, []);

  return {
    leads,
    allLeads: leadSource,
    leadSource,
    dateFilter,
    handleFilterChange,
    handleCustomRange,
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
    heatmapData,
  };
}
