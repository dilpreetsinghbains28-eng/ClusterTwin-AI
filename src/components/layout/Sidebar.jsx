import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ActionModal from "../ui/ActionModal";

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Overview' },
  { to: '/alerts', icon: 'notifications', label: 'Smart Alerts' },
  { to: '/factories', icon: 'precision_manufacturing', label: 'Factories' },
  { to: '/clusters', icon: 'hub', label: 'Cluster Map' },
  { to: '/digital-twin', icon: 'view_in_ar', label: 'Digital Twin' },
  { to: '/energy', icon: 'bolt', label: 'Energy' },
  { to: '/ai-insights', icon: 'psychology', label: 'AI Insights' },
  { to: '/reports', icon: 'analytics', label: 'Reports' },
  { to: '/government', icon: 'account_balance', label: 'Government Dashboard' },
  { to: '/simulation', icon: 'science', label: 'Simulation Center' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

const footerItems = [
  { to: '/docs', icon: 'menu_book', label: 'Documentation' },
  { to: '/status', icon: 'wifi_tethering', label: 'System Status' },
  { to: '/support', icon: 'help', label: 'Support' },
];

export default function Sidebar() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const navigate = useNavigate();

  const handleAction = (title, message) => {
    setModalState({ isOpen: true, title, message });
  };

  const activeNavLinkClass = 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container/20 text-primary border-r-4 border-primary font-label-mono text-label-mono';
  const inactiveNavLinkClass = 'flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-300 hover:translate-x-1 font-label-mono text-label-mono';

  const activeFooterLinkClass = 'flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-container/10 text-primary border-r-2 border-primary font-label-mono text-label-mono text-xs';
  const inactiveFooterLinkClass = 'flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all font-label-mono text-label-mono text-xs';

  return (
    <>
      <aside className="hidden md:flex flex-col py-6 px-4 space-y-2 bg-surface-container-low/60 backdrop-blur-2xl fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-white/5 z-40 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-black text-primary text-xl">ClusterTwin</h2>
          </div>
          <p className="font-label-mono text-label-mono text-on-surface-variant">Active Nodes: 1,240</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => isActive ? activeNavLinkClass : inactiveNavLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-1 border-t border-white/5 pt-4">
          <button 
            onClick={() => handleAction('Connect Asset', 'Connecting new industrial assets requires administrative privileges.')}
            className="w-full flex items-center justify-center gap-2 primary-gradient text-white py-3 rounded-lg font-label-mono text-label-mono font-bold primary-glow-hover transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Connect Asset
          </button>
          {footerItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => isActive ? activeFooterLinkClass : inactiveFooterLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span 
                    className="material-symbols-outlined text-sm"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => handleAction('Log Out', 'Are you sure you want to log out?')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-white/5 transition-all font-label-mono text-label-mono text-xs cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <ActionModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {
          if (modalState.title === 'Log Out') {
            navigate('/login');
          }
        }}
      />
    </>
  );
}
