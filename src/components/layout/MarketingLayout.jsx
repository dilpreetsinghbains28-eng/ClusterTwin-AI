import { Outlet, Link } from 'react-router-dom';

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-base antialiased overflow-x-hidden flex flex-col relative">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center w-full px-container-padding-desktop max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-gutter">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">ClusterTwin AI</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="font-body-base text-body-base text-on-surface-variant font-medium hover:text-primary hover:bg-primary/10 transition-all duration-300 px-2 py-1 rounded" to="/">Platform</Link>
            <Link className="font-body-base text-body-base text-on-surface-variant font-medium hover:text-primary hover:bg-primary/10 transition-all duration-300 px-2 py-1 rounded" to="/clusters">Clusters</Link>
            <Link className="font-body-base text-body-base text-on-surface-variant font-medium hover:text-primary hover:bg-primary/10 transition-all duration-300 px-2 py-1 rounded" to="/digital-twin">Twin Engine</Link>
            <Link className="font-body-base text-body-base text-on-surface-variant font-medium hover:text-primary hover:bg-primary/10 transition-all duration-300 px-2 py-1 rounded" to="/pricing">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block font-body-base text-body-base text-on-surface-variant font-medium hover:text-primary transition-all duration-300">Login</Link>
            <Link to="/dashboard" className="primary-gradient text-on-primary font-bold font-body-base text-body-base px-6 py-2 rounded-DEFAULT hover:shadow-[0_0_12px_rgba(107,216,203,0.5)] transition-all duration-300">Launch Console</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full pt-section-gap pb-8 border-t border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="font-headline-md text-headline-md text-primary font-bold">ClusterTwin AI</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              © 2024 ClusterTwin AI. Industrial Intelligence Refined.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-base text-white">Legal</h4>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" to="/">Privacy Policy</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" to="/">Terms of Service</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-base text-white">System</h4>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" to="/settings">Security</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100 flex items-center gap-2" to="/status">Status <span className="w-1.5 h-1.5 rounded-full bg-primary"></span></Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-headline-md text-base text-white">Developers</h4>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" to="/docs">API Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
