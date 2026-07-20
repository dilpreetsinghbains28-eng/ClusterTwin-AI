import { useState, useMemo, useEffect } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function OverviewPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [factories, setFactories] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const { globalKpis, alerts } = useSocket();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [facRes, transRes] = await Promise.all([
          api.get('/factories'),
          api.get('/transfers/history')
        ]);
        setFactories(facRes.data?.data || []);
        setTransfers(transRes.data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch cluster data. Please check network connection.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

    // 1-6, 9: Calculate Aggregates
  const stats = useMemo(() => {
    let activeNodes = 0;
    let production = 0;
    let powerKw = 0;
    let alertsCount = (alerts ?? []).length;
    let maxNodes = (factories ?? []).length * 4; // assuming 4 machines per factory mock

    Object.values(globalKpis ?? {}).forEach(f => {
      activeNodes += f.activeMachines || 0;
      production += f.totalProduction || 0;
      powerKw += f.totalPowerKw || 0;
    });

    const oee = maxNodes > 0 ? (activeNodes / maxNodes) * 100 : 0;
    const carbon = powerKw * 0.45; // roughly 0.45 kg CO2e per kWh
    
    // Cluster Health Heuristic: 100 - (alerts * 2) - (100 - oee)
    let health = 100 - (alertsCount * 1.5) - (100 - (oee || 100));
    if (health < 0) health = 0;
    if (health > 100) health = 100;

    let machineHealth = 100 - (alertsCount * 2.5);
    if (machineHealth < 40) machineHealth = 40;

    console.log('Overview Stats Calc:', { globalKpisKeys: Object.keys(globalKpis ?? {}).length, production, powerKw });

    return { production, powerKw, carbon, oee, health, machineHealth, activeNodes };
  }, [globalKpis, alerts, factories]);

  // 12-13: Rank Factories
  const rankedFactories = useMemo(() => {
    const scored = (factories ?? []).map(f => {
      const kpi = globalKpis[f._id];
      const prod = kpi ? kpi.totalProduction : 0;
      const act = kpi ? kpi.activeMachines : 0;
      const score = prod + (act * 1000);
      return { ...f, score, act, prod };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [factories, globalKpis]);

  const topFactories = rankedFactories.slice(0, 3);
  const bottomFactories = rankedFactories.slice(-3).reverse(); // worst first

  const formatNumber = (num) => {
    if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num > 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  const latestTransfer = (transfers ?? []).length > 0 ? transfers[0] : null;

  return (
    <>
      <div className="absolute inset-0 bg-background overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-[20%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto min-h-[calc(100vh-80px)] flex flex-col gap-4 pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-label-mono text-[11px] text-primary uppercase tracking-widest">Global Executive Command Center</span>
            </div>
            <h1 className="font-display-lg text-3xl text-white">Cluster Matrix</h1>
          </div>
          <div className="text-right">
            <div className="font-label-mono text-2xl text-white tracking-widest">{time}</div>
            <div className="font-label-mono text-[10px] text-on-surface-variant uppercase">Synchronized (Socket.IO Live)</div>
          </div>
        </div>

        {/* Bento Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-label-mono text-primary text-sm animate-pulse">Initializing Cluster Matrix...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-error/5 border border-error/20 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-error text-4xl mb-4">cloud_off</span>
            <p className="font-headline-md text-error text-lg mb-2">Telemetry Disconnected</p>
            <p className="font-label-mono text-on-surface-variant text-sm">{error}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[140px]">
          
          {/* W1: Cluster Health Score */}
          <div className="col-span-1 md:col-span-2 row-span-1 surface-glass rounded-xl p-4 flex items-center justify-between border-t-2 border-primary bg-primary/5 shadow-2xl">
            <div>
              <h3 className="font-label-mono text-[10px] text-primary uppercase tracking-wider mb-1">Cluster Health Score</h3>
              <div className="font-display-lg text-5xl text-white">{stats.health.toFixed(1)}</div>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"></circle>
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#6bd8cb" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - stats.health}></circle>
              </svg>
            </div>
          </div>

          {/* W4, W5, W6, W9: Core KPIs */}
          <div className="col-span-1 md:col-span-1 row-span-1 surface-glass rounded-xl p-4 flex flex-col justify-center border border-white/5">
            <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Aggregate Prod.</span>
            <span className="font-headline-md text-2xl text-white">{formatNumber(stats.production)}</span>
            <span className="text-[10px] text-primary mt-1 flex items-center"><span className="material-symbols-outlined text-[12px]">trending_up</span> Live</span>
          </div>
          <div className="col-span-1 md:col-span-1 row-span-1 surface-glass rounded-xl p-4 flex flex-col justify-center border border-white/5">
            <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Power Draw</span>
            <span className="font-headline-md text-2xl text-white">{(stats.powerKw / 1000).toFixed(2)} MW</span>
            <span className="text-[10px] text-tertiary mt-1 flex items-center"><span className="material-symbols-outlined text-[12px]">electric_bolt</span> Live</span>
          </div>
          <div className="col-span-1 md:col-span-1 row-span-1 surface-glass rounded-xl p-4 flex flex-col justify-center border border-white/5">
            <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Carbon Gen.</span>
            <span className="font-headline-md text-2xl text-white">{formatNumber(stats.carbon)} <span className="text-sm">kg</span></span>
            <span className="text-[10px] text-secondary mt-1 flex items-center"><span className="material-symbols-outlined text-[12px]">co2</span> Live</span>
          </div>
          <div className="col-span-1 md:col-span-1 row-span-1 surface-glass rounded-xl p-4 flex flex-col justify-center border border-white/5 bg-surface-container">
            <span className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Total OEE</span>
            <span className="font-headline-md text-2xl text-primary">{stats.oee.toFixed(1)}%</span>
            <div className="w-full h-1 bg-white/10 mt-2 rounded overflow-hidden">
               <div className="h-full bg-primary transition-all duration-500" style={{width: `${stats.oee}%`}}></div>
            </div>
          </div>

          {/* W2: Live Factory Map (SVG Geo concept) */}
          <div className="col-span-1 md:col-span-3 lg:col-span-4 row-span-2 surface-glass rounded-xl p-4 relative overflow-hidden border border-white/5 flex flex-col">
            <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-2 z-10 relative">Live Factory Geography</h3>
            <div className="flex-1 relative w-full h-full">
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48cGF0aCBkPSJNMTAwIDIwMCBRIDIwMCA1MCA0MDAgMjAwIFQgNzAwIDIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEwNywgMjE2LCAyMDMsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCA0Ii8+PC9zdmc+')] bg-center bg-no-repeat bg-contain opacity-40"></div>
               {/* Mock Factory Nodes on Map */}
               <div className="absolute top-[40%] left-[25%] w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#6bd8cb] animate-pulse"></div>
               <div className="absolute top-[60%] left-[45%] w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#6bd8cb]"></div>
               <div className="absolute top-[30%] left-[70%] w-3 h-3 bg-tertiary rounded-full shadow-[0_0_15px_#ffb59a] animate-ping"></div>
               <div className="absolute top-[75%] left-[80%] w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#6bd8cb]"></div>
               
               <div className="absolute bottom-2 left-2 flex gap-3 z-10">
                 <span className="font-label-mono text-[9px] text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Optimal</span>
                 <span className="font-label-mono text-[9px] text-tertiary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span> Critical</span>
               </div>
            </div>
          </div>

          {/* W10: Risk Radar */}
          <div className="col-span-1 md:col-span-2 row-span-2 surface-glass rounded-xl p-4 border border-white/5 flex flex-col items-center">
            <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-2 w-full text-left">Risk Vector Radar</h3>
            <div className="flex-1 w-full relative flex items-center justify-center mt-4">
              <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] overflow-visible">
                {/* Background Web */}
                <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                
                {/* Data Polygon - Dynamic based on alerts */}
                <polygon 
                  points={`50,${15 + ((alerts ?? []).length * 5)} ${80 + (stats.powerKw > 1500 ? 10 : 0)},50 50,${70 + (100 - stats.health)} ${30 - (stats.oee < 80 ? 15 : 0)},50`} 
                  fill="rgba(255,181,154,0.2)" 
                  stroke="#ffb59a" 
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
                
                {/* Labels */}
                <text x="50" y="0" fill="#a2b0d3" fontSize="6" textAnchor="middle" className="font-label-mono uppercase">Thermal</text>
                <text x="50" y="104" fill="#a2b0d3" fontSize="6" textAnchor="middle" className="font-label-mono uppercase">Maint.</text>
                <text x="100" y="52" fill="#a2b0d3" fontSize="6" className="font-label-mono uppercase">Supply</text>
                <text x="0" y="52" fill="#a2b0d3" fontSize="6" textAnchor="end" className="font-label-mono uppercase">Power</text>
              </svg>
            </div>
          </div>

          {/* W14: Daily AI Summary */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 surface-glass rounded-xl p-4 border border-primary/20 bg-primary/5 flex flex-col justify-center">
            <h3 className="font-label-mono text-[9px] text-primary uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">auto_awesome</span> Synthesized Summary</h3>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
              Cluster functioning at <strong className="text-white">{stats.oee.toFixed(1)}% OEE</strong>. 
              {(alerts ?? []).length > 0 ? ` Detected ${(alerts ?? []).length} structural anomalies needing attention.` : ' No structural anomalies detected.'} 
              {stats.powerKw > 2000 ? ' Power draw is currently elevated above baseline thresholds.' : ' Power consumption is nominal.'}
            </p>
          </div>

          {/* W7: Machine Health Gauge */}
          <div className="col-span-1 md:col-span-1 row-span-1 surface-glass rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center">
            <h3 className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-2 w-full text-left">Fleet Health</h3>
            <div className="font-headline-md text-3xl text-white mb-1">{stats.machineHealth.toFixed(0)}%</div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className={`h-full transition-all ${stats.machineHealth > 75 ? 'bg-primary' : 'bg-tertiary'}`} style={{width: `${stats.machineHealth}%`}}></div>
            </div>
          </div>

          {/* W8: Resource Sharing Status */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3 row-span-1 surface-glass rounded-xl p-4 border border-white/5 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
             <h3 className="font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1"><span className="material-symbols-outlined text-xs">share_location</span> Active Exchange Hub</h3>
             {latestTransfer ? (
               <div className="flex items-center gap-4 relative z-10">
                 <div className="p-2 bg-secondary/20 rounded text-secondary border border-secondary/30"><span className="material-symbols-outlined">conveyor_belt</span></div>
                 <div className="flex-1">
                   <div className="font-headline-sm text-white text-sm">{latestTransfer.quantity}x {latestTransfer.resourceType}</div>
                   <div className="font-label-mono text-[10px] text-on-surface-variant">{latestTransfer.sourceFactory?.name} <span className="text-secondary">→</span> {latestTransfer.destinationFactory?.name}</div>
                 </div>
                 <div className="text-right">
                   <div className="font-label-mono text-[10px] text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">{latestTransfer.status}</div>
                   <div className="font-label-mono text-[9px] text-on-surface-variant mt-1">ETA: {latestTransfer.etaHours}h</div>
                 </div>
               </div>
             ) : (
               <div className="text-[11px] text-on-surface-variant">No active resource exchanges.</div>
             )}
          </div>

          {/* W11: Live Activity Feed */}
          <div className="col-span-1 md:col-span-2 row-span-2 surface-glass rounded-xl p-4 border border-white/5 flex flex-col">
            <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-4">Live Activity</h3>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3 pr-2">
              <div className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <div>
                  <div className="text-[11px] text-white">System sync completed</div>
                  <div className="text-[9px] text-on-surface-variant font-label-mono">{time}</div>
                </div>
              </div>
              {latestTransfer && (
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0"></span>
                  <div>
                    <div className="text-[11px] text-white">Transfer {latestTransfer.status}</div>
                    <div className="text-[9px] text-on-surface-variant font-label-mono">Asset Redistribution</div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <div>
                  <div className="text-[11px] text-white">Neural physics engine updated</div>
                  <div className="text-[9px] text-on-surface-variant font-label-mono">Simulation Core</div>
                </div>
              </div>
            </div>
          </div>

          {/* W3: AI Alerts */}
          <div className="col-span-1 md:col-span-2 row-span-2 surface-glass rounded-xl p-4 border border-tertiary/20 bg-tertiary/5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-label-mono text-[11px] text-tertiary uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-xs">warning</span> AI Alerts</h3>
              <span className="w-2 h-2 bg-tertiary rounded-full animate-ping"></span>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2 pr-2">
              {(alerts ?? []).length === 0 ? (
                <div className="text-[11px] text-on-surface-variant text-center mt-4">Nominal operations.</div>
              ) : (
                (alerts ?? []).map((alert, i) => (
                  <div key={i} className="bg-tertiary/10 border border-tertiary/30 p-2 rounded flex flex-col gap-1">
                    <span className="font-label-mono text-[10px] text-tertiary">{alert.type}</span>
                    <span className="text-[11px] text-white/90">{alert.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* W12 & W13: Factory Rankings */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 surface-glass rounded-xl p-4 border border-white/5 flex flex-col gap-4">
             <div className="flex-1">
               <h3 className="font-label-mono text-[10px] text-primary uppercase tracking-wider mb-2 border-b border-white/5 pb-1">Top Performers</h3>
               {(topFactories ?? []).map((f, i) => (
                 <div key={f._id} className="flex justify-between items-center mb-2">
                   <div className="text-[11px] text-white flex items-center gap-1"><span className="text-primary font-bold">#{i+1}</span> {f.name}</div>
                   <div className="font-label-mono text-[9px] text-primary bg-primary/10 px-1.5 rounded">{formatNumber(f.prod)}u</div>
                 </div>
               ))}
             </div>
             <div className="flex-1">
               <h3 className="font-label-mono text-[10px] text-tertiary uppercase tracking-wider mb-2 border-b border-white/5 pb-1">Critical Nodes</h3>
               {(bottomFactories ?? []).map((f) => (
                 <div key={f._id} className="flex justify-between items-center mb-2">
                   <div className="text-[11px] text-white flex items-center gap-1"><span className="text-tertiary font-bold">!</span> {f.name}</div>
                   <div className="font-label-mono text-[9px] text-tertiary bg-tertiary/10 px-1.5 rounded">{formatNumber(f.prod)}u</div>
                 </div>
               ))}
             </div>
          </div>

        </div>
        )}
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
