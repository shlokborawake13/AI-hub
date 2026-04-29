import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/',          label: 'Home'      },
  { to: '/projects',  label: 'Projects'  },
  { to: '/events',    label: 'Events'    },
  { to: '/resources', label: 'Resources' },
  { to: '/blog',      label: 'Blog'      },
  { to: '/team',      label: 'Team'      },
];

export default function PublicNav() {
  const { pathname }    = useLocation();
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);
  const dropRef          = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,35,111,0.04)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">

        <Link to="/" className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
          Sanjivani AI Hub
        </Link>

        <div className="hidden md:flex gap-8 font-sans text-sm font-medium tracking-tight">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={pathname === l.to
                ? 'text-blue-900 dark:text-white border-b-2 border-amber-400 pb-1'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 transition-colors duration-200'}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropRef}>
              {/* Avatar button */}
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name}
                    className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <span className={`material-symbols-outlined text-[16px] text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">

                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    {user.prn && (
                      <p className="text-xs text-blue-600 font-mono mt-0.5">{user.prn}</p>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <DropItem icon="person" label="My Profile" onClick={() => { setOpen(false); navigate('/profile'); }} />
                    {user.role === 'admin' && (
                      <DropItem icon="admin_panel_settings" label="Admin Dashboard" onClick={() => { setOpen(false); navigate('/admin'); }} />
                    )}
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <DropItem
                      icon="logout"
                      label="Sign Out"
                      danger
                      onClick={() => { setOpen(false); logout(); navigate('/'); }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="text-sm font-semibold text-blue-900 dark:text-white hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
        danger
          ? 'text-red-500 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
      }`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );
}
