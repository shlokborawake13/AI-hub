import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { api } from '../services/api';
import { useRealtime } from '../services/useRealtime';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => { api.getBlogs().then(setBlogs).catch(() => {}); }, []);

  // Realtime: instantly reflect admin changes
  useRealtime('blogs', {
    onInsert: row => setBlogs(prev => [row, ...prev]),
    onUpdate: row => setBlogs(prev => prev.map(b => b.id === row.id ? row : b)),
    onDelete: row => setBlogs(prev => prev.filter(b => b.id !== row.id)),
  });

  const categories = ['All', 'Tutorial', 'Case Study', 'Featured', 'Research'];
  const filtered = filter === 'All' ? blogs : blogs.filter(b => b.category === filter);
  const featured = blogs.find(b => b.category === 'Featured') || blogs[0];
  const rest = filtered.filter(b => b.id !== featured?.id);

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-on-surface tracking-tight mb-4">AI Insights &amp; Tutorials</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">Exploring the frontiers of clinical intelligence and scientific precision through expert-led deep dives.</p>
        </header>

        {featured && (
          <section className="mb-24">
            <div className="relative group overflow-hidden rounded-xl bg-surface-container-lowest grid md:grid-cols-2 items-center gap-0">
              <div className="h-[400px] md:h-[500px] overflow-hidden">
                {featured.image_url && <img alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featured.image_url} />}
              </div>
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">Featured</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-6 leading-tight">{featured.title}</h2>
                <p className="text-on-surface-variant mb-8 text-lg leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{featured.author || 'Sanjivani Team'}</p>
                    <p className="text-xs text-on-surface-variant">AI Researcher</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-2xl font-bold text-on-surface">Recent Intelligence</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === c ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rest.map(blog => (
              <div key={blog.id} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden">
                {blog.image_url && <div className="h-56 overflow-hidden"><img alt={blog.title} className="w-full h-full object-cover" src={blog.image_url} /></div>}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold tracking-widest text-primary mb-3 uppercase">{blog.category}</span>
                  <h4 className="text-xl font-bold text-on-surface mb-3 leading-snug">{blog.title}</h4>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{blog.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">{new Date(blog.created_at).toLocaleDateString()}</span>
                    <span className="text-xs text-slate-400">{blog.author}</span>
                  </div>
                </div>
              </div>
            ))}
            {rest.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No blogs in this category yet.</p>}
          </div>
        </section>

        <section className="bg-primary rounded-2xl overflow-hidden p-12 md:p-20 relative">
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay calibrated with the latest AI breakthroughs.</h2>
            <p className="text-primary-fixed-dim text-lg mb-10 leading-relaxed">Join 15,000+ engineers and clinicians who receive our weekly curated report.</p>
            {subscribed ? (
              <p className="text-tertiary-fixed-dim font-bold text-lg">✓ You're subscribed!</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col md:flex-row gap-4 max-w-xl">
                <input value={email} onChange={e => setEmail(e.target.value)} required className="flex-grow bg-white/10 border-b-2 border-outline-variant/30 text-white placeholder:text-primary-fixed-dim/50 px-4 py-3 focus:outline-none focus:border-tertiary-fixed-dim transition-all" placeholder="Email address" type="email" />
                <button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity" type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 w-full border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
          <div><div className="text-lg font-bold text-blue-900 dark:text-white mb-6">Sanjivani AI Hub</div><p className="font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Advancing clinical intelligence through rigorous research.</p></div>
          <div><h5 className="text-blue-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h5><ul className="space-y-4">{[['/', 'Home'], ['/projects', 'Projects'], ['/blog', 'Blog']].map(([to, l]) => <li key={to}><Link className="text-slate-500 hover:text-blue-700 text-sm" to={to}>{l}</Link></li>)}</ul></div>
          <div><h5 className="text-blue-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h5><ul className="space-y-4">{['/team', '/join'].map(to => <li key={to}><Link className="text-slate-500 hover:text-blue-700 text-sm" to={to}>{to === '/team' ? 'Team' : 'Careers'}</Link></li>)}</ul></div>
          <div><h5 className="text-blue-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h5><p className="text-sm text-slate-500">hub@sanjivani.ai</p></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 dark:border-slate-800"><p className="font-sans text-sm text-slate-600 dark:text-slate-400">© 2024 Sanjivani AI Hub. Precision in Intelligence.</p></div>
      </footer>
    </div>
  );
}
