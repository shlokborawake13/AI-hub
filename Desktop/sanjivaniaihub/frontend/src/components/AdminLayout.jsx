import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const navItems = [
  { label: 'Dashboard',    icon: 'dashboard',     path: '/admin' },
  { label: 'Users',        icon: 'group',         path: '/admin/users' },
  { label: 'Applications', icon: 'inbox',         path: '/admin/applications' },
  { label: 'Blogs',        icon: 'article',       path: '/admin/blogs' },
  { label: 'Projects',     icon: 'account_tree',  path: '/admin/projects' },
  { label: 'Events',       icon: 'event',         path: '/admin/events' },
  { label: 'Resources',    icon: 'inventory_2',   path: '/admin/resources' },
  { label: 'Security Logs', icon: 'shield',        path: '/admin/logs' },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  // Count UNAUTHORIZED_ADMIN_ATTEMPT events from last 24h for the badge
  useEffect(() => {
    const since = new Date(Date.now() - 86400000).toISOString();
    supabase
      .from('unauthorized_access_log')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'UNAUTHORIZED_ADMIN_ATTEMPT')
      .gte('created_at', since)
      .then(({ count }) => setAlertCount(count || 0))
      .catch(() => {});

    // Realtime bump
    const channel = supabase
      .channel('layout:log_alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'unauthorized_access_log' }, payload => {
        if (payload.new?.event_type === 'UNAUTHORIZED_ADMIN_ATTEMPT') {
          setAlertCount(c => c + 1);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="absolute inset-0 w-full bg-slate-50 text-on-surface">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-white border-r border-slate-100 flex flex-col py-6 px-3">

        {/* Logo */}
        <div className="mb-8 px-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center shadow-sm group-hover:bg-blue-800 transition-colors">
              <span className="material-symbols-outlined text-white text-lg">clinical_notes</span>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 leading-tight">Sanjivani Hub</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Console</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map(item => {
            const active = pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <span className={`material-symbols-outlined text-[20px] ${active ? 'text-blue-700' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.label}
                {item.path === '/admin/logs' && alertCount > 0 && pathname !== '/admin/logs' ? (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {alertCount > 99 ? '99+' : alertCount}
                  </span>
                ) : active ? (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="mt-4 px-1 space-y-1 border-t border-slate-100 pt-4">
          <Link to="/admin/blogs">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Content
            </button>
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Header ── */}
      <header className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-slate-100 h-16 flex items-center justify-between px-8">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-600/10 focus:border-blue-400 outline-none placeholder:text-slate-400 transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-600">chevron_right</span>
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="ml-64 pt-16 min-h-screen bg-slate-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
