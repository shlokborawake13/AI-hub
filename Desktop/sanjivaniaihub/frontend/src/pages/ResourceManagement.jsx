import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const empty = { title: '', description: '', type: 'Dataset', url: '' };

export default function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getResources().then(setResources).catch(() => {}); }, []);

  function openEdit(r) {
    setEditing(r.id);
    setForm({ title: r.title, description: r.description || '', type: r.type || 'Dataset', url: r.url || '' });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateResource(editing, form);
        setResources(prev => prev.map(r => r.id === editing ? { ...r, ...form } : r));
        setMsg('Resource updated!');
      } else {
        const res = await api.createResource(form);
        setResources(prev => [{ id: res.id, ...form, created_at: new Date().toISOString() }, ...prev]);
        setMsg('Resource created!');
      }
      setShowForm(false); setEditing(null); setForm(empty);
    } catch (err) { setMsg(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this resource?')) return;
    await api.deleteResource(id);
    setResources(prev => prev.filter(r => r.id !== id));
  }

  const typeIcon = { Dataset: 'database', Course: 'school', Tool: 'build', Roadmap: 'route' };

  return (
    <AdminLayout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Resource Management</h2>
          <p className="text-on-surface-variant">Create, edit, and manage learning resources and datasets.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="px-5 py-2.5 bg-primary text-white font-medium rounded-[10px] hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>New Resource
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-on-surface">{editing ? 'Edit Resource' : 'New Resource'}</h3>
            {[['title', 'Title *'], ['description', 'Description'], ['url', 'URL']].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
                <input required={key === 'title'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1 bg-transparent">
                <option>Dataset</option><option>Course</option><option>Tool</option><option>Roadmap</option>
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
        {resources.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">{typeIcon[r.type] || 'folder'}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-blue-50 px-2 py-1 rounded">{r.type}</span>
            </div>
            <h4 className="text-base font-bold text-on-surface mb-2 leading-snug">{r.title}</h4>
            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 flex-grow">{r.description}</p>
            {r.url && r.url !== '#' && <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mb-4 truncate">{r.url}</a>}
            <div className="flex justify-end gap-2">
              <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-all">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No resources yet. Create one!</p>}
      </div>
    </AdminLayout>
  );
}
