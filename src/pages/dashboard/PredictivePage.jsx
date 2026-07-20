import { useState, useEffect, useCallback } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function PredictivePage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [aiData, setAiData] = useState(null);
  const [activeFactory, setActiveFactory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addToast = useToast();
  const { socket, globalKpis, alerts } = useSocket();

  // Auto-join factory
  useEffect(() => {
    if (!socket || !globalKpis) return;
    if (!activeFactory && Object.keys(globalKpis ?? {}).length > 0) {
      const firstFactoryId = Object.keys(globalKpis ?? {})[0];
      setActiveFactory(firstFactoryId);
      socket.emit('join_factory', firstFactoryId);
    }
  }, [socket, globalKpis, activeFactory]);

  // Fetch AI Insights
  const fetchInsights = useCallback(async () => {
    if (!activeFactory) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai/insights?factoryId=${activeFactory}`);
      setAiData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch AI insights.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFactory]);

  // Fetch on load and whenever a new alert arrives (live AI update)
  useEffect(() => {
    fetchInsights();
  }, [activeFactory, (alerts ?? []).length, fetchInsights]);

  // Calculate highest risk machine
  let highestRiskMachine = { name: 'N/A', prob: 0, status: 'Normal' };
  let rulList = [];
  
  if (aiData && aiData.machineHealthScores) {
    const sorted = [...(aiData.machineHealthScores ?? [])].sort((a, b) => a.healthScore - b.healthScore);
    if (sorted.length > 0) {
      const worst = sorted[0];
      highestRiskMachine = {
        name: worst.name,
        prob: 100 - worst.healthScore, // simplistic failure prob
        status: worst.healthScore < 70 ? 'Elevated' : 'Normal',
        id: worst.machineId
      };
    }
    
    // Sort for RUL (Remaining Useful Life) approximation based on health
    rulList = sorted.map(m => ({
      ...m,
      rulHours: Math.floor((m.healthScore / 100) * 500) // Mock RUL calculation based on health
    })).slice(0, 3);
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-container/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-section-gap w-full max-w-[1440px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-6">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg bg-clip-text text-transparent bg-gradient-to-br from-[#dae2fd] to-[#89f5e7] mb-2">AI Insights</h1>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(107,216,203,0.8)]"></span>
              <span className="font-label-mono text-label-mono text-primary tracking-wider uppercase">System Status: Predictive Mode Active</span>
            </div>
          </div>
          <div className="surface-glass px-6 py-4 rounded-xl border-glow flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">AI Confidence Score</span>
              <span className="font-headline-md text-headline-md text-on-surface">98.4%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center relative">
              <span className="material-symbols-outlined text-primary text-xl absolute">auto_awesome</span>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-label-mono text-primary text-sm animate-pulse">Analyzing live telemetry patterns...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 bg-error/5 border border-error/20 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-error text-4xl mb-4">warning</span>
            <p className="font-headline-md text-error text-lg mb-2">Analysis Failed</p>
            <p className="font-label-mono text-on-surface-variant text-sm">{error}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Predictive Maintenance - Gauge */}
          <section className="surface-glass rounded-2xl p-6 md:col-span-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">speed</span>
            </div>
            <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">warning</span>
              Highest Failure Probability
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center mt-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 transition-all duration-1000" viewBox="0 0 100 100">
                  <circle className="text-surface-container-high" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset="0" strokeWidth="8"></circle>
                  <circle className="text-tertiary transition-all duration-1000" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={283 - (283 * highestRiskMachine.prob / 100)} strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="font-display-lg text-display-lg text-tertiary">{highestRiskMachine.prob}%</span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant mt-1">Risk Level</span>
                </div>
              </div>
              <div className="mt-6 w-full bg-surface-container px-4 py-3 rounded-lg border border-outline-variant/30 flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface">Target: {highestRiskMachine.name}</span>
                <span className={`font-label-mono text-label-mono px-2 py-1 rounded ${highestRiskMachine.status === 'Elevated' ? 'text-tertiary bg-tertiary/10' : 'text-primary bg-primary/10'}`}>{highestRiskMachine.status}</span>
              </div>
            </div>
          </section>

          {/* Remaining Useful Life */}
          <section className="surface-glass rounded-2xl p-6 md:col-span-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">hourglass_bottom</span>
                Remaining Useful Life (RUL)
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {rulList.length > 0 ? rulList.map((m, i) => (
                <div key={m.machineId} className={`bg-surface-container/50 p-4 rounded-xl border border-white/5 transition-colors ${m.healthScore < 70 ? 'hover:border-tertiary/30' : 'hover:border-primary/30'}`}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined">{i === 0 ? 'warning' : 'precision_manufacturing'}</span>
                      </div>
                      <div>
                        <h4 className="font-body-base text-body-base font-semibold">{m.name}</h4>
                        <p className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">Health: {m.healthScore}/100</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-headline-md text-headline-md ${m.healthScore < 70 ? 'text-tertiary' : 'text-primary'}`}>{m.rulHours} h</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-3">
                    <div className={`h-1.5 rounded-full transition-all duration-1000 ${m.healthScore < 70 ? 'bg-tertiary' : 'bg-primary'}`} style={{ width: `${(m.rulHours / 500) * 100}%` }}></div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 text-on-surface-variant">Gathering AI predictions...</div>
              )}
            </div>
          </section>

          {/* Explainable AI (XAI) Panel - Root Cause */}
          <section className="surface-glass rounded-2xl p-6 md:col-span-6 border-glow relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">psychology_alt</span>
                Root Cause Analysis
              </h3>
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>LIVE</span>
            </div>
            
            {aiData?.recommendations && (aiData.recommendations ?? []).length > 0 ? (
              <div className="flex flex-col gap-4">
                {(aiData.recommendations ?? []).map((rec, i) => (
                  <div key={i} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/50 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary rounded-l-xl"></div>
                    <div className="flex items-start gap-4 mb-3">
                      <span className="material-symbols-outlined text-tertiary mt-1">troubleshoot</span>
                      <div>
                        <h4 className="font-body-base text-body-base font-semibold mb-1">Target: {rec.target}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{rec.explanation}</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg flex justify-between items-center mt-3">
                      <span className="font-label-mono text-[11px] font-bold text-primary">{rec.confidence}% Confidence</span>
                      <button onClick={() => { addToast(`Optimization applied to ${rec.target}`); }} className="font-label-mono text-[10px] text-white bg-primary/20 hover:bg-primary/40 px-3 py-1.5 rounded transition-colors cursor-pointer">
                        Apply Fix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant">No active anomalies detected by AI.</div>
            )}
          </section>

          {/* Machine Health Timeline */}
          <section className="surface-glass rounded-2xl p-6 md:col-span-6">
            <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">timeline</span>
              Live Anomaly Feed
            </h3>
            <div className="flex flex-col gap-3 h-[300px] overflow-y-auto hide-scrollbar">
              {(alerts ?? []).length > 0 ? (alerts ?? []).map((alert, i) => (
                <div key={i} className={`p-3 rounded border-l-2 ${alert.severity === 'Critical' ? 'bg-error-container/10 border-error' : 'bg-surface-container border-tertiary'}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-body-sm text-on-surface font-semibold">{alert.message}</span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <span className={`font-label-mono text-[10px] uppercase mt-2 block ${alert.severity === 'Critical' ? 'text-error' : 'text-tertiary'}`}>{alert.severity}</span>
                </div>
              )) : (
                <div className="p-8 text-center text-on-surface-variant">No alerts in current session.</div>
              )}
            </div>
          </section>
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
