import GlassCard from './GlassCard';

export default function KpiCard({ title, value, unit = '', trend = '', trendDirection = 'up', icon, color = 'primary' }) {
  const trendColor = trendDirection === 'up' ? 'text-primary' : trendDirection === 'down' ? 'text-error' : 'text-on-surface-variant';
  const trendIcon = trendDirection === 'up' ? 'trending_up' : trendDirection === 'down' ? 'trending_down' : 'trending_flat';

  return (
    <GlassCard className="flex flex-col relative overflow-hidden group">
      {/* Glow effect on hover */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${color}/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">{title}</h3>
        <div className={`p-2 bg-${color}/10 rounded border border-${color}/20 flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-${color} text-sm`}>{icon}</span>
        </div>
      </div>
      
      <div className="flex items-end gap-2 relative z-10">
        <span className="font-display-lg text-4xl text-on-surface leading-none">{value}</span>
        {unit && <span className="font-label-mono text-sm text-on-surface-variant mb-1">{unit}</span>}
      </div>
      
      {trend && (
        <div className={`flex items-center gap-1 mt-4 ${trendColor} bg-${trendColor === 'text-primary' ? 'primary' : 'error'}/10 w-fit px-2 py-1 rounded text-xs font-label-mono relative z-10`}>
          <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
          <span>{trend}</span>
        </div>
      )}
    </GlassCard>
  );
}
