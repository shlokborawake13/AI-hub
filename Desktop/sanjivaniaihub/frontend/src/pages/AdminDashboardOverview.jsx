import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ users: 0, projects: 0, blogs: 0, pendingApplications: 0 });
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getApplications().then(setApplications).catch(() => {});
    api.getEvents().then(setEvents).catch(() => {});
  }, []);

  async function handleAppStatus(id, status) {
    await api.updateApplicationStatus(id, status);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  const statusColors = { pending: 'bg-amber-100 text-amber-700', reviewing: 'bg-amber-100 text-amber-700', received: 'bg-blue-100 text-blue-700', processed: 'bg-emerald-100 text-emerald-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h2 className="text-[32px] font-semibold text-on-surface tracking-tight leading-tight">System Overview</h2>
        <p className="text-on-surface-variant mt-1 max-w-2xl">Real-time clinical intelligence and operational metrics for the Sanjivani AI ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <Link to="/admin/users" className="bg-white p-6 rounded-[12px] ambient-shadow group hover:bg-slate-50 transition-all block">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-900"><span className="material-symbols-outlined">person</span></div>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">+12%</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-on-surface">{stats.users.toLocaleString()}</h3>
        </Link>
        <Link to="/projects" className="bg-white p-6 rounded-[12px] ambient-shadow group hover:bg-slate-50 transition-all block">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><span className="material-symbols-outlined">biotech</span></div>
            <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Projects</p>
          <h3 className="text-2xl font-bold text-on-surface">{stats.projects}</h3>
        </Link>
        <Link to="/admin/blogs" className="bg-white p-6 rounded-[12px] ambient-shadow group hover:bg-slate-50 transition-all block">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-900"><span className="material-symbols-outlined">menu_book</span></div>
            <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded">Steady</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Blogs</p>
          <h3 className="text-2xl font-bold text-on-surface">{stats.blogs}</h3>
        </Link>
        <Link to="/admin/applications" className="bg-white p-6 rounded-[12px] ambient-shadow group hover:bg-slate-50 transition-all block border-b-2 border-amber-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><span className="material-symbols-outlined">pending_actions</span></div>
            <span className="text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded">Urgent</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Pending Applications</p>
          <h3 className="text-2xl font-bold text-on-surface">{stats.pendingApplications}</h3>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[12px] ambient-shadow p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-on-surface">Recent Applications</h3>
            <Link to="/admin/applications" className="text-blue-900 text-xs font-bold hover:underline">View All Applications</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="pb-4">Applicant</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {applications.slice(0, 5).map(app => (
                  <tr key={app.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-medium text-blue-900">{app.name}</td>
                    <td className="py-4 text-on-surface-variant italic">{app.course || '—'}</td>
                    <td className="py-4 text-on-surface-variant">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>{app.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <select value={app.status} onChange={e => handleAppStatus(app.id, e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 focus:outline-none focus:border-blue-900">
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="received">Received</option>
                        <option value="processed">Processed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[12px] ambient-shadow p-8">
            <h3 className="text-lg font-bold text-on-surface mb-6">Upcoming Events</h3>
            <div className="space-y-6">
              {events.slice(0, 3).map(ev => {
                const d = ev.event_date ? new Date(ev.event_date) : null;
                return (
                  <Link to="/events" key={ev.id} className="flex gap-4 group cursor-pointer">
                    <div className="flex-shrink-0 w-12 h-14 bg-slate-50 rounded-lg flex flex-col items-center justify-center border-t-2 border-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all">
                      <span className="text-xs font-bold">{d ? d.toLocaleString('default', { month: 'short' }).toUpperCase() : 'TBD'}</span>
                      <span className="text-lg font-black leading-none">{d ? d.getDate() : '--'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-blue-900 mb-1 group-hover:text-blue-700">{ev.title}</h4>
                      <p className="text-xs text-on-surface-variant">{ev.location} · {ev.event_time}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link to="/events">
              <button className="w-full mt-8 py-2 text-xs font-bold text-blue-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Calendar View</button>
            </Link>
          </div>
          <div className="editorial-gradient rounded-[12px] p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Resource Alert</h3>
              <p className="text-xs text-blue-100/80 leading-relaxed mb-4">Cloud computing resources are currently at 85% capacity. Consider optimizing background indexing tasks.</p>
              <Link to="/resources" className="inline-flex items-center text-xs font-bold text-tertiary-fixed-dim hover:text-white transition-colors">
                Manage Resources <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </Link>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/5 opacity-20 pointer-events-none">bolt</span>
          </div>
        </div>
      </div>

      <Link to="/admin/applications">
        <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full editorial-gradient text-white shadow-2xl flex items-center justify-center group z-50">
          <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
        </button>
      </Link>
    </AdminLayout>
  );
}
