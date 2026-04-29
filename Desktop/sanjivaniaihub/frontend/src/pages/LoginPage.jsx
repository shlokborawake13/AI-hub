import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword }    = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-600 text-2xl">mark_email_unread</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-sm text-gray-500 mb-1">We sent a password reset link to:</p>
            <p className="text-sm font-semibold text-blue-600 mb-5">{email}</p>
            <p className="text-xs text-gray-400 mb-6">Click the link in the email to reset your password. Check spam if you don't see it.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Reset password</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">Enter your email and we'll send you a link to reset your password.</p>
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">mail</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@sanjivani.ai" autoComplete="email"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending…</> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function ResendButton({ email, resendFn }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function handle() {
    setBusy(true);
    try { await resendFn(email); setSent(true); } catch { /* ignore */ } finally { setBusy(false); }
  }
  return (
    <button type="button" onClick={handle} disabled={busy || sent}
      className="mt-2 text-xs font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-900 disabled:opacity-50 transition-colors">
      {sent ? '✓ Verification email sent!' : busy ? 'Sending…' : 'Resend verification email'}
    </button>
  );
}

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showForgot, setShowForgot]       = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(from || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      if (err.message === 'EMAIL_NOT_CONFIRMED') {
        setUnverifiedEmail(email);
        setError('EMAIL_NOT_CONFIRMED');
      } else if (err.message === 'ACCOUNT_DISABLED') {
        setError('ACCOUNT_DISABLED');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOcHc-vRxRxjYxZnF2J4-U3XjPnU9nhQasnUEHXxoNtZcnPKLJWq2XlpjzBK496eIgPdJYGpE5FP-RWqzhubfyVsLYVfgpJnEregByu6GLZfb7pMpAvnzw1WN_dSGJ5nodnHXV2Bhp_OEizTnnFtWmExAP55DrV6W7scCmBofu-avjQ_L4T_Q_s63uExxO-Hy5NdwwA35wjg0a3tFyONevg2Pgx2Dud-SM_PC_1Jyfqh4V8Ls_8BkkyYiZeAWyTn50epXsVeeXVdw"
            alt="" className="w-full h-full object-cover opacity-50 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-900/75" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">clinical_notes</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Sanjivani AI Hub</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-snug">
            Precision in<br />Intelligence.<br />
            <span className="text-amber-400">Welcome back.</span>
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-sm">
            Access your research dashboard, manage projects, and collaborate with the brightest minds in clinical AI.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: 'biotech',  label: '142 Active Projects' },
              { icon: 'group',    label: '14k+ Researchers'    },
              { icon: 'memory',   label: '2.5 PFLOPS GPU'      },
              { icon: 'verified', label: 'Ethics Certified'    },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 bg-white/10 rounded-lg px-3 py-2.5 border border-white/10">
                <span className="material-symbols-outlined text-amber-400 text-[18px]">{item.icon}</span>
                <span className="text-white/90 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-200/40 text-xs">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white">clinical_notes</span>
            </div>
            <span className="text-blue-900 font-bold text-xl tracking-tight">Sanjivani AI Hub</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline underline-offset-4">
                Create one free
              </Link>
            </p>
          </div>

          {/* Error banners */}
          {error === 'EMAIL_NOT_CONFIRMED' ? (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-base flex-shrink-0 mt-0.5">mark_email_unread</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">Email not verified</p>
                  <p className="text-xs text-amber-700 mt-0.5">Please verify <strong>{unverifiedEmail}</strong> before signing in.</p>
                  <ResendButton email={unverifiedEmail} resendFn={resendVerification} />
                </div>
              </div>
            </div>
          ) : error === 'ACCOUNT_DISABLED' ? (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-base flex-shrink-0 mt-0.5">block</span>
                <div>
                  <p className="text-sm font-semibold text-red-800">Account disabled</p>
                  <p className="text-xs text-red-600 mt-0.5">Your account has been disabled by an administrator. Please contact support if you believe this is a mistake.</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="mb-6 flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">mail</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@sanjivani.ai" autoComplete="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-blue-600 hover:underline underline-offset-4 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">lock</span>
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div onClick={() => setRemember(v => !v)}
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${remember ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                {remember && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
              </div>
              <span className="text-sm text-gray-600">Remember me for 7 days</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm mt-1">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : (
                <>Sign In <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2024 Sanjivani AI Hub · Precision in Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
