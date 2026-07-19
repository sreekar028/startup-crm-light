import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, UserCircle2 } from 'lucide-react';
import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';

// Auth pages don't get the sidebar/topbar shell
const AUTH_ROUTES = ['/login', '/register'];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { isDarkMode } = useTheme();

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {isAuthPage ? (
        /* ── Auth-only layout: no sidebar, no topbar ── */
        <div className={isDarkMode ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-50 text-slate-900'}>
          <AppRoutes />
        </div>
      ) : (
        /* ── Main App layout ── */
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
          {/* Sidebar (drawer on mobile, side navigation on tablet+) */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content column */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top bar */}
            <TopBar onMenuToggle={() => setSidebarOpen(true)} />

            {/* Page content */}
            <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">
              <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
                <AppRoutes />
              </div>
            </main>

            {/* Footer */}
            <footer className={`border-t px-6 py-4 text-center mb-16 md:mb-0 ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
              <p className="text-[11px]">
                © 2025 Start Up CRM Lite. All rights reserved.
              </p>
            </footer>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex h-16 items-center justify-around border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex h-full w-full flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
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
                `flex h-full w-full flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
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
                `flex h-full w-full flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`
              }
              aria-label="Navigate to Analytics Overview"
            >
              <LineChart size={20} />
              <span className="mt-1 text-[10px] font-bold">Analytics</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex h-full w-full flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`
              }
              aria-label="Navigate to Profile"
            >
              <UserCircle2 size={20} />
              <span className="mt-1 text-[10px] font-bold">Profile</span>
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
