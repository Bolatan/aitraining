'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Send,
  MessageSquare,
  Users,
  Clock,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

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
}

interface IMessage {
  _id: string;
  sessionId?: string;
  roomId?: string;
  senderId: { _id: string; name: string; email: string; isAdmin: boolean };
  content: string;
  createdAt: string;
}

interface ISignalData {
  _id: string;
  roomId: string;
  senderId: string;
  type: 'offer' | 'answer' | 'candidate';
  data: string;
  createdAt: string;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  } | null>(null);

  const [session, setSession] = useState<ISession | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // WebRTC & Media States
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const processedSignalsRef = useRef<Set<string>>(new Set());

  // ICE Servers Configuration
  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Fetch Current User and Session Data
  const fetchRoomData = useCallback(async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        window.location.href = '/login';
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);

      const sessionRes = await fetch(`/api/sessions?id=${sessionId}`);
      if (!sessionRes.ok) {
        throw new Error('Session not found or unavailable');
      }
      const sessionData = await sessionRes.json();
      setSession(sessionData.session);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fetch In-Meeting Messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/messages?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchRoomData();
    fetchMessages();
  }, [fetchRoomData, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 2500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start Media Stream & WebRTC Connection
  const startVideoCall = async () => {
    if (!session) return;
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMediaStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCallStarted(true);

      // Create Peer Connection
      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      // Add Local Stream Tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle Remote Track
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsPeerConnected(true);
        }
      };

      // Handle ICE Candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await fetch('/api/webrtc/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId: session.roomId,
              type: 'candidate',
              data: event.candidate,
            }),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setIsPeerConnected(true);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsPeerConnected(false);
        }
      };

      // Create Offer if Admin/Host or initiate call
      if (currentUser?.isAdmin) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await fetch('/api/webrtc/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: session.roomId,
            type: 'offer',
            data: offer,
          }),
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Camera/Microphone Access Error: ${err.message}`);
      }
    }
  };

  // Poll WebRTC Signals
  useEffect(() => {
    if (!callStarted || !session || !peerConnectionRef.current) return;

    const pollSignals = async () => {
      try {
        const res = await fetch(`/api/webrtc/signal?roomId=${session.roomId}`);
        if (!res.ok) return;
        const data = await res.json();
        const signals: ISignalData[] = data.signals || [];

        const pc = peerConnectionRef.current;
        if (!pc) return;

        for (const sig of signals) {
          if (processedSignalsRef.current.has(sig._id)) continue;
          processedSignalsRef.current.add(sig._id);

          const payload = JSON.parse(sig.data);

          if (sig.type === 'offer' && !currentUser?.isAdmin) {
            await pc.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            await fetch('/api/webrtc/signal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                roomId: session.roomId,
                type: 'answer',
                data: answer,
              }),
            });
          } else if (sig.type === 'answer' && currentUser?.isAdmin) {
            if (pc.signalingState !== 'stable') {
              await pc.setRemoteDescription(new RTCSessionDescription(payload));
            }
          } else if (sig.type === 'candidate') {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload));
            } catch (candidateErr) {
              console.error('Error adding ICE candidate:', candidateErr);
            }
          }
        }
      } catch (err) {
        console.error('Error polling signals:', err);
      }
    };

    const interval = setInterval(pollSignals, 2000);
    return () => clearInterval(interval);
  }, [callStarted, session, currentUser]);

  // Toggle Mute Audio
  const toggleAudio = () => {
    if (!mediaStream) return;
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  // Toggle Video Camera
  const toggleVideo = () => {
    if (!mediaStream) return;
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (!peerConnectionRef.current) return;
    const pc = peerConnectionRef.current;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          if (mediaStream) {
            const origVideoTrack = mediaStream.getVideoTracks()[0];
            if (sender && origVideoTrack) {
              sender.replaceTrack(origVideoTrack);
            }
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = mediaStream;
            }
          }
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } else {
        if (mediaStream) {
          const origVideoTrack = mediaStream.getVideoTracks()[0];
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender && origVideoTrack) {
            sender.replaceTrack(origVideoTrack);
          }
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  // End Call & Leave Room
  const handleEndCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallStarted(false);
    setIsPeerConnected(false);
    router.push('/sessions');
  };

  // Send In-Meeting Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session._id,
          roomId: session.roomId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading Video Meeting Room...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto flex items-center justify-center p-6 text-center space-y-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-slate-900">Session Not Found</h2>
            <p className="text-xs text-slate-500">
              The scheduled meeting session you are trying to access does not exist or has been removed.
            </p>
            <Link
              href="/sessions"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sessions Calendar</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 flex flex-col">
        {/* Room Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <Link
              href="/sessions"
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 border border-slate-200 transition-colors"
              title="Return to Schedule"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-lg font-bold text-slate-900">{session.title}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
                  Room: {session.roomId}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-3 mt-0.5 font-mono">
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>
                    Student: {session.studentId?.name} | Instructor: {session.adminId?.name}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>
                    {new Date(session.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isPeerConnected ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Peer Connected</span>
              </span>
            ) : callStarted ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Waiting for Peer...</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-mono">
                Meeting Ready
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Video Stage + Chat Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          {/* Main Video View Area */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden">
            {!callStarted ? (
              <div className="m-auto text-center space-y-5 max-w-md py-12">
                <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 shadow-xs">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">
                    Ready to Join Video Meeting?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect your camera and microphone to start the WebRTC video session with your mentor/student.
                  </p>
                </div>

                <button
                  onClick={startVideoCall}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Camera & Join Call</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center min-h-[380px] bg-slate-900 p-3 rounded-xl border border-slate-800">
                {/* Local Video Stream */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-semibold text-white flex items-center space-x-1">
                    <span>You ({currentUser?.name})</span>
                    {isAudioMuted && <MicOff className="w-3 h-3 text-rose-400" />}
                  </div>
                </div>

                {/* Remote Video Stream */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {!isPeerConnected && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center space-y-2 p-4 text-center">
                      <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-slate-400 font-mono">
                        Waiting for peer to connect...
                      </p>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-semibold text-white">
                    <span>
                      {currentUser?.isAdmin
                        ? session.studentId?.name || 'Student'
                        : session.adminId?.name || 'Instructor'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Call Controls Bar */}
            {callStarted && (
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-center space-x-3">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isAudioMuted
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isVideoOff
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isScreenSharing
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="w-5 h-5" />
                </button>

                <button
                  onClick={handleEndCall}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
                  title="Leave / End Video Call"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>Leave Call</span>
                </button>
              </div>
            )}
          </div>

          {/* In-Meeting Live Chat Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="font-serif font-bold text-slate-900 text-xs">
                In-Meeting Live Chat
              </h3>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[380px]">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono space-y-1">
                  <p>No messages in this session yet.</p>
                  <p className="text-[10px] text-slate-400">Send a text message below!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId?._id === currentUser?.id;
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1 mb-0.5 px-1">
                        <span className="text-[10px] text-slate-600 font-semibold flex items-center space-x-1">
                          <span>{m.senderId?.name}</span>
                          {m.senderId?.isAdmin && (
                            <ShieldCheck className="w-3 h-3 text-amber-600 inline" />
                          )}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[220px] ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
