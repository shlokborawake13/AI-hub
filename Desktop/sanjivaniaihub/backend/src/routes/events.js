const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, type, location, event_date, event_time, image_url } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { data, error } = await supabase
    .from('events')
    .insert([{ title, description: description || '', type: type || 'Workshop', location: location || '', event_date: event_date || null, event_time: event_time || '', image_url: image_url || '' }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ id: data.id });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, type, location, event_date, event_time, image_url } = req.body;
  const { error } = await supabase.from('events').update({ title, description, type, location, event_date, event_time, image_url }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('events').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
