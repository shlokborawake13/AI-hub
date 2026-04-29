import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [validSession, setValid]  = useState(false);
  const [checking, setChecking]   = useState(true);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Supabase puts the access_token in the URL hash after clicking the reset link
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValid(!!session);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await resetPassword(password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-500 text-2xl">link_off</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Link expired or invalid</h2>
          <p className="text-sm text-gray-500 mb-6">This password reset link has expired. Please request a new one.</p>
          <Link to="/login" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all text-center">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Password updated!</h2>
          <p className="text-sm text-gray-500 mb-2">Your password has been changed successfully.</p>
          <p className="text-xs text-gray-400">Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white text-xl">clinical_notes</span>
            </div>
            <span className="text-blue-900 font-bold text-lg tracking-tight">Sanjivani AI Hub</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Set new password</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Choose a strong password for your account.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">lock</span>
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">lock_reset</span>
                <input type={showPw ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password" autoComplete="new-password"
                  className={`w-full bg-gray-50 border rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    confirm && confirm !== password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                    : confirm && confirm === password ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10'
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/10'
                  }`} />
              </div>
              {confirm && confirm !== password && <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords don't match</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
              {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Updating…</> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
