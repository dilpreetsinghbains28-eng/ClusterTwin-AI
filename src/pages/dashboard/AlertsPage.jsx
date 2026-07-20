import { useState, useEffect } from 'react';
import { useToast } from '../../components/ui/Toast';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function AlertsPage() {
  const addToast = useToast();
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState({ counts: [], dismissed: 0, acknowledged: 0 });
  const [loading, setLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoDismissEnabled, setAutoDismissEnabled] = useState(true);
  const [dispatchEmail, setDispatchEmail] = useState('');
  const { socket: globalSocket } = useSocket();

  useEffect(() => {
    fetchAlerts();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!globalSocket) return;

    const handleNewAlert = (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 100)); // Keep recent 100
    };

    globalSocket.on('alert:new', handleNewAlert);

    return () => {
      globalSocket.off('alert:new', handleNewAlert);
    };
  }, [globalSocket]);

  const fetchAlerts = async () => {
    setLoading(true);
    setAlertsError(null);
    try {
      const res = await api.get('/alerts?sort=-createdAt&limit=50');
      setAlerts(res.data.data);
    } catch (err) {
      setAlertsError(err.message || 'Failed to fetch alerts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsError(null);
    try {
      const res = await api.get('/alerts/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      setAnalyticsError(err.message || 'Failed to load analytics.');
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await api.put(`/alerts/${id}/acknowledge`);
      setAlerts(prev => (prev || []).map(a => a._id === id ? { ...a, isAcknowledged: true } : a));
      addToast('Alert acknowledged');
      fetchAnalytics();
    } catch (error) {
      
      addToast('Failed to acknowledge alert');
    }
  };

  const handleMockDispatch = async (id) => {
    if (!dispatchEmail) {
      addToast('Please enter an email address for dispatch');
      return;
    }
    try {
      await api.post('/alerts/dispatch', { email: dispatchEmail, alertId: id });
      addToast('Alert dispatched via Email (Check backend console)');
      setDispatchEmail('');
    } catch (error) {
      
      addToast('Failed to dispatch alert');
    }
  };

  const severityColor = (sev) => {
    switch (sev) {
      case 'Critical': return 'bg-error/20 text-error border-error/30';
      case 'High': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Medium': return 'bg-tertiary/20 text-tertiary border-tertiary/30';
      case 'Low': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-background overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-error/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto min-h-[calc(100vh-80px)] flex flex-col gap-6 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="font-label-mono text-[11px] text-error uppercase tracking-widest">Global Notification Center</span>
            </div>
            <h1 className="font-display-lg text-3xl text-white">Smart Alerts Hub</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Alert Feed */}
          <div className="lg:col-span-8 surface-glass rounded-xl p-5 border border-white/5 flex flex-col min-h-[500px]">
            <h3 className="font-headline-md text-lg text-white mb-6">Live Activity Stream</h3>
            
            <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar flex flex-col gap-3 max-h-[600px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="font-label-mono text-primary text-xs animate-pulse">Syncing alert streams...</p>
                </div>
              ) : alertsError ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] bg-error/5 border border-error/20 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-error text-3xl mb-2">sync_problem</span>
                  <p className="font-label-mono text-error text-sm">{alertsError}</p>
                </div>
              ) : (alerts ?? []).length === 0 ? (
                <div className="text-on-surface-variant font-label-mono text-xs text-center py-10 border border-white/5 rounded-xl bg-surface-glass">Cluster is nominal. No alerts active.</div>
              ) : (
                (alerts ?? []).map(alert => (
                  <div key={alert._id} className={`surface-container-low border ${alert.isAcknowledged || alert.autoDismissed ? 'border-white/5 opacity-70' : 'border-error/20 bg-error/5'} rounded-lg p-4 transition-all`}>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-label-mono text-[9px] px-2 py-0.5 rounded uppercase border ${severityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="font-label-mono text-[10px] text-on-surface-variant">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                          {alert.autoDismissed && (
                            <span className="font-label-mono text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">auto_awesome</span> Auto-Dismissed
                            </span>
                          )}
                          {alert.isAcknowledged && (
                            <span className="font-label-mono text-[9px] bg-surface-variant text-on-surface-variant border border-outline px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">check</span> Acknowledged
                            </span>
                          )}
                        </div>
                        <h4 className="font-body-base text-sm text-white mb-1">{alert.message}</h4>
                        <p className="font-label-mono text-[10px] text-on-surface-variant">Type: {alert.type}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        {!alert.isAcknowledged && !alert.autoDismissed && (
                          <button 
                            onClick={() => handleAcknowledge(alert._id)}
                            className="bg-transparent border border-primary/50 text-primary hover:bg-primary/10 text-[11px] font-label-mono py-1.5 rounded transition-colors w-full"
                          >
                            Acknowledge
                          </button>
                        )}
                        <div className="flex gap-2 w-full">
                          <input 
                            type="email" 
                            placeholder="Email..." 
                            className="bg-[#1E293B] border border-white/10 text-white text-[10px] px-2 py-1 rounded w-full outline-none focus:border-primary"
                            onChange={(e) => setDispatchEmail(e.target.value)}
                          />
                          <button 
                            onClick={() => handleMockDispatch(alert._id)}
                            className="bg-surface-variant text-on-surface hover:bg-white/10 p-1.5 rounded border border-white/5 transition-colors"
                            title="Dispatch via Email"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analytics & Rules */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Rules Engine */}
            <div className="surface-glass rounded-xl p-5 border border-white/5">
              <h3 className="font-headline-md text-lg text-white mb-4">Smart Rules Engine</h3>
              
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <h4 className="text-sm text-white font-body-base">Auto-Dismiss Recovery</h4>
                  <p className="text-[10px] font-label-mono text-on-surface-variant">Clear alerts when machine returns to Normal state.</p>
                </div>
                <button 
                  onClick={() => setAutoDismissEnabled(!autoDismissEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${autoDismissEnabled ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${autoDismissEnabled ? 'left-5' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm text-white font-body-base">Push Notifications</h4>
                  <p className="text-[10px] font-label-mono text-on-surface-variant">Dispatch critical alerts to mobile app.</p>
                </div>
                <button 
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${pushEnabled ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? 'left-5' : 'left-1'}`}></span>
                </button>
              </div>
            </div>

            {/* Alert Analytics */}
            <div className="surface-glass rounded-xl p-5 border border-white/5 flex-1">
              <h3 className="font-headline-md text-lg text-white mb-4">Alert Analytics</h3>
              
              {analyticsError ? (
                <div className="bg-error/5 border border-error/20 rounded-lg p-4 text-center mb-6">
                  <p className="font-label-mono text-error text-[11px]">{analyticsError}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container border border-white/5 rounded-lg p-3 text-center">
                  <span className="block font-display-lg text-2xl text-primary">{analytics.acknowledged}</span>
                  <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider">Acknowledged</span>
                </div>
                <div className="bg-surface-container border border-white/5 rounded-lg p-3 text-center">
                  <span className="block font-display-lg text-2xl text-secondary">{analytics.dismissed}</span>
                  <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider">Auto-Dismissed</span>
                </div>
              </div>

              <h4 className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-3">Historical Severity Distribution</h4>
              <div className="flex flex-col gap-2">
                {['Critical', 'High', 'Medium', 'Low'].map(sev => {
                  const countObj = (analytics.counts ?? []).find(c => c._id === sev);
                  const count = countObj ? countObj.count : 0;
                  const total = (analytics.counts ?? []).reduce((acc, curr) => acc + curr.count, 0) || 1;
                  const percent = Math.round((count / total) * 100);
                  
                  let barColor = 'bg-primary';
                  if (sev === 'Critical') barColor = 'bg-error';
                  if (sev === 'High') barColor = 'bg-secondary';
                  if (sev === 'Medium') barColor = 'bg-tertiary';

                  return (
                    <div key={sev}>
                      <div className="flex justify-between text-[10px] font-label-mono mb-1">
                        <span className="text-white">{sev}</span>
                        <span className="text-on-surface-variant">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
