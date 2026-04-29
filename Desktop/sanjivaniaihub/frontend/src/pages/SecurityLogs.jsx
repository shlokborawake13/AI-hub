import { useEffect, useState, useCallback, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';
import { useRealtime } from '../services/useRealtime';

const EVENT_TYPES = ['All', 'PAGE_VISIT', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'ADMIN_ACCESS_GRANTED', 'UNAUTHORIZED_ADMIN_ATTEMPT'];

const BADGE = {
  UNAUTHORIZED_ADMIN_ATTEMPT: 'bg-red-100 text-red-700 border border-red-200',
  ADMIN_ACCESS_GRANTED:       'bg-emerald-100 text-emerald-700 border border-emerald-200',
  PAGE_VISIT:                 'bg-blue-100 text-blue-700 border border-blue-200',
  LOGIN_SUCCESS:              'bg-amber-100 text-amber-700 border border-amber-200',
  LOGIN_FAILED:               'bg-orange-100 text-orange-700 border border-orange-200',
};

const STAT_CARDS = [
  { key: 'UNAUTHORIZED_ADMIN_ATTEMPT', label: 'Unauthorized Attempts', icon: 'gpp_bad',              color: 'text-red-600',     bg: 'bg-red-50'     },
  { key: 'LOGIN_FAILED',               label: 'Failed Logins',          icon: 'lock',                 color: 'text-orange-600',  bg: 'bg-orange-50'  },
  { key: 'LOGIN_SUCCESS',              label: 'Successful Logins',       icon: 'login',                color: 'text-amber-600',   bg: 'bg-amber-50'   },
  { key: 'ADMIN_ACCESS_GRANTED',       label: 'Admin Actions',           icon: 'admin_panel_settings', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

function parseDevice(ua = '') {
  if (!ua) return '—';
  if (/mobile/i.test(ua)) return '📱 Mobile';
  if (/tablet/i.test(ua)) return '📟 Tablet';
  return '🖥 Desktop';
}

function parseBrowser(ua = '') {
  if (!ua) return '—';
  if (/Edg\//i.test(ua))     return 'Edge';
  if (/Chrome\//i.test(ua))  return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua))  return 'Safari';
  return 'Other';
}

function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SecurityLogs() {
  const [logs, setLogs]               = useState([]);
  const [allLogs, setAllLogs]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [eventFilter, setEventFilter] = useState('All');
  const [search, setSearch]           = useState('');
  const [fromDate, setFromDate]       = useState('');
  const [toDate, setToDate]           = useState('');
  const [liveCount, setLiveCount]     = useState(0);
  const [selected, setSelected]       = useState(new Set());
  const [deleting, setDeleting]       = useState(false);
  const [confirmAll, setConfirmAll]   = useState(false);
  const searchRef = useRef(search);
  searchRef.current = search;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const params = new URLSearchParams();
      if (eventFilter !== 'All') params.set('event_type', eventFilter);
      if (search)   params.set('search', search);
      if (fromDate) params.set('from', new Date(fromDate).toISOString());
      if (toDate)   params.set('to', new Date(toDate + 'T23:59:59').toISOString());
      const data = await api.getLogs(params.toString());
      setLogs(data);
    } catch (_) {}
    setLoading(false);
  }, [eventFilter, search, fromDate, toDate]);

  const fetchAllForStats = useCallback(async () => {
    try { setAllLogs(await api.getLogs('limit=1000')); } catch (_) {}
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { fetchAllForStats(); }, [fetchAllForStats]);

  useRealtime('unauthorized_access_log', {
    onInsert: row => {
      setAllLogs(prev => [row, ...prev]);
      setLiveCount(c => c + 1);
      const matchesEvent  = eventFilter === 'All' || row.event_type === eventFilter;
      const matchesSearch = !searchRef.current ||
        row.email?.toLowerCase().includes(searchRef.current.toLowerCase()) ||
        row.ip_address?.toLowerCase().includes(searchRef.current.toLowerCase());
      if (matchesEvent && matchesSearch) setLogs(prev => [row, ...prev]);
    },
  });

  // ── Selection helpers ────────────────────────────────────────────────────
  const allSelected = logs.length > 0 && selected.size === logs.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(logs.map(l => l.id)));
    }
  }

  function toggleRow(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Delete selected ──────────────────────────────────────────────────────
  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected log${selected.size > 1 ? 's' : ''}?`)) return;
    setDeleting(true);
    try {
      await api.deleteSelectedLogs([...selected]);
      const removed = new Set(selected);
      setLogs(prev => prev.filter(l => !removed.has(l.id)));
      setAllLogs(prev => prev.filter(l => !removed.has(l.id)));
      setSelected(new Set());
    } catch (err) { alert(err.message); }
    setDeleting(false);
  }

  // ── Delete all ───────────────────────────────────────────────────────────
  async function handleDeleteAll() {
    setDeleting(true);
    try {
      await api.deleteAllLogs();
      setLogs([]);
      setAllLogs([]);
      setSelected(new Set());
      setLiveCount(0);
    } catch (err) { alert(err.message); }
    setDeleting(false);
    setConfirmAll(false);
  }

  function clearFilters() {
    setEventFilter('All'); setSearch(''); setFromDate(''); setToDate('');
  }

  const hasFilters = eventFilter !== 'All' || search || fromDate || toDate;

  const counts = STAT_CARDS.reduce((acc, c) => {
    acc[c.key] = allLogs.filter(l => l.event_type === c.key).length;
    return acc;
  }, {});

  return (
    <AdminLayout>
      {/* Confirm Delete All modal */}
      {confirmAll && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-2xl">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold text-center text-on-surface mb-2">Delete All Logs?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will permanently delete <span className="font-semibold text-red-600">all {allLogs.length} log entries</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAll(false)}
                className="flex-1 border border-slate-200 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleDeleteAll} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Deleting…</>
                  : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-semibold text-on-surface tracking-tight mb-1">Security Logs</h2>
          <p className="text-on-surface-variant text-sm">Real-time activity and access audit trail.</p>
        </div>
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {liveCount} new live
            </span>
          )}
          <button onClick={() => { fetchLogs(); fetchAllForStats(); setLiveCount(0); }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-[18px]">refresh</span>Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(c => (
          <button key={c.key}
            onClick={() => setEventFilter(prev => prev === c.key ? 'All' : c.key)}
            className={`bg-white rounded-xl p-5 shadow-sm text-left transition-all hover:shadow-md border-2 ${eventFilter === c.key ? 'border-primary' : 'border-transparent'}`}>
            <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-[20px] ${c.color}`}>{c.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{counts[c.key] ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Event Type</label>
            <select value={eventFilter} onChange={e => setEventFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-transparent">
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Search Email or IP</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[16px]">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchLogs()}
                placeholder="e.g. admin@ or 192.168..."
                className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={fetchLogs}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all">
              Apply
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-sm hover:bg-slate-50 transition-all">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Bulk action bar — shown when rows exist */}
        {!loading && logs.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
            <div className="flex items-center gap-3">
              {/* Select-all checkbox */}
              <button onClick={toggleAll}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                  ${allSelected ? 'bg-primary border-primary' : someSelected ? 'bg-primary/20 border-primary' : 'border-slate-300 bg-white hover:border-primary'}`}>
                {allSelected && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
                {someSelected && <span className="w-2 h-2 rounded-sm bg-primary block" />}
              </button>
              <span className="text-xs text-slate-500">
                {selected.size > 0
                  ? <span className="font-semibold text-slate-700">{selected.size} selected</span>
                  : `${logs.length} entries`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete Selected */}
              {selected.size > 0 && (
                <button onClick={handleDeleteSelected} disabled={deleting}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-60">
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  Delete Selected ({selected.size})
                </button>
              )}
              {/* Delete All */}
              <button onClick={() => setConfirmAll(true)} disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-all disabled:opacity-60">
                <span className="material-symbols-outlined text-[15px]">delete_forever</span>
                Delete All
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 w-10"></th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">IP Address</th>
                <th className="px-5 py-3">Device / Browser</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <span className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                      Loading logs…
                    </div>
                  </td>
                </tr>
              )}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">search_off</span>
                    No logs found{hasFilters ? ' for the current filters' : ''}.
                  </td>
                </tr>
              )}
              {!loading && logs.map(log => {
                const isSelected = selected.has(log.id);
                return (
                  <tr key={log.id}
                    onClick={() => toggleRow(log.id)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors
                      ${isSelected ? 'bg-blue-50' : log.event_type === 'UNAUTHORIZED_ADMIN_ATTEMPT' ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50'}`}>
                    {/* Checkbox cell */}
                    <td className="px-5 py-3" onClick={e => { e.stopPropagation(); toggleRow(log.id); }}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                        ${isSelected ? 'bg-primary border-primary' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <span className="material-symbols-outlined text-white text-[11px]">check</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-[180px]">
                      <div className="font-medium text-on-surface truncate">{log.name || log.email}</div>
                      {log.name && <div className="text-[11px] text-slate-400 truncate">{log.email}</div>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded
                        ${log.role === 'admin' ? 'bg-blue-50 text-blue-700' : log.role === 'guest' ? 'bg-slate-100 text-slate-500' : 'bg-purple-50 text-purple-700'}`}>
                        {log.role || 'guest'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${BADGE[log.event_type] || 'bg-slate-100 text-slate-600'}`}>
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500 max-w-[160px] truncate" title={log.path}>{log.path || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded
                        ${log.method === 'POST' ? 'bg-amber-50 text-amber-700' : log.method === 'DELETE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{log.ip_address || '—'}</td>
                    <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {parseDevice(log.user_agent)} · {parseBrowser(log.user_agent)}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{fmtTime(log.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && logs.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Showing <span className="font-semibold text-slate-600">{logs.length}</span> entries
              {selected.size > 0 && <span className="ml-2 text-primary font-semibold">· {selected.size} selected</span>}
            </span>
            {hasFilters && <span className="text-primary font-medium">Filters active</span>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
