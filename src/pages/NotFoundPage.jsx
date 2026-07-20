import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <h1 className="font-display-lg text-4xl text-on-surface mb-2">404 - Page Not Found</h1>
      <p className="font-body-base text-on-surface-variant mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="primary-gradient text-white font-bold px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.6)] transition-all">
        Return to Dashboard
      </Link>
    </div>
  );
}
