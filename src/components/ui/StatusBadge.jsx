export default function StatusBadge({ status }) {
  let color = 'primary';
  if (status === 'Offline' || status === 'Critical' || status === 'Error') color = 'error';
  else if (status === 'Warning' || status === 'Maintenance') color = 'tertiary';
  
  return (
    <div className={`flex items-center gap-2 bg-${color}/10 px-3 py-1 rounded-full border border-${color}/30`}>
      <span className={`w-2 h-2 rounded-full bg-${color} ${status === 'Active' || status === 'Operational' ? 'animate-pulse' : ''}`}></span>
      <span className={`font-label-mono text-label-mono text-${color} uppercase`}>{status}</span>
    </div>
  );
}
