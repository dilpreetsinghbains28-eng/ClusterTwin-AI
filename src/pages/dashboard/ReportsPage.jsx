import { useState, useMemo } from 'react';
import { useToast } from '../../components/ui/Toast';
import ActionModal from '../../components/ui/ActionModal';

export default function ReportsPage() {
  const addToast = useToast();
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    factory: 'All Factories',
    machine: 'All Machines',
    dateRange: 'Last 30 Days',
    shift: 'All Shifts',
    product: 'All Products'
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Mock export functions tied to filters
  const handleExport = async (type) => {
    setIsGenerating(true);
    addToast(`Compiling ${type.toUpperCase()} using active filters...`);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      addToast(`Advanced Analytics Report successfully exported to ${type.toUpperCase()}`);
    }, 1500);
  };

  // ----------------------------------------------------
  // Procedural Data Generation based on filters
  // ----------------------------------------------------
  
  // Seed influences the randomness slightly based on filter string length to make it look reactive
  const seed = Object.values(filters).join('').length;

  // 1. Forecast vs Demand (Line Chart)
  const forecastData = useMemo(() => {
    const points = [];
    let currentProd = 100;
    let currentDemand = 110;
    for (let i = 0; i < 30; i++) {
      points.push({
        x: i * (1000 / 30),
        yProd: 200 - (currentProd + (Math.sin(i + seed) * 20)),
        yDemand: 200 - (currentDemand + (Math.cos(i + seed) * 15))
      });
    }
    return points;
  }, [seed]);

  const prodPath = `M ${(forecastData ?? []).map(p => `${p.x},${p.yProd}`).join(' L ')}`;
  const demandPath = `M ${(forecastData ?? []).map(p => `${p.x},${p.yDemand}`).join(' L ')}`;

  // 2. Pareto Chart (Downtime Analysis)
  const paretoData = useMemo(() => {
    const categories = ['Thermal Overload', 'Calibration', 'Supply Shortage', 'Software Fault', 'Power Dip', 'Operator Error'];
    // Sort descending
    let data = categories.map((c, i) => ({
      label: c,
      val: Math.floor(100 / (i + 1)) + (seed % 10)
    })).sort((a, b) => b.val - a.val);

    let total = data.reduce((sum, item) => sum + item.val, 0);
    let cumulative = 0;
    
    return data.map((item, i) => {
      cumulative += item.val;
      return {
        ...item,
        cumulPercent: (cumulative / total) * 100,
        x: (i * (800 / categories.length)) + 50
      };
    });
  }, [seed]);

  // 3. Utilization Heatmap (28 days x 3 shifts)
  const heatMapDays = 28;
  const heatMapShifts = 3;
  const heatMapData = useMemo(() => {
    const grid = [];
    for (let d = 0; d < heatMapDays; d++) {
      for (let s = 0; s < heatMapShifts; s++) {
        // Generate a density value 0-100
        const val = Math.floor(Math.random() * 100) + (seed % 20);
        grid.push({ d, s, val: Math.min(val, 100) });
      }
    }
    return grid;
  }, [seed]);

  // 4. Dynamic KPIs
  const kpis = useMemo(() => {
    return {
      mttr: (1.2 + (seed % 5) * 0.1).toFixed(1), // Mean Time To Repair (Hrs)
      mtbf: (210 + (seed % 50)).toFixed(0), // Mean Time Between Failures (Hrs)
      oee: (82 + (seed % 10)).toFixed(1),
      energyTrend: seed % 2 === 0 ? '-2.4%' : '+1.1%',
      carbonTrend: seed % 2 === 0 ? '-4.2%' : '+0.5%'
    };
  }, [seed]);


  return (
    <>
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-background overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto min-h-[calc(100vh-80px)] flex flex-col gap-6 pb-10">
        
        {/* Header & Export Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-mono text-[11px] text-primary uppercase tracking-widest">Advanced Analytics Engine</span>
            </div>
            <h1 className="font-display-lg text-3xl text-white">Interactive Reports</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isGenerating}
              className="bg-surface-container border border-white/10 hover:border-primary/50 text-white font-label-mono text-[11px] uppercase tracking-wider py-2 px-4 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              Export PDF
            </button>
            <button 
              onClick={() => handleExport('excel')}
              disabled={isGenerating}
              className="primary-gradient text-surface font-label-mono text-[11px] uppercase tracking-wider font-bold py-2 px-4 rounded flex items-center gap-2 hover:shadow-glow transition-shadow disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">table_chart</span>
              Export Excel
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="surface-glass rounded-xl p-4 border border-white/5 flex flex-wrap gap-4 items-center">
          <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Filters:</span>
          
          {/* Factory Select */}
          <div className="relative">
            <select 
              value={filters.factory} 
              onChange={(e) => handleFilterChange('factory', e.target.value)}
              className="appearance-none bg-[#1E293B] border border-white/10 hover:border-primary/50 text-white text-xs py-2 pl-3 pr-8 rounded outline-none cursor-pointer transition-colors min-w-[140px]"
            >
              <option>All Factories</option>
              <option>Factory Alpha-1</option>
              <option>Factory Alpha-2</option>
              <option>Factory Beta</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">arrow_drop_down</span>
          </div>

          {/* Machine Select */}
          <div className="relative">
            <select 
              value={filters.machine} 
              onChange={(e) => handleFilterChange('machine', e.target.value)}
              className="appearance-none bg-[#1E293B] border border-white/10 hover:border-primary/50 text-white text-xs py-2 pl-3 pr-8 rounded outline-none cursor-pointer transition-colors min-w-[140px]"
            >
              <option>All Machines</option>
              <option>CNC Unit 1</option>
              <option>CNC Unit 2</option>
              <option>Stamping Press A</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">arrow_drop_down</span>
          </div>

          {/* Date Range */}
          <div className="relative">
            <select 
              value={filters.dateRange} 
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="appearance-none bg-[#1E293B] border border-white/10 hover:border-primary/50 text-white text-xs py-2 pl-3 pr-8 rounded outline-none cursor-pointer transition-colors min-w-[140px]"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">arrow_drop_down</span>
          </div>

          {/* Shift */}
          <div className="relative">
            <select 
              value={filters.shift} 
              onChange={(e) => handleFilterChange('shift', e.target.value)}
              className="appearance-none bg-[#1E293B] border border-white/10 hover:border-primary/50 text-white text-xs py-2 pl-3 pr-8 rounded outline-none cursor-pointer transition-colors min-w-[140px]"
            >
              <option>All Shifts</option>
              <option>Morning (06:00 - 14:00)</option>
              <option>Evening (14:00 - 22:00)</option>
              <option>Night (22:00 - 06:00)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">arrow_drop_down</span>
          </div>

          {/* Product */}
          <div className="relative">
            <select 
              value={filters.product} 
              onChange={(e) => handleFilterChange('product', e.target.value)}
              className="appearance-none bg-[#1E293B] border border-white/10 hover:border-primary/50 text-white text-xs py-2 pl-3 pr-8 rounded outline-none cursor-pointer transition-colors min-w-[140px]"
            >
              <option>All Products</option>
              <option>Model X Chassis</option>
              <option>Gearbox Assembly</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">arrow_drop_down</span>
          </div>
          
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Line Chart: Forecast vs Demand */}
          <div className="lg:col-span-8 surface-glass rounded-xl p-5 border border-white/5 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-lg text-white">Production Forecast vs Demand</h3>
                <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">AI Predictive Model Analysis</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><span className="w-3 h-1 bg-primary rounded"></span><span className="text-xs text-on-surface-variant">Production</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-1 bg-tertiary rounded"></span><span className="text-xs text-on-surface-variant">Demand Forecast</span></div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Demand Line */}
                <path d={demandPath} fill="none" stroke="#ffb59a" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(255,181,154,0.6)]" strokeLinejoin="round" />
                
                {/* Production Line */}
                <path d={prodPath} fill="none" stroke="#6bd8cb" strokeWidth="4" className="drop-shadow-[0_0_12px_rgba(107,216,203,0.8)]" strokeLinejoin="round" />
                
                {/* Forecast Divider Zone */}
                <rect x="700" y="0" width="300" height="200" fill="url(#forecastGradient)" opacity="0.5" />
                <line x1="700" y1="0" x2="700" y2="200" stroke="#6bd8cb" strokeWidth="1" strokeDasharray="2 2" />
                <text x="710" y="20" fill="#6bd8cb" fontSize="12" className="font-label-mono uppercase">AI Forecast Horizon</text>

                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(107,216,203,0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* KPI Mini Grid */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Reliability KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="surface-glass rounded-xl p-4 border border-white/5">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-2">MTTR</span>
                <span className="font-display-lg text-3xl text-white">{kpis.mttr}</span><span className="text-on-surface-variant text-sm ml-1">hrs</span>
              </div>
              <div className="surface-glass rounded-xl p-4 border border-white/5">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-2">MTBF</span>
                <span className="font-display-lg text-3xl text-white">{kpis.mtbf}</span><span className="text-on-surface-variant text-sm ml-1">hrs</span>
              </div>
            </div>

            {/* Macro Trends */}
            <div className="surface-glass rounded-xl p-4 border border-white/5 flex-1 flex flex-col justify-center gap-6">
               <div>
                 <div className="flex justify-between items-end mb-1">
                   <span className="font-label-mono text-[11px] text-on-surface-variant uppercase">OEE Trend</span>
                   <span className="font-headline-md text-primary">{kpis.oee}%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${kpis.oee}%`}}></div>
                 </div>
               </div>
               
               <div className="flex justify-between items-center border-t border-white/5 pt-4">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-tertiary/10 rounded text-tertiary"><span className="material-symbols-outlined text-sm">bolt</span></div>
                   <span className="text-sm text-white">Energy Var.</span>
                 </div>
                 <span className={`font-label-mono text-xs ${kpis.energyTrend.includes('-') ? 'text-primary' : 'text-error'}`}>{kpis.energyTrend}</span>
               </div>

               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-secondary/10 rounded text-secondary"><span className="material-symbols-outlined text-sm">co2</span></div>
                   <span className="text-sm text-white">Carbon Var.</span>
                 </div>
                 <span className={`font-label-mono text-xs ${kpis.carbonTrend.includes('-') ? 'text-primary' : 'text-error'}`}>{kpis.carbonTrend}</span>
               </div>
            </div>
          </div>
          
          {/* Downtime Pareto Chart */}
          <div className="lg:col-span-6 surface-glass rounded-xl p-5 border border-white/5 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-lg text-white">Downtime Analysis</h3>
                <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">Pareto Distribution (Root Cause)</p>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 800 250" className="w-full h-full overflow-visible">
                {/* Axes */}
                <line x1="40" y1="200" x2="800" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="40" y1="200" x2="40" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                
                {/* Bars */}
                {(paretoData ?? []).map((d, i) => (
                  <g key={i}>
                    <rect 
                      x={d.x - 30} 
                      y={200 - (d.val * 1.5)} 
                      width="60" 
                      height={d.val * 1.5} 
                      fill="rgba(107,216,203,0.3)" 
                      stroke="#6bd8cb" 
                      strokeWidth="1" 
                    />
                    {/* Rotated Labels */}
                    <text x={d.x} y="215" fill="#a2b0d3" fontSize="11" textAnchor="end" transform={`rotate(-35, ${d.x}, 215)`}>{d.label}</text>
                  </g>
                ))}

                {/* Cumulative Percentage Line */}
                <path 
                  d={`M ${(paretoData ?? []).map(d => `${d.x},${200 - (d.cumulPercent * 1.5)}`).join(' L ')}`} 
                  fill="none" 
                  stroke="#ffb59a" 
                  strokeWidth="3" 
                  className="drop-shadow-[0_0_5px_rgba(255,181,154,0.6)]"
                />
                
                {/* Line Points */}
                {(paretoData ?? []).map((d, i) => (
                  <circle key={`c-${i}`} cx={d.x} cy={200 - (d.cumulPercent * 1.5)} r="4" fill="#ffb59a" />
                ))}
              </svg>
            </div>
          </div>

          {/* Machine Utilization Heatmap */}
          <div className="lg:col-span-6 surface-glass rounded-xl p-5 border border-white/5 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-lg text-white">Machine Utilization Matrix</h3>
                <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">Density mapping across 3 shifts (28 Days)</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-on-surface-variant mr-1">Idle</span>
                <span className="w-3 h-3 rounded-sm bg-[#1E293B]"></span>
                <span className="w-3 h-3 rounded-sm bg-primary/30"></span>
                <span className="w-3 h-3 rounded-sm bg-primary/60"></span>
                <span className="w-3 h-3 rounded-sm bg-primary"></span>
                <span className="text-[9px] text-on-surface-variant ml-1">Max</span>
              </div>
            </div>

            <div className="flex-1 flex overflow-x-auto hide-scrollbar">
              <svg viewBox="0 0 600 120" className="w-full h-full min-w-[500px]">
                {/* Y-Axis Labels (Shifts) */}
                <text x="0" y="20" fill="#a2b0d3" fontSize="10" className="font-label-mono">Morning</text>
                <text x="0" y="55" fill="#a2b0d3" fontSize="10" className="font-label-mono">Evening</text>
                <text x="0" y="90" fill="#a2b0d3" fontSize="10" className="font-label-mono">Night</text>
                
                {/* Heatmap Blocks */}
                {(heatMapData ?? []).map((d, i) => {
                  let color = '#1E293B'; // base idle
                  if (d.val > 25) color = 'rgba(107,216,203,0.3)';
                  if (d.val > 50) color = 'rgba(107,216,203,0.6)';
                  if (d.val > 80) color = '#6bd8cb';
                  
                  return (
                    <rect 
                      key={i}
                      x={60 + (d.d * 18)} 
                      y={d.s * 35} 
                      width="15" 
                      height="30" 
                      fill={color} 
                      rx="2"
                      className="transition-colors duration-500 hover:fill-white cursor-pointer"
                    >
                      <title>Density: {d.val}%</title>
                    </rect>
                  );
                })}
              </svg>
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
