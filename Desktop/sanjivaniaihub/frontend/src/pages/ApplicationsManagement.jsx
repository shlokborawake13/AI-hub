import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const statusColors = { pending: 'bg-amber-100 text-amber-700', reviewing: 'bg-amber-100 text-amber-700', received: 'bg-blue-100 text-blue-700', processed: 'bg-emerald-100 text-emerald-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' };

export default function ApplicationsManagement() {
  const [apps, setApps] = useState([]);

  useEffect(() => { api.getApplications().then(setApps).catch(() => {}); }, []);

  async function handleStatus(id, status) {
    await api.updateApplicationStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    await api.deleteApplication(id);
    setApps(prev => prev.filter(a => a.id !== id));
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Applications</h2>
        <p className="text-on-surface-variant">Review and manage hub membership applications.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {['pending', 'reviewing', 'approved'].map(s => (
          <div key={s} className="bg-white p-4 rounded-xl ambient-shadow">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 capitalize">{s}</p>
            <p className="text-2xl font-bold text-on-surface">{apps.filter(a => a.status === s).length}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[12px] ambient-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <th className="px-8 py-5">Applicant</th>
              <th className="px-6 py-5">Course</th>
              <th className="px-6 py-5">Skills</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {apps.map(app => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4">
                  <p className="font-semibold text-blue-900">{app.name}</p>
                  <p className="text-xs text-slate-400">{app.email}</p>
                </td>
                <td className="px-6 py-4 text-on-surface-variant italic">{app.course || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {app.skills?.split(',').slice(0, 3).map(s => <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{s.trim()}</span>)}
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{new Date(app.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <select value={app.status} onChange={e => handleStatus(app.id, e.target.value)} className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 focus:outline-none capitalize ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="received">Received</option>
                    <option value="processed">Processed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleStatus(app.id, 'approved')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Approve">
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                    <button onClick={() => handleStatus(app.id, 'rejected')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Reject">
                      <span className="material-symbols-outlined">cancel</span>
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400">No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
