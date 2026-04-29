import { supabase } from './supabase';
import { getClientIp } from './getClientIp';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || localStorage.getItem('token') || '';
}

async function authHeaders() {
  const token = await getToken();
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function backendRequest(path, options = {}) {
  const res  = await fetch(`${BACKEND}/api${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // ─── Security Logs ───────────────────────────────────────────────────────
  getLogs: async (params = '') =>
    backendRequest(`/logs?${params}`, { headers: await authHeaders() }),

  deleteSelectedLogs: async (ids) =>
    backendRequest('/logs', { method: 'DELETE', headers: await authHeaders(), body: JSON.stringify({ ids }) }),

  deleteAllLogs: async () =>
    backendRequest('/logs/all', { method: 'DELETE', headers: await authHeaders() }),

  logPageVisit: async (path) => {
    if (path.startsWith('/admin/logs')) return;
    const [{ data: { session } }, client_ip] = await Promise.all([
      supabase.auth.getSession().catch(() => ({ data: { session: null } })),
      getClientIp(),
    ]);
    const token = session?.access_token || localStorage.getItem('token') || '';
    return fetch(`${BACKEND}/api/log`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body:    JSON.stringify({ event_type: 'PAGE_VISIT', path, client_ip }),
    }).catch(() => {});
  },

  logAuthEvent: async (event_type, email, path = '/login') => {
    const [{ data: { session } }, client_ip] = await Promise.all([
      supabase.auth.getSession().catch(() => ({ data: { session: null } })),
      getClientIp(),
    ]);
    const token = session?.access_token || '';
    return fetch(`${BACKEND}/api/log`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body:    JSON.stringify({ event_type, path, hint_email: email, client_ip }),
    }).catch(() => {});
  },

  // ─── Stats ───────────────────────────────────────────────────────────────
  getStats: async () => backendRequest('/stats', { headers: await authHeaders() }),

  // ─── Users (admin, via backend) ──────────────────────────────────────────
  getUsers: async (params = '') =>
    backendRequest(`/users?${params}`, { headers: await authHeaders() }),
  addUser: async (data) =>
    backendRequest('/users', { method: 'POST', headers: await authHeaders(), body: JSON.stringify(data) }),
  updateUserStatus: async (id, status) =>
    backendRequest(`/users/${id}/status`, { method: 'PATCH', headers: await authHeaders(), body: JSON.stringify({ status }) }),
  updateUserRole: async (id, role) =>
    backendRequest(`/users/${id}/role`, { method: 'PATCH', headers: await authHeaders(), body: JSON.stringify({ role }) }),
  deleteUser: async (id) =>
    backendRequest(`/users/${id}`, { method: 'DELETE', headers: await authHeaders() }),

  // ─── Applications (Supabase direct) ──────────────────────────────────────
  getApplications: async () => {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  submitApplication: async (form) => {
    const { data, error } = await supabase.from('applications').insert([{ ...form, status: 'pending' }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateApplicationStatus: async (id, status) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  deleteApplication: async (id) => {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // ─── Blogs (Supabase direct) ──────────────────────────────────────────────
  getBlogs: async () => {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  createBlog: async (blog) => {
    const { data, error } = await supabase.from('blogs').insert([blog]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateBlog: async (id, blog) => {
    const { error } = await supabase.from('blogs').update(blog).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  deleteBlog: async (id) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // ─── Projects (Supabase direct) ───────────────────────────────────────────
  getProjects: async (params = '') => {
    const p = new URLSearchParams(params);
    let q = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (p.get('search')) q = q.or(`title.ilike.%${p.get('search')}%,description.ilike.%${p.get('search')}%`);
    if (p.get('tag'))    q = q.ilike('tags', `%${p.get('tag')}%`);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data;
  },
  createProject: async (project) => {
    const { data, error } = await supabase.from('projects').insert([project]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateProject: async (id, project) => {
    const { error } = await supabase.from('projects').update(project).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // ─── Events (Supabase direct) ─────────────────────────────────────────────
  getEvents: async () => {
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },
  createEvent: async (event) => {
    const { data, error } = await supabase.from('events').insert([event]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateEvent: async (id, event) => {
    const { error } = await supabase.from('events').update(event).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  deleteEvent: async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // ─── Resources (Supabase direct) ──────────────────────────────────────────
  getResources: async () => {
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  createResource: async (resource) => {
    const { data, error } = await supabase.from('resources').insert([resource]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateResource: async (id, resource) => {
    const { error } = await supabase.from('resources').update(resource).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  deleteResource: async (id) => {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};
