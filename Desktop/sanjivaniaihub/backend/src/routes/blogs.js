const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, excerpt, content, category, author, image_url } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { data, error } = await supabase
    .from('blogs')
    .insert([{ title, excerpt: excerpt || '', content: content || '', category: category || 'Tutorial', author: author || '', image_url: image_url || '' }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ id: data.id });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, excerpt, content, category, author, image_url } = req.body;
  const { error } = await supabase.from('blogs').update({ title, excerpt, content, category, author, image_url }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabase.from('blogs').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
