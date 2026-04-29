const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, email, course, skills, motivation } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const { data, error } = await supabase
    .from('applications')
    .insert([{ name, email, course: course || '', skills: skills || '', motivation: motivation || '', status: 'pending' }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ id: data.id, message: 'Application submitted successfully' });
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('applications').update({ status: req.body.status }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('applications').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
