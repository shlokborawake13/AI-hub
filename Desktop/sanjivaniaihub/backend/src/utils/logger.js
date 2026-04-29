const supabase = require('../db/supabase');

async function logEvent({ user, event_type, path, method, req, client_ip }) {
  // Prefer client_ip sent from frontend (real public IP).
  // Fall back to x-forwarded-for (set by proxies/load balancers in production),
  // then socket address (always ::1 / 127.0.0.1 in local dev).
  const ip =
    client_ip ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown';

  // Normalise IPv6 loopback to readable form
  const ip_address = ip === '::1' ? '127.0.0.1 (local)' : ip;

  try {
    await supabase.from('unauthorized_access_log').insert([{
      user_id:    user?.id    || null,
      email:      user?.email || 'guest',
      name:       user?.name  || null,
      role:       user?.role  || 'guest',
      event_type,
      path,
      method:     method?.toUpperCase() || 'GET',
      ip_address,
      user_agent: req.headers['user-agent'] || null,
      created_at: new Date().toISOString(),
    }]);
  } catch (err) {
    console.error('[logEvent] Failed to write log:', err.message);
  }
}

module.exports = { logEvent };
