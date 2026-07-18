import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart } from 'lucide-react';
import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

// Auth pages don't get the sidebar/topbar shell
const AUTH_ROUTES = ['/login', '/register'];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {isAuthPage ? (
        /* ── Auth-only layout: no sidebar, no topbar ── */
        <AppRoutes />
      ) : (
        /* ── Main App layout ── */
        <div className="flex min-h-screen" style={{ background: '#06091A' }}>
          {/* Sidebar (drawer on mobile, side navigation on tablet+) */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content column */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top bar */}
            <TopBar onMenuToggle={() => setSidebarOpen(true)} />

            {/* Page content */}
            <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AppRoutes />
              </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 px-6 mb-16 md:mb-0" style={{ borderTop: '1px solid #1A2850' }}>
              <p className="text-[11px] text-slate-600">
                © 2025 Start Up CRM Lite. All rights reserved.
              </p>
            </footer>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around items-center h-16 border-t"
            style={{ background: '#0A0F28', borderColor: '#1A2850' }}
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                }`
              }
              aria-label="Navigate to Dashboard"
            >
              <LayoutDashboard size={20} />
              <span className="mt-1 text-[10px] font-bold">Dashboard</span>
            </NavLink>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                }`
              }
              aria-label="Navigate to Leads Management"
            >
              <Users size={20} />
              <span className="mt-1 text-[10px] font-bold">Leads</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                }`
              }
              aria-label="Navigate to Analytics Overview"
            >
              <LineChart size={20} />
              <span className="mt-1 text-[10px] font-bold">Analytics</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* Toast notifications — always rendered */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0D1533',
            color: '#F1F5F9',
            border: '1px solid #1A2850',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
          },
          success: { style: { borderLeft: '4px solid #22C55E' } },
          error: { style: { borderLeft: '4px solid #EF4444' } },
        }}
      />
    </>
  );
}
