'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Video,
  MessageSquare,
  Clock,
  Plus,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  Search,
  CalendarDays,
  List,
} from 'lucide-react';

interface IUserContact {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isAuthorized: boolean;
}

interface ISession {
  _id: string;
  title: string;
  description?: string;
  studentId: { _id: string; name: string; email: string };
  adminId: { _id: string; name: string; email: string };
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  roomId: string;
  createdAt: string;
}

interface IMessage {
  _id: string;
  sessionId?: string;
  roomId?: string;
  senderId: { _id: string; name: string; email: string; isAdmin: boolean };
  receiverId?: { _id: string; name: string; email: string; isAdmin: boolean };
  content: string;
  createdAt: string;
}

export default function SessionsPage() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isAuthorized: boolean;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'calendar' | 'messages'>('calendar');
  const [calendarViewMode, setCalendarViewMode] = useState<'grid' | 'list'>('grid');

  // Sessions and contacts data
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [contacts, setContacts] = useState<IUserContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calendar Date Navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal State for Scheduling
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    studentId: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
  });
  const [scheduling, setScheduling] = useState(false);

  // Direct Messaging State
  const [selectedContact, setSelectedContact] = useState<IUserContact | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user and contacts
  const fetchAuthAndContacts = useCallback(async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        window.location.href = '/login';
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);

      const contactsRes = await fetch('/api/contacts');
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
        if (contactsData.contacts && contactsData.contacts.length > 0 && !selectedContact) {
          setSelectedContact(contactsData.contacts[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedContact]);

  // Fetch Sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  }, []);

  // Fetch Messages for Direct Chat
  const fetchDirectMessages = useCallback(async (contactId: string) => {
    if (!contactId) return;
    try {
      const res = await fetch(`/api/messages?partnerId=${contactId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, []);

  useEffect(() => {
    fetchAuthAndContacts();
    fetchSessions();
  }, [fetchAuthAndContacts, fetchSessions]);

  useEffect(() => {
    if (activeTab === 'messages' && selectedContact) {
      fetchDirectMessages(selectedContact._id);
      const interval = setInterval(() => {
        fetchDirectMessages(selectedContact._id);
      }, 3000); // Poll every 3 seconds for active direct messaging
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedContact, fetchDirectMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Schedule Session Handler
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.studentId || !scheduleData.title || !scheduleData.date) {
      setError('Please fill in all required fields');
      return;
    }

    setScheduling(true);
    setError('');
    setSuccess('');

    try {
      const startIso = new Date(`${scheduleData.date}T${scheduleData.startTime}`).toISOString();
      const endIso = new Date(`${scheduleData.date}T${scheduleData.endTime}`).toISOString();

      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: scheduleData.studentId,
          title: scheduleData.title,
          description: scheduleData.description,
          startTime: startIso,
          endTime: endIso,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule session');
      }

      setSuccess('Session scheduled successfully!');
      setShowScheduleModal(false);
      setScheduleData({
        studentId: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
      });
      fetchSessions();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdateStatus = async (sessionId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, status: newStatus }),
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel and remove this scheduled session?')) return;
    try {
      const res = await fetch(`/api/sessions?id=${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Direct Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedContact) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedContact._id,
          content: newMessageText,
        }),
      });

      if (res.ok) {
        setNewMessageText('');
        fetchDirectMessages(selectedContact._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const selectedDateSessions = sessions.filter((s) => {
    const sDate = new Date(s.startTime);
    return (
      sDate.getFullYear() === selectedDate.getFullYear() &&
      sDate.getMonth() === selectedDate.getMonth() &&
      sDate.getDate() === selectedDate.getDate()
    );
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Ongoing Live</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 text-[10px] font-bold">
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading Sessions Portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                Live Video Meetings & Calendaring
              </h1>
              <p className="text-xs text-slate-500">
                Schedule 1-on-1 mentoring sessions, join live video meeting rooms, and text message in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {currentUser?.isAdmin && (
              <button
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setShowScheduleModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Session</span>
              </button>
            )}

            <button
              onClick={() => {
                fetchSessions();
                if (selectedContact) fetchDirectMessages(selectedContact._id);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'calendar'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar & Schedule ({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'messages'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Text Messaging</span>
          </button>
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

        {/* TAB 1: CALENDAR & SCHEDULED MEETINGS */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCalendarViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    calendarViewMode === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Month Calendar Grid</span>
                </button>
                <button
                  onClick={() => setCalendarViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    calendarViewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-mono">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {calendarViewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View Grid */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleToday}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Days of week */}
                  <div className="grid grid-cols-7 text-center font-mono text-[11px] font-bold text-slate-500 uppercase py-1">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Calendar cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Previous month padding days */}
                    {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                      <div
                        key={`prev-${idx}`}
                        className="min-h-16 p-1.5 bg-slate-50 rounded-lg text-slate-300 text-xs font-mono select-none"
                      >
                        {prevMonthDays - firstDayOfMonth + idx + 1}
                      </div>
                    ))}

                    {/* Current month days */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayNumber = idx + 1;
                      const dateObj = new Date(year, month, dayNumber);
                      const isToday =
                        new Date().toDateString() === dateObj.toDateString();
                      const isSelected =
                        selectedDate.toDateString() === dateObj.toDateString();

                      const daySessions = sessions.filter((s) => {
                        const sDate = new Date(s.startTime);
                        return (
                          sDate.getFullYear() === year &&
                          sDate.getMonth() === month &&
                          sDate.getDate() === dayNumber
                        );
                      });

                      return (
                        <div
                          key={`day-${dayNumber}`}
                          onClick={() => setSelectedDate(dateObj)}
                          className={`min-h-20 p-1.5 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-600 shadow-2xs ring-1 ring-indigo-500/30'
                              : isToday
                              ? 'bg-amber-50/80 border-amber-400 text-slate-900'
                              : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-mono text-xs font-bold ${
                                isToday ? 'text-amber-700' : 'text-slate-700'
                              }`}
                            >
                              {dayNumber}
                            </span>
                            {daySessions.length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            )}
                          </div>

                          <div className="space-y-1 mt-1">
                            {daySessions.slice(0, 2).map((s) => (
                              <div
                                key={s._id}
                                className={`text-[10px] p-1 rounded font-medium truncate ${
                                  s.status === 'ongoing'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                }`}
                              >
                                {s.title}
                              </div>
                            ))}
                            {daySessions.length > 2 && (
                              <p className="text-[9px] font-mono text-slate-500">
                                +{daySessions.length - 2} more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day details panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs flex flex-col">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-base">
                        {selectedDate.toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {selectedDateSessions.length} session(s) scheduled
                      </p>
                    </div>

                    {currentUser?.isAdmin && (
                      <button
                        onClick={() => {
                          setScheduleData((prev) => ({
                            ...prev,
                            date: selectedDate.toISOString().split('T')[0],
                          }));
                          setShowScheduleModal(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px]">
                    {selectedDateSessions.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-mono space-y-2">
                        <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                        <p>No sessions scheduled for this date.</p>
                      </div>
                    ) : (
                      selectedDateSessions.map((s) => (
                        <div
                          key={s._id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-slate-900 text-xs">{s.title}</h4>
                            {getStatusBadge(s.status)}
                          </div>

                          {s.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {s.description}
                            </p>
                          )}

                          <div className="space-y-1 text-[11px] text-slate-700 font-mono pt-1">
                            <div className="flex items-center space-x-1.5 text-slate-600">
                              <Clock className="w-3 h-3 text-indigo-600" />
                              <span>
                                {new Date(s.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(s.endTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5 text-slate-600">
                              <UserIcon className="w-3 h-3 text-emerald-600" />
                              <span>Student: {s.studentId?.name || 'N/A'}</span>
                            </div>

                            <div className="flex items-center space-x-1.5 text-slate-600">
                              <UserIcon className="w-3 h-3 text-amber-600" />
                              <span>Mentor: {s.adminId?.name || 'Instructor'}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                            <Link
                              href={`/sessions/${s._id}`}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Room</span>
                            </Link>

                            {currentUser?.isAdmin && (
                              <button
                                onClick={() => handleCancelSession(s._id)}
                                className="text-[10px] text-rose-600 hover:text-rose-700 font-mono hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* List Schedule View */
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    Scheduled Sessions Schedule ({filteredSessions.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {filteredSessions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-mono">
                      No sessions found matching filters.
                    </div>
                  ) : (
                    filteredSessions.map((s) => (
                      <div
                        key={s._id}
                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
                            {getStatusBadge(s.status)}
                          </div>

                          {s.description && (
                            <p className="text-xs text-slate-600">{s.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
                            <span className="flex items-center space-x-1 text-slate-600">
                              <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                              <span>
                                {new Date(s.startTime).toLocaleDateString([], {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>

                            <span className="flex items-center space-x-1 text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>
                                {new Date(s.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(s.endTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </span>

                            <span className="flex items-center space-x-1 text-slate-600">
                              <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Student: {s.studentId?.name || 'Student'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto justify-end">
                          {currentUser?.isAdmin && s.status === 'scheduled' && (
                            <button
                              onClick={() => handleUpdateStatus(s._id, 'ongoing')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 text-xs font-semibold transition-colors"
                            >
                              Start Meeting
                            </button>
                          )}

                          <Link
                            href={`/sessions/${s._id}`}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            <span>Join Video & Chat</span>
                          </Link>

                          {currentUser?.isAdmin && (
                            <button
                              onClick={() => handleCancelSession(s._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Cancel Session"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIRECT TEXT MESSAGING */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px] shadow-xs">
            {/* Contacts Sidebar */}
            <div className="border-r border-slate-200 p-4 space-y-4 bg-slate-50/50">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Conversations
                </h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search contacts..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[450px]">
                {filteredContacts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center font-mono">
                    No contacts found.
                  </p>
                ) : (
                  filteredContacts.map((c) => {
                    const isSelected = selectedContact?._id === c._id;
                    return (
                      <button
                        key={c._id}
                        onClick={() => setSelectedContact(c)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold truncate flex items-center space-x-1">
                              <span>{c.name}</span>
                              {c.isAdmin && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded border border-amber-300 font-semibold">
                                  Instructor
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              {c.email}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div className="md:col-span-2 flex flex-col justify-between bg-white">
              {selectedContact ? (
                <>
                  {/* Chat Topbar */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        {selectedContact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-xs flex items-center space-x-1.5">
                          <span>{selectedContact.name}</span>
                          {selectedContact.isAdmin && (
                            <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 font-semibold">
                              Admin Instructor
                            </span>
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {selectedContact.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[400px]">
                    {messages.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs font-mono space-y-2">
                        <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                        <p>No text messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.senderId?._id === currentUser?.id;
                        return (
                          <div
                            key={m._id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center space-x-1 mb-1 px-1">
                              <span className="text-[10px] text-slate-500 font-semibold">
                                {m.senderId?.name}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-indigo-600 text-white rounded-br-none shadow-2xs'
                                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                              }`}
                            >
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder={`Message ${selectedContact.name}...`}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessageText.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="m-auto text-center text-slate-400 text-xs font-mono py-12">
                  Select a contact from the sidebar to view direct messages.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Session Modal for Admins */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  <span>Schedule Mentoring Session</span>
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                    Select Student *
                  </label>
                  <select
                    value={scheduleData.studentId}
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, studentId: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Student --</option>
                    {contacts.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={scheduleData.title}
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. 1-on-1 Code Review & Mentorship"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                    Description / Agenda
                  </label>
                  <textarea
                    value={scheduleData.description}
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Topics to discuss, preparation instructions..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={scheduleData.startTime}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={scheduleData.endTime}
                      onChange={(e) =>
                        setScheduleData((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                  >
                    {scheduling ? 'Scheduling...' : 'Confirm & Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
