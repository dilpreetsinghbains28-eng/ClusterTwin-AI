import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !orgEmail || !orgName || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      console.log('1. [SignUpPage] Sending payload:', { firstName, lastName, email: orgEmail, organizationName: orgName, password });
      await register({
        firstName,
        lastName,
        email: orgEmail,
        organizationName: orgName,
        password,
      });
      console.log('2. [SignUpPage] Registration successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('3. [SignUpPage] Catch block hit with error:', err);
      console.error('4. [SignUpPage] Error response:', err.response?.data);
      const backendError = err.response?.data?.message || err.response?.data?.error;
      setError(backendError || err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="surface-glass rounded-xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">Request Access</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Join the ClusterTwin AI Industrial Platform
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/50 rounded text-error font-body-sm text-center">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="orgEmail">
                Organization Email
              </label>
              <input
                id="orgEmail"
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="you@organization.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="orgName">
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="Acme Industrial Co."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider" htmlFor="newPassword">
                Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E293B] border border-outline-variant/30 rounded px-4 py-3 text-on-surface font-body-base text-body-base focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="Min. 8 characters"
              />
            </div>

            <div className="flex items-start gap-3 mt-1">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1E293B] border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 mt-0.5"
              />
              <label htmlFor="terms" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                I agree to the <Link to="/" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full primary-gradient text-on-primary font-bold font-body-base text-body-base py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all duration-300 text-center mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-fixed font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
