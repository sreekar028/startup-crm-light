import React, { memo, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Bell, Sun, Moon, LogOut, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadContext';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/leads': 'Leads Management',
  '/analytics': 'Analytics Overview',
  '/profile': 'Profile Settings',
};

/**
 * Top navigation bar — shows page title + global action buttons.
 * Optimized for touch targets (min 44x44px) and responsive states.
 */
const TopBar = memo(({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { leads } = useLeads();
  const [showNotifications, setShowNotifications] = useState(false);

  const title = PAGE_TITLES[location.pathname] || 'Startup CRM Lite';

  // User initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleMenuToggle = () => {
    if (onMenuToggle) onMenuToggle();
  };

  const notifications = useMemo(() => {
    if (!Array.isArray(leads) || leads.length === 0) {
      return [
        {
          id: 'welcome',
          title: 'Welcome back',
          message: 'Create or review your first lead to see activity here.',
          time: 'Just now',
        },
      ];
    }

    return leads.slice(0, 4).map((lead) => ({
      id: lead._id || lead.id,
      title: `${lead.name || 'Lead'} • ${lead.status || 'Updated'}`,
      message: lead.company ? `${lead.company} is in ${lead.status || 'progress'}.` : 'New activity was recorded.',
      time: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recently added',
    }));
  }, [leads]);

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:px-6 ${isDarkMode ? 'border-slate-800 bg-slate-900/95 text-slate-100' : 'border-slate-200 bg-white/95 text-slate-900'}`}>
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMenuToggle}
          className={`md:hidden flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className={`text-sm font-bold tracking-tight sm:text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Add Lead CTA */}
        <button
          onClick={() => navigate('/leads', { state: { openModal: true } })}
          className="flex min-h-[44px] shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white shadow transition-all hover:bg-primary-dark active:scale-95 sm:px-3.5 sm:py-2"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Lead</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User avatar with initials */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          title={user?.name || 'User'}
          className="flex h-[44px] w-[44px] shrink-0 select-none items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-white shadow transition hover:opacity-90 sm:h-9 sm:w-9"
        >
          {initials}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-danger" />
          </button>

          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border shadow-xl ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Latest lead activity</p>
                </div>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-sm font-semibold text-primary"
                >
                  View all
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate('/leads')}
                    className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/70' : 'border-slate-100 hover:bg-slate-50'}`}
                  >
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className={`mt-1 block text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.message}</span>
                      <span className={`mt-1 block text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.time}</span>
                    </span>
                    <ArrowRight size={14} className={`mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-red-950/30 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-500'}`}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
