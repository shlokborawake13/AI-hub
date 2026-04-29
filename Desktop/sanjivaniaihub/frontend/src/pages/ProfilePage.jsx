import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import PublicNav from '../components/PublicNav';

const DEPARTMENTS = [
  'Computer Engineering', 'Information Technology', 'Electronics & Telecommunication',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'AIDS', 'AIML', 'Data Science', 'Other',
];
const YEARS     = ['First Year', 'Second Year', 'Third Year', 'Final Year'];
const DIVISIONS = ['A', 'B', 'C', 'D', 'E'];
const LOCKED    = ['name', 'phone', 'prn', 'department'];

// Parse Supabase duplicate-key errors into friendly messages
function parseSaveError(msg) {
  if (!msg) return 'Failed to save profile. Please try again.';
  const m = msg.toLowerCase();
  if (m.includes('users_prn_key') || (m.includes('unique') && m.includes('prn')))
    return 'This PRN is already registered to another account. Please check and try again.';
  if (m.includes('users_phone_key') || (m.includes('unique') && m.includes('phone')))
    return 'This phone number is already registered to another account.';
  if (m.includes('users_email_key') || (m.includes('unique') && m.includes('email')))
    return 'This email is already registered to another account.';
  if (m.includes('duplicate') || m.includes('unique'))
    return 'One of the values you entered is already registered to another account.';
  return msg;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({
    name: '', phone: '', prn: '', department: '',
    year: '', division: '', github: '', avatar_url: '',
  });
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]             = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({
      name:       user.name       || '',
      phone:      user.phone      || '',
      prn:        user.prn        || '',
      department: user.department || '',
      year:       user.year       || '',
      division:   user.division   || '',
      github:     user.github     || '',
      avatar_url: user.avatar_url || '',
    });
    setAvatarPreview(user.avatar_url || '');
  }, [user]);

  function isLocked(field) {
    return LOCKED.includes(field) && !!user?.[field];
  }

  function handleChange(field, value) {
    if (isLocked(field)) return;
    if (field === 'prn') value = value.toUpperCase();
    setForm(f => ({ ...f, [field]: value }));
    setMsg({ type: '', text: '' });
  }

  // Upload avatar → skip storage (RLS issues) → save base64 directly to DB
  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Image must be under 2MB.' });
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      // Read file as base64
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = ev => res(ev.target.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      // Show preview immediately
      setAvatarPreview(base64);

      // Try Supabase Storage first
      const ext  = file.name.split('.').pop().toLowerCase();
      const path = `${user.id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      let finalUrl = base64; // fallback to base64

      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars').getPublicUrl(path);
        finalUrl = `${publicUrl}?t=${Date.now()}`;
      }
      // If storage fails (RLS/bucket missing), we use base64 — no error shown

      // Save to DB immediately
      await updateProfile({ avatar_url: finalUrl });
      setForm(f => ({ ...f, avatar_url: finalUrl }));
      setAvatarPreview(finalUrl);
      setMsg({ type: 'success', text: 'Profile picture updated!' });

    } catch (err) {
      setMsg({ type: 'error', text: `Upload failed: ${err.message}` });
      setAvatarPreview(user?.avatar_url || '');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    // Client-side validation for PRN format
    if (form.prn && form.prn.length < 5) {
      setMsg({ type: 'error', text: 'PRN must be at least 5 characters.' });
      return;
    }
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
      setMsg({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile(form);
      setMsg({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: parseSaveError(err.message) });
    } finally {
      setSaving(false);
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PublicNav />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information.{' '}
            <span className="text-amber-600 font-medium">
              Fields marked with 🔒 cannot be changed once saved.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Avatar ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Profile Picture</h2>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow">
                    {initials}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <button type="button" disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50">
                  {uploading ? 'Uploading…' : avatarPreview ? 'Change photo' : 'Upload photo'}
                </button>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · Max 2MB · Saves immediately</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>
          </div>

          {/* ── Locked identity fields ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Identity</h2>
            <p className="text-xs text-amber-600 mb-4">🔒 These fields cannot be changed once saved</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Full Name" locked={isLocked('name')}>
                <input type="text" value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Dr. Jane Doe" disabled={isLocked('name')}
                  className={inputCls(isLocked('name'))} />
              </Field>

              <Field label="PRN" locked={isLocked('prn')}>
                <input type="text" value={form.prn}
                  onChange={e => handleChange('prn', e.target.value)}
                  placeholder="22110XXXXX" disabled={isLocked('prn')}
                  className={inputCls(isLocked('prn'))}
                  style={{ textTransform: 'uppercase' }} />
              </Field>

              <Field label="Phone Number" locked={isLocked('phone')}>
                <input type="tel" value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210" disabled={isLocked('phone')}
                  className={inputCls(isLocked('phone'))} />
              </Field>

              <Field label="Department" locked={isLocked('department')}>
                {isLocked('department') ? (
                  <input type="text" value={form.department} disabled className={inputCls(true)} />
                ) : (
                  <select value={form.department}
                    onChange={e => handleChange('department', e.target.value)}
                    className={inputCls(false)}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              </Field>

            </div>
          </div>

          {/* ── Academic details ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Academic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Year">
                <select value={form.year} onChange={e => handleChange('year', e.target.value)}
                  className={inputCls(false)}>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>

              <Field label="Division">
                <select value={form.division} onChange={e => handleChange('division', e.target.value)}
                  className={inputCls(false)}>
                  <option value="">Select division</option>
                  {DIVISIONS.map(d => <option key={d} value={d}>Division {d}</option>)}
                </select>
              </Field>

            </div>
          </div>

          {/* ── Links ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Links</h2>
            <Field label="GitHub Profile URL">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono pointer-events-none">
                  github.com/
                </span>
                <input type="text"
                  value={form.github.replace('https://github.com/', '')}
                  onChange={e => handleChange('github', e.target.value
                    ? `https://github.com/${e.target.value.replace('https://github.com/', '')}`
                    : '')}
                  placeholder="your-username"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-[6.5rem] pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all" />
              </div>
            </Field>
          </div>

          {/* ── Status message ── */}
          {msg.text && (
            <div className={`flex items-start gap-3 p-3.5 rounded-lg text-sm border ${
              msg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">
                {msg.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{msg.text}</span>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">save</span>Save Profile</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Field({ label, locked, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
        {locked && <span className="text-amber-500 text-[10px] normal-case tracking-normal font-medium">🔒 locked</span>}
      </label>
      {children}
    </div>
  );
}

function inputCls(locked) {
  return `w-full border rounded-lg py-3 px-4 text-sm transition-all focus:outline-none ${
    locked
      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
  }`;
}
