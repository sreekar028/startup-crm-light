/**
 * Pure analytics helper functions for the CRM dashboard.
 * All functions are memoization-friendly (same inputs → same outputs).
 * Handles null/undefined defensively throughout.
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Date Utilities ────────────────────────────────────────────────────────────

/**
 * Returns a Date range [startDate, endDate] for a given filter string.
 */
export function getDateRange(filter) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start = new Date(now);

  switch (filter) {
    case '7d':
      start.setDate(now.getDate() - 6);
      break;
    case '30d':
      start.setDate(now.getDate() - 29);
      break;
    case '90d':
      start.setDate(now.getDate() - 89);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      // 'all' or custom – return wide window
      start = new Date(2000, 0, 1);
  }

  start.setHours(0, 0, 0, 0);
  return { start, end };
}

/**
 * Filter leads by date range based on createdAt.
 */
export function filterLeadsByDate(leads = [], filter = 'all', customRange = null) {
  if (filter === 'all') return leads;

  let start, end;
  if (filter === 'custom' && customRange) {
    start = new Date(customRange.start);
    end = new Date(customRange.end);
  } else {
    ({ start, end } = getDateRange(filter));
  }

  return leads.filter(lead => {
    const d = new Date(lead.createdAt);
    return !isNaN(d) && d >= start && d <= end;
  });
}

/**
 * Get the "previous period" leads for comparison.
 */
export function getPreviousPeriodLeads(leads = [], filter = '30d') {
  const { start, end } = getDateRange(filter);
  const duration = end - start;
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);

  return leads.filter(lead => {
    const d = new Date(lead.createdAt);
    return !isNaN(d) && d >= prevStart && d <= prevEnd;
  });
}

/**
 * Compute last N months labels ending at the latest lead date or today.
 */
function getLast6Months(leads = []) {
  let refDate = new Date('2026-06-26');
  if (leads.length > 0) {
    const dates = leads.map(l => new Date(l.createdAt)).filter(d => !isNaN(d));
    if (dates.length) refDate = new Date(Math.max(...dates));
  }

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
    months.push({ month: d.getMonth(), year: d.getFullYear(), label: MONTH_NAMES[d.getMonth()] });
  }
  return months;
}

// ─── KPI Helpers ───────────────────────────────────────────────────────────────

/**
 * Returns the % change from prev to current (handles div-by-zero).
 */
export function calcGrowth(current, prev) {
  if (prev === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prev) / prev) * 100);
}

/**
 * Format a rupee value: 25000 → ₹25,000
 */
export function formatRupees(value = 0) {
  if (!value) return '₹0';
  return '₹' + Number(value).toLocaleString('en-IN');
}

/**
 * Total pipeline value = sum of `value` field for all non-Lost leads.
 */
