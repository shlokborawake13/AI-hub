import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);
const SITE_URL = window.location.origin;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hardTimeout = setTimeout(() => setLoading(false), 3000);

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(hardTimeout);
        if (session?.user) await fetchAndSetUser(session.user);
        setLoading(false);
      })
      .catch(() => { clearTimeout(hardTimeout); setLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { setUser(null); clearSaved(); }
      if (event === 'TOKEN_REFRESHED' && session?.user) fetchAndSetUser(session.user);
    });

    return () => { clearTimeout(hardTimeout); subscription.unsubscribe(); };
  }, []);

  function saveUser(u)  { localStorage.setItem('sanjivani_user', JSON.stringify(u)); }
  function clearSaved() { localStorage.removeItem('sanjivani_user'); }

  async function fetchAndSetUser(authUser) {
    let profile = null;
    try {
      const { data } = await supabase
        .from('users')
        .select('id, auth_id, name, email, role, status, prn, department, year, division, phone, github, avatar_url')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      profile = data;
    } catch { /* ignore */ }

    if (!profile) {
      try {
        const { data } = await supabase
          .from('users')
          .upsert({
            auth_id: authUser.id,
            name:    authUser.user_metadata?.name || authUser.email.split('@')[0],
            email:   authUser.email,
            role:    authUser.user_metadata?.role || 'student',
            status:  'active',
          }, { onConflict: 'auth_id' })
          .select('id, auth_id, name, email, role, status, prn, department, year, division, phone, github, avatar_url')
          .single();
        profile = data;
      } catch { /* ignore */ }
    }

    const u = profile || {
      id:      authUser.id,
      auth_id: authUser.id,
      name:    authUser.user_metadata?.name || authUser.email.split('@')[0],
      email:   authUser.email,
      role:    authUser.user_metadata?.role || 'student',
    };

    setUser(u);
    saveUser(u);
    return u;
  }

  // ── Login — checks disabled status before allowing in ─────────────────────
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Fire-and-forget: log failed attempt with email hint (no token yet)
      api.logAuthEvent('LOGIN_FAILED', email);
      if (error.message.toLowerCase().includes('email not confirmed'))
        throw new Error('EMAIL_NOT_CONFIRMED');
      if (error.message.toLowerCase().includes('invalid login credentials'))
        throw new Error('Invalid email or password.');
      throw new Error(error.message);
    }

    // Check account status from DB before allowing access
    const { data: profile } = await supabase
      .from('users')
      .select('status')
      .eq('auth_id', data.user.id)
      .maybeSingle();

    if (profile?.status === 'disabled') {
      await supabase.auth.signOut();
      api.logAuthEvent('LOGIN_FAILED', email);
      throw new Error('ACCOUNT_DISABLED');
    }

    const u = await fetchAndSetUser(data.user);
    // Session is now active — token resolves server-side to get full profile
    api.logAuthEvent('LOGIN_SUCCESS', email);
    return u;
  }

  // ── Register ──────────────────────────────────────────────────────────────
  async function register(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'student' },
        emailRedirectTo: `${SITE_URL}/login`,
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed. Please try again.');

    if (!data.user.identities || data.user.identities.length === 0)
      throw new Error('DUPLICATE_EMAIL');

    try {
      await supabase.from('users').upsert({
        auth_id: data.user.id,
        name, email,
        role: 'student', status: 'active',
      }, { onConflict: 'auth_id', ignoreDuplicates: true });
    } catch { /* trigger handles it */ }

    if (data.session) {
      const u = await fetchAndSetUser(data.user);
      return { user: u, emailConfirmationRequired: false };
    }
    return { emailConfirmationRequired: true, email };
  }

  async function forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }

  async function resetPassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  }

  async function resendVerification(email) {
    const { error } = await supabase.auth.resend({
      type: 'signup', email,
      options: { emailRedirectTo: `${SITE_URL}/login` },
    });
    if (error) throw new Error(error.message);
  }

  async function updateProfile(updates) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { data: current } = await supabase
      .from('users').select('name, phone, prn, department')
      .eq('auth_id', authUser.id).single();

    const safe = { ...updates };
    if (current?.name)       delete safe.name;
    if (current?.phone)      delete safe.phone;
    if (current?.prn)        delete safe.prn;
    if (current?.department) delete safe.department;

    const { data, error } = await supabase
      .from('users').update(safe).eq('auth_id', authUser.id)
      .select('id, auth_id, name, email, role, status, prn, department, year, division, phone, github, avatar_url')
      .single();

    if (error) throw new Error(error.message);
    setUser(data); saveUser(data);
    return data;
  }

  async function logout() {
    clearSaved(); setUser(null);
    await supabase.auth.signOut().catch(() => {});
  }

  async function getToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch { return null; }
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      forgotPassword, resetPassword, resendVerification,
      updateProfile, getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
