'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, ShieldCheck, LogOut, Key, CheckCircle, LayoutDashboard, Award, Calendar } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean; isAuthorized: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.authenticated) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    };

    checkAuth();

    window.addEventListener('user-updated', checkAuth);
    return () => {
      window.removeEventListener('user-updated', checkAuth);
    };
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-[#1B2330] border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block">
                Deploy Web Apps
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono tracking-wider uppercase">
                Absolute Beginners
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Curriculum
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    pathname.startsWith('/dashboard') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/capstone"
                  className={`text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    pathname.startsWith('/capstone') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Capstone</span>
                </Link>

                <Link
                  href="/sessions"
                  className={`text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    pathname.startsWith('/sessions') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Sessions & Meet</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={`text-sm font-medium px-2.5 py-1 rounded-md border text-amber-300 border-amber-500/30 bg-amber-500/10 flex items-center space-x-1.5 hover:bg-amber-500/20 transition-colors ${
                      pathname.startsWith('/admin') ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className="text-[11px] text-slate-400 flex items-center justify-end space-x-1">
                    {user.isAuthorized ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" /> Token Active
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center space-x-1">
                        <Key className="w-3 h-3" /> Token Pending
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors"
                >
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
