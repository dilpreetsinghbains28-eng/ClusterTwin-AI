import { useState } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';

export default function LogisticsPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const addToast = useToast();
  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });

  return (
    <>
      {/* Page Header & Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
            Resource Sharing Protocol
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-mono text-label-mono text-[10px] border border-primary/30 uppercase tracking-widest">Active</span>
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Cross-cluster dynamic allocation and macro-logistics view.</p>
        </div>
        {/* Government View Toggle */}
        <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2 rounded-full border border-white/5 shadow-inner">
          <span className="font-label-mono text-label-mono text-on-surface-variant">Cluster View</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" value="" onChange={(e) => addToast(e.target.checked ? 'Govt Overview Active' : 'Cluster View Active')} />
            <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/80 border border-white/10"></div>
          </label>
          <span className="font-label-mono text-label-mono text-primary drop-shadow-[0_0_4px_rgba(107,216,203,0.5)]">Govt Overview</span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Interactive Map (Span 8) */}
        <div className="lg:col-span-8 surface-glass rounded-xl overflow-hidden relative flex flex-col min-h-[600px]">
          {/* Map Toolbar Overlay */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button onClick={() => addToast('Heatmap layer toggled')} className="bg-surface/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded text-primary font-label-mono text-label-mono flex items-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">layers</span> Heatmap
            </button>
            <button onClick={() => handleAction('Map Filters', 'Map filtering is currently disabled.')} className="bg-surface/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded text-on-surface-variant font-label-mono text-label-mono flex items-center gap-2 hover:text-on-surface transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span> Filters
            </button>
          </div>
          {/* Map Background & Elements */}
          <div className="flex-1 bg-surface-dim relative overflow-hidden bg-[length:40px_40px]" style={{ backgroundImage: 'linear-gradient(to right, rgba(107, 216, 203, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(107, 216, 203, 0.05) 1px, transparent 1px)' }}>
            {/* Heatmap Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(107, 216, 203, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(5, 102, 217, 0.15) 0%, transparent 40%)' }}></div>
            {/* Node 1: High Demand */}
            <div className="absolute top-1/4 left-1/3 group cursor-pointer">
              <div className="w-4 h-4 bg-error rounded-full shadow-[0_0_15px_#ffb4ab] animate-pulse relative z-10"></div>
              <div className="absolute w-32 h-32 bg-error/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-md pointer-events-none"></div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 surface-glass rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <h4 className="font-label-mono text-label-mono text-on-surface font-bold border-b border-white/10 pb-1 mb-2">Node 4: Assembly</h4>
                <div className="space-y-1">
                  <div className="flex justify-between font-label-mono text-label-mono text-[10px]">
                    <span className="text-on-surface-variant">Status:</span>
                    <span className="text-error">Critical Shortage</span>
                  </div>
                  <div className="flex justify-between font-label-mono text-label-mono text-[10px]">
                    <span className="text-on-surface-variant">Workforce:</span>
                    <span className="text-on-surface">65% Active</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Node 2: Surplus */}
            <div className="absolute top-1/2 left-2/3 group cursor-pointer">
              <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#6bd8cb] relative z-10"></div>
              <div className="absolute w-40 h-40 bg-primary/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-md pointer-events-none"></div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 surface-glass rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <h4 className="font-label-mono text-label-mono text-on-surface font-bold border-b border-white/10 pb-1 mb-2">Node 7: Fabrication</h4>
                <div className="space-y-1">
                  <div className="flex justify-between font-label-mono text-label-mono text-[10px]">
                    <span className="text-on-surface-variant">Status:</span>
                    <span className="text-primary">Optimal</span>
                  </div>
                  <div className="flex justify-between font-label-mono text-label-mono text-[10px]">
                    <span className="text-on-surface-variant">Surplus Operators:</span>
                    <span className="text-on-surface">12 Available</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Node 3: Standard */}
            <div className="absolute bottom-1/3 left-1/4 group cursor-pointer">
              <div className="w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_#adc6ff] relative z-10"></div>
            </div>
            {/* Data Connection Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
              <path className="animate-pulse" d="M 33% 25% Q 50% 30% 66% 50%" fill="none" stroke="rgba(107, 216, 203, 0.4)" strokeDasharray="4 4" strokeWidth="2"></path>
              <circle className="animate-ping" cx="50%" cy="30%" fill="#6bd8cb" r="3"></circle>
            </svg>
          </div>
          {/* Map Legend Bottom */}
          <div className="absolute bottom-0 w-full bg-surface-container-low/90 backdrop-blur border-t border-white/10 p-3 flex justify-between items-center z-10">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#6bd8cb]"></span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">Surplus Resource</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error shadow-[0_0_5px_#ffb4ab]"></span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">Critical Need</span>
              </div>
            </div>
            <span className="font-label-mono text-[10px] text-primary/50 uppercase tracking-widest">Live Telemetry</span>
          </div>
        </div>
        {/* Sidebar: Resource Availability (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="surface-glass rounded-xl p-6 flex-1 flex flex-col">
            <h3 className="font-headline-md text-[18px] text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
              Cluster Availability
            </h3>
            <div className="space-y-8 flex-1">
              {/* Gauge 1: Machinery */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant">Heavy Machinery</span>
                  <span className="font-label-mono text-label-mono text-primary">82%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary-container to-primary w-[82%] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 mix-blend-overlay"></div>
                  </div>
                </div>
                <p className="font-label-mono text-[10px] text-on-surface-variant/50 mt-1 text-right">4 Idle Units detected</p>
              </div>
              {/* Gauge 2: Workforce */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant">Skilled Workforce</span>
                  <span className="font-label-mono text-label-mono text-secondary">64%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-secondary-container to-secondary w-[64%] relative"></div>
                </div>
                <p className="font-label-mono text-[10px] text-on-surface-variant/50 mt-1 text-right">High demand at Node 4</p>
              </div>
              {/* Gauge 3: Raw Materials */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant">Raw Materials</span>
                  <span className="font-label-mono text-label-mono text-error">38%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-error-container to-error w-[38%] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px] animate-pulse"></div>
                  </div>
                </div>
                <p className="font-label-mono text-[10px] text-error/80 mt-1 text-right">Supply chain bottleneck detected</p>
              </div>
            </div>
          </div>
          {/* Mini Insight Card */}
          <div className="surface-glass rounded-xl p-5 border-l-4 border-l-primary relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[100px]">lightbulb</span>
            </div>
            <h4 className="font-label-mono text-[10px] uppercase tracking-widest text-primary mb-2">AI Insight</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Shifting 5 CNC operators from <span className="text-on-surface font-semibold">Node 7</span> to <span className="text-on-surface font-semibold">Node 4</span> will increase overall cluster output by <span className="text-primary font-bold">12.4%</span> over the next 48 hours.
            </p>
          </div>
        </div>
        {/* Bottom Panel: Smart Logistics List (Span 12) */}
        <div className="lg:col-span-12 surface-glass rounded-xl overflow-hidden mt-2">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-surface-container/30">
            <h3 className="font-headline-md text-[18px] text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">route</span>
              AI Recommended Transfers
            </h3>
            <button onClick={() => handleAction('Transfer History', 'Viewing past 30 days of AI recommended transfers.')} className="font-label-mono text-[12px] text-primary hover:underline cursor-pointer">View All History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-surface-dim/50">
                  <th className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant font-medium">Resource/Asset</th>
                  <th className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant font-medium">Origin <span className="material-symbols-outlined text-[14px] align-middle mx-1">arrow_forward</span> Destination</th>
                  <th className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant font-medium">Logistics</th>
                  <th className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Row 1 */}
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-[16px]">engineering</span>
                      </div>
                      <div>
                        <p className="font-body-sm text-on-surface font-medium">5x CNC Operators</p>
                        <p className="font-label-mono text-[10px] text-on-surface-variant">Priority: High</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 font-label-mono text-[12px]">
                      <span className="text-on-surface">Node 7</span>
                      <span className="material-symbols-outlined text-primary text-[16px]">trending_flat</span>
                      <span className="text-error">Node 4</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-label-mono text-[12px] text-on-surface-variant">
                      <p>Dist: <span className="text-on-surface">14.2 km</span></p>
                      <p>ETA: <span className="text-on-surface">25 mins</span></p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => { addToast('Workflow Approved'); handleAction('Workflow Approved', 'Initiated transfer of 5x CNC Operators from Node 7 to Node 4.'); }} className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-on-primary font-label-mono text-label-mono px-4 py-2 rounded transition-all shadow-[0_0_10px_rgba(107,216,203,0.1)] hover:shadow-[0_0_15px_rgba(107,216,203,0.4)] cursor-pointer">
                      Approve Workflow
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <span className="material-symbols-outlined text-secondary text-[16px]">forklift</span>
                      </div>
                      <div>
                        <p className="font-body-sm text-on-surface font-medium">2x Heavy Forklifts</p>
                        <p className="font-label-mono text-[10px] text-on-surface-variant">Priority: Standard</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 font-label-mono text-[12px]">
                      <span className="text-on-surface">Node 2</span>
                      <span className="material-symbols-outlined text-primary text-[16px]">trending_flat</span>
                      <span className="text-on-surface">Node 5</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-label-mono text-[12px] text-on-surface-variant">
                      <p>Dist: <span className="text-on-surface">3.8 km</span></p>
                      <p>ETA: <span className="text-on-surface">12 mins</span></p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleAction('Review Transfer', 'Reviewing recommended transfer of 2x Heavy Forklifts from Node 2 to Node 5.')} className="bg-transparent text-primary border border-primary/30 hover:bg-primary/10 font-label-mono text-label-mono px-4 py-2 rounded transition-all cursor-pointer">
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
