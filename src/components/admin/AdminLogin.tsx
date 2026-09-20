import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { loginAdmin, AuthenticatedAdmin } from '../../lib/auth';

interface AdminLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess?: (admin: AuthenticatedAdmin) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const admin = await loginAdmin(email.trim(), password);
      onLoginSuccess?.(admin);
      onNavigate('/admin/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-stone-900 antialiased" id="admin-login-root">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 text-amber-400 font-bold font-display shadow-xs">
          P
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-stone-950">
          {/* Portfolio Console */}
          HERITAGE TECH LABS
        </h1>
        <p className="text-xs font-mono text-stone-500 uppercase tracking-wider">
          Single-tenant private administrator access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-xs font-mono font-medium text-stone-700 uppercase">
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block text-xs font-mono font-medium text-stone-700 uppercase">
                Password / Access Key
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs font-mono text-stone-600 space-y-1">
              <div className="text-stone-900 font-semibold flex items-center gap-1.5">
                <Icon name="lock" size="sm" className="text-stone-500" />
                <span>Private Admin Access</span>
              </div>
              <p className="font-sans text-stone-600 text-[11px] leading-relaxed">
                Sign in with the private administrator credentials configured on the backend.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                'Access Console'
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <Icon name="arrow_back" size="sm" />
              <span>Return to Public Website</span>
            </button>
            <span className="text-stone-400">Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
