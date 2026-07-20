import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container py-4 px-container-padding-mobile md:px-container-padding-desktop flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
      <div className="font-label-mono text-xs text-on-surface-variant flex items-center gap-2">
        <span>© 2024 ClusterTwin AI. All rights reserved.</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/50"></span>
        <span className="text-primary font-bold">System Status: Optimal</span>
      </div>
      <div className="flex items-center gap-6 font-label-mono text-xs text-on-surface-variant">
        <Link className="hover:text-primary transition-colors" to="/">Privacy Policy</Link>
        <Link className="hover:text-primary transition-colors" to="/">Terms of Service</Link>
        <Link className="hover:text-primary transition-colors" to="/docs">Cluster Protocol</Link>
        <Link className="hover:text-primary transition-colors" to="/settings">Security</Link>
      </div>
    </footer>
  );
}
