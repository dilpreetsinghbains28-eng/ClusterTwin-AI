import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="surface-glass rounded-xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">Welcome Back</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sign in to access your industrial twin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/50 rounded text-error font-body-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(107,216,203,0.2)] transition-all placeholder:text-on-surface-variant/50"
                placeholder="operator@cluster.ai"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="font-label-mono text-label-mono text-primary hover:text-primary-fixed transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(107,216,203,0.2)] transition-all placeholder:text-on-surface-variant/50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded bg-[#1E293B] border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="remember" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full primary-gradient text-on-primary font-bold font-body-base text-body-base py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all duration-300 text-center mt-2 block cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-outline-variant/30"></div>
            <span className="font-label-mono text-label-mono text-on-surface-variant">OR</span>
            <div className="flex-1 h-px bg-outline-variant/30"></div>
          </div>

          {/* SSO Button */}
          <button className="w-full surface-glass border border-outline-variant/50 text-on-surface font-body-base text-body-base py-3 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">key</span>
            Continue with SSO
          </button>

          {/* Footer */}
          <p className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-fixed font-semibold transition-colors">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
