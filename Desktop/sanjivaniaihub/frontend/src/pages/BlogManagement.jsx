import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const empty = { title: '', excerpt: '', content: '', category: 'Tutorial', author: '', image_url: '' };

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getBlogs().then(setBlogs).catch(() => {}); }, []);

  function openEdit(blog) {
    setEditing(blog.id);
    setForm({ title: blog.title, excerpt: blog.excerpt || '', content: blog.content || '', category: blog.category || 'Tutorial', author: blog.author || '', image_url: blog.image_url || '' });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateBlog(editing, form);
        setBlogs(prev => prev.map(b => b.id === editing ? { ...b, ...form } : b));
        setMsg('Blog updated!');
      } else {
        const res = await api.createBlog(form);
        setBlogs(prev => [{ id: res.id, ...form, created_at: new Date().toISOString() }, ...prev]);
        setMsg('Blog created!');
      }
      setShowForm(false);
      setEditing(null);
      setForm(empty);
    } catch (err) { setMsg(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this blog?')) return;
    await api.deleteBlog(id);
    setBlogs(prev => prev.filter(b => b.id !== id));
  }

  return (
    <AdminLayout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Blog Management</h2>
          <p className="text-on-surface-variant">Create, edit, and manage AI insights and tutorials.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="px-5 py-2.5 bg-primary text-white font-medium rounded-[10px] hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>New Blog
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-on-surface">{editing ? 'Edit Blog' : 'New Blog'}</h3>
            {[['title', 'Title *'], ['excerpt', 'Excerpt'], ['author', 'Author'], ['image_url', 'Image URL']].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
                <input required={key === 'title'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1 bg-transparent">
                <option>Tutorial</option><option>Case Study</option><option>Featured</option><option>Research</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Content</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-primary outline-none text-sm mt-1 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold text-sm">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 border border-slate-200 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white rounded-xl overflow-hidden ambient-shadow flex flex-col">
            {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-full h-40 object-cover" />}
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{blog.category}</span>
              <h4 className="text-base font-bold text-on-surface mb-2 leading-snug">{blog.title}</h4>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{blog.excerpt}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-slate-400">{blog.author}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(blog)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-all">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No blogs yet. Create one!</p>}
      </div>
    </AdminLayout>
  );
}
