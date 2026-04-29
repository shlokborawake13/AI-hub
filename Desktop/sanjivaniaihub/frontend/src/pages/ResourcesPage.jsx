import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { api } from '../services/api';
import { useRealtime } from '../services/useRealtime';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  useEffect(() => { api.getResources().then(setResources).catch(() => {}); }, []);

  useRealtime('resources', {
    onInsert: row => setResources(prev => [row, ...prev]),
    onUpdate: row => setResources(prev => prev.map(r => r.id === row.id ? row : r)),
    onDelete: row => setResources(prev => prev.filter(r => r.id !== row.id)),
  });

  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />
<main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
{/* comment */}
<header className="mb-20 max-w-3xl">
<span className="text-tertiary-fixed-dim font-bold tracking-widest text-xs uppercase mb-4 block">Knowledge Base</span>
<h1 className="text-5xl md:text-6xl font-bold text-on-surface tracking-tight leading-tight mb-6">Learning Resources</h1>
<p className="text-lg text-on-surface-variant leading-relaxed">
                A curated library of technical roadmaps, high-quality datasets, essential developer tools, and advanced AI courses tailored for precision intelligence research and application.
            </p>
</header>
{/* comment */}
<section className="mb-24">
<div className="flex items-center gap-4 mb-10">
<h2 className="text-2xl font-semibold text-primary">Technical Roadmaps</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* comment */}
<div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between transition-all hover:shadow-[0_20px_50px_rgba(0,35,111,0.06)] group">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="route">route</span>
</div>
<h3 className="text-xl font-bold mb-3 text-on-surface">LLM Engineer Path</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Master the architecture of Large Language Models, from transformer basics to fine-tuning and deployment optimization.
                        </p>
</div>
<button className="w-full py-3 px-4 rounded-md border border-outline-variant/50 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Access Resource <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
{/* comment */}
<div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between transition-all hover:shadow-[0_20px_50px_rgba(0,35,111,0.06)] group">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
</div>
<h3 className="text-xl font-bold mb-3 text-on-surface">Data Science Mastery</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                            A comprehensive guide to statistical modeling, data visualization, and exploratory analysis techniques used in modern research.
                        </p>
</div>
<button className="w-full py-3 px-4 rounded-md border border-outline-variant/50 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Access Resource <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
{/* comment */}
<div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between transition-all hover:shadow-[0_20px_50px_rgba(0,35,111,0.06)] group">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="cloud_done">cloud_done</span>
</div>
<h3 className="text-xl font-bold mb-3 text-on-surface">MLOps &amp; Deployment</h3>
<p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Bridge the gap between model development and production. Learn Docker, Kubernetes, and CI/CD for machine learning.
                        </p>
</div>
<button className="w-full py-3 px-4 rounded-md border border-outline-variant/50 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Access Resource <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</section>
{/* comment */}
<section className="mb-24">
<div className="flex items-center gap-4 mb-10">
<h2 className="text-2xl font-semibold text-primary">Datasets</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
<div className="md:col-span-7 bg-surface-container-lowest p-10 rounded-xl relative overflow-hidden group min-h-[400px] flex flex-col justify-end shadow-sm">
<div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
<img alt="Large scale data visualization" className="w-full h-full object-cover" data-alt="Abstract complex data visualization nodes connecting in a deep blue space with glowing highlights and depth of field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4iUfyYQkmYzw4_X7mw6cxrwQJxQUCkEvVrY4VSG2s5ADu6bQcRJgHrbnPzJnLb6nDA7cnnG5XqxcfSr5UoPSOI0JgF4qAN9ehATYAeyKYb1RQkT29wQ9v92lpiGqdNpwwhV_shfyJo7Ap8Q-6RmqG1QEgRYdsIBkpQDqFrCqtCHnPDoZzuSI2aU9kcqD6bkTNyriBzS1LSHMIHpQ10CksJE-pEGZTOc0seeneGKn2xgpAhk1R4RbUzQh8EImcb8a1oHQda28lw4A"/>
</div>
<div className="relative z-10">
<span className="bg-tertiary-fixed-dim text-on-tertiary-fixed text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-4 inline-block">Premium Collection</span>
<h3 className="text-3xl font-bold text-on-surface mb-4">Global Climate Patterns (1950-2024)</h3>
<p className="text-on-surface-variant max-w-lg mb-8">High-resolution meteorological sensor data featuring over 4 billion records for predictive modeling of climate change anomalies.</p>
<button className="bg-primary text-white px-8 py-3 rounded-md font-semibold text-sm transition-all hover:bg-primary-container active:scale-95">Download Dataset</button>
</div>
</div>
<div className="md:col-span-5 flex flex-col gap-8">
<div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 group hover:shadow-md transition-all">
<div className="w-16 h-16 bg-surface-container-low rounded flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-all">
<span className="material-symbols-outlined text-3xl" data-icon="neurology">neurology</span>
</div>
<div>
<h4 className="font-bold text-on-surface">Neural Image Corpus</h4>
<p className="text-xs text-on-surface-variant mb-2">1.2M Labeled biological scans.</p>
<a className="text-primary text-xs font-bold hover:underline" href="#">Explore Index</a>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 group hover:shadow-md transition-all">
<div className="w-16 h-16 bg-surface-container-low rounded flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-all">
<span className="material-symbols-outlined text-3xl" data-icon="translate">translate</span>
</div>
<div>
<h4 className="font-bold text-on-surface">Multi-Dialect Lexicon</h4>
<p className="text-xs text-on-surface-variant mb-2">Parallel text for 45 dialects.</p>
<a className="text-primary text-xs font-bold hover:underline" href="#">Explore Index</a>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 group hover:shadow-md transition-all">
<div className="w-16 h-16 bg-surface-container-low rounded flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-all">
<span className="material-symbols-outlined text-3xl" data-icon="finance">finance</span>
</div>
<div>
<h4 className="font-bold text-on-surface">Ethical Finance Log</h4>
<p className="text-xs text-on-surface-variant mb-2">Verified transaction behaviors.</p>
<a className="text-primary text-xs font-bold hover:underline" href="#">Explore Index</a>
</div>
</div>
</div>
</div>
</section>
{/* comment */}
<section className="mb-24">
<div className="flex items-center gap-4 mb-10">
<h2 className="text-2xl font-semibold text-primary">Developer Tools</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
{/* comment */}
<div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-primary transition-transform hover:-translate-y-1">
<span className="material-symbols-outlined text-primary mb-4" data-icon="terminal">terminal</span>
<h3 className="font-bold mb-2">Sanjivani CLI</h3>
<p className="text-xs text-on-surface-variant mb-6">Automate your ML pipelines directly from the terminal with integrated hub authentication.</p>
<button className="text-xs font-bold text-primary flex items-center gap-1 group">
                        Install Now <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</button>
