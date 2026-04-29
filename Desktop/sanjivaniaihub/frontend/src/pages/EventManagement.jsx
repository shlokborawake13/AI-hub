import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const empty = { title: '', description: '', type: 'Workshop', location: '', event_date: '', event_time: '', image_url: '' };

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getEvents().then(setEvents).catch(() => {}); }, []);

  function openEdit(ev) {
    setEditing(ev.id);
    setForm({ title: ev.title, description: ev.description || '', type: ev.type || 'Workshop', location: ev.location || '', event_date: ev.event_date || '', event_time: ev.event_time || '', image_url: ev.image_url || '' });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateEvent(editing, form);
        setEvents(prev => prev.map(ev => ev.id === editing ? { ...ev, ...form } : ev));
        setMsg('Event updated!');
      } else {
        const res = await api.createEvent(form);
        setEvents(prev => [...prev, { id: res.id, ...form }].sort((a, b) => new Date(a.event_date) - new Date(b.event_date)));
        setMsg('Event created!');
      }
      setShowForm(false); setEditing(null); setForm(empty);
    } catch (err) { setMsg(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    await api.deleteEvent(id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }

  return (
    <AdminLayout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-2">Event Management</h2>
          <p className="text-on-surface-variant">Create, edit, and manage upcoming events and workshops.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="px-5 py-2.5 bg-primary text-white font-medium rounded-[10px] hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>New Event
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-on-surface">{editing ? 'Edit Event' : 'New Event'}</h3>
            {[['title', 'Title *'], ['description', 'Description'], ['location', 'Location'], ['image_url', 'Image URL']].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
                <input required={key === 'title'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</label>
                <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Time</label>
                <input type="time" value={form.event_time} onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border-b-2 border-slate-200 py-2 focus:border-primary outline-none text-sm mt-1 bg-transparent">
                <option>Workshop</option><option>Hackathon</option><option>Seminar</option><option>Networking</option>
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
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full h-40 object-cover" />}
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{ev.type}</span>
              <h4 className="text-base font-bold text-on-surface mb-2 leading-snug">{ev.title}</h4>
              <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{ev.description}</p>
              <div className="space-y-1 mb-4 text-xs text-slate-500">
                {ev.event_date && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">calendar_today</span>{ev.event_date}</div>}
                {ev.location && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span>{ev.location}</div>}
              </div>
              <div className="mt-auto flex justify-end gap-2">
                <button onClick={() => openEdit(ev)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-all">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button onClick={() => handleDelete(ev.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No events yet. Create one!</p>}
      </div>
    </AdminLayout>
  );
}
