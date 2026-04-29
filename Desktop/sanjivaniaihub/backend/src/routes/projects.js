const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', tag = '' } = req.query;
  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (tag) query = query.ilike('tags', `%${tag}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, tags, image_url } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, description: description || '', tags: tags || '', image_url: image_url || '', status: 'active' }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ id: data.id });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, tags, image_url, status } = req.body;
  const { error } = await supabase.from('projects').update({ title, description, tags, image_url, status }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
