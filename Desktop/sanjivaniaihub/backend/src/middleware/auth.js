require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { logEvent } = require('../utils/logger');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── requireAuth ───────────────────────────────────────────────────────────────
async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  const token = auth.slice(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
    }
    req.authUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized — token verification failed' });
  }
}

// ── requireAdmin ──────────────────────────────────────────────────────────────
async function requireAdmin(req, res, next) {
  if (!req.authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('id, role, name, email')
      .eq('auth_id', req.authUser.id)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Could not verify user role' });
    }

    if (!profile || profile.role !== 'admin') {
      await logEvent({
        user:       { id: req.authUser.id, email: req.authUser.email, role: profile?.role || 'unknown' },
        event_type: 'UNAUTHORIZED_ADMIN_ATTEMPT',
        path:       req.originalUrl,
        method:     req.method,
        req,
      });
      return res.status(403).json({ error: 'Forbidden — admin access required', code: 'NOT_ADMIN' });
    }

    req.user = { id: profile.id, email: profile.email, role: profile.role, name: profile.name };

    // Skip logging for the logs endpoint itself to avoid self-referential noise
    if (!req.originalUrl.startsWith('/api/logs')) {
      await logEvent({
        user:       req.user,
        event_type: 'ADMIN_ACCESS_GRANTED',
        path:       req.originalUrl,
        method:     req.method,
        req,
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error during authorization' });
  }
}

module.exports = { requireAuth, requireAdmin, supabase };
