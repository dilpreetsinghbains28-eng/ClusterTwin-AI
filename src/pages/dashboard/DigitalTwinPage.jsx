import { useState, useEffect } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function DigitalTwinPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [activeFactory, setActiveFactory] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState(null);
  const addToast = useToast();
  const { socket, globalKpis } = useSocket();

  useEffect(() => {
    if (!socket || !globalKpis) return;
    
    if (!activeFactory && Object.keys(globalKpis ?? {}).length > 0) {
      const firstFactoryId = Object.keys(globalKpis ?? {})[0];
      setActiveFactory(firstFactoryId);
      socket.emit('join_factory', firstFactoryId);
    }

    const handleMachineTelemetry = (data) => {
      setMachines(data);
      if (selectedMachine) {
        const updated = (data || []).find(m => m.machineId === selectedMachine?.machineId);
        if (updated) setSelectedMachine(updated);
      }
    };

    socket.on('telemetry:machines', handleMachineTelemetry);

    return () => {
      socket.off('telemetry:machines', handleMachineTelemetry);
      if (activeFactory) {
        socket.emit('leave_factory', activeFactory);
      }
    };
  }, [socket, globalKpis, activeFactory, selectedMachine]);

  // Fetch AI Insights when a machine is selected
  useEffect(() => {
    if (selectedMachine && activeFactory) {
      const fetchInsights = async () => {
        setIsLoadingInsights(true);
        setInsightsError(null);
        try {
          const res = await api.get(`/ai/insights?factoryId=${activeFactory}`);
          setAiInsights(res.data.data);
        } catch (error) {
          setInsightsError(error.message || 'Failed to fetch AI insights.');
        } finally {
          setIsLoadingInsights(false);
        }
      };
      fetchInsights();
    }
  }, [selectedMachine, activeFactory]);

  // Extract specific machine AI data
  const currentMachineAi = (aiInsights?.machineHealthScores ?? []).find(m => m.machineId === selectedMachine?.machineId);
  const currentMachineRecs = (aiInsights?.recommendations ?? []).filter(r => r.target === selectedMachine?.name);

  // Isometric Grid Positions
  const gridPositions = [
    { top: '35%', left: '35%' },
    { top: '45%', left: '45%' },
    { top: '55%', left: '55%' },
    { top: '65%', left: '65%' }
  ];

  return (
    <>
    <div className="relative w-full h-[calc(100vh-80px)] -mt-8 -mx-8 sm:-mx-8 md:-mx-8 overflow-hidden rounded-xl bg-[#0b101a]">
      {/* Background Isometric Grid SVG */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `linear-gradient(rgba(107,216,203, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(107,216,203, 0.4) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             transform: 'rotateX(60deg) rotateZ(-45deg) scale(2)',
             transformOrigin: 'center center'
           }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b101a_80%)] z-10 pointer-events-none"></div>

      {/* Production Lines (Connecting Paths) */}
      <div className="absolute inset-0 z-15 pointer-events-none">
         <svg width="100%" height="100%" className="absolute inset-0">
           <defs>
             <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#6bd8cb" stopOpacity="0.2" />
               <stop offset="50%" stopColor="#6bd8cb" stopOpacity="0.8" />
               <stop offset="100%" stopColor="#6bd8cb" stopOpacity="0.2" />
             </linearGradient>
           </defs>
           {/* Hardcoded paths for the layout visual */}
           <path d="M 25% 25% L 35% 35% L 45% 45% L 55% 55% L 65% 65% L 75% 75%" 
                 fill="none" stroke="url(#lineGlow)" strokeWidth="4" 
                 strokeDasharray="10 5" 
                 className="animate-[dash_20s_linear_infinite]"
           />
           <path d="M 35% 35% L 50% 30% L 65% 65%" 
                 fill="none" stroke="url(#lineGlow)" strokeWidth="2" 
                 strokeDasharray="5 5" 
                 className="animate-[dash_10s_linear_infinite]"
           />
         </svg>
      </div>

      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
      `}</style>

      {/* Render Factory Elements as Isometric Nodes */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        
        {/* Storage Node */}
        <div 
          className="absolute w-40 h-40 flex items-center justify-center z-20 pointer-events-none"
          style={{ top: '25%', left: '25%', transformStyle: 'preserve-3d' }}
        >
          <div className="absolute -top-12 bg-surface-glass border border-white/10 px-3 py-1 rounded flex flex-col items-center">
            <span className="font-label-mono text-[10px] text-on-surface">Raw Materials Storage</span>
          </div>
          <div className="w-24 h-24 bg-secondary/20 border-2 border-secondary backdrop-blur-md shadow-2xl"
               style={{ transform: 'rotateX(60deg) rotateZ(-45deg)', boxShadow: '0 20px 50px rgba(162,176,211,0.4), inset 0 0 20px rgba(162,176,211,0.4)' }}>
            <div className="absolute inset-2 grid grid-cols-2 gap-1 opacity-50">
               <div className="bg-secondary"></div>
               <div className="bg-secondary"></div>
               <div className="bg-secondary"></div>
               <div className="bg-secondary"></div>
            </div>
          </div>
        </div>

        {/* Energy Node */}
        <div 
          className="absolute w-40 h-40 flex items-center justify-center z-20 pointer-events-none"
          style={{ top: '75%', left: '75%', transformStyle: 'preserve-3d' }}
        >
          <div className="absolute -top-12 bg-surface-glass border border-white/10 px-3 py-1 rounded flex flex-col items-center">
            <span className="font-label-mono text-[10px] text-tertiary">Main Energy Grid</span>
          </div>
          <div className="w-24 h-24 bg-tertiary/20 border-2 border-tertiary backdrop-blur-md shadow-2xl animate-pulse"
               style={{ transform: 'rotateX(60deg) rotateZ(-45deg)', boxShadow: '0 20px 50px rgba(255,181,154,0.4), inset 0 0 20px rgba(255,181,154,0.4)' }}>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-[40px] transform rotate-45 rotate-x-[-60deg]">bolt</span>
             </div>
          </div>
        </div>

        {/* Machines Nodes */}
        {(machines ?? []).map((machine, index) => {
          const isWarning = ['Overheating', 'Bearing Wear', 'Overloaded'].includes(machine.status);
          const isIdle = machine.status === 'Idle';
          const pos = gridPositions[index % gridPositions.length];
          const isSelected = selectedMachine?.machineId === machine.machineId;

          let glowColor = 'rgba(107,216,203,0.6)';
          let bgColor = 'bg-primary/20 border-primary';
          if (isWarning) {
            glowColor = 'rgba(255,181,154,0.8)';
            bgColor = 'bg-tertiary/30 border-tertiary animate-pulse';
          } else if (isIdle) {
            glowColor = 'rgba(148,163,184,0.4)';
            bgColor = 'bg-surface-variant/50 border-outline-variant';
          }

          return (
            <div 
              key={machine.machineId}
              onClick={() => setSelectedMachine(isSelected ? null : machine)}
              className={`absolute w-32 h-32 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 ${isSelected ? 'scale-110 z-30' : 'z-20'}`}
              style={{
                top: pos.top,
                left: pos.left,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Floating Label */}
              <div className="absolute -top-12 bg-surface-glass border border-white/10 px-3 py-1 rounded shadow-lg backdrop-blur flex flex-col items-center">
                <span className="font-label-mono text-[10px] text-on-surface whitespace-nowrap">{machine.name}</span>
                <span className={`font-label-mono text-[9px] uppercase tracking-wider ${isWarning ? 'text-tertiary' : (isIdle ? 'text-on-surface-variant' : 'text-primary')}`}>
                  {machine.status}
                </span>
              </div>
              
              {/* Isometric Cube (Top Face) */}
              <div 
                className={`w-20 h-20 ${bgColor} border-2 backdrop-blur-md shadow-2xl transition-all relative`}
                style={{
                  transform: 'rotateX(60deg) rotateZ(-45deg)',
                  boxShadow: `0 20px 50px ${glowColor}, inset 0 0 20px ${glowColor}`
                }}
              >
                {/* Simulated inner mechanics */}
                <div className="absolute inset-2 border border-white/20 rounded-full flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full ${isWarning ? 'bg-tertiary' : 'bg-primary'} ${isIdle ? '' : 'animate-spin'}`}></div>
                </div>

                {/* Simulated Sensors */}
                <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isWarning ? 'bg-tertiary animate-ping' : 'bg-primary'} shadow-[0_0_5px_currentColor]`}></div>
                <div className={`absolute bottom-1 left-1 w-2 h-2 rounded-full ${isIdle ? 'bg-surface-variant' : 'bg-secondary animate-pulse'} shadow-[0_0_5px_currentColor]`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Side Overlays */}
      <div className="z-40 absolute right-4 top-4 flex flex-col gap-4 w-72 pointer-events-none">
        <div className="surface-glass rounded-xl p-4 flex flex-col gap-4 pointer-events-auto shrink-0 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="font-headline-md text-[16px] text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">factory</span>
              Factory Overview
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Power Draw</span>
              <span className="font-headline-md text-[18px] text-tertiary font-bold">{activeFactory && globalKpis[activeFactory] ? globalKpis[activeFactory].totalPowerKw.toFixed(0) : 0} <span className="text-[12px] font-normal text-tertiary/70">kW</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Production</span>
              <span className="font-headline-md text-[18px] text-on-surface font-bold">{activeFactory && globalKpis[activeFactory] ? globalKpis[activeFactory].totalProduction.toLocaleString() : 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Machine Details Modal (Left side) */}
      {selectedMachine && (
      <div className="z-40 absolute top-4 left-4 w-[420px] max-h-[calc(100vh-120px)] surface-glass rounded-xl border border-tertiary/30 p-5 flex flex-col gap-5 pointer-events-auto shadow-2xl overflow-y-auto hide-scrollbar backdrop-blur-2xl bg-surface-container-highest/90">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${['Overheating', 'Bearing Wear', 'Overloaded'].includes(selectedMachine.status) ? 'from-tertiary' : 'from-primary'} to-transparent`}></div>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-display-sm text-[22px] text-on-surface font-bold">{selectedMachine.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${['Overheating', 'Bearing Wear', 'Overloaded'].includes(selectedMachine.status) ? 'bg-tertiary animate-pulse' : 'bg-primary'}`}></span>
              <span className={`font-label-mono text-[11px] ${['Overheating', 'Bearing Wear', 'Overloaded'].includes(selectedMachine.status) ? 'text-tertiary' : 'text-primary'} uppercase tracking-widest`}>
                Status: {selectedMachine.status}
              </span>
            </div>
          </div>
          <button onClick={() => setSelectedMachine(null)} className="text-on-surface-variant hover:text-white transition-colors cursor-pointer bg-white/5 p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Health Score from AI API */}
        <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/20 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-1">AI Health Score</span>
            <span className="font-body-xs text-on-surface-variant max-w-[150px]">Based on real-time harmonic & thermal loads</span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            {isLoadingInsights ? (
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : insightsError ? (
               <span className="material-symbols-outlined text-error text-[24px]">error</span>
            ) : (
              <>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <path strokeDasharray={`${currentMachineAi?.healthScore || 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={`${(currentMachineAi?.healthScore || 100) < 70 ? '#ffb59a' : '#6bd8cb'}`} strokeWidth="3" />
                </svg>
                <span className="absolute font-headline-md text-[16px] font-bold text-on-surface">{currentMachineAi ? currentMachineAi.healthScore : '---'}</span>
              </>
            )}
          </div>
        </div>

        {/* Extended Telemetry Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Temperature</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.temp} <span className="text-[9px] text-on-surface-variant">°C</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Voltage</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.vol || '---'} <span className="text-[9px] text-on-surface-variant">V</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Current</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.cur || '---'} <span className="text-[9px] text-on-surface-variant">A</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Speed</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.rpm} <span className="text-[9px] text-on-surface-variant">RPM</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Runtime</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.runtime || '---'} <span className="text-[9px] text-on-surface-variant">hrs</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Vibration</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.vib} <span className="text-[9px] text-on-surface-variant">g</span></span>
          </div>
          <div className="bg-surface-container/30 p-2 rounded-lg border border-white/5">
            <span className="font-label-mono text-[8px] uppercase text-on-surface-variant block mb-1">Power Draw</span>
            <span className="font-headline-sm text-[14px] text-on-surface">{selectedMachine.telemetry.pwr} <span className="text-[9px] text-on-surface-variant">kW</span></span>
          </div>
          <div className="col-span-2 bg-primary/10 p-2 rounded-lg border border-primary/30 flex justify-between items-center">
            <span className="font-label-mono text-[10px] uppercase text-primary font-bold">Total Production</span>
            <span className="font-headline-sm text-[16px] text-on-surface">{selectedMachine.telemetry.prod || '---'} <span className="text-[9px] text-on-surface-variant">units</span></span>
          </div>
          <div className="col-span-3 bg-secondary/10 p-2 rounded-lg border border-secondary/30 flex justify-between items-center">
             <span className="font-label-mono text-[10px] uppercase text-secondary font-bold">Real-time Efficiency</span>
             {/* Efficiency = Production / Power * Constant (mock scaled) */}
             <span className="font-headline-sm text-[16px] text-on-surface">
               {selectedMachine.telemetry.pwr > 0 
                  ? ((selectedMachine.telemetry.prod / selectedMachine.telemetry.pwr) * 1.5).toFixed(1) 
                  : 0} 
               <span className="text-[9px] text-on-surface-variant"> U/kW</span>
             </span>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="flex flex-col gap-2 mt-1 border-t border-white/10 pt-3">
          <span className="font-label-mono text-[10px] uppercase text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">build</span>
            Maintenance History
          </span>
          <div className="bg-surface-container/20 p-2 rounded border border-white/5 text-[11px] text-on-surface-variant">
            <ul className="space-y-1">
               <li className="flex justify-between"><span>2026-06-12</span><span>Lubrication</span></li>
               <li className="flex justify-between"><span>2026-05-04</span><span>Sensor Recalibration</span></li>
               <li className="flex justify-between opacity-50"><span>2025-11-20</span><span>Annual Overhaul</span></li>
            </ul>
          </div>
        </div>

        {/* AI Recommendations */}
        {isLoadingInsights ? (
          <div className="flex flex-col gap-2 mt-1 border-t border-white/10 pt-3">
             <span className="font-label-mono text-[10px] uppercase text-on-surface-variant flex items-center gap-1">
               <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
               Analyzing Machine Telemetry...
             </span>
          </div>
        ) : insightsError ? (
          <div className="flex flex-col gap-2 mt-1 border-t border-white/10 pt-3">
             <span className="font-label-mono text-[10px] uppercase text-error flex items-center gap-1">
               <span className="material-symbols-outlined text-[14px]">warning</span>
               {insightsError}
             </span>
          </div>
        ) : currentMachineRecs && (currentMachineRecs ?? []).length > 0 && (
          <div className="flex flex-col gap-2 mt-1 border-t border-white/10 pt-3">
            <span className="font-label-mono text-[10px] uppercase text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              AI Recommendations
            </span>
            {(currentMachineRecs ?? []).map((rec, i) => (
              <div key={i} className="bg-tertiary/10 p-3 rounded border border-tertiary/30 text-body-sm text-on-surface leading-relaxed">
                <span className="font-bold text-tertiary block mb-1">{rec.confidence}% Confidence</span>
                {rec.explanation}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => { addToast(`Maintenance scheduled for ${selectedMachine.name}`); setSelectedMachine(null); }} className="mt-2 w-full font-label-mono text-[12px] uppercase tracking-widest text-surface bg-primary hover:bg-primary-fixed py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(107,216,203,0.3)] hover:shadow-[0_0_20px_rgba(107,216,203,0.5)] cursor-pointer font-bold">
          Schedule Maintenance
        </button>
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
