
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';

export default function TeamPage() {
  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      <PublicNav />
<main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
{/* comment */}
<header className="mb-24 max-w-3xl">
<h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tight mb-6 leading-tight">The Minds Behind <span className="text-primary">Sanjivani</span></h1>
<p className="text-xl text-on-surface-variant font-light leading-relaxed">A collective of researchers, engineers, and visionaries dedicated to advancing the frontier of Editorial Intelligence and ethical AI systems.</p>
</header>
{/* comment */}
<section className="mb-32">
<div className="flex items-baseline justify-between mb-12">
<h2 className="text-2xl font-semibold text-on-surface tracking-tight">Faculty Advisors</h2>
<div className="h-px flex-grow mx-8 bg-outline-variant opacity-20"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
{/* comment */}
<div className="group">
<div className="aspect-square mb-6 overflow-hidden rounded-xl bg-surface-container-high relative">
<img alt="Advisor 1" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" data-alt="Professional portrait of a middle-aged male professor in a scholarly setting, soft window lighting, academic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR_Z7SaXiKPva-pnGy1IAXe5j4tX17zUk90nuRZu5E_4VrPcFEZoF4WMFQEti8mT57wTcq3oNLysQijI_DEnmDVXHQ3udi0to7M-O7lKssTK9h48iUKKEV-zquBqBfo0M6NdUI5Zx8uz0eI-zwpU0SW5-rbNfQhc6AloEE4JuilqIz0WVz0z-Vfez9iL74DXxscxZJZX_jPN7CGdLO-QGqt3V9jG6kLBwK9Av_2vOLViJ3DFd2mU_gJ7clopNC0Uq5UWLuLWp_Owg"/>
</div>
<h3 className="text-xl font-bold text-on-surface mb-1">Dr. Arjan Varma</h3>
<p className="text-sm text-on-surface-variant font-medium mb-4 uppercase tracking-wider">Director of Research</p>
<a className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-low text-primary hover:bg-tertiary-fixed-dim transition-colors" href="#">
<span className="material-symbols-outlined text-lg" data-icon="link">link</span>
</a>
</div>
{/* comment */}
<div className="group">
<div className="aspect-square mb-6 overflow-hidden rounded-xl bg-surface-container-high relative">
<img alt="Advisor 2" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" data-alt="Professional portrait of a female academic researcher with glasses, neutral background, studio lighting, confident expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOpDjRkM0fV8ATixshvLgnRkz98S9fDwwQXFvS3AYxYmxcs3RK_9vGjH2ueDpn4BNFiRkzFpFEhXpjrzQNdTURsIKwls5OvVph5nvqvBDJ2kDL4FsKWDKIiDCYYQogA0FB50PnOIVL1tdh7ThwfStrbVLaIXZXx16W6ur1r31dbrd_DjsYkkPpjg4dtdbUVhu0jnvVhunxxw4gjOHLIhqIYniMiH1w8ltDxxkWHmsXtzpq6daSUbsdMI4CmACSIiHGzon8IsTqqFA"/>
</div>
<h3 className="text-xl font-bold text-on-surface mb-1">Prof. Elena Rodriguez</h3>
<p className="text-sm text-on-surface-variant font-medium mb-4 uppercase tracking-wider">Lead Ethicist</p>
<a className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-low text-primary hover:bg-tertiary-fixed-dim transition-colors" href="#">
<span className="material-symbols-outlined text-lg" data-icon="link">link</span>
</a>
</div>
</div>
</section>
{/* comment */}
<section className="mb-32">
<div className="flex items-baseline justify-between mb-12">
<h2 className="text-2xl font-semibold text-on-surface tracking-tight">Core Team</h2>
<div className="h-px flex-grow mx-8 bg-outline-variant opacity-20"></div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
{/* comment */}
<div className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-[0_12px_40px_rgba(0,35,111,0.04)] transition-all duration-300">
<div className="w-full aspect-square mb-6 overflow-hidden rounded-full border-4 border-surface">
<img alt="Core 1" className="w-full h-full object-cover" data-alt="Portrait of a young male software engineer in a modern office, natural lighting, focused look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE2RsqjDJb-knNI85skmINk9L49zRZ8w9SRK7InueApxfejBd3Qf4LLdEdDKqs62OAGPgzWR8hc3Nn7oXRlgr5Azrq6dXtX5JL4s-kEpLBzTLK00twiwjDPkeRxTM1X_7jDyaid5BKxbcU-TimdtQVr2mDnlnNizsBGyVihV0fte34XUC6DjfPeJZITlHJOgOn35XTvEUaKzEqwEpsh2YKxgHxL3kKjzEHGsAqyEBVfveH6nvA9oodt20lHQ-6CdTtk-LHwdvBqHw"/>
</div>
<div className="text-center">
<h3 className="text-lg font-bold text-on-surface mb-1 tracking-tight">Siddharth Nair</h3>
<p className="text-xs text-primary font-semibold mb-4">Lead AI Architect</p>
<a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
</a>
</div>
</div>
{/* comment */}
<div className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-[0_12px_40px_rgba(0,35,111,0.04)] transition-all duration-300">
<div className="w-full aspect-square mb-6 overflow-hidden rounded-full border-4 border-surface">
<img alt="Core 2" className="w-full h-full object-cover" data-alt="Portrait of a young woman professional in creative workspace, bright and airy lighting, friendly expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTkMEMj9opeKRqPuXiOsVo1-KzVYFvRv3v6aey1gHeXuYyrPJ0r_n75Wy75OrkfV1YbE5ORZOYb1uFzpYbQJpWeMaoARsUdNSOwbE9F7khQ-XDGsdGDX5Cr6zg_l93_UISAct2rpU3Y4Y8s7Y_-XsPMq-7bfIaBt416ZMridYYNjbcZqw0Cvk907vXX0q1ZP1efgzpNiHxMN_vm_SNH7NgUjW97lYWZ0GMxfWQj2f5rHlMRFfiwq2Ud54TpQNRvFI7vBC7Ihb8vL4"/>
</div>
<div className="text-center">
<h3 className="text-lg font-bold text-on-surface mb-1 tracking-tight">Anjali Mehta</h3>
<p className="text-xs text-primary font-semibold mb-4">Head of UX Strategy</p>
<a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
</a>
</div>
</div>
{/* comment */}
<div className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-[0_12px_40px_rgba(0,35,111,0.04)] transition-all duration-300">
<div className="w-full aspect-square mb-6 overflow-hidden rounded-full border-4 border-surface">
<img alt="Core 3" className="w-full h-full object-cover" data-alt="Close up portrait of a male professional with beard, modern studio lighting, professional attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCemzbEFds_EsN8_xiWFD3vZ4741Gjvyap9HYUY7ifLONQ9yB1X6-FtfUSwajt4bjc_ab3yBZOrGTb3ds48JCaYt2-Zflg31GbayNtqQ6znYAKLSXlsPDW3eJKWvpWtlHHrShkEqrysi89TdFOCz-uAxt-vEnrSNafbibzZsqi_Zx3Syo_VdAg6DIB590DDzAFpIVgaAVPNBYEuRyjc3Iv3B1oHEeifHMpwBt8vDXJ05ggY6Qu4vnZ6OyoAjxS4UCGKM40dXbA0zmo"/>
</div>
<div className="text-center">
<h3 className="text-lg font-bold text-on-surface mb-1 tracking-tight">Marcus Thorne</h3>
<p className="text-xs text-primary font-semibold mb-4">NLP Researcher</p>
<a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
</a>
</div>
</div>
{/* comment */}
<div className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-[0_12px_40px_rgba(0,35,111,0.04)] transition-all duration-300">
<div className="w-full aspect-square mb-6 overflow-hidden rounded-full border-4 border-surface">
<img alt="Core 4" className="w-full h-full object-cover" data-alt="Candid portrait of a woman tech leader, bright sunlight, natural outdoor background, confident smile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbKfqpTKUTK6hFl6xhi4ezWa02LjTPNEZeBv8xuMzleV5ivi_DYiQyM27dq_bN7OeKvaNk632rNrMrVG4HdMNZNbKQXMjO_ST5wGt5bZF3B0o9stsABSYIZtUpvL8SXNstZbtz5NDyiaXiW2k56ov6YUp-IRBUaOlCJZ3hYf-jR344S-TW7mgJnRRVu_YEmvCW29iz-mo_qXoxzEuijKy8F7ySK9KtZrxFUKzzB2AYFkxNibIIOeLAXbQh8hEsiQv2Mpibsapx1ac"/>
</div>
<div className="text-center">
<h3 className="text-lg font-bold text-on-surface mb-1 tracking-tight">Sarah Jenkins</h3>
<p className="text-xs text-primary font-semibold mb-4">Data Scientist</p>
<a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
</a>
</div>
</div>
</div>
</section>
{/* comment */}
<section className="mb-24">
<div className="flex items-baseline justify-between mb-12">
<h2 className="text-2xl font-semibold text-on-surface tracking-tight">Alumni</h2>
<div className="h-px flex-grow mx-8 bg-outline-variant opacity-20"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
{/* comment */}
<div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
<div>
<div className="w-16 h-16 rounded-full overflow-hidden mb-6">
<img alt="Alumni Large" className="w-full h-full object-cover" data-alt="Portrait of a young man, soft natural lighting, blurred office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkeZc6gOror5mi2xKeg_R3OTQ37LFrfOGmFOHTHJX6KX55gDOWiVRxXk3K2gqDXstdyN9FyIKnS95SFNZuNx-ROCkq2LhyFQulCp1yDpRBz7K9sXPZ9gUOk7UIJ9otFno69mR3abEc5jYfGhOWOUO67Ox_rv1uTovfkcLxB_KD9eZt7mklOqwv4DQg53qC3lk7zMwkceMBfAOPQHDgADJH_GTD3Ut8SUL251jqeiBk5wEBUTaNhwuMWbXsD3fRIppbcBqZ-S7OYQ8"/>
</div>
<h3 className="text-2xl font-bold text-on-surface tracking-tight">Vikram Sethi</h3>
<p className="text-on-surface-variant mb-4">Class of 2022 • Now at DeepMind</p>
<p className="text-sm font-light leading-relaxed mb-6 italic opacity-80">"The Sanjivani Hub was where my journey into Large Language Models began. The collaborative culture here is truly unique."</p>
</div>
<div className="flex gap-4">
<span className="text-xs font-bold text-primary px-3 py-1 bg-white rounded-full">NLP Expert</span>
<span className="text-xs font-bold text-primary px-3 py-1 bg-white rounded-full">Ex-Lead</span>
</div>
</div>
{/* comment */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
<div className="w-12 h-12 rounded-full overflow-hidden mb-4">
<img alt="Alumni 1" className="w-full h-full object-cover" data-alt="Close-up of a smiling young woman, studio portrait, soft key light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTbmLOrx3xz45tIjcWY_Iy_5sI5nJ_D5jQGovtCjbfmRW8JxLu_5gDPbS6Ma6gSyDkYdH9yCyZidACS1M6Jn1ZFMw_-fd2vRs2995M0rD6gkrQ_fYyEISgMbHrs6g1pb7Xu7ayN3ly89fOfYvg3ArkgV1nR4Mo1cbn08J0dci9TuJJutiztBeeTLvX661ZydGECB0YQwMjd50b5aWjxfak0uJ4cHS7BgQtTrSB9z4JKKzB7QJJjiA5vQYEMdMaFVDWy_SD-VzEWGU"/>
</div>
<h3 className="text-base font-bold text-on-surface">Priya Das</h3>
<p className="text-xs text-on-surface-variant mb-4">Senior ML Engineer, Meta</p>
<a className="text-primary hover:underline text-xs font-semibold" href="#">View Profile</a>
</div>
<div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
<div className="w-12 h-12 rounded-full overflow-hidden mb-4">
<img alt="Alumni 2" className="w-full h-full object-cover" data-alt="Portrait of a man in casual attire, outdoor evening light, urban setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9fvlVkhB-aO6j9AGHcQuJyr-w66mli97CQajnu695zcFA2tj7gvx17pEOKmq-Vz1N6gUwH6R-TgdChuve8DyfWwFC5kezXiG2Kcc9xF5kBUqnFzyggyokXEm8MJZVxuNmP-zsN9Ol6y8O4AYayubdeajk5vK8BSLY7GvRqP1KpZFwxhWVcaCoHQTgrtR_4CbLHyF8EUJiIY--MDpNpRmMYnUTAM9S-GM_xeQWA1AvpP7Bfa1qeAlKOSg-ZLvqVNCr5xOxhHu90fA"/>
</div>
<h3 className="text-base font-bold text-on-surface">Omar Farooq</h3>
<p className="text-xs text-on-surface-variant mb-4">Co-founder, NeuralSync</p>
<a className="text-primary hover:underline text-xs font-semibold" href="#">View Profile</a>
</div>
</div>
</section>
{/* comment */}
<section className="bg-primary text-on-primary p-12 rounded-2xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed-dim/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
<div className="relative z-10 text-center">
<h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to build the future of AI?</h2>
<p className="text-blue-200 mb-8 max-w-xl mx-auto font-light">We are always looking for curious minds to join our mission. Explore open positions and research fellowships.</p>
<Link to="/join"><button className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">Explore Careers</button></Link>
</div>
</section>
</main>
{/* comment */}
<footer className="bg-slate-50 dark:bg-slate-950 w-full border-t border-slate-200 dark:border-slate-800">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
<div className="col-span-1 md:col-span-1">
<div className="text-lg font-bold text-blue-900 dark:text-white mb-4">Sanjivani AI Hub</div>
<p className="font-sans text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Defining the standard for Editorial Intelligence through precision research and ethical engineering.</p>
</div>
<div>
<h4 className="text-blue-900 font-bold text-sm mb-6 uppercase tracking-widest">Platform</h4>
<ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
<li><a className="hover:text-blue-700 underline decoration-amber-400 underline-offset-4 transition-all" href="#">Research Projects</a></li>
<li><a className="hover:text-blue-700 transition-all" href="#">Resource Library</a></li>
<li><a className="hover:text-blue-700 transition-all" href="#">Blog &amp; Updates</a></li>
</ul>
</div>
<div>
<h4 className="text-blue-900 font-bold text-sm mb-6 uppercase tracking-widest">Company</h4>
<ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
<li><a className="hover:text-blue-700 transition-all" href="#">Careers</a></li>
<li><a className="hover:text-blue-700 transition-all" href="#">Contact Us</a></li>
<li><a className="hover:text-blue-700 transition-all" href="#">FAQ</a></li>
</ul>
</div>
<div>
<h4 className="text-blue-900 font-bold text-sm mb-6 uppercase tracking-widest">Legal</h4>
<ul className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400">
<li><a className="hover:text-blue-700 transition-all" href="#">Privacy Policy</a></li>
<li><a className="hover:text-blue-700 transition-all" href="#">Terms of Service</a></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 dark:border-slate-800 text-center md:text-left font-sans text-sm text-slate-600 dark:text-slate-400">
            © 2024 Sanjivani AI Hub. Precision in Intelligence.
        </div>
</footer>

    </div>
  );
}
