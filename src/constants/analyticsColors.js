/**
 * Centralized color palette for Analytics Dashboard.
 * All charts reference these constants for consistent branding.
 */

export const STATUS_COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  Meeting: '#F59E0B',
  'Proposal Sent': '#7C3AED',
  Proposal: '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

export const SOURCE_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#0EA5E9',
  '#EC4899',
  '#14B8A6',
];

export const CHART_COLORS = {
  primary: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#7C3AED',
  cyan: '#0EA5E9',
  pink: '#EC4899',
  teal: '#14B8A6',
  slate: '#94A3B8',
};

export const GRADIENT_COLORS = {
  revenue: { start: '#22C55E', end: 'rgba(34,197,94,0)' },
  leads: { start: '#2563EB', end: 'rgba(37,99,235,0)' },
  conversion: { start: '#7C3AED', end: 'rgba(124,58,237,0)' },
};

export const HEATMAP_COLORS = [
  '#F1F5F9', // 0
  '#BFDBFE', // 1-2
  '#93C5FD', // 3-5
  '#60A5FA', // 6-8
  '#3B82F6', // 9-12
  '#2563EB', // 13+
];
