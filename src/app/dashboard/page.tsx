'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  HelpCircle,
  Lightbulb,
  Check,
  AlertCircle,
  Key,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface ILesson {
  tag: string;
  heading: string;
  body: string;
}

interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface IModule {
  _id: string;
  order: number;
  slug: string;
  title: string;
  accentColor: string;
  estMinutes: number;
  objectives: string[];
  lessons: ILesson[];
  exercise: string;
  tip: string;
  quiz: IQuizQuestion[];
  isCapstone?: boolean;
  isToolkit?: boolean;
}

interface IProgressRecord {
  moduleId: string;
  quizPassed: boolean;
  quizScore: number;
  adminApproved: boolean;
  completed: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isAuthorized: boolean;
  } | null>(null);
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, IProgressRecord>>({});
  const [loading, setLoading] = useState(true);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{
    submitted: boolean;
    passed: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [authTokenInput, setAuthTokenInput] = useState('');
  const [submittingToken, setSubmittingToken] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [tokenSuccess, setTokenSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        window.location.href = '/login';
        return;
      }
      const authData = await authRes.json();
      setUser(authData.user);

      const modulesRes = await fetch('/api/modules');
      const modulesData = await modulesRes.json();
      setModules(modulesData.modules || []);

      if (modulesData.modules && modulesData.modules.length > 0) {
        setSelectedSlug(modulesData.modules[0].slug);
      }

      if (authData.user.isAuthorized || authData.user.isAdmin) {
        const progRes = await fetch('/api/progress');
        if (progRes.ok) {
          const progData = await progRes.json();
          const progMap: Record<string, IProgressRecord> = {};
          (progData.progress || []).forEach((p: IProgressRecord) => {
            progMap[p.moduleId] = p;
          });
          setProgress(progMap);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedModule = modules.find((m) => m.slug === selectedSlug);
  const selectedProgress = selectedModule ? progress[selectedModule._id] : undefined;

  const totalSections = modules.filter((m) => !m.isToolkit).length;
  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const progressPercent = totalSections > 0 ? Math.min(100, Math.round((completedCount / totalSections) * 100)) : 0;

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authTokenInput.trim()) return;

    setSubmittingToken(true);
    setTokenError('');
    setTokenSuccess('');

    try {
      const res = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authTokenInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authorize token');
      }

      setTokenSuccess(data.message || 'Authorization token accepted!');
      if (user) {
        setUser({ ...user, isAuthorized: true });
      }
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTokenError(err.message);
      }
    } finally {
      setSubmittingToken(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedModule) return;
    setSubmittingQuiz(true);
    setActionError('');
    setActionSuccess('');

    try {
      const answerArray = selectedModule.quiz.map((_, idx) => quizAnswers[idx] ?? -1);

      const res = await fetch('/api/progress/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule._id,
          answers: answerArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quiz');
      }

      setQuizResult({
        submitted: true,
        passed: data.passed,
        score: data.score,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions,
      });

      setProgress((prev) => ({
        ...prev,
        [selectedModule._id]: data.progress,
      }));

      if (data.passed) {
        setActionSuccess('Quiz passed with 100%! Great job.');
      } else {
        setActionError(`Score: ${data.score}%. You need 100% to pass. Review the lessons and try again!`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message);
      }
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedModule) return;
    setActionError('');
    setActionSuccess('');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule._id,
          markComplete: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update module completion');
      }

      setProgress((prev) => ({
        ...prev,
        [selectedModule._id]: data.progress,
      }));

      setActionSuccess('Module marked as completed!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400 font-mono">Loading Course Portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="bg-[#1B2330] border-b border-slate-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-white leading-tight">
                Course Progress
              </h1>
              <p className="text-xs text-slate-400">
                {completedCount} of {totalSections} sections completed ({progressPercent}%)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-80 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Overall Completion</span>
              <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-80 shrink-0 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
            <span>Modules & Roadmap</span>
            <span className="text-[10px] font-mono text-slate-500">{modules.length} Items</span>
          </div>

          <div className="space-y-1.5">
            {modules.map((m) => {
              const isSelected = m.slug === selectedSlug;
              const p = progress[m._id];
              const isDone = p?.completed;
              const isQuizDone = p?.quizPassed;

              return (
                <button
                  key={m._id}
                  onClick={() => {
                    setSelectedSlug(m.slug);
                    setQuizAnswers({});
                    setQuizResult(null);
                    setActionError('');
                    setActionSuccess('');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#1B2330] border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/50 hover:bg-[#1B2330]/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: m.accentColor }}
                    >
                      {m.isCapstone ? 'C' : m.isToolkit ? 'T' : m.order}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {m.title}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{m.estMinutes} mins</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isQuizDone ? (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                        Quiz Done
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/capstone"
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 flex items-center justify-between transition-colors block text-xs font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Capstone Submission Portal</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>

        <main className="flex-1 bg-[#1B2330] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          {!user?.isAuthorized && !user?.isAdmin ? (
            <div className="my-auto py-12 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Key className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Token Access Required
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-3">
                  Course Authorization Pending
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Students can self-register and view the dashboard roadmap, but accessing module content requires an authorization token granted by the instructor or administrator.
                </p>
              </div>

              <form onSubmit={handleTokenSubmit} className="space-y-4 text-left bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
                <label htmlFor="token-input" className="block text-xs font-semibold text-slate-300">
                  Enter Authorization Token
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="token-input"
                    type="text"
                    value={authTokenInput}
                    onChange={(e) => setAuthTokenInput(e.target.value)}
                    placeholder="Enter course authorization token..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingToken || !authTokenInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    {submittingToken ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Submit Token</span>
                      </>
                    )}
                  </button>
                </div>

                {tokenError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{tokenError}</span>
                  </div>
                )}

                {tokenSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{tokenSuccess}</span>
                  </div>
                )}
              </form>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-left space-y-2 font-mono">
                <p className="text-slate-300 font-semibold font-sans">How to activate access:</p>
                <p>1. Enter your authorization token granted by the instructor in the field above.</p>
                <p>2. Click &quot;Submit Token&quot; to unlock all course module contents &amp; quizzes.</p>
              </div>
            </div>
          ) : !selectedModule ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Select a module from the sidebar to view lessons.
            </div>
          ) : (
            <div className="space-y-8">
              <div
                className="p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{
                  backgroundColor: `${selectedModule.accentColor}1A`,
                  borderColor: `${selectedModule.accentColor}50`,
                }}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: selectedModule.accentColor }}
                    >
                      {selectedModule.isCapstone
                        ? 'Capstone'
                        : selectedModule.isToolkit
                        ? 'Toolkit'
                        : `Module ${selectedModule.order}`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Est. {selectedModule.estMinutes} mins</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {selectedModule.title}
                  </h2>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {selectedProgress?.completed ? (
                    <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Section Completed</span>
                    </span>
                  ) : selectedProgress?.quizPassed ? (
                    <span className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Quiz Passed (Awaiting Admin Approval)</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {actionError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{actionError}</span>
                </div>
              )}
              {actionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {selectedModule.objectives && selectedModule.objectives.length > 0 && (
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Learning Objectives</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedModule.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2">
                  Lessons & Walkthrough
                </h3>

                {selectedModule.lessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        {lesson.tag}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {lesson.heading}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 whitespace-pre-line">
                      {lesson.body}
                    </p>
                  </div>
                ))}
              </div>

              {selectedModule.exercise && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Practical Exercise</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {selectedModule.exercise}
                  </p>
                </div>
              )}

              {selectedModule.tip && (
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-amber-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Pro Tip</span>
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed">{selectedModule.tip}</p>
                </div>
              )}

              {selectedModule.quiz && selectedModule.quiz.length > 0 && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white flex items-center space-x-2">
                        <span>Module Knowledge Quiz</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Must achieve 100% score to pass and qualify for section completion.
                      </p>
                    </div>

                    {selectedProgress?.quizPassed && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Passed ({selectedProgress.quizScore}%)</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {selectedModule.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-3">
                        <p className="text-xs sm:text-sm font-semibold text-slate-200">
                          {qIdx + 1}. {q.questionText}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = quizAnswers[qIdx] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <span>{opt}</span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'border-indigo-400 bg-indigo-500 text-white'
                                      : 'border-slate-600'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={submittingQuiz}
                      className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
                    >
                      {submittingQuiz ? 'Evaluating Answers...' : 'Submit Quiz Answers'}
                    </button>

                    {quizResult && (
                      <span
                        className={`text-xs font-bold font-mono ${
                          quizResult.passed ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        Score: {quizResult.score}% ({quizResult.correctCount}/{quizResult.totalQuestions})
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>Progression criteria: </span>
                  <span className="font-semibold text-slate-300">
                    Quiz Passed ({selectedProgress?.quizPassed ? 'Yes' : 'No'}) & Admin Approved (
                    {selectedProgress?.adminApproved || user?.isAdmin ? 'Yes' : 'Pending'})
                  </span>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={selectedProgress?.completed}
                  className={`px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2 ${
                    selectedProgress?.completed
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedProgress?.completed ? 'Section Completed' : 'Mark Complete'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
