import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/leads': 'Leads Management',
  '/analytics': 'Analytics Overview',
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

  return (
    <header className="topbar sticky top-0 z-30 flex items-center justify-between px-4 py-3 lg:px-6">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMenuToggle}
          className="md:hidden p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Add Lead CTA */}
        <button
          onClick={() => navigate('/leads', { state: { openModal: true } })}
          className="flex items-center gap-1 px-3 py-2 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow transition-all active:scale-95 min-h-[44px] shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Lead</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User avatar with initials */}
        <div
          title={user?.name || 'User'}
          className="w-[44px] h-[44px] sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-extrabold shadow shrink-0 cursor-default select-none"
        >
          {initials}
        </div>

        {/* Notifications */}
        <button
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
