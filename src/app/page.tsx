import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Monitor,
  FileSpreadsheet,
  MessageSquare,
  Palette,
  Rocket,
  Shield,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      num: 1,
      title: 'Windows 11 Fundamentals',
      accent: '#5C4A72',
      accentName: 'Plum',
      bgClass: 'bg-[#5C4A72]/20 border-[#5C4A72]/40',
      badgeBg: 'bg-[#5C4A72]',
      icon: Monitor,
      desc: 'Master OS navigation, Taskbar, File Explorer, Quick Settings, and essential Windows 11 keyboard shortcuts.',
      time: '~2 hrs',
    },
    {
      num: 2,
      title: 'Office Foundations',
      accent: '#2E5C8A',
      accentName: 'Blue',
      bgClass: 'bg-[#2E5C8A]/20 border-[#2E5C8A]/40',
      badgeBg: 'bg-[#2E5C8A]',
      icon: FileSpreadsheet,
      desc: 'Draft PRDs in Word with Styles, construct budgets in Excel with SUM/XLOOKUP, and build PowerPoint pitch decks.',
      time: '~5 hrs',
    },
    {
      num: 3,
      title: 'Drafting with Claude',
      accent: '#A85A2A',
      accentName: 'Copper',
      bgClass: 'bg-[#A85A2A]/20 border-[#A85A2A]/40',
      badgeBg: 'bg-[#A85A2A]',
      icon: MessageSquare,
      desc: 'Prompt engineering principles, drafting loop (brief → outline → draft → refine), and converting AI copy into Word/PPT.',
      time: '1.25 hrs',
    },
    {
      num: 4,
      title: 'Designing Infographics',
      accent: '#96721F',
      accentName: 'Gold',
      bgClass: 'bg-[#96721F]/20 border-[#96721F]/40',
      badgeBg: 'bg-[#96721F]',
      icon: Palette,
      desc: 'Create clear infographic briefs, generate visuals in ChatGPT, fact-check data labels, and embed into proposal docs.',
      time: '45 mins',
    },
    {
      num: 5,
      title: 'Building & Deploying',
      accent: '#3F6249',
      accentName: 'Sage',
      bgClass: 'bg-[#3F6249]/20 border-[#3F6249]/40',
      badgeBg: 'bg-[#3F6249]',
      icon: Rocket,
      desc: 'Agentic AI & vibe coding pipeline: Bolt prototype → MongoDB Atlas → GitHub → Vercel Hobby → Google Jules agent tasks.',
      time: '3 hrs',
    },
    {
      num: 6,
      title: 'Cybersecurity Principles',
      accent: '#1E3A8A',
      accentName: 'Navy',
      bgClass: 'bg-[#1E3A8A]/20 border-[#1E3A8A]/40',
      badgeBg: 'bg-[#1E3A8A]',
      icon: Shield,
      desc: 'Governance, risk management, CIA triad, frameworks (NIST CSF, Zero Trust), and practical security operations.',
      time: '1.5 hrs',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1B2330] via-[#1B2330]/90 to-[#0F172A] pt-20 pb-24 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Structured Path for Absolute Beginners</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Deploy Websites and Applications for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">
              Absolute Beginners
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Windows 11 — Word, PowerPoint & Excel — Claude prompting, ChatGPT infographics, vibe coding with Bolt/GitHub/Vercel, and Cybersecurity Principles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In to Portal</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80 text-left">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-bold text-white block">6</span>
              <span className="text-xs text-slate-400">Core Modules</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-bold text-amber-400 block">1</span>
              <span className="text-xs text-slate-400">Capstone Project</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-bold text-emerald-400 block">~14 hrs</span>
              <span className="text-xs text-slate-400">Total, Self-Paced</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-bold text-purple-400 block">$0</span>
              <span className="text-xs text-slate-400">Everything Has a Free Tier</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Principles */}
      <section className="py-12 bg-[#1B2330]/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 text-center mb-6">How this course works</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">1</div>
              <h4 className="font-serif font-bold text-sm text-white">Connected end-to-end flow</h4>
              <p className="text-xs text-slate-400">Each module&apos;s output builds into the next — proposal &rarr; infographic &rarr; deck &rarr; application &rarr; cybersecurity governance.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">2</div>
              <h4 className="font-serif font-bold text-sm text-white">Built for beginners</h4>
              <p className="text-xs text-slate-400">No prior experience assumed beyond knowing how to turn a computer on.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">3</div>
              <h4 className="font-serif font-bold text-sm text-white">Practical AI skills</h4>
              <p className="text-xs text-slate-400">Prompt engineering, agentic AI and vibe coding are taught as you use them — not as separate theory.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">4</div>
              <h4 className="font-serif font-bold text-sm text-white">Tools change fast</h4>
              <p className="text-xs text-slate-400">AI product interfaces shift often — this course flags where to check what&apos;s current.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">5</div>
              <h4 className="font-serif font-bold text-sm text-white">Online only</h4>
              <p className="text-xs text-slate-400">Everything runs in a browser or on your own PC — self-paced and flexible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Roadmap Graphic */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            The Beginner Learning Roadmap
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Each module hands its output to the next: proposal &rarr; infographic &rarr; pitch deck &rarr; application &rarr; security governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative mb-12">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.num}
                className={`p-5 rounded-xl border ${step.bgClass} flex flex-col justify-between transition-transform hover:-translate-y-1 relative group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-8 h-8 rounded-full ${step.badgeBg} text-white font-bold text-xs flex items-center justify-center shadow-md`}
                    >
                      {step.num}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700">
                      {step.time}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <StepIcon className="w-5 h-5 text-white/90" />
                    <h3 className="font-serif font-semibold text-white text-base leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Quiz + Auth</span>
                  </span>
                  <span className="font-mono text-slate-400">{step.accentName}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Capstone & Toolkit Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1B2330] via-indigo-950/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 mb-3">
                  <Award className="w-3.5 h-3.5" /> Capstone Project
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  Ship a Proposal-Backed Application
                </h3>
                <p className="text-sm text-slate-300 max-w-xl">
                  Combine all course modules into one deliverable: a small application idea, pitched properly with a Word proposal, PowerPoint deck, ChatGPT infographic, cybersecurity considerations, and deployed live on Vercel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Deliverable 1</span>
                <span className="font-medium text-slate-200">Proposal Doc</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Deliverable 2</span>
                <span className="font-medium text-slate-200">Pitch Deck</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Deliverable 3</span>
                <span className="font-medium text-slate-200">Infographic Link</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Deliverable 4</span>
                <span className="font-medium font-mono text-emerald-400">Live App URL</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#1B2330] border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mb-3">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Reference Toolkit
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Course Toolkit Summary
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Reference table covering Windows 11, MS Office, Claude, ChatGPT, Bolt, MongoDB Atlas, Cybersecurity Principles, GitHub, Vercel Hobby, and Google Jules.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span>Vercel + MongoDB Atlas</span>
                <span className="text-emerald-400 font-semibold">$0 Free Tier</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Google Jules Agent</span>
                <span className="text-indigo-300 font-semibold">Free Tier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Control & Governance Features */}
      <section className="py-16 bg-[#1B2330] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">
                  Token Gated Access
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Students can self-register anytime. Accessing course content requires instructor token authorization.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">
                  Quiz & Admin Progression
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To move between modules, students pass end-of-module quizzes and receive instructor authorization.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white mb-1">
                  Instructor Admin Control
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated admin portal to manage token access, review quiz scores, and approve student completions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#0F172A] border-t border-slate-800 text-center text-xs text-slate-500">
        <p>Deploy Websites and Applications for Absolute Beginners &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
