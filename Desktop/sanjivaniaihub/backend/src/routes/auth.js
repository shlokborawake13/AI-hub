const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const supabase = require('../db/supabase');
const { logEvent } = require('../utils/logger');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'sanjivani_secret_2024';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user || !bcrypt.compareSync(password, user.password)) {
    await logEvent({
      user:       { email: email || 'unknown' },
      event_type: 'LOGIN_FAILED',
      path:       '/api/auth/login',
      method:     'POST',
      req,
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status === 'disabled') {
    await logEvent({
      user:       { id: user.id, email: user.email, role: user.role },
      event_type: 'LOGIN_FAILED',
      path:       '/api/auth/login',
      method:     'POST',
      req,
    });
    return res.status(403).json({ error: 'Account disabled' });
  }

  await logEvent({
    user:       { id: user.id, email: user.email, role: user.role },
    event_type: 'LOGIN_SUCCESS',
    path:       '/api/auth/login',
    method:     'POST',
    req,
  });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = bcrypt.hashSync(password, 10);
  const { data: user, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hash, role: 'student', status: 'active' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const token = jwt.sign({ id: user.id, role: 'student', name }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name, email, role: 'student' } });
});

module.exports = router;
