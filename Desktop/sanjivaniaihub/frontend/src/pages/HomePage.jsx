import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PublicNav from '../components/PublicNav';

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
    api.getEvents().then(setEvents).catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />

      <main className="pt-24">
        <section className="relative px-8 py-24 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary-fixed-dim/10 rounded-full blur-3xl"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tighter leading-tight mb-8 max-w-4xl">
            Advancing Human Intelligence Through <span className="text-primary">Artificial Innovation</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
            Empowering the next generation of researchers and creators at Sanjivani. A clinical laboratory for intelligence, where ethics meets cutting-edge computation.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/register">
              <button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95">Join Hub</button>
            </Link>
            <Link to="/projects">
              <button className="border border-outline-variant/30 text-primary px-8 py-4 rounded-lg font-semibold hover:bg-surface-container-low transition-all active:scale-95">Explore Projects</button>
            </Link>
          </div>
        </section>

        <section className="bg-surface-container-low py-16 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center"><span className="text-4xl font-bold text-primary mb-2">42+</span><span className="text-label-md text-on-surface-variant uppercase tracking-widest">Total Projects</span></div>
            <div className="flex flex-col items-center text-center"><span className="text-4xl font-bold text-primary mb-2">120+</span><span className="text-label-md text-on-surface-variant uppercase tracking-widest">Active Researchers</span></div>
            <div className="flex flex-col items-center text-center"><span className="text-4xl font-bold text-primary mb-2">15</span><span className="text-label-md text-on-surface-variant uppercase tracking-widest">Events Hosted</span></div>
            <div className="flex flex-col items-center text-center"><span className="text-4xl font-bold text-primary mb-2">2.5 PFLOPS</span><span className="text-label-md text-on-surface-variant uppercase tracking-widest">GPU Resources</span></div>
          </div>
        </section>

        <section className="bg-surface py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-3xl font-semibold tracking-tight text-on-surface">Featured Projects</h2>
              <Link to="/projects" className="text-primary font-medium border-b border-primary/20 pb-1">View All Projects</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {projects.slice(0, 3).map(p => (
                <div key={p.id} className="group flex flex-col bg-surface-container-lowest rounded-xl ambient-shadow overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                  {p.image_url && <img alt={p.title} className="w-full aspect-[16/9] object-cover" src={p.image_url} />}
                  <div className="p-8">
                    <div className="flex gap-2 mb-4">
                      {p.tags?.split(',').map(t => <span key={t} className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-bold tracking-wider uppercase">{t.trim()}</span>)}
                    </div>
                    <h3 className="text-xl font-semibold text-on-surface mb-3">{p.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{p.description}</p>
                    <Link to="/projects" className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Case Study <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-24 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-on-surface mb-12">Upcoming Events</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {events.slice(0, 2).map(ev => {
              const d = ev.event_date ? new Date(ev.event_date) : null;
              return (
                <div key={ev.id} className="flex-1 bg-surface-container-low p-8 rounded-xl flex items-center gap-8 group hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col items-center justify-center bg-white w-20 h-20 rounded-lg ambient-shadow">
                    <span className="text-xs font-bold text-primary uppercase">{d ? d.toLocaleString('default', { month: 'short' }) : 'TBD'}</span>
                    <span className="text-2xl font-bold text-on-surface">{d ? d.getDate() : '--'}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-on-surface">{ev.title}</h4>
                    <p className="text-sm text-on-surface-variant">{ev.location} • {ev.event_time}</p>
                  </div>
                  <Link to="/events">
                    <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="max-w-5xl mx-auto hero-gradient rounded-3xl p-12 md:p-24 text-center text-white ambient-shadow relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Innovate?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto opacity-90">Secure your position in our research cohorts or partner with us to solve the world's most complex challenges.</p>
            <Link to="/register">
              <button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-10 py-5 rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-xl">Apply to Join Hub</button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-white mb-6">Sanjivani AI Hub</div>
            <p className="font-sans text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p>
          </div>
          <div>
            <h5 className="text-blue-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-wider">Ecosystem</h5>
            <ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
              <li><Link className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" to="/projects">Projects</Link></li>
              <li><Link className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" to="/blog">Research Papers</Link></li>
              <li><Link className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" to="/resources">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-blue-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-wider">Company</h5>
            <ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
              <li><Link className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" to="/team">Team</Link></li>
              <li><Link className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" to="/register">Register</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-blue-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-wider">Contact</h5>
            <ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span>hub@sanjivani.ai</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span>Innovation District, Tech City</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
