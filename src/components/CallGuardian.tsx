import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Activity,
  ChevronDown,
  ChevronUp,
  Radio,
  Zap,
  FileText,
  BarChart3,
} from 'lucide-react';


interface CallTranscriptLine {
  id: number;
  speaker: 'caller' | 'you';
  text: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

interface CallHistoryItem {
  id: number;
  phoneNumber: string;
  callerName: string;
  date: string;
  duration: string;
  threat: 'safe' | 'suspicious' | 'scam';
  scamType?: string;
  flagCount: number;
  summary: string;
}

const mockTranscript: CallTranscriptLine[] = [
  { id: 1, speaker: 'caller', text: 'Hello, this is Agent Johnson from the Internal Revenue Service.', timestamp: '0:03', flagged: true, flagReason: 'IRS impersonation — IRS does not make unsolicited calls' },
  { id: 2, speaker: 'you', text: 'Oh, hello. What is this about?', timestamp: '0:08', flagged: false },
  { id: 3, speaker: 'caller', text: 'We have found a serious discrepancy in your tax records. You owe $4,500 in back taxes.', timestamp: '0:14', flagged: true, flagReason: 'False claim of owed taxes — common IRS scam tactic' },
  { id: 4, speaker: 'you', text: 'I was not aware of that. What do I need to do?', timestamp: '0:20', flagged: false },
  { id: 5, speaker: 'caller', text: 'This is very urgent. If you do not pay today, a warrant will be issued for your arrest.', timestamp: '0:26', flagged: true, flagReason: 'THREAT OF ARREST — Major red flag! IRS never threatens arrest over the phone' },
  { id: 6, speaker: 'caller', text: 'You need to go to your nearest store and purchase Apple gift cards totaling $4,500.', timestamp: '0:34', flagged: true, flagReason: 'GIFT CARD PAYMENT — No government agency accepts gift cards as payment. This is 100% a scam!' },
  { id: 7, speaker: 'you', text: 'Gift cards? That seems unusual...', timestamp: '0:40', flagged: false },
  { id: 8, speaker: 'caller', text: 'This is standard procedure. Do not hang up or tell anyone. Stay on the line while you go to the store.', timestamp: '0:47', flagged: true, flagReason: 'ISOLATION TACTIC — Telling you not to hang up or tell anyone is a manipulation technique' },
  { id: 9, speaker: 'caller', text: 'If you do not comply, officers will be sent to your home within the hour.', timestamp: '0:55', flagged: true, flagReason: 'ESCALATING THREATS — Creating extreme urgency to prevent you from thinking clearly' },
];

const mockCallHistory: CallHistoryItem[] = [
  {
    id: 1,
    phoneNumber: '(202) 555-0147',
    callerName: 'Unknown — "IRS Agent"',
    date: 'Today, 2:15 PM',
    duration: '1:23',
    threat: 'scam',
    scamType: 'IRS Impersonation',
    flagCount: 6,
    summary: 'Caller claimed to be from IRS, demanded immediate payment via gift cards, threatened arrest.',
  },
  {
    id: 2,
    phoneNumber: '(800) 555-0199',
    callerName: 'Unknown — "Microsoft Support"',
    date: 'Yesterday, 10:42 AM',
    duration: '3:47',
    threat: 'scam',
    scamType: 'Tech Support Fraud',
    flagCount: 8,
    summary: 'Caller claimed computer had virus, requested remote access, tried to charge $299 for fake repair.',
  },
  {
    id: 3,
    phoneNumber: '(555) 867-5309',
    callerName: 'Dr. Smith Office',
    date: 'Yesterday, 9:00 AM',
    duration: '0:45',
    threat: 'safe',
    flagCount: 0,
    summary: 'Appointment reminder for Tuesday at 2:30 PM. Standard medical office call.',
  },
  {
    id: 4,
    phoneNumber: '(312) 555-0188',
    callerName: 'Unknown — "Social Security"',
    date: 'Mar 28, 3:20 PM',
    duration: '0:52',
    threat: 'scam',
    scamType: 'Social Security Scam',
    flagCount: 5,
    summary: 'Caller claimed SSN was compromised, threatened to suspend benefits, asked for personal information.',
  },
  {
    id: 5,
    phoneNumber: '(555) 234-5678',
    callerName: 'Grandson Tommy',
    date: 'Mar 28, 11:15 AM',
    duration: '5:23',
    threat: 'safe',
    flagCount: 0,
    summary: 'Regular family call. No suspicious patterns detected.',
  },
  {
    id: 6,
    phoneNumber: '(888) 555-0142',
    callerName: 'Unknown — "Medicare"',
    date: 'Mar 27, 1:45 PM',
    duration: '2:10',
    threat: 'suspicious',
    scamType: 'Possible Medicare Fraud',
    flagCount: 3,
    summary: 'Caller offered free medical equipment, asked for Medicare number. Possible Medicare fraud attempt.',
  },
];

const CallGuardian: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activeView, setActiveView] = useState<'monitor' | 'history'>('monitor');
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState<CallTranscriptLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [alertLevel, setAlertLevel] = useState<'none' | 'warning' | 'danger'>('none');
  const [showFullAlert, setShowFullAlert] = useState(false);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(mockCallHistory);
  const [expandedCall, setExpandedCall] = useState<number | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'scam' | 'suspicious' | 'safe'>('all');
  const transcriptRef = useRef<HTMLDivElement>(null);

  const handleEnable = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsEnabled(true);
      setIsActivating(false);
    }, 2000);
  };

  const handleSimulateCall = useCallback(() => {
    setIsCallActive(true);
    setTranscriptLines([]);
    setCurrentLineIndex(0);
    setAlertLevel('none');
    setShowFullAlert(false);
  }, []);

  useEffect(() => {
    if (!isCallActive || currentLineIndex >= mockTranscript.length) return;

    const timer = setTimeout(() => {
      const newLine = mockTranscript[currentLineIndex];
      setTranscriptLines((prev) => [...prev, newLine]);
      setCurrentLineIndex((prev) => prev + 1);

      // Update alert level based on flags
      if (newLine.flagged) {
        const flaggedCount = [...transcriptLines, newLine].filter((l) => l.flagged).length;
        if (flaggedCount >= 3) {
          setAlertLevel('danger');
          setShowFullAlert(true);
        } else if (flaggedCount >= 1) {
          setAlertLevel('warning');
        }
      }

      // Auto-scroll transcript
      setTimeout(() => {
        transcriptRef.current?.scrollTo({
          top: transcriptRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }, 2200);

    return () => clearTimeout(timer);
  }, [isCallActive, currentLineIndex, transcriptLines]);

  const handleEndCall = () => {
    setIsCallActive(false);
    setCurrentLineIndex(mockTranscript.length);
  };

  const filteredHistory = historyFilter === 'all'
    ? callHistory
    : callHistory.filter((c) => c.threat === historyFilter);

  const threatConfig = {
    scam: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', label: 'SCAM' },
    suspicious: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', label: 'SUSPICIOUS' },
    safe: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700', label: 'SAFE' },
  };

  return (
    <section id="call-guardian" className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50 to-white" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <PhoneCall className="w-5 h-5" />
            Call Guardian
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Real-Time <span className="text-emerald-700">Phone Call</span> Protection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Vigilante listens to your phone calls in real-time and alerts you the moment
            it detects scam language, threats, or manipulation tactics. Like having a
            protective friend on every call.

          </p>
        </div>

        {/* Not Enabled State */}
        {!isEnabled && !isActivating && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Enable Call Protection
                </h3>
                <p className="text-lg text-emerald-200 max-w-lg mx-auto">
                  Turn on call monitoring to get real-time alerts when scam language is detected
                  during your phone calls.
                </p>
              </div>

              <div className="p-8">
                {/* How it works */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: <Mic className="w-7 h-7 text-emerald-600" />, title: 'Listens Safely', desc: 'Monitors call audio for scam keywords and patterns' },
                    { icon: <Zap className="w-7 h-7 text-amber-600" />, title: 'Instant Alerts', desc: 'Flashes a warning the moment danger is detected' },
                    { icon: <FileText className="w-7 h-7 text-blue-600" />, title: 'Call Reports', desc: 'Get a summary after each call with threat analysis' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-5 text-center">
                      <div className="bg-white p-3 rounded-xl inline-block mb-3 shadow-sm">
                        {item.icon}
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleEnable}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
                >
                  <Shield className="w-6 h-6" />
                  Enable Call Protection
                </button>

                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-bold text-emerald-900 mb-1">Privacy First</h4>
                      <p className="text-base text-emerald-700 leading-relaxed">
                        Call audio is analyzed on your device in real-time. Conversations are never
                        recorded, stored, or sent anywhere. Only scam pattern alerts are generated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activating State */}
        {isActivating && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-12 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="w-20 h-20 border-4 border-emerald-200 rounded-full" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin" />
                <Phone className="absolute inset-0 m-auto w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Activating Call Protection...
              </h3>
              <p className="text-lg text-gray-600">
                Setting up real-time call monitoring. This will only take a moment.
              </p>
            </div>
          </div>
        )}

        {/* Enabled State */}
        {isEnabled && !isActivating && (
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2.5 rounded-xl">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      Call Protection Active
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-base text-gray-500">
                      Monitoring all incoming calls for scam language
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('monitor')}
                    className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
                      activeView === 'monitor'
                        ? 'bg-emerald-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4" />
                      Live Monitor
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveView('history')}
                    className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
                      activeView === 'history'
                        ? 'bg-emerald-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Call History
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Monitor View */}
            {activeView === 'monitor' && (
              <div className="space-y-6">
                {/* Call Simulation */}
                {!isCallActive && transcriptLines.length === 0 && (
                  <div className="bg-white rounded-3xl shadow-md border-2 border-gray-200 p-10 text-center">
                    <div className="bg-emerald-50 p-4 rounded-2xl inline-block mb-5">
                      <Phone className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Waiting for Incoming Call...
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
                      Call protection is active. When you receive a phone call, Scam Agent
                      will automatically start monitoring for scam language.
                    </p>
                    <button
                      onClick={handleSimulateCall}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 mx-auto"
                    >
                      <PhoneCall className="w-5 h-5" />
                      Simulate a Scam Call (Demo)
                    </button>
                    <p className="mt-3 text-sm text-gray-400">
                      Try a live demo to see how call protection works
                    </p>
                  </div>
                )}

                {/* Active Call / Transcript */}
                {(isCallActive || transcriptLines.length > 0) && (
                  <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden">
                    {/* Call Header */}
                    <div className={`px-6 py-5 flex items-center justify-between ${
                      alertLevel === 'danger'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600'
                        : alertLevel === 'warning'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-700 to-teal-700'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                          {isCallActive ? (
                            <PhoneCall className="w-7 h-7 text-white animate-pulse" />
                          ) : (
                            <PhoneOff className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">
                            {isCallActive ? 'Call in Progress' : 'Call Ended'}
                          </div>
                          <div className="text-base text-white/80">
                            (202) 555-0147 — Unknown Caller
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {alertLevel === 'danger' && (
                          <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-5 h-5 text-white" />
                            <span className="text-white font-bold text-lg">SCAM ALERT</span>
                          </div>
                        )}
                        {isCallActive && (
                          <button
                            onClick={handleEndCall}
                            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
                          >
                            <PhoneOff className="w-5 h-5" />
                            End Call
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Full Screen Alert */}
                    {showFullAlert && (
                      <div className="bg-red-50 border-b-2 border-red-200 p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                            <ShieldX className="w-8 h-8 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-red-900 mb-2">
                              Scam Detected — Hang Up Now!
                            </h3>
                            <p className="text-lg text-red-700 leading-relaxed mb-3">
                              This call shows multiple signs of an <strong>IRS Impersonation Scam</strong>.
                              The caller is using threats and urgency to steal your money. The real IRS
                              never calls demanding immediate payment.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <a
                                href="tel:18333728311"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                              >
                                <Phone className="w-5 h-5" />
                                Call Elder Fraud Hotline
                              </a>
                              <button
                                onClick={() => setShowFullAlert(false)}
                                className="px-6 py-3 bg-white border-2 border-red-300 text-red-700 font-bold rounded-xl hover:bg-red-50 transition-colors"
                              >
                                Dismiss Alert
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Live Transcript */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-gray-500" />
                        <h4 className="text-lg font-bold text-gray-900">Live Transcript</h4>
                        {isCallActive && (
                          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold ml-auto">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Listening...
                          </span>
                        )}
                      </div>

                      <div
                        ref={transcriptRef}
                        className="max-h-96 overflow-y-auto space-y-3 pr-2"
                      >
                        {transcriptLines.map((line) => (
                          <div key={line.id} className="space-y-1">
                            <div
                              className={`flex gap-3 ${
                                line.speaker === 'caller' ? 'justify-start' : 'justify-end'
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                  line.speaker === 'caller'
                                    ? line.flagged
                                      ? 'bg-red-50 border-2 border-red-300'
                                      : 'bg-gray-100 border border-gray-200'
                                    : 'bg-blue-50 border border-blue-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-bold ${
                                    line.speaker === 'caller'
                                      ? line.flagged ? 'text-red-700' : 'text-gray-600'
                                      : 'text-blue-700'
                                  }`}>
                                    {line.speaker === 'caller' ? 'Caller' : 'You'}
                                  </span>
                                  <span className="text-xs text-gray-400">{line.timestamp}</span>
                                  {line.flagged && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                                <p className={`text-base leading-relaxed ${
                                  line.flagged ? 'text-red-900' : 'text-gray-800'
                                }`}>
                                  {line.text}
                                </p>
                              </div>
                            </div>

                            {/* Flag Alert */}
                            {line.flagged && line.flagReason && (
                              <div className="flex justify-start ml-3">
                                <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 max-w-[80%]">
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                  {line.flagReason}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {isCallActive && currentLineIndex < mockTranscript.length && (
                          <div className="flex items-center gap-2 text-gray-400 pl-3 py-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm">Listening...</span>
                          </div>
                        )}
                      </div>

                      {/* Post-Call Summary */}
                      {!isCallActive && transcriptLines.length > 0 && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <ShieldX className="w-7 h-7 text-red-600" />
                              <h4 className="text-xl font-bold text-red-900">Call Analysis Summary</h4>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                              <div className="bg-white rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                  {transcriptLines.filter((l) => l.flagged).length}
                                </div>
                                <div className="text-sm font-semibold text-red-700">Red Flags</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-red-600">98%</div>
                                <div className="text-sm font-semibold text-red-700">Scam Confidence</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-red-600">IRS Scam</div>
                                <div className="text-sm font-semibold text-red-700">Scam Type</div>
                              </div>
                            </div>
                            <p className="text-lg text-red-800 leading-relaxed mb-4">
                              This was an <strong>IRS Impersonation Scam</strong>. The caller used threats of arrest,
                              demanded gift card payment, and tried to isolate you. The real IRS always sends letters
                              first and never demands immediate payment.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <a
                                href="tel:18333728311"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                              >
                                <Phone className="w-5 h-5" />
                                Report to Elder Fraud Hotline
                              </a>
                              <button
                                onClick={() => {
                                  setTranscriptLines([]);
                                  setCurrentLineIndex(0);
                                  setAlertLevel('none');
                                  setShowFullAlert(false);
                                }}
                                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                              >
                                Clear & Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Call History View */}
            {activeView === 'history' && (
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all' as const, label: `All (${callHistory.length})` },
                    { value: 'scam' as const, label: `Scams (${callHistory.filter((c) => c.threat === 'scam').length})` },
                    { value: 'suspicious' as const, label: `Suspicious (${callHistory.filter((c) => c.threat === 'suspicious').length})` },
                    { value: 'safe' as const, label: `Safe (${callHistory.filter((c) => c.threat === 'safe').length})` },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setHistoryFilter(f.value)}
                      className={`px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                        historyFilter === f.value
                          ? 'bg-emerald-900 text-white shadow-md'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Call List */}
                {filteredHistory.map((call) => {
                  const config = threatConfig[call.threat];
                  const isExpanded = expandedCall === call.id;
                  return (
                    <div
                      key={call.id}
                      className={`bg-white rounded-2xl border-2 ${config.border} transition-all hover:shadow-md`}
                    >
                      <button
                        onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                        className="w-full p-5 text-left flex items-center gap-4"
                      >
                        <div className={`${config.bg} p-2.5 rounded-xl flex-shrink-0`}>
                          {call.threat === 'scam' ? (
                            <ShieldX className={`w-6 h-6 ${config.text}`} />
                          ) : call.threat === 'suspicious' ? (
                            <ShieldAlert className={`w-6 h-6 ${config.text}`} />
                          ) : (
                            <ShieldCheck className={`w-6 h-6 ${config.text}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <span className="text-lg font-bold text-gray-900">{call.callerName}</span>
                            <span className={`${config.badge} px-3 py-0.5 rounded-full text-sm font-bold`}>
                              {config.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-base text-gray-500">
                            <span>{call.phoneNumber}</span>
                            <span className="text-gray-300">|</span>
                            <span>{call.date}</span>
                            <span className="text-gray-300">|</span>
                            <span>{call.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {call.flagCount > 0 && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                              {call.flagCount} flags
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className={`border-t ${config.border} p-5 ${config.bg}`}>
                          {call.scamType && (
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-base font-bold text-gray-900 mb-3 shadow-sm">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              {call.scamType}
                            </div>
                          )}
                          <p className="text-lg text-gray-700 leading-relaxed">
                            {call.summary}
                          </p>
                          {call.threat !== 'safe' && (
                            <div className="mt-4">
                              <a
                                href="tel:18333728311"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                Report This Call
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredHistory.length === 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
                    <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-xl text-gray-500">No calls match this filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CallGuardian;
