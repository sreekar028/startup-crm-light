import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading page components for optimal load performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * A beautiful skeleton screen spinner to show during lazy loading transitions.
 */
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {/* Sleek spinning gradient ring */}
      <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin dark:border-slate-800"></div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        Loading view...
      </p>
    </div>
  );
}

/**
 * Main application routes mapping component.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
