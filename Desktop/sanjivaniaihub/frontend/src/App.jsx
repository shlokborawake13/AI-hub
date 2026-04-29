import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';
import NotAuthorizedPage  from './pages/NotAuthorizedPage';
import HomePage           from './pages/HomePage';
import ProjectsPage       from './pages/ProjectsPage';
import EventsPage         from './pages/EventsPage';
import ResourcesPage      from './pages/ResourcesPage';
import BlogPage           from './pages/BlogPage';
import TeamPage           from './pages/TeamPage';
import ProfilePage        from './pages/ProfilePage';
import AdminDashboardOverview from './pages/AdminDashboardOverview';
import UserManagement         from './pages/UserManagement';
import ApplicationsManagement from './pages/ApplicationsManagement';
import BlogManagement         from './pages/BlogManagement';
import ProjectManagement      from './pages/ProjectManagement';
import EventManagement        from './pages/EventManagement';
import ResourceManagement     from './pages/ResourceManagement';
import SecurityLogs           from './pages/SecurityLogs';

// ── Page-visit tracker ───────────────────────────────────────────────────────
function PageVisitTracker() {
  const location = useLocation();
  useEffect(() => {
    api.logPageVisit(location.pathname);
  }, [location.pathname]);
  return null;
}

// ── Full-screen loader ────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Verifying access…</p>
      </div>
    </div>
  );
}

// ── AdminRoute ────────────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (user.role !== 'admin') {
    api.logAuthEvent('UNAUTHORIZED_ADMIN_ATTEMPT', user.email, location.pathname);
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

// ── GuestRoute ────────────────────────────────────────────────────────────────
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  if (loading) return <Loader />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <PageVisitTracker />
      <Routes>
        {/* Public */}
        <Route path="/"               element={<HomePage />} />
        <Route path="/projects"       element={<ProjectsPage />} />
        <Route path="/events"         element={<EventsPage />} />
        <Route path="/resources"      element={<ResourcesPage />} />
        <Route path="/blog"           element={<BlogPage />} />
        <Route path="/team"           element={<TeamPage />} />
        <Route path="/profile"        element={<ProfilePage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />

        {/* Auth — guests only */}
        <Route path="/login"          element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register"       element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin — role verified from DB via AuthContext */}
        <Route path="/admin"              element={<AdminRoute><AdminDashboardOverview /></AdminRoute>} />
        <Route path="/admin/users"        element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/applications" element={<AdminRoute><ApplicationsManagement /></AdminRoute>} />
        <Route path="/admin/blogs"        element={<AdminRoute><BlogManagement /></AdminRoute>} />
        <Route path="/admin/projects"     element={<AdminRoute><ProjectManagement /></AdminRoute>} />
        <Route path="/admin/events"       element={<AdminRoute><EventManagement /></AdminRoute>} />
        <Route path="/admin/resources"    element={<AdminRoute><ResourceManagement /></AdminRoute>} />
        <Route path="/admin/logs"          element={<AdminRoute><SecurityLogs /></AdminRoute>} />

        {/* Legacy redirects */}
        <Route path="/join"                   element={<Navigate to="/register" replace />} />
        <Route path="/joinhubapplication"     element={<Navigate to="/register" replace />} />
        <Route path="/loginpage"              element={<Navigate to="/login"    replace />} />
        <Route path="/homepage"               element={<Navigate to="/"         replace />} />
        <Route path="/projectspage"           element={<Navigate to="/projects" replace />} />
        <Route path="/eventspage"             element={<Navigate to="/events"   replace />} />
        <Route path="/resourcespage"          element={<Navigate to="/resources" replace />} />
        <Route path="/blogpage"               element={<Navigate to="/blog"     replace />} />
        <Route path="/teampage"               element={<Navigate to="/team"     replace />} />
        <Route path="/admindashboardoverview" element={<Navigate to="/admin"    replace />} />
        <Route path="/usermanagement"         element={<Navigate to="/admin/users" replace />} />
        <Route path="/applicationsmanagement" element={<Navigate to="/admin/applications" replace />} />
        <Route path="/blogmanagement"         element={<Navigate to="/admin/blogs" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
