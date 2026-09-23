'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  Award,
  FileText,
  Presentation,
  Image as ImageIcon,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function CapstonePage() {
  const [proposalUrl, setProposalUrl] = useState('');
  const [deckUrl, setDeckUrl] = useState('');
  const [infographicUrl, setInfographicUrl] = useState('');
  const [appUrl, setAppUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/capstone')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.submission) {
          setProposalUrl(data.submission.proposalUrl || '');
          setDeckUrl(data.submission.deckUrl || '');
          setInfographicUrl(data.submission.infographicUrl || '');
          setAppUrl(data.submission.appUrl || '');
          setIsSubmitted(true);
          setSubmittedAt(data.submission.submittedAt);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/capstone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalUrl,
          deckUrl,
          infographicUrl,
          appUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit capstone');
      }

      setIsSubmitted(true);
      setSubmittedAt(data.submission.submittedAt);
      setSuccess('Capstone project submitted successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading Capstone Portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-3">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Final Project Submission
              </div>
              <h1 className="font-serif text-3xl font-bold text-slate-900">
                Capstone Submission Form
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Submit all four project deliverables to finalize your course portfolio.
              </p>
            </div>

            {isSubmitted && (
              <div className="shrink-0">
                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Capstone Submitted</span>
                </div>
                {submittedAt && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1 text-right">
                    {new Date(submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>1. Word Project Proposal Document URL</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Module 2 Deliverable
                </span>
              </label>
              <input
                type="url"
                required
                value={proposalUrl}
                onChange={(e) => setProposalUrl(e.target.value)}
                placeholder="https://docs.google.com/document/d/... or OneDrive link"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Presentation className="w-4 h-4 text-purple-600" />
                  <span>2. PowerPoint Pitch Deck Presentation URL</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Module 2 Deliverable
                </span>
              </label>
              <input
                type="url"
                required
                value={deckUrl}
                onChange={(e) => setDeckUrl(e.target.value)}
                placeholder="https://slides.google.com/... or Canva link"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>3. ChatGPT Architecture Infographic Link</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Module 4 Deliverable
                </span>
              </label>
              <input
                type="url"
                required
                value={infographicUrl}
                onChange={(e) => setInfographicUrl(e.target.value)}
                placeholder="https://github.com/user/repo/blob/main/infographic.svg or image link"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>4. Live Vercel Deployed Web Application URL</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Module 5 Deliverable
                </span>
              </label>
              <input
                type="url"
                required
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                placeholder="https://my-capstone-app.vercel.app"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400 font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/dashboard"
                className="text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                &larr; Back to Dashboard
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Saving Submission...</span>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>{isSubmitted ? 'Update Capstone Deliverables' : 'Submit Capstone Project'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {isSubmitted && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Submitted Deliverables Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={proposalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-blue-700 flex items-center justify-between"
                >
                  <span className="truncate">Proposal Doc</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                </a>
                <a
                  href={deckUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-purple-700 flex items-center justify-between"
                >
                  <span className="truncate">Pitch Deck</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                </a>
                <a
                  href={infographicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-amber-800 flex items-center justify-between"
                >
                  <span className="truncate">Infographic Graphic</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                </a>
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-emerald-800 font-mono flex items-center justify-between"
                >
                  <span className="truncate">Live Vercel App</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
