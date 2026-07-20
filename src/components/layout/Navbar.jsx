import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const { socket: globalSocket } = useSocket();

  useEffect(() => {
    if (!globalSocket) return;

    const handleNewAlert = (alert) => {
      setNotifications(prev => [{ 
        id: alert._id || Date.now(), 
        text: alert.message, 
        severity: alert.severity, 
        read: false,
        isAcknowledged: false,
        time: 'Just now'
      }, ...prev].slice(0, 10)); // Keep last 10
    };

    globalSocket.on('alert:new', handleNewAlert);

    return () => {
      globalSocket.off('alert:new', handleNewAlert);
    };
  }, [globalSocket]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary border-b-2 border-primary pb-1 font-body-base text-body-base flex items-center hover:bg-white/5 transition-all active:scale-95 duration-200 whitespace-nowrap"
      : "text-on-surface-variant hover:text-on-surface transition-colors font-body-base text-body-base flex items-center hover:bg-white/5 transition-all active:scale-95 duration-200 pb-1 border-b-2 border-transparent whitespace-nowrap";

  const unreadCount = (notifications || []).filter(n => !n.read && !n.isAcknowledged).length;

  const handleAcknowledge = async (e, id) => {
    e.stopPropagation();
    setNotifications(prev => (prev || []).map(n => n.id === id ? { ...n, isAcknowledged: true, read: true } : n));
    try {
      await api.put(`/alerts/${id}/acknowledge`);
    } catch (error) {
      
      // Ignore in prototype
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 fixed top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(107,216,203,0.1)]">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          ClusterTwin Forge
        </Link>
        <div className="hidden lg:flex space-x-6">
          <NavLink to="/" end className={navLinkClass}>Platform</NavLink>
          <NavLink to="/clusters" className={navLinkClass}>Clusters</NavLink>
          <NavLink to="/alerts" className={navLinkClass}>Alerts</NavLink>
          <NavLink to="/login" className={navLinkClass}>Login</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Console</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="text-on-surface-variant hover:bg-primary/10 transition-colors duration-200 p-2 rounded-full active:scale-95 flex items-center justify-center cursor-pointer relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 surface-glass border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
                <span className="font-headline-md text-sm text-on-surface">Smart Alerts</span>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/alerts')} className="font-label-mono text-[10px] text-primary hover:underline cursor-pointer">View All</button>
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                {(notifications || []).length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant font-body-sm text-sm">Cluster is nominal.</div>
                ) : (
                  (notifications || []).map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-label-mono text-[9px] px-1.5 py-0.5 rounded uppercase ${
                          n.severity === 'Critical' ? 'bg-error/20 text-error border border-error/30' :
                          n.severity === 'High' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
                          'bg-primary/20 text-primary border border-primary/30'
                        }`}>{n.severity || 'Update'}</span>
                        <span className="font-label-mono text-[10px] text-on-surface-variant">{n.time}</span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface mb-2">{n.text}</p>
                      {!n.isAcknowledged && (
                        <button onClick={(e) => handleAcknowledge(e, n.id)} className="text-[10px] font-label-mono text-primary border border-primary/30 hover:bg-primary/20 px-2 py-1 rounded transition-colors w-full cursor-pointer">
                          Acknowledge
                        </button>
                      )}
                      {n.isAcknowledged && (
                        <span className="text-[10px] font-label-mono text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-primary">check_circle</span> Acknowledged
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 surface-glass border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden z-50">
              <button onClick={() => navigate('/login')} className="w-full text-left px-4 py-3 hover:bg-white/5 font-body-sm text-sm text-error flex items-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-sm">logout</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