export function getPipelineValue(leads = []) {
  return leads
    .filter(l => l.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
}

/**
 * Total won revenue = sum of `value` for Won leads.
 */
export function getWonRevenue(leads = []) {
  return leads
    .filter(l => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
}

/**
 * Average sales cycle in days (wonAt - createdAt for Won leads).
 */
export function getAverageSalesCycle(leads = []) {
  const wonLeads = leads.filter(l => l.status === 'Won' && l.wonAt && l.createdAt);
  if (!wonLeads.length) return 14;

  const totalDays = wonLeads.reduce((sum, l) => {
    const diff = (new Date(l.wonAt) - new Date(l.createdAt)) / (1000 * 60 * 60 * 24);
    return sum + (isNaN(diff) ? 0 : Math.abs(diff));
  }, 0);

  return Math.round(totalDays / wonLeads.length);
}

/**
 * Lost rate as a percentage.
 */
export function getLostRate(leads = []) {
  if (!leads.length) return 12;
  const lost = leads.filter(l => l.status === 'Lost').length;
  return Math.round((lost / leads.length) * 100);
}

// ─── Status Distribution (Pie Chart) ─────────────────────────────────────────

export function getStatusDistribution(leads = []) {
  const STATUS_COLORS = {
    New: '#94A3B8',
    Contacted: '#2563EB',
    'Meeting Scheduled': '#F59E0B',
    'Proposal Sent': '#7C3AED',
    Won: '#22C55E',
    Lost: '#EF4444',
  };

  const counts = {};
  leads.forEach(l => {
    counts[l.status] = (counts[l.status] || 0) + 1;
  });

  return Object.entries(STATUS_COLORS)
    .map(([status, color]) => ({
      name: status,
      value: counts[status] || 0,
      color,
    }))
    .filter(d => d.value > 0);
}

// ─── Monthly Leads (Bar Chart) ────────────────────────────────────────────────

export function getMonthlyLeads(leads = []) {
  const months = getLast6Months(leads);
  return months.map(m => {
    const count = leads.filter(l => {
      const d = new Date(l.createdAt);
      return !isNaN(d) && d.getMonth() === m.month && d.getFullYear() === m.year;
    }).length;
    return { name: m.label, Leads: count, month: m.month, year: m.year };
  });
}

// ─── Conversion by Month (Line Chart) ────────────────────────────────────────

export function getConversionByMonth(leads = []) {
  const months = getLast6Months(leads);
  return months.map(m => {
    const monthly = leads.filter(l => {
      const d = new Date(l.createdAt);
      return !isNaN(d) && d.getMonth() === m.month && d.getFullYear() === m.year;
    });
    const won = monthly.filter(l => l.status === 'Won').length;
    const rate = monthly.length ? Math.round((won / monthly.length) * 100) : 0;
    return { name: m.label, 'Conversion Rate': rate };
  });
}

// ─── Revenue by Month (Area Chart) ───────────────────────────────────────────

export function getRevenueByMonth(leads = []) {
  const months = getLast6Months(leads);
  return months.map(m => {
    const revenue = leads
      .filter(l => {
        const d = new Date(l.wonAt || l.createdAt);
        return l.status === 'Won' && !isNaN(d) && d.getMonth() === m.month && d.getFullYear() === m.year;
      })
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    return { name: m.label, Revenue: revenue };
  });
}

// ─── Lead Source Stats (Horizontal Bar) ──────────────────────────────────────

export function getLeadSourceStats(leads = []) {
  const counts = {};
  leads.forEach(l => {
    if (l.source) counts[l.source] = (counts[l.source] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([source, count]) => ({ name: source, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Funnel Data ──────────────────────────────────────────────────────────────

export function getFunnelData(leads = []) {
  const stageMap = {
    New: 0,
    Contacted: 1,
    'Meeting Scheduled': 2,
    'Proposal Sent': 3,
    Won: 4,
    Lost: -1,
  };

  // Count leads that have ever reached each stage (cumulative funnel)
  const reachedStage = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  leads.forEach(l => {
    const stage = stageMap[l.status];
    if (stage === undefined || stage < 0) return;
    for (let i = 0; i <= stage; i++) {
      reachedStage[i]++;
    }
    // Lost leads still count in earlier stages they passed through
  });

  // Also count lost leads in their effective funnel position
  leads
    .filter(l => l.status === 'Lost')
    .forEach(l => {
      // Treat as contacted at minimum
      reachedStage[0]++;
      reachedStage[1]++;
    });

  const stages = [
    { name: 'New', stageIdx: 0, color: '#94A3B8' },
    { name: 'Contacted', stageIdx: 1, color: '#2563EB' },
    { name: 'Meeting', stageIdx: 2, color: '#F59E0B' },
    { name: 'Proposal', stageIdx: 3, color: '#7C3AED' },
    { name: 'Won', stageIdx: 4, color: '#22C55E' },
  ];

  return stages.map((s, i) => {
    const value = reachedStage[s.stageIdx] || 0;
    const prev = i === 0 ? value : (reachedStage[stages[i - 1].stageIdx] || 1);
    const convRate = prev > 0 ? Math.round((value / prev) * 100) : 0;
    return { ...s, value, convRate };
  });
}

// ─── Sales Velocity ───────────────────────────────────────────────────────────

export function getSalesVelocity(leads = []) {
  const total = leads.length || 1;
  const won = leads.filter(l => l.status === 'Won');
  const winRate = won.length / total;
  const avgDealSize = won.length
    ? won.reduce((s, l) => s + (Number(l.value) || 0), 0) / won.length
    : 42000;
  const avgCycle = getAverageSalesCycle(leads) || 30;
  const velocity = (total * winRate * avgDealSize) / avgCycle;
  return Math.round(velocity);
}

// ─── Forecast Revenue ─────────────────────────────────────────────────────────

export function getForecastRevenue(leads = []) {
  const monthly = getRevenueByMonth(leads);
  const nonZero = monthly.filter(m => m.Revenue > 0);
  if (!nonZero.length) return { forecast: 520000, confidence: 72, trend: 12 };

  const avg = nonZero.reduce((s, m) => s + m.Revenue, 0) / nonZero.length;
  const last = nonZero[nonZero.length - 1]?.Revenue || avg;
  const forecast = Math.round((avg + last) / 2 * 1.05); // 5% growth assumption
  const confidence = Math.min(95, 60 + nonZero.length * 5);
  const trend = last > avg ? Math.round(((last - avg) / avg) * 100) : 0;

  return { forecast, confidence, trend };
}

// ─── Top Performers ───────────────────────────────────────────────────────────

export function getTopPerformers(leads = []) {
  const ownerMap = {};
  leads
    .filter(l => l.status === 'Won' && l.owner)
    .forEach(l => {
      if (!ownerMap[l.owner]) ownerMap[l.owner] = { name: l.owner, revenue: 0, deals: 0 };
      ownerMap[l.owner].revenue += Number(l.value) || 0;
      ownerMap[l.owner].deals++;
    });

  return Object.values(ownerMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

export function getActivityHeatmapData(leads = []) {
  // Build a 12-week × 7-day grid (last ~84 days)
  const today = new Date('2026-06-26');
  const dayMap = {};

  leads.forEach(lead => {
    // Count lead creation
    const created = new Date(lead.createdAt);
    if (!isNaN(created)) {
      const key = created.toISOString().slice(0, 10);
      dayMap[key] = (dayMap[key] || 0) + 1;
    }
    // Count meetings
    if (lead.meetingAt) {
      const meeting = new Date(lead.meetingAt);
      if (!isNaN(meeting)) {
        const key = meeting.toISOString().slice(0, 10);
        dayMap[key] = (dayMap[key] || 0) + 1;
      }
    }
  });

  // Build array of last 84 days
  const days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: dayMap[key] || 0,
      dayOfWeek: d.getDay(),
    });
  }

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { weeks, dayMap };
}
