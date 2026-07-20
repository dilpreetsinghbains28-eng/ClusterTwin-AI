import { useState } from 'react';
import ActionModal from '../../components/ui/ActionModal';
import { useToast } from '../../components/ui/Toast';

export default function GovernmentPage() {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const addToast = useToast();
  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });

  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-mono text-label-mono text-primary tracking-widest uppercase">Live Telemetry</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2 text-3xl">Gov Dashboard</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">Macro-industrial analytics view for regional administrators. Monitoring district output, employment trends, and operational efficiency across the cluster.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => handleAction('Policy Insights', 'Analyzing current regional output to generate AI-driven policy recommendations. Check back later.')} className="px-6 py-2.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all font-label-mono text-label-mono flex items-center gap-2 border-glow cursor-pointer">
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            Policy Insights
          </button>
          <button onClick={() => { addToast('Data export started'); handleAction('Export Data', 'Generating comprehensive CSV export for all regional districts.'); }} className="px-6 py-2.5 rounded-lg primary-gradient text-white font-label-mono text-label-mono font-bold hover:shadow-[0_0_12px_rgba(107,216,203,0.4)] transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span>
            Export All Data
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* KPI 1 */}
        <div className="surface-glass rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-label-mono text-label-mono text-on-surface-variant uppercase">Regional Prod. Index</div>
            <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display-lg text-display-lg text-on-surface text-4xl">142.8</span>
            <span className="font-body-sm text-body-sm text-primary flex items-center"><span className="material-symbols-outlined text-xs">arrow_upward</span>3.2%</span>
          </div>
          <div className="h-8 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,2" fill="none" stroke="#6bd8cb" strokeWidth="2"></path>
              <path d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,2 L100,20 L0,20 Z" fill="url(#grad1)" opacity="0.2"></path>
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6bd8cb', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#6bd8cb', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* KPI 2 */}
        <div className="surface-glass rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-label-mono text-label-mono text-on-surface-variant uppercase">Total Employment</div>
            <span className="material-symbols-outlined text-secondary">groups</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display-lg text-display-lg text-on-surface text-4xl">84.5k</span>
            <span className="font-body-sm text-body-sm text-primary flex items-center"><span className="material-symbols-outlined text-xs">arrow_upward</span>1.1%</span>
          </div>
          <div className="h-8 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,10 L20,12 L40,8 L60,14 L80,6 L100,2" fill="none" stroke="#adc6ff" strokeWidth="2"></path>
              <path d="M0,10 L20,12 L40,8 L60,14 L80,6 L100,2 L100,20 L0,20 Z" fill="url(#grad2)" opacity="0.2"></path>
              <defs>
                <linearGradient id="grad2" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#adc6ff', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#adc6ff', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* KPI 3 */}
        <div className="surface-glass rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-container/10 rounded-full blur-2xl group-hover:bg-tertiary-container/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-label-mono text-label-mono text-on-surface-variant uppercase">Agg. Energy Intensity</div>
            <span className="material-symbols-outlined text-tertiary-container">bolt</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display-lg text-display-lg text-on-surface text-4xl">4.2<span className="text-sm text-on-surface-variant ml-1">GJ/t</span></span>
            <span className="font-body-sm text-body-sm text-error flex items-center"><span className="material-symbols-outlined text-xs">arrow_upward</span>0.5%</span>
          </div>
          <div className="h-8 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,8 Q20,15 40,10 T80,12 T100,18" fill="none" stroke="#d27956" strokeWidth="2"></path>
              <path d="M0,8 Q20,15 40,10 T80,12 T100,18 L100,20 L0,20 Z" fill="url(#grad3)" opacity="0.2"></path>
              <defs>
                <linearGradient id="grad3" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#d27956', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#d27956', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* KPI 4 */}
        <div className="surface-glass rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-label-mono text-label-mono text-on-surface-variant uppercase">Carbon Emissions</div>
            <span className="material-symbols-outlined text-primary">co2</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display-lg text-display-lg text-on-surface text-4xl">1.2<span className="text-sm text-on-surface-variant ml-1">Mt</span></span>
            <span className="font-body-sm text-body-sm text-primary flex items-center"><span className="material-symbols-outlined text-xs">arrow_downward</span>2.4%</span>
          </div>
          <div className="h-8 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,2 Q20,8 40,5 T80,12 T100,18" fill="none" stroke="#6bd8cb" strokeWidth="2"></path>
              <path d="M0,2 Q20,8 40,5 T80,12 T100,18 L100,20 L0,20 Z" fill="url(#grad4)" opacity="0.2"></path>
              <defs>
                <linearGradient id="grad4" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6bd8cb', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#6bd8cb', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* District Comparison Map (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 surface-glass rounded-xl p-0 relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/30 absolute top-0 w-full z-10 backdrop-blur-md">
            <h3 className="font-headline-md text-headline-md text-on-surface text-xl">District Output Heatmap</h3>
            <div className="flex gap-2">
              <button onClick={() => addToast('Zoomed in heatmap')} className="p-1.5 rounded bg-surface-variant text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">zoom_in</span></button>
              <button onClick={() => addToast('Zoomed out heatmap')} className="p-1.5 rounded bg-surface-variant text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">zoom_out</span></button>
            </div>
          </div>
          {/* Map Container */}
          <div className="flex-1 w-full h-full relative mt-16 bg-surface-dim">
            <img alt="District Map Visualization" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" data-alt="A highly detailed, stylized 3D topological map of a sprawling futuristic industrial district. The map uses a dark mode color palette with deep obsidian bases. Glowing neon cyan and vibrant blue heat map overlays highlight areas of high industrial output and data density. Floating interface elements and data nodes are visible." data-location="Industrial Sector 7" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1IZSvouX_7Ruxmxo_JV9RHTmwljiqiXC2eJJpG8TEsUkyngpNJx7p3MfF2-PJAyT26pZLWgRSQpRa8qGjR6OkHs1I7mJm3fVNT5vtuY0sTYJQW0JklGNe34wwlTYRHxFoFn2FCAx_erckL3JKKFXBsvTbqVZKCpoGrPUTPSJcgQypWGnlTyDx7EnRPnPpTWAvkQHqWwDJOQ7r7AXkB2algvc2PxZkxKQ8J-iNgr4YBB748uEul2lf5B5DDZjAcUBXWlQcN96tJEI" />
            {/* Interactive Map Nodes */}
            <div className="absolute top-[30%] left-[40%] group">
              <div className="w-4 h-4 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 surface-glass p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-glow z-20">
                <div className="font-label-mono text-xs text-primary mb-1">District Alpha</div>
                <div className="text-sm text-on-surface">Output: 45k Units</div>
                <div className="text-xs text-on-surface-variant">Efficiency: 92%</div>
              </div>
            </div>
            <div className="absolute top-[60%] left-[20%] group">
              <div className="w-3 h-3 rounded-full bg-secondary relative cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-50"></div>
              </div>
            </div>
            <div className="absolute top-[45%] left-[70%] group">
              <div className="w-5 h-5 rounded-full bg-primary relative cursor-pointer shadow-[0_0_15px_#6bd8cb]">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-100"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Industry Analysis Bar Chart */}
        <div className="surface-glass rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface text-xl">Sector Performance</h3>
            <span className="material-symbols-outlined text-on-surface-variant">bar_chart</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {/* Automotive */}
            <div>
              <div className="flex justify-between font-label-mono text-label-mono mb-2">
                <span className="text-on-surface">Automotive</span>
                <span className="text-primary">88%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-2 rounded-full relative" style={{ width: '88%' }}>
                  <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
            {/* Electronics */}
            <div>
              <div className="flex justify-between font-label-mono text-label-mono mb-2">
                <span className="text-on-surface">Electronics</span>
                <span className="text-secondary">76%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            {/* Textiles */}
            <div>
              <div className="flex justify-between font-label-mono text-label-mono mb-2">
                <span className="text-on-surface">Textiles</span>
                <span className="text-tertiary-container">45%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div className="bg-tertiary-container h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            {/* Heavy Machinery */}
            <div>
              <div className="flex justify-between font-label-mono text-label-mono mb-2">
                <span className="text-on-surface">Heavy Machinery</span>
                <span className="text-primary">62%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div className="bg-primary/60 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factory Ranking Table */}
        <div className="surface-glass rounded-xl p-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface text-xl">Top Facilities</h3>
            <button onClick={() => handleAction('Facilities List', 'Displaying full list of all 42 regional facilities.')} className="font-label-mono text-label-mono text-primary hover:text-white transition-colors cursor-pointer">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 font-label-mono text-label-mono text-on-surface-variant">
                  <th className="py-3 px-4 font-medium">Rank</th>
                  <th className="py-3 px-4 font-medium">Facility ID</th>
                  <th className="py-3 px-4 font-medium">District</th>
                  <th className="py-3 px-4 font-medium text-right">Efficiency</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4 text-primary font-label-mono">01</td>
                  <td className="py-3 px-4 text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    GigaFab Alpha
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">D-North</td>
                  <td className="py-3 px-4 text-right text-on-surface font-label-mono">98.2%</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4 text-secondary font-label-mono">02</td>
                  <td className="py-3 px-4 text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    ElectroWorks 4
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">D-East</td>
                  <td className="py-3 px-4 text-right text-on-surface font-label-mono">95.4%</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4 text-on-surface-variant font-label-mono">03</td>
                  <td className="py-3 px-4 text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                    AutoAssembly B
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">D-South</td>
                  <td className="py-3 px-4 text-right text-on-surface font-label-mono">91.1%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4 text-on-surface-variant font-label-mono">04</td>
                  <td className="py-3 px-4 text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                    TextileHub
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">D-West</td>
                  <td className="py-3 px-4 text-right text-on-surface font-label-mono">88.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Employment Trends Line Graph */}
        <div className="surface-glass rounded-xl p-6 relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface text-xl mb-1">Workforce Dynamics</h3>
              <p className="font-label-mono text-label-mono text-on-surface-variant">Quarterly Growth vs Demand</p>
            </div>
            <div className="flex gap-3 font-label-mono text-xs">
              <div className="flex items-center gap-1 text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary"></span> Active</div>
              <div className="flex items-center gap-1 text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-secondary"></span> Demand</div>
            </div>
          </div>
          <div className="flex-1 relative mt-4 w-full h-full min-h-[200px] z-10 flex items-end">
            {/* Abstract graph representation using SVG */}
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Grid lines */}
              <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
              <line stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75"></line>
              {/* Demand Line (Secondary) */}
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,80 Q20,70 40,75 T60,50 T80,30 T100,20" fill="none" stroke="#adc6ff" strokeDasharray="2,2" strokeWidth="1.5"></path>
              {/* Active Workforce Line (Primary) */}
              <path style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s ease-out forwards' }} d="M0,90 Q20,85 40,80 T60,60 T80,45 T100,40" fill="none" stroke="#6bd8cb" strokeWidth="2.5"></path>
              {/* Area Fill */}
              <path d="M0,90 Q20,85 40,80 T60,60 T80,45 T100,40 L100,100 L0,100 Z" fill="url(#gradGraph)" opacity="0.15"></path>
              <defs>
                <linearGradient id="gradGraph" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6bd8cb', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#6bd8cb', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
              {/* Data Points */}
              <circle cx="60" cy="60" fill="#0b1326" r="2" stroke="#6bd8cb" strokeWidth="1.5"></circle>
              <circle cx="80" cy="45" fill="#0b1326" r="2" stroke="#6bd8cb" strokeWidth="1.5"></circle>
            </svg>
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 w-full flex justify-between font-label-mono text-[10px] text-on-surface-variant pt-2 border-t border-white/10">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
          </div>
        </div>
      </section>
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