</div>
{/* comment */}
<div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-tertiary-fixed-dim transition-transform hover:-translate-y-1">
<span className="material-symbols-outlined text-primary mb-4" data-icon="code_blocks">code_blocks</span>
<h3 className="font-bold mb-2">Python SDK v2.4</h3>
<p className="text-xs text-on-surface-variant mb-6">The official software development kit for connecting your local agents to Sanjivani's core APIs.</p>
<button className="text-xs font-bold text-primary flex items-center gap-1 group">
                        Documentation <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</button>
</div>
{/* comment */}
<div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-on-primary-container transition-transform hover:-translate-y-1">
<span className="material-symbols-outlined text-primary mb-4" data-icon="data_object">data_object</span>
<h3 className="font-bold mb-2">JSON Sanitizer</h3>
<p className="text-xs text-on-surface-variant mb-6">A high-performance utility to clean and structure large-scale training data before ingestion.</p>
<button className="text-xs font-bold text-primary flex items-center gap-1 group">
                        View Source <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</button>
</div>
{/* comment */}
<div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-secondary transition-transform hover:-translate-y-1">
<span className="material-symbols-outlined text-primary mb-4" data-icon="monitoring">monitoring</span>
<h3 className="font-bold mb-2">Compute Monitor</h3>
<p className="text-xs text-on-surface-variant mb-6">Real-time visualization tool for tracking token usage and inference latency across deployments.</p>
<button className="text-xs font-bold text-primary flex items-center gap-1 group">
                        Open Tool <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</section>
{/* comment */}
<section className="mb-24">
<div className="flex items-center gap-4 mb-10">
<h2 className="text-2xl font-semibold text-primary">Advanced Courses</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* comment */}
<div className="flex bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
<div className="w-2/5 relative">
<img alt="AI Ethics Course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Close up of a human hand interacting with a holographic interface representing ethical AI governance concepts and binary streams" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVmQ7wMOaVSdO8stWxrwsuGUfuIKpzC-IiDT0mPrAraDy-Ru4MOnaj7Ye2UshZZq2wDE0HF7-VwyFiYbQgDRMf1M9sPuTkmHYsn_gS1Kyp41ThJckDGzmdPXR9yKHiKGsxdgYVpAT4z-8pFwNxxs8RFhTSycm2Kd84EIddrs4HMpS0n_mCnbaifOdHAn2Wx22SKRW5aIYqtCVZsaExnl4tCVNxLriaCKFsAlo6vvTF8z4sGIQVePX7JHIzEeeRtG1Y2fxU4ndn0uE"/>
</div>
<div className="w-3/5 p-8 flex flex-col justify-center">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-amber-500 text-sm" data-icon="star" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Expert Level</span>
</div>
<h3 className="text-xl font-bold mb-3">AI Governance &amp; Ethics</h3>
<p className="text-sm text-on-surface-variant mb-6">A deep dive into the regulatory landscape and philosophical implications of autonomous systems.</p>
<button className="bg-tertiary-fixed-dim text-on-tertiary-fixed py-2 px-6 rounded-md text-sm font-bold w-fit active:opacity-80 transition-opacity">Access Resource</button>
</div>
</div>
{/* comment */}
<div className="flex bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
<div className="w-2/5 relative">
<img alt="Mathematics for AI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Complex mathematical equations handwritten on a blackboard with warm ambient lighting and selective focus on calculus formulas" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjA4UJmMxF8_mmFi8jkChYFxeEViIPvH9js0un00_VwHQHFl-z6X3FOL84X2QOTIJVbJ3N4JPXRzyn5n8UgJ5kGDmDMsxvo1IaMkwFRUOaJYp-jTHVf-RH3t62AuLc_tjOs2wp1F71SQjZCsHgbSR7UzqyeHeLSHr7PwS-A7wixW0TWsf46pU9Zkp0VkI9TzisaVs97th7kKnyYGYOVdlMhRoOr9riN7d1sJlokvKuish-JWdGqP4qvs1lI4RLRF8j4n5KyG2dS-k"/>
</div>
<div className="w-3/5 p-8 flex flex-col justify-center">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-amber-500 text-sm" data-icon="star" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Foundation Level</span>
</div>
<h3 className="text-xl font-bold mb-3">Calculus for Deep Learning</h3>
<p className="text-sm text-on-surface-variant mb-6">The fundamental mathematics required to understand backpropagation and gradient descent from scratch.</p>
<button className="bg-tertiary-fixed-dim text-on-tertiary-fixed py-2 px-6 rounded-md text-sm font-bold w-fit active:opacity-80 transition-opacity">Access Resource</button>
</div>
</div>
</div>
</section>
{/* comment */}
<section className="bg-primary-container text-white p-12 rounded-2xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
<svg viewbox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
<path d="M150,0 L400,0 L400,400 L0,400 Z" fill="white"></path>
</svg>
</div>
<div className="relative z-10 max-w-2xl">
<h2 className="text-3xl font-bold mb-4">Stay updated with new resources</h2>
<p className="text-on-primary-container text-lg mb-8">Get weekly notifications about newly released datasets, tool updates, and curriculum additions directly in your inbox.</p>
<form className="flex flex-col sm:flex-row gap-4">
<input className="flex-grow bg-white/10 border-b-2 border-white/30 text-white placeholder:text-white/50 px-0 py-3 focus:border-white focus:ring-0 outline-none transition-all" placeholder="Enter your research email" type="email"/>
<button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-3 rounded-md font-bold hover:scale-105 transition-transform">Subscribe Now</button>
</form>
</div>
</section>
</main>
{/* comment */}
<footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-sans text-sm text-slate-600 dark:text-slate-400">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
<div className="col-span-1 md:col-span-1">
<div className="text-lg font-bold text-blue-900 dark:text-white mb-6">Sanjivani AI Hub</div>
<p className="mb-6 leading-relaxed">Pioneering precision in collaborative intelligence and high-impact AI research development.</p>
<div className="flex space-x-4">
<a className="material-symbols-outlined opacity-80 hover:opacity-100 transition-opacity" data-icon="public" href="#">public</a>
<a className="material-symbols-outlined opacity-80 hover:opacity-100 transition-opacity" data-icon="groups" href="#">groups</a>
<a className="material-symbols-outlined opacity-80 hover:opacity-100 transition-opacity" data-icon="share" href="#">share</a>
</div>
</div>
<div className="flex flex-col space-y-4">
<h4 className="font-bold text-blue-900 dark:text-white mb-2">Ecosystem</h4>
<a className="text-slate-500 hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Research Papers</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Sandbox Labs</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Community Forum</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Open Source</a>
</div>
<div className="flex flex-col space-y-4">
<h4 className="font-bold text-blue-900 dark:text-white mb-2">Legal &amp; Support</h4>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Privacy Policy</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Terms of Service</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Contact Us</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">FAQ</a>
</div>
<div className="flex flex-col space-y-4">
<h4 className="font-bold text-blue-900 dark:text-white mb-2">Connect</h4>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Careers</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">LinkedIn</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">Twitter / X</a>
<a className="text-slate-500 hover:text-blue-700 hover:underline decoration-amber-400 underline-offset-4 transition-opacity" href="#">GitHub</a>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center opacity-80">
<div>© 2024 Sanjivani AI Hub. Precision in Intelligence.</div>
<div className="mt-4 md:mt-0 flex gap-6 text-xs uppercase tracking-widest font-bold">
<span className="text-blue-900 dark:text-blue-400">Ver 2.4.0</span>
<span>Status: Operational</span>
</div>
</div>
</footer>

    </div>
  );
}
