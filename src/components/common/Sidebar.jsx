import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, Rocket, X, HelpCircle, ChevronRight } from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    subtitle: 'Overview & KPIs',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Leads',
    subtitle: 'Manage & Track Leads',
    path: '/leads',
    icon: Users,
  },
  {
    name: 'Analytics',
    subtitle: 'Insights & Performance',
    path: '/analytics',
    icon: LineChart,
  },
];

/**
 * Sidebar component that adapts dynamically:
 * - Mobile: Hidden drawer, slides out on trigger.
 * - Tablet: Compact side bar showing icons + small labels only.
 * - Desktop: Wide side bar showing logo, icons, full labels, subtitles, helper card.
 */
function Sidebar({ isOpen, onClose }) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={handleClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 
          w-64 md:w-20 lg:w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0A0F28', borderRight: '1px solid #1A2850' }}
      >
        {/* Logo container */}
        <div className="flex items-center justify-between px-5 py-4 md:px-0 md:justify-center lg:justify-between lg:px-5" style={{ borderBottom: '1px solid #1A2850' }}>
          <div className="flex items-center gap-3 md:flex-col md:gap-1.5 lg:flex-row lg:gap-3">
            <div className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/30 min-w-[36px] min-h-[36px] flex items-center justify-center">
              <Rocket size={20} className="text-white" />
            </div>
            <div className="md:hidden lg:block text-left md:text-center lg:text-left">
              <p className="text-sm font-extrabold text-white leading-tight">Start Up CRM</p>
              <p className="text-[10px] text-blue-400 font-semibold tracking-wider">POWERED BY AI</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="md:hidden p-2 text-slate-500 hover:text-white rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close sidebar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav section label - hidden on tablet */}
        <div className="px-5 pt-6 pb-2 md:hidden lg:block">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Main Menu</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 md:px-2 lg:px-3 py-4 space-y-1 md:space-y-2 lg:space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={handleClose}
              className={({ isActive }) =>
                `flex flex-row md:flex-col lg:flex-row items-center gap-3 md:gap-1 lg:gap-3 px-3 md:px-1 lg:px-3 py-3 rounded-xl transition-all group min-h-[44px] ${
                  isActive ? 'sidebar-active' : 'hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-white/5 text-slate-400 group-hover:text-white'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0 md:w-full md:text-center lg:text-left">
                      <p className={`text-sm font-semibold leading-tight truncate ${
                        isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate md:hidden lg:block">
                        {item.subtitle}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="text-primary shrink-0 md:hidden lg:block" />
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Footer help card - hidden on tablet */}
        <div className="p-4 m-3 rounded-xl md:hidden lg:block" style={{ background: '#111D40', border: '1px solid #1A2850' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <HelpCircle size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Need Help?</p>
              <p className="text-[11px] text-slate-500">Contact Support</p>
            </div>
            <ChevronRight size={14} className="text-slate-500 ml-auto shrink-0" />
          </div>
        </div>

        {/* Version - hidden on tablet */}
        <div className="px-5 pb-4 text-center md:hidden lg:block">
          <p className="text-[10px] text-slate-600">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);
