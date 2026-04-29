import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const empty = { title: '', description: '', tags: '', image_url: '', status: 'active' };

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getProjects().then(setProjects).catch(() => {}); }, []);

  function openEdit(p) {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description || '', tags: p.tags || '', image_url: p.image_url || '', status: p.status || 'active' });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateProject(editing, form);
        setProjects(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
        setMsg('Project updated!');
      } else {
        const res = await api.createProject(form);
        setProjects(prev => [{ id: res.id, ...form, created_at: new Date().toISOString() }, ...prev]);
        setMsg('Project created!');
      }
      setShowForm(false); setEditing(null); setForm(empty);
    } catch (err) { setMsg(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    await api.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return (
    <AdminLayout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Project Management</h2>
          <p className="text-on-surface-variant">Create, edit, and manage AI research projects.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="px-5 py-2.5 bg-primary text-white font-medium rounded-[10px] hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>New Project
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-on-surface">{editing ? 'Edit Project' : 'New Project'}</h3>
            {[['title', 'Title *'], ['description', 'Description'], ['tags', 'Tags (comma-separated)'], ['image_url', 'Image URL']].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
                <input required={key === 'title'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1 bg-transparent">
                <option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold text-sm">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 border border-slate-200 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex flex-wrap gap-1 mb-2">
                {p.tags?.split(',').map(t => <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{t.trim()}</span>)}
              </div>
              <h4 className="text-base font-bold text-on-surface mb-2 leading-snug">{p.title}</h4>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{p.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{p.status}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-all">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No projects yet. Create one!</p>}
      </div>
    </AdminLayout>
  );
}
