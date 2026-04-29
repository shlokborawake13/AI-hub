require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const supabase = require('./db/supabase');
const { logEvent } = require('./utils/logger');
const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/blogs',        require('./routes/blogs'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/events',       require('./routes/events'));
app.use('/api/resources',    require('./routes/resources'));

// ── Page-visit + auth event tracking ────────────────────────────────────
app.post('/api/log', async (req, res) => {
  const { event_type = 'PAGE_VISIT', path: visitPath, hint_email, client_ip } = req.body;

  // Resolve user from Supabase JWT — works for logged-in users
  let user = null;
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const { data: { user: authUser }, error } = await supabase.auth.getUser(auth.slice(7));
      if (!error && authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('auth_id', authUser.id)
          .single();
        user = profile || { email: authUser.email, role: 'student' };
      }
    }
  } catch (_) {}

  // For LOGIN_FAILED there is no token — use the email hint from the request body
  if (!user && hint_email) {
    try {
      const { data: profile } = await supabase
        .from('users').select('id, name, email, role').eq('email', hint_email).single();
      user = profile || { email: hint_email, role: 'guest' };
    } catch (_) {
      user = { email: hint_email, role: 'guest' };
    }
  }

  await logEvent({ user, event_type, path: visitPath || '/login', method: 'POST', req, client_ip });
  res.json({ ok: true });
});

// ── Security logs (admin only) — requireAdmin skips logEvent for this route ──
app.get('/api/logs', requireAuth, requireAdmin, async (req, res) => {
  const { event_type, search, from, to, limit = 500 } = req.query;

  let q = supabase
    .from('unauthorized_access_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Number(limit));

  if (event_type) q = q.eq('event_type', event_type);
  if (search)     q = q.or(`email.ilike.%${search}%,ip_address.ilike.%${search}%,name.ilike.%${search}%`);
  if (from)       q = q.gte('created_at', from);
  if (to)         q = q.lte('created_at', to);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete selected logs by IDs
app.delete('/api/logs', requireAuth, requireAdmin, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: 'ids array required' });
  const { error } = await supabase
    .from('unauthorized_access_log')
    .delete()
    .in('id', ids);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ deleted: ids.length });
});

// Delete ALL logs
app.delete('/api/logs/all', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('unauthorized_access_log')
    .delete()
    .gte('id', 0);          // matches every row
  if (error) return res.status(500).json({ error: error.message });
  res.json({ deleted: 'all' });
});

// ── Stats ────────────────────────────────────────────────────────────────────
app.get('/api/stats', requireAuth, requireAdmin, async (req, res) => {
  const [users, projects, blogs, apps] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  res.json({
    users:               users.count    || 0,
    projects:            projects.count || 0,
    blogs:               blogs.count    || 0,
    pendingApplications: apps.count     || 0,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sanjivani backend running on http://localhost:${PORT}`));
