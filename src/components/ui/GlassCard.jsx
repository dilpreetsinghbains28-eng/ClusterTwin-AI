export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div 
      className={`surface-glass p-6 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
