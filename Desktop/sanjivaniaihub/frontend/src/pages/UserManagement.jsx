import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

export default function UserManagement() {
  const [data, setData] = useState({ users: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'student' });
  const [msg, setMsg] = useState('');

  function load(page = 1) {
    api.getUsers(`search=${search}&page=${page}&limit=10`).then(setData).catch(() => {});
  }

  useEffect(() => { load(); }, [search]);

  async function handleStatus(id, status) {
    await api.updateUserStatus(id, status);
    load(data.page);
  }

  async function handleRole(id, role) {
    await api.updateUserRole(id, role);
    load(data.page);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return;
    await api.deleteUser(id);
    load(data.page);
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.addUser(form);
      setMsg('User added!');
      setShowAdd(false);
      setForm({ name: '', email: '', role: 'student' });
      load();
    } catch (err) { setMsg(err.message); }
  }

  return (
    <AdminLayout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Users</h2>
          <p className="text-on-surface-variant">Manage platform access, roles, and administrative permissions.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-primary text-white font-medium rounded-[10px] hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">person_add</span>Add User
          </button>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <form onSubmit={handleAdd} className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-on-surface">Add New User</h3>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm" />
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm" />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm bg-transparent">
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold text-sm">Add User</button>
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-900/10" placeholder="Search users..." />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,35,111,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              <th className="px-8 py-5">Name</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm">{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div>
                      <p className="font-semibold text-on-surface">{u.name}</p>
                      <p className="text-sm text-on-surface-variant">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <select value={u.role} onChange={e => handleRole(u.id, e.target.value)} className="text-xs border border-slate-200 rounded-full px-3 py-1 focus:outline-none focus:border-primary bg-transparent font-bold capitalize">
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-2 text-sm font-medium ${u.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="capitalize">{u.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-on-surface-variant text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleStatus(u.id, u.status === 'active' ? 'disabled' : 'active')} className={`p-2 rounded-lg transition-all ${u.status === 'active' ? 'text-slate-400 hover:text-error hover:bg-red-50' : 'text-primary hover:bg-primary/5'}`} title={u.status === 'active' ? 'Disable' : 'Enable'}>
                      <span className="material-symbols-outlined">{u.status === 'active' ? 'block' : 'check_circle'}</span>
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-8 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
          <p className="text-sm text-on-surface-variant">Showing <span className="font-semibold text-on-surface">{data.users.length}</span> of <span className="font-semibold text-on-surface">{data.total}</span> users</p>
          <div className="flex items-center gap-1">
            <button disabled={data.page <= 1} onClick={() => load(data.page - 1)} className="p-2 text-slate-400 hover:text-on-surface disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: data.pages }, (_, i) => (
              <button key={i + 1} onClick={() => load(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${data.page === i + 1 ? 'bg-primary text-white font-bold' : 'hover:bg-slate-100'}`}>{i + 1}</button>
            ))}
            <button disabled={data.page >= data.pages} onClick={() => load(data.page + 1)} className="p-2 text-slate-400 hover:text-on-surface disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
