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
  HelpCircle,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Check,
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

interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'quizzes'>('users');
  const [users, setUsers] = useState<IUserAdmin[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Quiz Manager state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [editingQuestions, setEditingQuestions] = useState<IQuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);

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
      if (data.modules && data.modules.length > 0 && !selectedModuleId) {
        setSelectedModuleId(data.modules[0]._id);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedModuleId]);

  const loadModuleQuiz = useCallback(async (moduleId: string) => {
    if (!moduleId) return;
    setQuizLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/quiz?moduleId=${moduleId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch quiz');
      }
      setEditingQuestions(data.quiz || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setQuizLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === 'quizzes' && selectedModuleId) {
      loadModuleQuiz(selectedModuleId);
    }
  }, [activeTab, selectedModuleId, loadModuleQuiz]);

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

  // Quiz editing functions
  const handleAddQuestion = () => {
    setEditingQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', ''],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setEditingQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setEditingQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], questionText: text };
      return updated;
    });
  };

  const handleOptionTextChange = (qIndex: number, oIndex: number, text: string) => {
    setEditingQuestions((prev) => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options];
      newOptions[oIndex] = text;
      updated[qIndex] = { ...updated[qIndex], options: newOptions };
      return updated;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setEditingQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...updated[qIndex].options, ''],
      };
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    setEditingQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex].options.length <= 2) return prev; // Keep at least 2 options
      const newOptions = updated[qIndex].options.filter((_, i) => i !== oIndex);
      let newCorrectIndex = updated[qIndex].correctAnswerIndex;
      if (newCorrectIndex >= newOptions.length) {
        newCorrectIndex = newOptions.length - 1;
      }
      updated[qIndex] = {
        ...updated[qIndex],
        options: newOptions,
        correctAnswerIndex: newCorrectIndex,
      };
      return updated;
    });
  };

  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    setEditingQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], correctAnswerIndex: oIndex };
      return updated;
    });
  };

  const handleSaveQuiz = async () => {
    if (!selectedModuleId) return;
    setQuizSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModuleId,
          quiz: editingQuestions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save quiz');
      }

      setSuccess(data.message || 'Quiz updated successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setQuizSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedModuleObj = modules.find((m) => m._id === selectedModuleId);

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
                Admin Governance & Quiz Portal
              </h1>
              <p className="text-xs text-slate-400">
                Manage student token access, approve module progress, and create/assign module quizzes.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                fetchUsers();
                if (selectedModuleId && activeTab === 'quizzes') {
                  loadModuleQuiz(selectedModuleId);
                }
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => {
              setActiveTab('users');
              setError('');
              setSuccess('');
            }}
            className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Student Management & Approvals</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('quizzes');
              setError('');
              setSuccess('');
            }}
            className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'quizzes'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz Management & Assignment</span>
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

        {activeTab === 'users' ? (
          <>
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
          </>
        ) : (
          /* Quiz Management Tab */
          <div className="space-y-6">
            <div className="bg-[#1B2330] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Select Target Module to Assign Quiz
                  </label>
                  <p className="text-xs text-slate-400">
                    Choose a course module to edit questions or create a new quiz test suite.
                  </p>
                </div>

                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      Module {m.order}: {m.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {quizLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs font-mono space-y-2">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading Quiz Data...</p>
              </div>
            ) : (
              <div className="bg-[#1B2330] p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <span>Quiz Questions for &quot;{selectedModuleObj?.title}&quot;</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Total Questions: {editingQuestions.length}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleAddQuestion}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Question</span>
                    </button>

                    <button
                      onClick={handleSaveQuiz}
                      disabled={quizSaving}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{quizSaving ? 'Saving Quiz...' : 'Save & Assign Quiz'}</span>
                    </button>
                  </div>
                </div>

                {editingQuestions.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs border-2 border-dashed border-slate-800 rounded-xl space-y-3">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                    <p>No questions configured for this module yet.</p>
                    <button
                      onClick={handleAddQuestion}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 inline-flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Question</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {editingQuestions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                            Question #{qIndex + 1}
                          </span>
                          <button
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-slate-400 uppercase">
                            Question Text
                          </label>
                          <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                            placeholder="Enter question text here..."
                            className="w-full px-3 py-2 bg-[#1B2330] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                          />
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-mono text-slate-400 uppercase">
                              Options (Select radio button for Correct Answer)
                            </label>
                            <button
                              onClick={() => handleAddOption(qIndex)}
                              className="text-[11px] text-indigo-400 hover:underline font-mono flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Option</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, oIndex) => {
                              const isCorrect = q.correctAnswerIndex === oIndex;
                              return (
                                <div key={oIndex} className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetCorrectOption(qIndex, oIndex)}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                      isCorrect
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'bg-slate-800 border-slate-700 text-transparent hover:border-slate-500'
                                    }`}
                                    title="Mark as correct answer"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>

                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionTextChange(qIndex, oIndex, e.target.value)
                                    }
                                    placeholder={`Option ${oIndex + 1}`}
                                    className={`flex-1 px-3 py-1.5 bg-[#1B2330] border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                      isCorrect
                                        ? 'border-emerald-500/50 bg-emerald-950/10'
                                        : 'border-slate-800'
                                    }`}
                                  />

                                  {q.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                                      className="text-slate-500 hover:text-rose-400 p-1"
                                      title="Remove option"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
