import { Outlet, Link } from 'react-router-dom';
import ThreeBackground from "../../components/ThreeBackground";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-base antialiased overflow-hidden relative flex flex-col">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ThreeBackground />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/40 to-background/90 pointer-events-none" />

      {/* Brand Header */}
      <header className="relative z-20 w-full px-container-padding-desktop py-6">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          ClusterTwin AI
        </Link>
      </header>

      {/* Centered Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-container-padding-mobile md:px-container-padding-desktop">
        <Outlet />
      </div>
    </div>
  );
}
