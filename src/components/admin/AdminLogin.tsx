import React, { useState } from 'react';
import { Lock, Mail, Eye, ShieldCheck, ArrowRight, AlertCircle, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: { email: string; name: string }) => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('admin@getwelleyehospital.com');
  const [password, setPassword] = useState('GetWell@Bikaner2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-lg mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hospital Admin Portal
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          GetWell Eye Hospital, Patel Nagar, Bikaner
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80 text-left">
          
          {/* Security Banner */}
          <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>Secure Access Only:</strong> Authorized staff credential verification with cryptographic session tokens.
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="adminEmail" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="adminEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
                  placeholder="admin@getwelleyehospital.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adminPass" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="adminPass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 transition-colors cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Credential Tip */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl space-y-1">
            <div className="font-semibold text-slate-700">Initial Staff Credentials:</div>
            <div>Email: <code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-slate-800">admin@getwelleyehospital.com</code></div>
            <div>Password: <code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-slate-800">GetWell@Bikaner2026!</code></div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onBackToHome}
              type="button"
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
