import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { api } from '../services/api';
import { useRealtime } from '../services/useRealtime';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All Events');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [registered, setRegistered] = useState({});

  useEffect(() => { api.getEvents().then(setEvents).catch(() => {}); }, []);

  useRealtime('events', {
    onInsert: row => setEvents(prev => [...prev, row].sort((a, b) => new Date(a.event_date) - new Date(b.event_date))),
    onUpdate: row => setEvents(prev => prev.map(e => e.id === row.id ? row : e)),
    onDelete: row => setEvents(prev => prev.filter(e => e.id !== row.id)),
  });

  const types = ['All Events', 'Hackathon', 'Workshop', 'Seminar', 'Networking'];
  const filtered = filter === 'All Events' ? events : events.filter(e => e.type === filter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
        <header className="mb-16">
          <span className="text-tertiary-fixed-dim font-bold tracking-widest text-xs uppercase mb-4 block">Intelligence in Motion</span>
          <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-6 max-w-2xl">Upcoming Events &amp; Workshops</h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">Connect with pioneers and master the latest in artificial intelligence through our curated technical workshops.</p>
        </header>

        {featured && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            <div className="lg:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_40px_rgba(0,35,111,0.04)]">
              {featured.image_url && <div className="aspect-[16/9] w-full overflow-hidden"><img alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={featured.image_url} /></div>}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{featured.type}</span>
                  <span className="text-on-surface-variant text-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{featured.event_date}</span>
                </div>
                <h3 className="text-3xl font-bold text-on-surface mb-4">{featured.title}</h3>
                <p className="text-on-surface-variant mb-8 line-clamp-2">{featured.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm font-medium text-on-surface-variant">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">location_on</span>{featured.location}</span>
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">schedule</span>{featured.event_time}</span>
                  </div>
                  <button onClick={() => setRegistered(r => ({ ...r, [featured.id]: true }))} className={`px-8 py-3 rounded-lg font-bold transition-all active:scale-95 shadow-lg ${registered[featured.id] ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary-container'}`}>
                    {registered[featured.id] ? '✓ Registered' : 'Register Now'}
                  </button>
                </div>
              </div>
            </div>
            {rest[0] && (
              <div className="lg:col-span-4 bg-primary-container rounded-xl p-8 text-white flex flex-col justify-between">
                <div>
                  <span className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-6 inline-block">{rest[0].type}</span>
                  <h3 className="text-2xl font-bold mb-4">{rest[0].title}</h3>
                  <p className="text-primary-fixed text-sm leading-relaxed mb-6">{rest[0].description}</p>
                </div>
                <div>
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined opacity-70">event</span><span>{rest[0].event_date}</span></div>
                    <div className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined opacity-70">location_on</span><span>{rest[0].location}</span></div>
                  </div>
                  <button onClick={() => setRegistered(r => ({ ...r, [rest[0].id]: true }))} className={`w-full py-4 rounded-lg font-bold transition-all ${registered[rest[0].id] ? 'bg-emerald-400 text-white' : 'bg-tertiary-fixed-dim text-on-tertiary-fixed hover:brightness-110'}`}>
                    {registered[rest[0].id] ? '✓ Registered' : 'Secure Spot'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-on-surface">Curated Sessions</h2>
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === t ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.slice(1).map(ev => (
              <div key={ev.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10 group">
                {ev.image_url && <div className="h-48 overflow-hidden"><img alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ev.image_url} /></div>}
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-tighter mb-2 block text-primary">{ev.type}</span>
                  <h4 className="text-lg font-bold text-on-surface mb-4">{ev.title}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-xs">calendar_month</span>{ev.event_date}</div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-xs">location_on</span>{ev.location}</div>
                  </div>
                  <button onClick={() => setRegistered(r => ({ ...r, [ev.id]: true }))} className={`w-full py-3 rounded-lg font-semibold transition-colors ${registered[ev.id] ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'border border-outline-variant text-primary hover:bg-surface-container-low'}`}>
                    {registered[ev.id] ? '✓ Registered' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No events scheduled yet.</p>}
          </div>
        </section>

        <section className="mt-24 bg-surface-container-low rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-on-surface mb-4">Stay in the Loop</h2>
            <p className="text-on-surface-variant">Get notified about new workshops and speaker announcements.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            {subscribed ? <p className="text-emerald-600 font-semibold">✓ You're subscribed!</p> : (
              <>
                <input value={email} onChange={e => setEmail(e.target.value)} className="bg-white border-none rounded-lg px-6 py-4 focus:ring-2 focus:ring-primary w-full sm:w-80 shadow-sm" placeholder="Enter your email" type="email" />
                <button onClick={() => email && setSubscribed(true)} className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-4 rounded-lg font-bold whitespace-nowrap shadow-md">Subscribe</button>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <p className="text-sm text-slate-600">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-slate-500 hover:text-blue-700 text-sm">Home</Link>
            <Link to="/projects" className="text-slate-500 hover:text-blue-700 text-sm">Projects</Link>
            <Link to="/join" className="text-slate-500 hover:text-blue-700 text-sm">Join</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
