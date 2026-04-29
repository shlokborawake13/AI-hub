import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter',       ok: /[A-Z]/.test(password) },
    { label: 'Number',                 ok: /[0-9]/.test(password) },
    { label: 'Special character',      ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score  = checks.filter(c => c.ok).length;
  const bars   = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const texts  = ['text-red-500', 'text-orange-500', 'text-yellow-600', 'text-emerald-600'];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? bars[score-1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(c => (
            <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined text-[11px]">{c.ok ? 'check_circle' : 'radio_button_unchecked'}</span>
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-[10px] font-bold ${texts[score-1]}`}>{labels[score-1]}</span>}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState('');
  const [resent, setResent]   = useState(false);

  const { register, resendVerification } = useAuth();
  const navigate     = useNavigate();

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (field === 'email') setError(''); // clear duplicate error when email changes
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2)    return setError('Full name must be at least 2 characters.');
    if (form.password.length < 8)       return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (!agreed)                        return setError('Please accept the terms to continue.');
    setLoading(true);
    try {
      const result = await register(form.name.trim(), form.email, form.password);
      if (result?.emailConfirmationRequired) {
        setEmailSent(form.email);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    } catch (err) {
      if (err.message === 'DUPLICATE_EMAIL') {
        setError('DUPLICATE_EMAIL');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const pwMatch    = form.confirm.length > 0 && form.confirm === form.password;
  const pwMismatch = form.confirm.length > 0 && form.confirm !== form.password;

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-blue-600 text-3xl">mark_email_unread</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-1">We sent a verification link to:</p>
          <p className="text-sm font-semibold text-blue-600 mb-6">{emailSent}</p>
          <p className="text-xs text-gray-400 mb-6">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
          <div className="space-y-3">
            <button
              onClick={async () => { try { await resendVerification(emailSent); setResent(true); } catch {} }}
              disabled={resent}
              className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50">
              {resent ? '✓ Email resent!' : 'Resend verification email'}
            </button>
            <Link to="/login" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all text-center">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Account created!</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome to Sanjivani AI Hub. Redirecting you now…</p>
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-gray-100 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmEaFtg_NtbOGN5rqMqYr7FjmvQ0UkDfp-iEPX4JieQGS7oqz0ysyvU6vuyWDVoSkO8YjoRCAN1ODuqQoiG_YrnRWIpnVJ7TxSccKKz3hAWyHOw8cBw8VQ_iXruuAUpNTaq0AzkBW6C25lmHeMRgKB_0kuXM4Yt9feQGvIs4rWLHb3r04nSBFjrkYlVcY5krYzyUAKWBUcn3Owpo3Zza2ACWwA8uEDNfMBwRY7WYFf01MOQm7gGR0aF0ntdt8lDSdcPZaNDepIn5g"
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
            Join the frontier<br />of clinical AI.<br />
            <span className="text-amber-400">Start today.</span>
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-sm">
            Create your account and get instant access to research projects, GPU resources, events, and a global community of AI innovators.
          </p>
          <div className="space-y-3 pt-2">
            {[
              { icon: 'memory',        text: 'Access to NVIDIA A100 GPU clusters' },
              { icon: 'groups',        text: 'Mentorship from PhD researchers'    },
              { icon: 'rocket_launch', text: 'Work on real healthcare AI projects' },
              { icon: 'event',         text: 'Exclusive workshops & hackathons'   },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-amber-400 text-[16px]">{item.icon}</span>
                </div>
                <span className="text-blue-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-200/40 text-xs">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white">clinical_notes</span>
            </div>
            <span className="text-blue-900 font-bold text-xl tracking-tight">Sanjivani AI Hub</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create account</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline underline-offset-4">Sign in</Link>
            </p>
          </div>

          {/* Error */}
          {error === 'DUPLICATE_EMAIL' ? (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-base flex-shrink-0 mt-0.5">person_off</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Account already registered</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    <strong>{form.email}</strong> is already linked to an account. Try signing in instead.
                  </p>
                  <Link to="/login" state={{ email: form.email }}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 hover:underline underline-offset-4">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    Go to Sign In
                  </Link>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="mb-5 flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">person</span>
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Dr. Jane Doe" autoComplete="name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">mail</span>
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@university.edu" autoComplete="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">lock</span>
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min. 8 characters" autoComplete="new-password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">lock_reset</span>
                <input type={showCf ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" autoComplete="new-password"
                  className={`w-full bg-gray-50 border rounded-lg py-3 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    pwMismatch ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                    : pwMatch  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10'
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/10'
                  }`} />
                <button type="button" onClick={() => setShowCf(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showCf ? 'visibility_off' : 'visibility'}</span>
                </button>
                {(pwMatch || pwMismatch) && (
                  <span className={`absolute right-10 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] ${pwMatch ? 'text-emerald-500' : 'text-red-500'}`}>
                    {pwMatch ? 'check_circle' : 'cancel'}
                  </span>
                )}
              </div>
              {pwMismatch && <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords don't match</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
              <div onClick={() => setAgreed(v => !v)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white hover:border-blue-400'}`}>
                {agreed && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
              </div>
              <span className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <span className="text-blue-600 font-semibold hover:underline underline-offset-4 cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-blue-600 font-semibold hover:underline underline-offset-4 cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 shadow-sm mt-1">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account…</>
              ) : (
                <>Create Account <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By creating an account you join 400+ researchers worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
