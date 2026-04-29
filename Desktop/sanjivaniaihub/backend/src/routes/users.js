const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  let query = supabase
    .from('users')
    .select('id,name,email,role,status,created_at', { count: 'exact' })
    .range(from, to);

  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data: users, count, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json({ users, total: count, page: Number(page), pages: Math.ceil(count / Number(limit)) });
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, email, password = 'pass123', role = 'student' } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hash, role, status: 'active' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('users').update({ status: req.body.status }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.patch('/:id/role', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('users').update({ role: req.body.role }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
