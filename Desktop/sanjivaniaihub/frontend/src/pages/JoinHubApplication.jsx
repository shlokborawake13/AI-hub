import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,35,111,0.04)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">Sanjivani AI Hub</Link>
        <div className="hidden md:flex items-center space-x-8 font-sans text-sm font-medium tracking-tight">
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/">Home</Link>
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/projects">Projects</Link>
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/events">Events</Link>
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/resources">Resources</Link>
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/blog">Blog</Link>
          <Link className="text-slate-600 hover:text-blue-900 transition-colors" to="/team">Team</Link>
        </div>
        <Link to="/login"><button className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm active:opacity-80 transition-all">Sign In</button></Link>
      </div>
    </nav>
  );
}

export default function JoinHubApplication() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', course: '', skills: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.submitApplication(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-4">Application Submitted!</h2>
          <p className="text-on-surface-variant mb-8">Thank you for applying to Sanjivani AI Hub. We'll review your application and get back to you soon.</p>
          <Link to="/"><button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold">Back to Home</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-12">
            <header className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-primary leading-tight">Join the next frontier of intelligence.</h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">Become part of a community dedicated to clinical precision and editorial excellence in Artificial Intelligence.</p>
            </header>
            <div className="space-y-8">
              {[{ icon: 'memory', title: 'Access to GPUs', desc: 'High-performance computing resources including NVIDIA A100s for training and fine-tuning models.' }, { icon: 'groups', title: 'Mentorship', desc: 'One-on-one sessions with industry veterans and PhD researchers.' }, { icon: 'rocket_launch', title: 'Real-world projects', desc: 'Work on live datasets from our healthcare partners, solving actual diagnostic challenges.' }].map(item => (
                <div key={item.icon} className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">{item.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_12px_40px_rgba(0,35,111,0.04)]">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-on-surface mb-2">Application Form</h2>
                <p className="text-on-surface-variant">Precision starts here. Tell us about your journey and expertise.</p>
              </div>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Full Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-3 focus:ring-0 focus:border-primary transition-all text-on-surface outline-none" placeholder="Dr. Jane Doe" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-3 focus:ring-0 focus:border-primary transition-all text-on-surface outline-none" placeholder="jane.doe@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Course / Year</label>
                    <input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-3 focus:ring-0 focus:border-primary transition-all text-on-surface outline-none" placeholder="B.Tech CS - 3rd Year" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Top Skills (comma separated)</label>
                    <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-3 focus:ring-0 focus:border-primary transition-all text-on-surface outline-none" placeholder="Python, PyTorch, NLP" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Motivation</label>
                  <textarea value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))} className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-3 focus:ring-0 focus:border-primary transition-all text-on-surface resize-none outline-none" placeholder="What drives you to apply clinical precision to AI?" rows="4"></textarea>
                </div>
                <div className="pt-4">
                  <button disabled={loading} className="w-full md:w-auto bg-tertiary-fixed-dim text-on-tertiary-fixed px-10 py-4 rounded-lg font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transform active:scale-95 transition-all disabled:opacity-60" type="submit">
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
