import { Link } from 'react-router-dom';
import ThreeBackground from '../../components/ThreeBackground';

export default function LandingPage() {
  return (
    <>
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden pt-section-gap pb-section-gap px-container-padding-mobile md:px-container-padding-desktop">
          <div className="absolute inset-0 z-0 opacity-40">
            <ThreeBackground />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-glass w-fit border-glow">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-mono text-label-mono text-primary">SYSTEM ONLINE V2.4</span>
              </div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg bg-clip-text text-transparent bg-gradient-to-br from-[#dae2fd] to-[#6bd8cb] leading-tight">
                Transform MSME Clusters with AI Digital Twins
              </h1>
              <p className="font-headline-md text-headline-md text-on-surface-variant font-normal max-w-3xl">
                The premier AI-powered Shared Digital Twin Platform for Industrial Clusters. Efficiency, resilience, and growth for every factory.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link to="/signup" className="primary-gradient text-white font-bold px-8 py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.6)] transition-all duration-300 flex items-center gap-2">
                  <span>Get Started</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                </Link>
                <Link to="/dashboard" className="surface-glass border-glow text-on-surface font-bold px-8 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300 flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>play_circle</span>
                  <span>Live Demo</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(107, 216, 203, 0.15) 0%, rgba(11, 19, 38, 0) 70%)', top: '20%', left: '-10%' }}></div>
          <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(107, 216, 203, 0.15) 0%, rgba(11, 19, 38, 0) 70%)', bottom: '10%', right: '-5%' }}></div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-outline-variant/30 bg-surface-container-lowest/50 relative z-10">
          <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
              <div className="flex flex-col items-center justify-center p-4">
                <span className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold drop-shadow-[0_0_15px_rgba(107,216,203,0.5)]">500+</span>
                <span className="font-label-mono text-label-mono text-on-surface-variant mt-2 uppercase tracking-widest">Factories Connected</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold drop-shadow-[0_0_15px_rgba(107,216,203,0.5)]">99%</span>
                <span className="font-label-mono text-label-mono text-on-surface-variant mt-2 uppercase tracking-widest">AI Accuracy</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold drop-shadow-[0_0_15px_rgba(107,216,203,0.5)]">30%</span>
                <span className="font-label-mono text-label-mono text-on-surface-variant mt-2 uppercase tracking-widest">Energy Saved</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
