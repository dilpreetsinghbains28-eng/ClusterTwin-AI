import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import ActionModal from '../../components/ui/ActionModal';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function ClustersPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [factories, setFactories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [factoriesError, setFactoriesError] = useState(null);
  
  // Resource Exchange Hub State
  const [exchangeState, setExchangeState] = useState({
    sourceFactoryId: '',
    resourceType: 'Machines',
    quantity: 1
  });
  const [recommendation, setRecommendation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(true);
  const [transfersError, setTransfersError] = useState(null);
  
  const addToast = useToast();
  const { globalKpis } = useSocket();

  const fetchFactories = useCallback(async () => {
    setIsLoading(true);
    setFactoriesError(null);
    try {
      const res = await api.get('/factories');
      setFactories(res.data.data);
      if ((res.data.data ?? []).length > 0 && !exchangeState.sourceFactoryId) {
        setExchangeState(prev => ({ ...prev, sourceFactoryId: res.data.data[0]._id }));
      }
    } catch (err) {
      setFactoriesError(err.message || 'Failed to fetch clusters.');
    } finally {
      setIsLoading(false);
    }
  }, [exchangeState.sourceFactoryId]);

  const fetchTransferHistory = useCallback(async () => {
    setIsLoadingTransfers(true);
    setTransfersError(null);
    try {
      const res = await api.get('/transfers/history');
      setTransferHistory(res.data.data);
    } catch (err) {
      setTransfersError(err.message || 'Failed to fetch transfer history.');
    } finally {
      setIsLoadingTransfers(false);
    }
  }, []);

  useEffect(() => {
    fetchFactories();
    fetchTransferHistory();
  }, [fetchFactories, fetchTransferHistory]);

  // Compute Aggregate metrics
  let totalAggregateOee = 0;
  let totalEnergy = 0;
  const factoryCount = (factories ?? []).length;

  if (factoryCount > 0 && Object.keys(globalKpis ?? {}).length > 0) {
    (factories ?? []).forEach(f => {
      const kpi = globalKpis[f._id];
      if (kpi) {
        totalEnergy += kpi.totalPowerKw;
        const oee = kpi.activeMachines > 0 ? (kpi.activeMachines / 4) * 100 : 0;
        totalAggregateOee += oee;
      }
    });
    totalAggregateOee = totalAggregateOee / factoryCount;
  }

  const handleAnalyzeTransfer = async () => {
    if (!exchangeState.sourceFactoryId) return addToast('Please select a source factory.');
    setIsAnalyzing(true);
    setRecommendation(null);
    try {
      const res = await api.post('/transfers/recommend', exchangeState);
      setRecommendation(res.data.data);
      addToast('Analysis complete. Optimal route found.');
    } catch (error) {
      
      addToast(error.response?.data?.error || 'Failed to analyze network');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeTransfer = async () => {
    if (!recommendation) return;
    try {
      await api.post('/transfers/execute', {
        sourceFactoryId: recommendation?.sourceFactory?._id,
        destinationFactoryId: recommendation?.destinationFactory?._id,
        resourceType: recommendation?.resourceType,
        quantity: recommendation?.quantity,
        ...(recommendation?.recommendation ?? {})
      });
      addToast('Transfer execution initiated');
      setRecommendation(null);
      fetchTransferHistory();
    } catch (error) {
      
      addToast('Failed to execute transfer');
    }
  };

  return (
    <>
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] radial-glow translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] radial-glow -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto pb-20">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2">Cluster Network</h1>
            <p className="font-body-base text-body-base text-on-surface-variant">Manage and monitor global factory performance & asset routing.</p>
          </div>
        </div>

        {/* Top Analytics & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-section-gap">
          {/* Factory Cards (Col 1-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {isLoading ? (
              <div className="p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-label-mono text-primary text-xs animate-pulse">Loading clusters...</p>
              </div>
            ) : factoriesError ? (
              <div className="p-10 text-center flex flex-col items-center justify-center min-h-[200px] bg-error/5 border border-error/20 rounded-2xl">
                <span className="material-symbols-outlined text-error text-3xl mb-2">cloud_off</span>
                <p className="font-label-mono text-error text-sm">{factoriesError}</p>
              </div>
            ) : (factories ?? []).length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center min-h-[200px] bg-surface-glass border border-white/5 rounded-2xl">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-2">factory</span>
                <p className="font-label-mono text-on-surface-variant text-sm">No clusters available.</p>
              </div>
            ) : (
              (factories ?? []).slice(0, 3).map((factory) => {
                const liveKpi = (globalKpis ?? {})[factory._id] || { totalPowerKw: 0, totalProduction: 0, activeMachines: 0 };
                const isOptimal = liveKpi.activeMachines >= 3;
                
                return (
                <GlassCard key={factory._id} className="p-6 relative group overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(107,216,203,0.1)] !border-none bg-surface-glass border border-outline-variant/30 hover:border-primary/50 rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 h-32 rounded-xl bg-surface-container-high border-glow overflow-hidden flex-shrink-0 relative">
                      <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-luminosity">
                        <span className="material-symbols-outlined text-4xl text-outline-variant">factory</span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <StatusBadge status={isOptimal ? "Optimal" : "Warning"} />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-headline-md text-headline-md text-white mb-1">{factory.name}</h3>
                        <div className="flex flex-wrap gap-4 font-label-mono text-label-mono text-on-surface-variant text-[11px]">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span> {factory.location?.city || 'Unknown'}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">category</span> {factory.industry}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                        <div className="bg-[#1E293B] rounded p-2 border border-outline-variant/20">
                          <div className="text-[10px] font-label-mono text-on-surface-variant mb-1">Production</div>
                          <div className="font-headline-md text-sm text-primary">{liveKpi.totalProduction.toLocaleString()}</div>
                        </div>
                        <div className="bg-[#1E293B] rounded p-2 border border-outline-variant/20">
                          <div className="text-[10px] font-label-mono text-on-surface-variant mb-1">OEE</div>
                          <div className="font-headline-md text-sm text-white">{((liveKpi.activeMachines / 4) * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                )
              })
            )}
          </div>
          
          {/* Telemetry Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassCard className="p-6 h-full flex flex-col rounded-2xl bg-surface-glass">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-base text-white">Global Telemetry</h3>
                <span className="font-label-mono text-[10px] bg-primary/20 text-primary px-2 py-1 rounded">LIVE</span>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#1E293B] p-4 rounded-xl border border-outline-variant/20 relative overflow-hidden">
                  <div className="font-label-mono text-[10px] text-on-surface-variant">Aggregate OEE</div>
                  <div className="font-headline-md text-xl text-primary">{totalAggregateOee.toFixed(1)}%</div>
                </div>
                <div className="bg-[#1E293B] p-4 rounded-xl border border-outline-variant/20">
                  <div className="font-label-mono text-[10px] text-on-surface-variant">Total Power Draw</div>
                  <div className="font-headline-md text-xl text-white">{totalEnergy.toFixed(0)} kW</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* AI Resource Sharing Engine Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-section-gap">
          <div className="lg:col-span-12">
            <GlassCard className="rounded-2xl border-glow overflow-hidden bg-surface-glass/80 backdrop-blur-xl">
              <div className="border-b border-white/10 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">share_location</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-lg text-white">AI Resource Sharing Engine</h2>
                    <p className="font-label-mono text-[10px] text-on-surface-variant">Global Asset Redistribution Matrix</p>
                  </div>
                </div>
                {/* Decorative map dots */}
                <div className="hidden md:flex gap-2 opacity-50">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                   <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                   <div className="w-2 h-2 rounded-full bg-tertiary animate-ping"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Configuration Panel */}
                <div className="p-6 border-r border-white/10 bg-surface-container/30">
                  <h3 className="font-label-mono text-[11px] uppercase tracking-wider text-on-surface-variant mb-5">Exchange Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="font-label-mono text-[10px] text-on-surface block mb-1">Source Node (Factory)</label>
                      <select 
                        value={exchangeState.sourceFactoryId}
                        onChange={(e) => setExchangeState({...exchangeState, sourceFactoryId: e.target.value})}
                        className="w-full bg-[#1E293B] border border-outline-variant/30 rounded p-2 text-sm text-on-surface outline-none focus:border-primary/50"
                      >
                        {(factories ?? []).map(f => (
                          <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-label-mono text-[10px] text-on-surface block mb-1">Resource Class</label>
                      <select 
                        value={exchangeState.resourceType}
                        onChange={(e) => setExchangeState({...exchangeState, resourceType: e.target.value})}
                        className="w-full bg-[#1E293B] border border-outline-variant/30 rounded p-2 text-sm text-on-surface outline-none focus:border-primary/50"
                      >
                        <option>Machines</option>
                        <option>Workers</option>
                        <option>Raw Materials</option>
                        <option>Spare Parts</option>
                        <option>Warehouse Space</option>
                        <option>Transport</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-mono text-[10px] text-on-surface block mb-1">Quantity/Volume</label>
                      <input 
                        type="number" min="1"
                        value={exchangeState.quantity}
                        onChange={(e) => setExchangeState({...exchangeState, quantity: parseInt(e.target.value) || 1})}
                        className="w-full bg-[#1E293B] border border-outline-variant/30 rounded p-2 text-sm text-on-surface outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleAnalyzeTransfer}
                    disabled={isAnalyzing}
                    className="w-full mt-6 py-3 border border-primary text-primary hover:bg-primary hover:text-surface font-label-mono text-[11px] uppercase tracking-wider rounded transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing Network...' : 'Analyze Network Route'}
                  </button>
                </div>

                {/* AI Recommendation HUD */}
                <div className="p-6 md:col-span-2 relative min-h-[300px]">
                  {!recommendation && !isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
                      <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">query_stats</span>
                      <p className="font-label-mono text-[11px] text-on-surface-variant">Awaiting network configuration...</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                      <p className="font-label-mono text-[11px] text-primary animate-pulse">Running GIS Routing & Heuristics...</p>
                    </div>
                  )}

                  {recommendation && !isAnalyzing && (
                    <div className="h-full flex flex-col">
                      <h3 className="font-label-mono text-[11px] uppercase tracking-wider text-primary mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> Optimal Route Discovered
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container/50 p-4 rounded-xl border border-primary/20 mb-6">
                         <div className="flex-1 text-center sm:text-left">
                           <span className="font-label-mono text-[9px] text-on-surface-variant block uppercase">Source</span>
                           <span className="font-headline-md text-white">{recommendation?.sourceFactory?.name ?? ""}</span>
                         </div>
                         <div className="flex flex-col items-center flex-1 w-full px-4">
                           <span className="font-label-mono text-[10px] text-tertiary mb-1">{recommendation?.quantity ?? 0}x {recommendation?.resourceType ?? ""}</span>
                           <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="material-symbols-outlined text-primary text-sm rotate-90 sm:rotate-0">flight_takeoff</span>
                              </div>
                           </div>
                         </div>
                         <div className="flex-1 text-center sm:text-right">
                           <span className="font-label-mono text-[9px] text-on-surface-variant block uppercase">Best Destination</span>
                           <span className="font-headline-md text-primary">{recommendation?.destinationFactory?.name ?? ""}</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 flex-1">
                        <div className="bg-[#1E293B] p-3 rounded-lg border border-white/5">
                          <span className="font-label-mono text-[9px] text-on-surface-variant block uppercase">Distance</span>
                          <span className="font-headline-sm text-white">{recommendation?.recommendation?.distance ?? 0} mi</span>
                        </div>
                        <div className="bg-[#1E293B] p-3 rounded-lg border border-white/5">
                          <span className="font-label-mono text-[9px] text-on-surface-variant block uppercase">Logistics Cost</span>
                          <span className="font-headline-sm text-error">${(recommendation?.recommendation?.cost ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#1E293B] p-3 rounded-lg border border-white/5">
                          <span className="font-label-mono text-[9px] text-on-surface-variant block uppercase">Est. Arrival</span>
                          <span className="font-headline-sm text-white">{recommendation?.recommendation?.etaHours ?? 0} Hrs</span>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/30 md:col-span-2">
                          <span className="font-label-mono text-[9px] text-primary block uppercase">Expected Savings</span>
                          <span className="font-headline-sm text-primary font-bold">${(recommendation?.recommendation?.expectedSavings ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/30 md:col-span-5 flex justify-between items-center">
                          <span className="font-label-mono text-[9px] text-secondary block uppercase">Carbon Abatement (vs New Prod)</span>
                          <span className="font-headline-sm text-secondary">-{(recommendation?.recommendation?.carbonSavings ?? 0).toLocaleString()} kg CO2e</span>
                        </div>
                      </div>

                      <button onClick={executeTransfer} className="mt-auto primary-gradient w-full py-3 rounded text-surface font-bold font-label-mono text-[11px] uppercase tracking-widest hover:shadow-glow transition-shadow">
                        Execute Transfer Protocol
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Transfer History Ledger */}
        <div className="grid grid-cols-1 gap-gutter mb-section-gap">
          <GlassCard className="p-6 overflow-hidden rounded-2xl bg-surface-glass">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-xl text-white">Transfer Ledger</h2>
            </div>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4">Savings</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-white text-[13px]">
                  {isLoadingTransfers ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-primary font-label-mono text-xs animate-pulse">Loading transfer ledger...</td>
                    </tr>
                  ) : transfersError ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-error font-label-mono text-xs">{transfersError}</td>
                    </tr>
                  ) : (transferHistory ?? []).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-on-surface-variant">No transfers recorded.</td>
                    </tr>
                  ) : (
                    (transferHistory ?? []).slice(0, 5).map((log) => (
                      <tr key={log._id} className="border-b border-outline-variant/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-label-mono text-[11px] text-on-surface-variant">
                          {log?.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-medium text-white">
                          {log.quantity}x {log.resourceType}
                        </td>
                        <td className="py-3 px-4 font-label-mono text-[11px]">
                          {log.sourceFactory?.name} <span className="text-primary mx-1">→</span> {log.destinationFactory?.name}
                        </td>
                        <td className="py-3 px-4 text-error">
                          ${log.cost.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-primary">
                          ${log.expectedSavings.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-label-mono uppercase ${log.status === 'Completed' ? 'bg-primary/20 text-primary' : 'bg-tertiary/20 text-tertiary'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
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
