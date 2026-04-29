import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotAuthorizedPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [visible, setVisible] = useState(false);

  // Trigger fade-in + scale animation on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 flex flex-col items-center justify-center px-4 text-center overflow-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
      >
        {/* Meme image */}
        <div className="mb-6">
          <img
            src="/meme.webp"
            alt="Nice Try"
            className="w-72 sm:w-96 rounded-2xl shadow-2xl shadow-black/60 mx-auto border border-white/10"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
          Nice Try 😏
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-base mb-2 max-w-sm mx-auto leading-relaxed">
          You are <span className="text-red-400 font-semibold">not authorized</span> to access this page.
        </p>
        <p className="text-gray-600 text-sm mb-8 max-w-xs mx-auto">
          Typing <code className="bg-white/10 text-blue-400 px-1.5 py-0.5 rounded font-mono text-xs">/admin</code> in the URL doesn't grant you admin powers.
        </p>

        {/* User info pill */}
        {user && (
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-400 text-xs">
              Signed in as <span className="text-white font-medium">{user.email}</span>
              {' '}· Role: <span className="text-amber-400 font-semibold capitalize">{user.role}</span>
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
          >
            Go Back to Dashboard
          </Link>
          {!user && (
            <Link
              to="/login"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Footer */}
        <p className="text-gray-700 text-xs mt-10">
          © 2024 Sanjivani AI Hub · Precision in Intelligence
        </p>
      </div>
    </div>
  );
}
