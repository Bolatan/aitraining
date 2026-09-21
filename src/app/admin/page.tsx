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
  Copy,
  Check,
  Plus,
  Trash2,
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

interface IAuthTokenAdmin {
  _id: string;
  code: string;
  createdAt: string;
  isUsed: boolean;
  usedBy?: { name: string; email: string };
  usedAt?: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<IUserAdmin[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [tokens, setTokens] = useState<IAuthTokenAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [customTokenInput, setCustomTokenInput] = useState('');
  const [generatingToken, setGeneratingToken] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tokens');
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
    }
  }, []);

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
    fetchTokens();
  }, [fetchUsers, fetchTokens]);

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

  const handleGenerateToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGeneratingToken(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customCode: customTokenInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate token');
      }

      setSuccess(data.message);
      setCustomTokenInput('');
      fetchTokens();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId }),
      });
      if (res.ok) {
        fetchTokens();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyToken = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400 font-mono">Loading Admin Control Panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-[#1B2330] p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">
                Admin Governance Portal
              </h1>
              <p className="text-xs text-slate-400">
                Manage student token access, generate course tokens, inspect quiz attempts, and approve module progression.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchUsers();
              fetchTokens();
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh All</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* TOKEN GENERATOR & MANAGEMENT SECTION */}
        <div className="bg-[#1B2330] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">
                  Course Authorization Token Generator
                </h2>
                <p className="text-xs text-slate-400">
                  Generate tokens for students to unlock module access on their dashboard.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateToken} className="flex items-center gap-2">
              <input
                type="text"
                value={customTokenInput}
                onChange={(e) => setCustomTokenInput(e.target.value)}
                placeholder="Custom token code (optional)"
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
              />
              <button
                type="submit"
                disabled={generatingToken}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{generatingToken ? 'Generating...' : 'Generate Token'}</span>
              </button>
            </form>
          </div>

          {tokens.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic text-center py-4">
              No authorization tokens generated yet. Click &quot;Generate Token&quot; above to create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tokens.map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2 relative group hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-indigo-300 tracking-wider">
                      {t.code}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCopyToken(t.code, t._id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copy token to clipboard"
                      >
                        {copiedTokenId === t._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteToken(t._id)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-500 transition-colors"
                        title="Delete token"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono flex items-center justify-between">
                    {t.isUsed ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Used by {t.usedBy?.name || 'Student'}
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Active / Unused
                      </span>
                    )}
                    <span className="text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredUsers.length} of {users.length} registered students
          </div>
        </div>

        <div className="bg-[#1B2330] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Token Status</th>
                  <th className="px-4 py-3.5">Overall Progress</th>
                  <th className="px-4 py-3.5">Module Approvals</th>
                  <th className="px-4 py-3.5">Capstone</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-white flex items-center space-x-1.5">
                          <span>{u.name}</span>
                          {u.isAdmin && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {u.isAuthorized ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Active Token</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[11px] inline-flex items-center space-x-1">
                          <Key className="w-3 h-3 text-amber-400" />
                          <span>Pending Token</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-300">{u.completedCount}/{u.totalModules} done</span>
                          <span className="text-amber-400 font-bold">{u.completionPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
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
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : passed
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
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
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
                            <Award className="w-3 h-3 text-emerald-400" />
                            <span>Submitted</span>
                          </span>
                          {u.capstoneDetails?.appUrl && (
                            <a
                              href={u.capstoneDetails.appUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-indigo-400 hover:underline flex items-center space-x-1 font-mono"
                            >
                              <span>Live App</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-mono">Not submitted</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleToggleToken(u.id, u.isAuthorized)}
                        disabled={actionLoading === `token-${u.id}`}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors border ${
                          u.isAuthorized
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm'
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
