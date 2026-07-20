import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="surface-glass rounded-xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">Reset Password</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your email and we&apos;ll send a reset link to your inbox
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/50 rounded text-error font-body-sm text-center">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded text-primary font-body-base text-center">
              Reset link sent! Please check your email inbox.
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleReset}>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="resetEmail">
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(107,216,203,0.2)] transition-all placeholder:text-on-surface-variant/50"
                  placeholder="operator@cluster.ai"
                />
              </div>

              <button
                type="submit"
                className="w-full primary-gradient text-on-primary font-bold font-body-base text-body-base py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all duration-300 text-center mt-2 cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:text-primary-fixed font-semibold transition-colors">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
