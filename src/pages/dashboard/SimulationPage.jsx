import { useState, useEffect, useCallback } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export default function SimulationPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [activeFactory, setActiveFactory] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  
  const addToast = useToast();
  const { globalKpis } = useSocket();
  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });

  useEffect(() => {
    if (!activeFactory && Object.keys(globalKpis || {}).length > 0) {
      setActiveFactory(Object.keys(globalKpis || {})[0]);
    }
  }, [globalKpis, activeFactory]);

  useEffect(() => {
    if (activeFactory) {
      fetchHistory();
    }
  }, [activeFactory, fetchHistory]);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await api.get(`/simulations?factoryId=${activeFactory}`);
      setHistory(res.data.data);
    } catch (err) {
      setHistoryError(err.message || 'Failed to fetch history');
    } finally {
      setIsHistoryLoading(false);
    }
  }, [activeFactory]);

  const runSimulation = async (disruptionType) => {
    if (!activeFactory) {
      addToast('No active factory available for simulation');
      return;
    }
    
    setIsSimulating(true);
    setSimulationResult(null);
    addToast(`Launching ${disruptionType} scenario...`);
    
    try {
      const res = await api.post('/simulations/run', {
        factoryId: activeFactory,
        scenarioType: disruptionType
      });
      setSimulationResult(res.data.data);
      addToast('Simulation complete');
      fetchHistory();
    } catch (err) {
      
      addToast('Simulation failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSimulating(false);
    }
  };

  const loadHistoricalResult = (doc) => {
    setSimulationResult(doc);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scenarios = [
    { type: 'Machine Failure', severity: 'High', icon: 'engineering', color: 'error', desc: 'Simulate breakdown of primary assembly nodes.' },
    { type: 'Power Outage', severity: 'High', icon: 'bolt', color: 'error', desc: 'Grid level disconnect affecting entire factory.' },
    { type: 'Worker Shortage', severity: 'Med', icon: 'groups', color: 'tertiary', desc: '30% reduction in skilled labor force availability.' },
    { type: 'Raw Material Delay', severity: 'High', icon: 'inventory_2', color: 'error', desc: 'Supply chain disruption halting incoming materials.' },
    { type: 'Equipment Breakdown', severity: 'Med', icon: 'precision_manufacturing', color: 'tertiary', desc: 'Secondary equipment degradation over 36h.' },
    { type: 'Demand Surge', severity: 'Low', icon: 'trending_up', color: 'primary', desc: 'Unexpected 120% spike in product demand.' },
    { type: 'Network Failure', severity: 'Med', icon: 'wifi_off', color: 'tertiary', desc: 'Loss of cloud connectivity for PLC units.' },
    { type: 'Conveyor Failure', severity: 'High', icon: 'conveyor_belt', color: 'error', desc: 'Physical transport layer halt.' }
  ];

  return (
    <>
      <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-error/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto space-y-section-gap pb-20 flex flex-col xl:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-section-gap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">AI Simulation Center</span>
              </div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Predictive Risk Analysis</h1>
              <p className="font-body-base text-body-base text-on-surface-variant mt-2 max-w-2xl">Run complex disruption scenarios through the ClusterTwin neural matrix to evaluate impact cascading and formulate mitigation strategies.</p>
            </div>
          </div>

          <section>
            <h3 className="font-label-mono text-label-mono text-on-surface-variant mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">science</span> Select Disruption Vector
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scenarios.map((s, idx) => (
                <div key={idx} onClick={() => runSimulation(s.type)} className={`surface-glass rounded-xl p-4 flex flex-col gap-3 group hover:border-${s.color} transition-all duration-300 relative overflow-hidden cursor-pointer`}>
                  <div className={`absolute inset-0 bg-${s.color}/0 group-hover:bg-${s.color}/5 transition-colors duration-300 pointer-events-none`}></div>
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center group-hover:border-${s.color}/50 transition-colors`}>
                      <span className={`material-symbols-outlined text-on-surface text-xl group-hover:text-${s.color} transition-colors`}>{s.icon}</span>
                    </div>
                    <span className={`font-label-mono text-label-mono text-${s.color} bg-${s.color}/10 px-2 py-0.5 rounded text-[10px]`}>{s.severity}</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-sm mb-1 text-on-surface line-clamp-1">{s.type}</h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {(isSimulating || simulationResult) && (
          <section className="border border-outline-variant/30 rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-500 bg-surface-container/40 backdrop-blur-md">
            <div className="bg-surface-glass p-5 border-b border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${simulationResult?.parameters?.type === 'Demand Surge' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-error/20 border-error/50 text-error animate-pulse'}`}>
                  <span className="material-symbols-outlined text-xl">{simulationResult?.parameters?.type === 'Demand Surge' ? 'trending_up' : 'warning'}</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-lg text-on-surface uppercase">IMPACT MATRIX: {simulationResult?.parameters?.type || 'Processing...'}</h2>
                  <p className="font-label-mono text-[10px] text-on-surface-variant mt-1">Status: {isSimulating ? 'Running Physics Engine...' : 'Completed'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 relative z-10">
              {isSimulating ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-label-mono text-primary animate-pulse tracking-widest">Evaluating Cascading Dependencies...</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Metrics HUD */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Production Loss</p>
                    <p className={`font-headline-sm text-lg ${(simulationResult?.results?.metrics?.productionLoss ?? 0) < 0 ? 'text-primary' : 'text-error'}`}>
                      {simulationResult?.results?.metrics?.productionLoss ?? 0}%
                    </p>
                  </div>
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Financial Loss</p>
                    <p className={`font-headline-sm text-lg ${(simulationResult?.results?.metrics?.revenueLoss ?? 0) < 0 ? 'text-primary' : 'text-error'}`}>
                      ${Math.abs(simulationResult?.results?.metrics?.revenueLoss ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Delivery Delay</p>
                    <p className="font-headline-sm text-lg text-tertiary">
                      {simulationResult?.results?.metrics?.deliveryDelay ?? 0} hrs
                    </p>
                  </div>
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Energy Impact</p>
                    <p className="font-headline-sm text-lg text-secondary">
                      {(simulationResult?.results?.metrics?.energyImpact ?? 0) > 0 ? '+' : ''}{simulationResult?.results?.metrics?.energyImpact ?? 0}%
                    </p>
                  </div>
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Carbon Impact</p>
                    <p className="font-headline-sm text-lg text-on-surface">
                      {(simulationResult?.results?.metrics?.carbonImpact ?? 0) > 0 ? '+' : ''}{simulationResult?.results?.metrics?.carbonImpact ?? 0}%
                    </p>
                  </div>
                  <div className="bg-surface-container/60 rounded-lg p-3 border border-white/5">
                    <p className="font-label-mono text-[9px] uppercase text-on-surface-variant mb-1">Proj. Recovery</p>
                    <p className="font-headline-sm text-lg text-primary">
                      {simulationResult?.results?.metrics?.recoveryTime ?? 0} hrs
                    </p>
                  </div>
                  
                  {/* Visual Before/After Charts */}
                  <div className="col-span-2 sm:col-span-3 bg-surface-container/40 rounded-lg p-4 border border-white/5 mt-2">
                    <h4 className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-4">Baseline vs Simulation Delta (Relative Impact)</h4>
                    <div className="flex flex-col gap-5">
                      
                      {/* Production Bar */}
                      <div className="relative w-full h-8 bg-surface-container-highest rounded overflow-hidden flex">
                        <div className="absolute inset-0 flex justify-between items-center px-3 z-10 pointer-events-none">
                           <span className="font-label-mono text-[10px] text-on-surface">Production Volume</span>
                        </div>
                        {/* Baseline (100%) */}
                        <div className="h-full bg-primary/30" style={{ width: '50%' }}></div>
                        {/* Delta */}
                        <div className={`h-full transition-all duration-1000 ${(simulationResult?.results?.metrics?.productionLoss ?? 0) < 0 ? 'bg-primary' : 'bg-error'}`} 
                             style={{ width: `${Math.min(50, Math.abs(simulationResult?.results?.metrics?.productionLoss ?? 0) / 2)}%` }}>
                        </div>
                      </div>

                      {/* Energy/Carbon Bar */}
                      <div className="relative w-full h-8 bg-surface-container-highest rounded overflow-hidden flex">
                        <div className="absolute inset-0 flex justify-between items-center px-3 z-10 pointer-events-none">
                           <span className="font-label-mono text-[10px] text-on-surface">Energy Load</span>
                        </div>
                        {/* Baseline (100%) */}
                        <div className="h-full bg-secondary/30" style={{ width: '50%' }}></div>
                        {/* Delta */}
                        <div className={`h-full transition-all duration-1000 ${(simulationResult?.results?.metrics?.energyImpact ?? 0) < 0 ? 'bg-primary' : 'bg-tertiary'}`} 
                             style={{ width: `${Math.min(50, Math.abs(simulationResult?.results?.metrics?.energyImpact ?? 0) / 2)}%` }}>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* AI Resolution Side */}
                <div className="flex flex-col gap-3 h-full">
                  <h3 className="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-sm text-primary">smart_toy</span> AI Resolution Hub
                  </h3>
                  
                  <div className="surface-glass rounded-lg p-4 border border-primary/30 bg-primary/5 flex flex-col gap-3 flex-1 shadow-[0_0_15px_rgba(107,216,203,0.1)]">
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline-md text-[12px] text-primary uppercase">Recommended Mitigation</h4>
                    </div>
                    <ul className="list-disc pl-4 text-[12px] text-on-surface-variant space-y-2">
                      {(simulationResult?.results?.aiRecommendations ?? []).map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-auto pt-3 border-t border-primary/20 grid grid-cols-2 gap-2">
                      <div>
                        <span className="block font-label-mono text-[9px] text-primary/70">Alternate Route</span>
                        <span className="text-[11px] text-on-surface">{simulationResult?.results?.metrics?.alternateFactory ?? 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block font-label-mono text-[9px] text-primary/70">Est. Mitigated Savings</span>
                        <span className="text-[11px] text-primary font-bold">${(simulationResult?.results?.metrics?.costSavings ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { addToast('Mitigation plan executed'); handleAction('Plan Executed', 'Automated workflows triggered.'); }} className="w-full py-3 primary-gradient rounded-lg text-background font-bold font-label-mono text-label-mono text-[11px] uppercase cursor-pointer hover:shadow-glow transition-shadow">
                    Execute Mitigation Protocols
                  </button>
                </div>

              </div>
              )}
            </div>
          </section>
          )}
        </div>

        {/* Right Sidebar: History */}
        <div className="xl:w-80 flex-shrink-0 flex flex-col gap-4">
           <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">history</span> Simulation History
           </h3>
           <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar pb-10">
             {isHistoryLoading ? (
               <div className="text-[11px] text-on-surface-variant p-4 text-center bg-surface-glass rounded border border-white/5 animate-pulse">Loading history...</div>
             ) : historyError ? (
               <div className="text-[11px] text-error p-4 text-center bg-error/10 rounded border border-error/20">{historyError}</div>
             ) : (history ?? []).length === 0 ? (
               <div className="text-[11px] text-on-surface-variant p-4 text-center bg-surface-glass rounded border border-white/5">No previous simulations run.</div>
             ) : (
               (history ?? []).map(doc => (
                 <div key={doc?._id || Math.random()} onClick={() => loadHistoricalResult(doc)} className="bg-surface-glass rounded-lg p-3 border border-white/5 cursor-pointer hover:border-primary/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-headline-md text-[12px] text-on-surface">{doc?.parameters?.type ?? 'Unknown'}</span>
                     <span className="font-label-mono text-[9px] text-on-surface-variant">
                       {formatTime(doc?.createdAt)}
                     </span>
                   </div>
                   <div className="flex justify-between items-center mt-2">
                     <span className={`text-[10px] px-2 py-0.5 rounded font-label-mono ${(doc?.results?.metrics?.productionLoss ?? 0) < 0 ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
                       {doc?.results?.metrics?.productionLoss ?? 0}% Prod
                     </span>
                     <span className="text-[10px] text-on-surface-variant">
                       ${Math.abs((doc?.results?.metrics?.revenueLoss ?? 0) / 1000).toFixed(1)}k Loss
                     </span>
                   </div>
                 </div>
               ))
             )}
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
