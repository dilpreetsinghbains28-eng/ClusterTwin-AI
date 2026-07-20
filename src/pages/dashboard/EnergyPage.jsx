import { useState, useEffect } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function EnergyPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [activeFactory, setActiveFactory] = useState(null);
  const [machines, setMachines] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const addToast = useToast();
  const { socket, globalKpis, alerts } = useSocket();
  const [hasFetchedAi, setHasFetchedAi] = useState(false);

  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!socket || !globalKpis) return;
    
    // Auto-select first available factory if none selected to join room
    if (!activeFactory && Object.keys(globalKpis ?? {}).length > 0) {
      const firstFactoryId = Object.keys(globalKpis ?? {})[0];
      setActiveFactory(firstFactoryId);
      socket.emit('join_factory', firstFactoryId);
    }

    const handleMachineTelemetry = (data) => {
      setMachines(data);
    };

    socket.on('telemetry:machines', handleMachineTelemetry);

    return () => {
      socket.off('telemetry:machines', handleMachineTelemetry);
      if (activeFactory) {
        socket.emit('leave_factory', activeFactory);
      }
    };
  }, [socket, globalKpis, activeFactory]);

  useEffect(() => {
    if (activeFactory && !hasFetchedAi) {
      api.get(`/ai/recommendations?factoryId=${activeFactory}`)
        .then(res => {
          setAiRecommendations(res.data?.data || []);
          setHasFetchedAi(true);
        })
        .catch(err => console.error('Failed to fetch AI Recs:', err));
    }
  }, [activeFactory, hasFetchedAi]);

  const livePower = activeFactory && globalKpis?.[activeFactory] ? (globalKpis[activeFactory].totalPowerKw || 0) : 0;
  
  // Calculate dynamic average energy per product
  const liveProduction = activeFactory && globalKpis?.[activeFactory] ? (globalKpis[activeFactory].totalProduction || 0) : 0;
  const energyPerProduct = liveProduction > 0 ? (livePower / liveProduction).toFixed(2) : '0.00';

  // Filter Energy specific alerts
  const energyAlerts = (alerts ?? []).filter(a => a.message?.toLowerCase().includes('power') || a.message?.toLowerCase().includes('thermal'));

  return (
    <>
    <div className="w-full max-w-[1440px] mx-auto">
      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-section-gap">
        <div className="surface-glass flex flex-col gap-2 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <p className="text-on-surface-variant text-body-sm font-medium">Live Electricity</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            </div>
          </div>
          <p className="text-on-background font-display-lg text-[32px] font-bold leading-tight tracking-tighter" id="live-power">{livePower.toFixed(0)} kW</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[#0bda4d] text-[16px]">trending_up</span>
            <p className="text-[#0bda4d] text-body-sm font-medium">Live Feed <span className="text-on-surface-variant font-normal text-xs ml-1">updating...</span></p>
          </div>
        </div>
        <div className="surface-glass flex flex-col gap-2 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <p className="text-on-surface-variant text-body-sm font-medium">Electricity Cost (MTD)</p>
            <span className="material-symbols-outlined text-tertiary text-[20px]">payments</span>
          </div>
          <p className="text-on-background font-display-lg text-[32px] font-bold leading-tight tracking-tighter">${(livePower * 0.12 * 24 * 30).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-primary text-[16px]">trending_down</span>
            <p className="text-primary text-body-sm font-medium">Est. Monthly <span className="text-on-surface-variant font-normal text-xs ml-1">@ $0.12/kWh</span></p>
          </div>
        </div>
        <div className="surface-glass flex flex-col gap-2 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <p className="text-on-surface-variant text-body-sm font-medium">Carbon Footprint</p>
            <span className="material-symbols-outlined text-outline text-[20px]">co2</span>
          </div>
          <p className="text-on-background font-display-lg text-[32px] font-bold leading-tight tracking-tighter">{(livePower * 0.4).toFixed(1)}t</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-primary text-[16px]">trending_down</span>
            <p className="text-primary text-body-sm font-medium">Estimated <span className="text-on-surface-variant font-normal text-xs ml-1">based on load</span></p>
          </div>
        </div>
        <div className="surface-glass flex flex-col justify-between rounded-xl p-6 relative overflow-hidden">
          <div className="z-10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-on-surface-variant text-body-sm font-medium">Green Score</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-on-background font-display-lg text-[40px] font-bold leading-none tracking-tighter">{livePower > 500 ? 72 : 88}</p>
              <p className="text-on-surface-variant text-sm mb-1">/100</p>
            </div>
          </div>
          {/* Mock Gauge Background */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-[8px] border-surface-container flex items-center justify-center opacity-40">
            <div className="w-28 h-28 rounded-full border-[8px] border-primary border-t-transparent border-r-transparent transform rotate-45 transition-transform duration-1000" style={{ transform: `rotate(${livePower > 500 ? '20' : '65'}deg)`}}></div>
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-section-gap">
        {/* Middle Column (Charts & KPI) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-glass rounded-xl p-6 min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-on-surface text-lg">Live Energy Trend</h3>
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">LIVE</span>
              </div>
              <div className="flex-1 w-full bg-surface-container-low rounded border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-primary/20 to-transparent clip-path-trend transition-all duration-1000" style={{ transform: `scaleY(${0.5 + (livePower % 100) / 200})`, transformOrigin: 'bottom' }}></div>
                <svg className="absolute inset-0 w-full h-full stroke-primary transition-all duration-1000" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ transform: `translateY(${(livePower % 10) - 5}px)` }}>
                  <path d="M0,80 Q10,75 20,60 T40,50 T60,65 T80,40 T100,30" fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                </svg>
                <svg className="absolute inset-0 w-full h-full stroke-outline-variant stroke-dashed" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,60 L100,60" fill="none" strokeDasharray="4,4" strokeWidth="1" vectorEffect="non-scaling-stroke"></path>
                </svg>
                <span className="text-outline-variant text-xs absolute top-2 right-2">Savings Target</span>
              </div>
            </div>
            <div className="surface-glass rounded-xl p-6 min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-on-surface text-lg">Energy Distribution</h3>
              </div>
              <div className="flex-1 flex items-center justify-center gap-6">
                {/* Donut Chart Mockup */}
                <div className="relative w-32 h-32 rounded-full border-[12px] border-surface-container transition-transform duration-1000" style={{ transform: `rotate(${livePower % 10}deg)` }}>
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-primary" style={{ clipPath: 'polygon(50% 50%, 100% -20%, 100% 100%, -20% 100%, -20% 50%)' }}></div>
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-tertiary" style={{ clipPath: 'polygon(50% 50%, -20% 50%, -20% -20%, 50% -20%)' }}></div>
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-secondary" style={{ clipPath: 'polygon(50% 50%, 50% -20%, 100% -20%)' }}></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span><span className="text-sm text-on-surface-variant">Extruders (55%)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-tertiary"></span><span className="text-sm text-on-surface-variant">HVAC (25%)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-sm text-on-surface-variant">CNC (20%)</span></div>
                </div>
              </div>
            </div>
          </div>
          {/* Special KPI */}
          <div className="surface-glass rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-primary transition-all duration-500">
            <div>
              <p className="text-on-surface-variant text-body-sm font-medium mb-1">Energy Per Product</p>
              <h4 className="font-display-lg text-2xl text-on-surface">{energyPerProduct} kWh / unit</h4>
            </div>
            <div className="h-12 w-px bg-outline-variant hidden md:block"></div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <div className="flex justify-between text-xs text-on-surface-variant font-label-mono">
                <span>Current: {energyPerProduct}</span>
                <span>Target: 1.30</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(10, (1.30 / parseFloat(energyPerProduct || 1.30)) * 100))}%` }}></div>
              </div>
            </div>
          </div>
          {/* Shared Machine Table Component */}
          <div className="surface-glass rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 pb-4 pt-6">
              <h2 className="text-on-surface text-[22px] font-bold leading-tight tracking-[-0.015em] font-display-lg">Live Machine Energy Overview</h2>
              <span className="flex items-center gap-2 font-label-mono text-xs text-primary"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> STREAMING</span>
            </div>
            <div className="px-6 pb-6">
              <div className="flex overflow-hidden rounded border border-outline-variant bg-surface">
                <table className="flex-1 w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant text-sm font-medium font-body-sm uppercase tracking-wider">
                      <th className="px-4 py-3">Machine</th>
                      <th className="px-4 py-3">Current Draw</th>
                      <th className="px-4 py-3">Voltage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Idle Alert</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body-sm text-on-surface divide-y divide-outline-variant/50">
                    {(machines ?? []).map((machine) => {
                      const isIdle = machine?.status === 'Idle';
                      const isWarning = ['Overheating', 'Overloaded'].includes(machine?.status);
                      return (
                        <tr key={machine?.machineId || Math.random()} className={`hover:bg-surface-container-low transition-colors ${isWarning ? 'bg-error-container/10' : ''}`}>
                          <td className="px-4 py-3 font-medium">{machine?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 font-label-mono text-tertiary">{machine?.telemetry?.pwr ?? '0.0'} kW</td>
                          <td className="px-4 py-3 font-label-mono">{machine?.telemetry?.vol ?? '---'} V</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 bg-surface-container-highest text-on-surface text-xs">
                              <span className={`w-2 h-2 rounded-full ${isIdle ? 'bg-outline' : (isWarning ? 'bg-error animate-pulse' : 'bg-primary')}`}></span>
                              {machine?.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {isIdle && parseFloat(machine?.telemetry?.pwr || '0') > 0.5 ? (
                              <span className="text-error font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">warning</span> Parasitic Draw</span>
                            ) : (
                              <span className="text-outline">Normal</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {(machines ?? []).length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant">Awaiting telemetry data...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column (AI Insights & Alerts) */}
        <div className="flex flex-col gap-6">
          {/* AI Savings Panel */}
          <div className="surface-glass rounded-xl p-6 bg-gradient-to-br from-surface-container to-surface-container-low border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h3 className="font-headline-md text-on-surface text-lg">AI Recommendations</h3>
            </div>
            <div className="space-y-4">
              {(aiRecommendations ?? []).length === 0 ? (
                <p className="text-sm text-on-surface-variant italic">No AI recommendations available at this time.</p>
              ) : (
                (aiRecommendations ?? []).slice(0, 3).map((rec, i) => (
                  <div key={rec?._id || i} onClick={() => { addToast('Action triggered'); handleAction('Recommendation Applied', 'AI automation protocols initiated.'); }} className="p-4 rounded-lg bg-surface border border-outline-variant hover:border-primary/50 transition-colors cursor-pointer group">
                    <p className="text-sm text-on-surface mb-2">{rec?.type}: {rec?.target}</p>
                    <div className="flex justify-between items-center text-xs font-label-mono">
                      <span className="text-primary font-medium">{rec?.explanation || 'Optimal efficiency route'}</span>
                      <span className="text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-1">Apply <span className="material-symbols-outlined text-[14px]">arrow_forward</span></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Alerts Feed */}
          <div className="surface-glass rounded-xl p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <h3 className="font-headline-md text-on-surface text-lg">Energy Alerts</h3>
              </div>
              <span className="bg-error/20 text-error text-xs font-bold px-2 py-1 rounded-full">{(energyAlerts ?? []).length} New</span>
            </div>
            <div className="space-y-3">
              {(energyAlerts ?? []).slice(0, 5).map((alert, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded bg-surface-container-lowest border-l-2 ${alert?.severity === 'Critical' ? 'border-error' : 'border-tertiary'}`}>
                  <span className={`material-symbols-outlined text-[20px] mt-0.5 ${alert?.severity === 'Critical' ? 'text-error' : 'text-tertiary'}`}>warning</span>
                  <div>
                    <p className="text-sm text-on-surface font-medium">{alert?.message || 'Unknown alert'}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{formatTime(alert?.createdAt)}</p>
                  </div>
                </div>
              ))}
              {(energyAlerts ?? []).length === 0 && (
                <p className="text-sm text-on-surface-variant italic">No recent energy anomalies.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ActionModal
      isOpen={modalState.isOpen}
      title={modalState.title}
      message={modalState.message}
      onClose={() => setModalState({ ...modalState, isOpen: false })}
      onConfirm={() => {}}
    />
    </>
  );
}
