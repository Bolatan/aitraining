'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  Key,
  CheckCircle2,
  Award,
  AlertCircle,
  Search,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface IModule {
  _id: string;
  order: number;
  title: string;
  slug: string;
}

interface IProgressRecord {
  moduleId: string;
  quizPassed: boolean;
  quizScore: number;
  adminApproved: boolean;
  completed: boolean;
}

interface ICapstone {
  proposalUrl: string;
  deckUrl: string;
  infographicUrl: string;
  appUrl: string;
  submittedAt: string;
}

interface IUserAdmin {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isAuthorized: boolean;
  createdAt: string;
  completedCount: number;
  totalModules: number;
  completionPercentage: number;
  progress: IProgressRecord[];
  capstoneSubmitted: boolean;
  capstoneDetails?: ICapstone;
}

export default function AdminPage() {
  const [users, setUsers] = useState<IUserAdmin[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/users');
      if (res.status === 403) {
        window.location.href = '/dashboard';
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load admin data');
      }
      setUsers(data.users || []);
      setModules(data.modules || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleToken = async (userId: string, currentStatus: boolean) => {
    setActionLoading(`token-${userId}`);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleToken',
          userId,
          isAuthorized: !currentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      setSuccess(data.message);
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveModule = async (userId: string, moduleId: string) => {
    setActionLoading(`approve-${userId}-${moduleId}`);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approveModule',
          userId,
          moduleId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      setSuccess('Module progression approved');
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading Admin Control Panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                Admin Governance Portal
              </h1>
              <p className="text-xs text-slate-500">
                Manage student token access, inspect quiz attempts, and approve module progression.
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Table</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name or email..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing {filteredUsers.length} of {users.length} registered students
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider font-mono border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Token Status</th>
                  <th className="px-4 py-3.5">Overall Progress</th>
                  <th className="px-4 py-3.5">Module Approvals</th>
                  <th className="px-4 py-3.5">Capstone</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 flex items-center space-x-1.5">
                          <span>{u.name}</span>
                          {u.isAdmin && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {u.isAuthorized ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active Token</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[11px] inline-flex items-center space-x-1">
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>Pending Token</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-700">{u.completedCount}/{u.totalModules} done</span>
                          <span className="text-amber-700 font-bold">{u.completionPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                            style={{ width: `${u.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {modules.map((m) => {
                          const p = u.progress.find((pr) => pr.moduleId === m._id);
                          const passed = p?.quizPassed;
                          const approved = p?.adminApproved || p?.completed;

                          return (
                            <div
                              key={m._id}
                              className={`p-1 rounded text-[10px] font-mono border flex items-center space-x-1 ${
                                approved
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                  : passed
                                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                                  : 'bg-slate-100 border-slate-200 text-slate-400'
                              }`}
                              title={`${m.title}: Quiz Score ${p?.quizScore || 0}%`}
                            >
                              <span>M{m.order}</span>
                              {!approved && (
                                <button
                                  onClick={() => handleApproveModule(u.id, m._id)}
                                  disabled={actionLoading === `approve-${u.id}-${m._id}`}
                                  className="ml-1 px-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition-colors"
                                  title="Click to approve module progression"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {u.capstoneSubmitted ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[10px] flex items-center space-x-1 w-fit">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Submitted</span>
                          </span>
                          {u.capstoneDetails?.appUrl && (
                            <a
                              href={u.capstoneDetails.appUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-indigo-600 hover:underline flex items-center space-x-1 font-mono"
                            >
                              <span>Live App</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Not submitted</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleToggleToken(u.id, u.isAuthorized)}
                        disabled={actionLoading === `token-${u.id}`}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors border ${
                          u.isAuthorized
                            ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                        }`}
                      >
                        {u.isAuthorized ? 'Revoke Access' : 'Grant Course Token'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
