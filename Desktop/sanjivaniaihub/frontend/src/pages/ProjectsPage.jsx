import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { api } from '../services/api';
import { useRealtime } from '../services/useRealtime';

const tags = ['All', 'Python', 'PyTorch', 'C++', 'Research', 'VHDL'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeTag !== 'All') params.set('tag', activeTag);
    api.getProjects(params.toString()).then(setProjects).catch(() => {});
  }, [search, activeTag]);

  useRealtime('projects', {
    onInsert: row => setProjects(prev => [row, ...prev]),
    onUpdate: row => setProjects(prev => prev.map(p => p.id === row.id ? row : p)),
    onDelete: row => setProjects(prev => prev.filter(p => p.id !== row.id)),
  });

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-[3.5rem] font-bold leading-tight tracking-tight text-on-surface mb-4">AI Projects &amp; Research</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">Exploring the frontier of artificial intelligence through rigorous research and collaborative development.</p>
        </header>

        <section className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="relative w-full md:max-w-md">
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent border-b-2 border-outline-variant py-3 pl-2 pr-10 focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" placeholder="Search projects..." type="text" />
            <span className="material-symbols-outlined absolute right-2 top-3 text-on-surface-variant">search</span>
          </div>
          <nav className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTag === t ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>{t}</button>
            ))}
          </nav>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => (
            <article key={p.id} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,35,111,0.04)] hover:translate-y-[-4px] transition-transform duration-300">
              {p.image_url && <div className="aspect-video overflow-hidden bg-slate-200"><img alt={p.title} className="w-full h-full object-cover" src={p.image_url} /></div>}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags?.split(',').map(t => <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-secondary-container text-on-secondary-container rounded">{t.trim()}</span>)}
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2 leading-tight">{p.title}</h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">{p.description}</p>
                <div className="mt-auto">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{p.status}</span>
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No projects found.</p>}
        </div>

        <section className="mt-24 bg-primary text-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <span className="text-tertiary-fixed-dim text-sm font-bold tracking-widest uppercase mb-4">Collaborate With Us</span>
            <h2 className="text-4xl font-bold mb-6">Have a breakthrough AI research idea?</h2>
            <p className="text-primary-fixed-dim text-lg mb-8 leading-relaxed">Join our residential research program and gain access to high-compute clusters and expert mentorship.</p>
            <div className="flex gap-4">
              <Link to="/join"><button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">Apply to Hub</button></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <p className="font-sans text-sm text-slate-600 dark:text-slate-400">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-slate-500 hover:text-blue-700 text-sm">Home</Link>
            <Link to="/blog" className="text-slate-500 hover:text-blue-700 text-sm">Blog</Link>
            <Link to="/team" className="text-slate-500 hover:text-blue-700 text-sm">Team</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
