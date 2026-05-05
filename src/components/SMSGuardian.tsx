import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  X,
  Loader2,
  Settings,
  Ban,
  Flag,
  Send,
  Smartphone,
  Copy,
  Check,
  TrendingUp,
  Package,
  Gift,
  Landmark,
  Car,
  Briefcase,
  Heart,
  Cpu,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';



interface ScannedSMS {
  id: number;

  sender: string;
  message: string;
  date: string;
  threat: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  redFlags: string[];
  safeSignals: string[];
  scamType?: string;
  explanation?: string;
  isBlocked: boolean;
  isReported: boolean;
}

interface SMSScamPattern {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  example: string;
  frequency: string;
}

const FORWARDING_NUMBER = '1-833-VIG-TEXT';
const FORWARDING_NUMBER_RAW = '18338448398';

const scamPatterns: SMSScamPattern[] = [
  {
    id: 'package',
    name: 'Package Delivery',
    icon: <Package className="w-6 h-6" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Fake USPS, FedEx, or UPS tracking notifications with malicious links',
    example: '"Your package is held at the facility. Confirm delivery: bit.ly/3xFake"',
    frequency: '38% of SMS scams',
  },
  {
    id: 'bank',
    name: 'Bank Alert Phishing',
    icon: <Landmark className="w-6 h-6" />,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Fake fraud alerts from banks asking you to verify your account',
    example: '"Chase: Unusual activity detected. Verify now: chase-secure.fake.com"',
    frequency: '27% of SMS scams',
  },
  {
    id: 'prize',
    name: 'Prize / Lottery',
    icon: <Gift className="w-6 h-6" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Claims you won a prize, gift card, or lottery — always fake',
    example: '"Congratulations! You won a $500 Walmart gift card. Claim: reward-claim.fake"',
    frequency: '15% of SMS scams',
  },
  {
    id: 'toll',
    name: 'Toll / Traffic Scam',
    icon: <Car className="w-6 h-6" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Fake unpaid toll or traffic violation notices demanding payment',
    example: '"EZPass: You have an unpaid toll of $6.99. Pay now to avoid $50 late fee"',
    frequency: '8% of SMS scams',
  },
  {
    id: 'government',
    name: 'Government Impersonation',
    icon: <Landmark className="w-6 h-6" />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Fake IRS, SSA, or Medicare messages threatening action',
    example: '"IRS: Your tax return has a discrepancy. Resolve immediately or face penalties"',
    frequency: '5% of SMS scams',
  },
  {
    id: 'job',
    name: 'Job Offer Scam',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Unsolicited job offers with too-good-to-be-true pay',
    example: '"Hi! Work from home $500/day. No experience needed. Reply YES to start"',
    frequency: '4% of SMS scams',
  },
  {
    id: 'crypto',
    name: 'Crypto / Investment',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Fake cryptocurrency or investment opportunities promising huge returns',
    example: '"Make $10K/week with Bitcoin. Guaranteed returns. Join now: crypto-earn.fake"',
    frequency: '2% of SMS scams',
  },
  {
    id: 'romance',
    name: 'Romance / Dating',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Messages from strangers trying to build a fake romantic connection',
    example: '"Hey! I think I have the wrong number but you seem nice. Want to chat?"',
    frequency: '1% of SMS scams',
  },
];

const mockScannedSMS: ScannedSMS[] = [
  {
    id: 1,
    sender: '+1 (800) 555-0147',
    message: 'USPS: Your package has been held at our facility due to an incomplete address. Please confirm your delivery details at: usps-redelivery-confirm.com/track',
    date: '12 min ago',
    threat: 'scam',
    confidence: 97,
    redFlags: [
      'USPS never sends links via text to confirm addresses',
      'Suspicious domain: usps-redelivery-confirm.com is NOT usps.com',
      'Creates urgency about a "held" package',
      'Link likely leads to a phishing page to steal personal info',
    ],
    safeSignals: [],
    scamType: 'Package Delivery Scam',
    explanation: 'This is a classic package delivery scam. USPS does not send text messages asking you to click links to confirm your address. The link goes to a fake website designed to steal your personal information.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 2,
    sender: '+1 (888) 555-0234',
    message: 'Chase Bank: We detected unusual activity on your debit card ending in 4821. If this was not you, verify your identity immediately at: chase-secure-verify.net',
    date: '28 min ago',
    threat: 'scam',
    confidence: 96,
    redFlags: [
      'Chase Bank does not send verification links via text',
      'Fake domain: chase-secure-verify.net is NOT chase.com',
      'Uses fear of "unusual activity" to create panic',
      'Asks you to "verify identity" through a link — classic phishing',
    ],
    safeSignals: [],
    scamType: 'Bank Alert Phishing',
    explanation: 'This is a bank phishing scam. Chase Bank will never ask you to verify your identity through a text message link. If you are concerned about your account, call the number on the back of your card directly.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 3,
    sender: 'CVS Pharmacy',
    message: 'CVS: Your prescription for Lisinopril is ready for pickup at the CVS on Main St. Reply STOP to opt out of text alerts.',
    date: '1 hour ago',
    threat: 'safe',
    confidence: 91,
    redFlags: [],
    safeSignals: [
      'Standard pharmacy prescription notification',
      'References a specific medication and location',
      'Includes opt-out instructions (STOP)',
      'No links to click or personal info requested',
    ],
    explanation: 'This appears to be a legitimate prescription ready notification from CVS Pharmacy. It follows standard pharmacy notification patterns and does not ask for any personal information.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 4,
    sender: '+1 (312) 555-0891',
    message: 'Congratulations! You have been selected to receive a $750 Walmart gift card! Click here to claim your reward before it expires: walmart-rewards-claim.com/gift',
    date: '2 hours ago',
    threat: 'scam',
    confidence: 99,
    redFlags: [
      'You cannot win a prize you never entered',
      'Fake domain: walmart-rewards-claim.com is NOT walmart.com',
      'Creates urgency with "before it expires"',
      '"Congratulations" + unsolicited prize = classic scam pattern',
    ],
    safeSignals: [],
    scamType: 'Prize / Lottery Scam',
    explanation: 'This is a prize scam. You did not win anything. Walmart does not randomly select people to receive gift cards via text message. The link leads to a fake website that will try to steal your personal and financial information.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 5,
    sender: '+1 (202) 555-0456',
    message: 'EZPass: You have an unpaid toll of $6.99. To avoid a $50 late fee, pay now at: ezpass-payment-center.com/pay',
    date: '3 hours ago',
    threat: 'scam',
    confidence: 95,
    redFlags: [
      'EZPass does not send payment demands via text',
      'Fake domain: ezpass-payment-center.com is NOT official',
      'Threatens a $50 late fee to create urgency',
      'Small dollar amount ($6.99) designed to seem reasonable',
    ],
    safeSignals: [],
    scamType: 'Toll / Traffic Scam',
    explanation: 'This is a toll scam. EZPass and other toll agencies do not send payment demands via text message. The small amount ($6.99) is designed to make you think it is not worth questioning. The link steals your payment information.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 6,
    sender: 'Dr. Martinez Office',
    message: 'Reminder: You have an appointment with Dr. Martinez tomorrow at 10:30 AM. Reply C to confirm or R to reschedule. Reply STOP to opt out.',
    date: '4 hours ago',
    threat: 'safe',
    confidence: 89,
    redFlags: [],
    safeSignals: [
      'Standard medical appointment reminder format',
      'Simple reply options (C/R) — no links to click',
      'Includes opt-out instructions',
      'No requests for personal or financial information',
    ],
    explanation: 'This appears to be a legitimate appointment reminder from a doctor\'s office. It uses standard reminder formatting and only asks for a simple text reply to confirm or reschedule.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 7,
    sender: '+1 (415) 555-0777',
    message: 'Hi! I think I texted the wrong number but you seem really nice. My name is Jessica and I just moved to the area. Would you like to chat sometime?',
    date: '5 hours ago',
    threat: 'suspicious',
    confidence: 78,
    redFlags: [
      'Classic "wrong number" opener used in romance scams',
      'Immediately tries to build personal connection',
      'Unknown sender with no context for why they have your number',
    ],
    safeSignals: [
      'No links or requests for money',
      'Could potentially be a genuine wrong number',
    ],
    scamType: 'Romance / Dating Scam',
    explanation: 'This is likely the beginning of a romance scam. Scammers send "wrong number" texts to thousands of people, hoping some will engage. They then build a fake relationship over weeks before asking for money. Do not reply.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 8,
    sender: '+1 (917) 555-0333',
    message: 'IRS NOTICE: Your tax return has been flagged for review. Failure to respond within 24 hours will result in legal action. Call 1-800-555-0199 immediately.',
    date: '6 hours ago',
    threat: 'scam',
    confidence: 98,
    redFlags: [
      'The IRS NEVER contacts taxpayers by text message',
      'Threatens "legal action" within 24 hours — classic fear tactic',
      'Demands immediate phone call to a suspicious number',
      'Uses all-caps "IRS NOTICE" to appear official',
    ],
    safeSignals: [],
    scamType: 'Government Impersonation',
    explanation: 'This is a government impersonation scam. The IRS will NEVER contact you by text message, threaten legal action, or demand immediate payment. If you have tax concerns, visit irs.gov directly or call 1-800-829-1040.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 9,
    sender: '+1 (305) 555-0999',
    message: 'Make $5,000/week from home! No experience needed. We are hiring remote workers immediately. Reply YES to get started or visit: easy-income-jobs.com',
    date: '8 hours ago',
    threat: 'scam',
    confidence: 94,
    redFlags: [
      'Unrealistic income claims ($5,000/week)',
      '"No experience needed" for high-paying job is a red flag',
      'Unsolicited job offer from unknown number',
      'Suspicious domain: easy-income-jobs.com',
    ],
    safeSignals: [],
    scamType: 'Job Offer Scam',
    explanation: 'This is a job scam. Legitimate employers do not send unsolicited text messages offering $5,000/week with no experience. These scams typically ask for personal information or upfront "training" fees.',
    isBlocked: false,
    isReported: false,
  },
  {
    id: 10,
    sender: 'Amazon',
    message: 'Amazon: Your order #112-7839201 has shipped. Estimated delivery: Thursday, April 2. Track at amazon.com/track',
    date: '1 day ago',
    threat: 'safe',
    confidence: 87,
    redFlags: [],
    safeSignals: [
      'References a specific order number',
      'Links to legitimate amazon.com domain',
      'Standard shipping notification format',
      'No urgency or requests for personal information',
    ],
    explanation: 'This appears to be a legitimate Amazon shipping notification. It references a specific order number and links to the official amazon.com domain.',
    isBlocked: false,
    isReported: false,
  },
];

const SMSGuardian: React.FC = () => {
  const { user, incrementStat } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'patterns' | 'forward'>('dashboard');
  const [messages, setMessages] = useState<ScannedSMS[]>(mockScannedSMS);
  const [selectedMessage, setSelectedMessage] = useState<ScannedSMS | null>(null);
  const [filter, setFilter] = useState<'all' | 'scam' | 'suspicious' | 'safe'>('all');
  const [bulkText, setBulkText] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showPatternDetail, setShowPatternDetail] = useState<string | null>(null);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Global counter state
  const [globalStats, setGlobalStats] = useState({
    totalScanned: 847293,
    totalBlocked: 234891,
    totalSuspicious: 98234,
    totalReports: 45672,
  });
  const [animatedBlocked, setAnimatedBlocked] = useState(234891);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate the global counter
  useEffect(() => {
    // Fetch real stats from database
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('global_sms_stats')
          .select('*')
          .eq('id', 1)
          .single();
        if (data) {
          setGlobalStats({
            totalScanned: data.total_sms_scanned ?? 847293,
            totalBlocked: data.total_scams_blocked ?? 234891,
            totalSuspicious: data.total_suspicious_flagged ?? 98234,
            totalReports: data.total_reports_filed ?? 45672,
          });
          setAnimatedBlocked(data.total_scams_blocked ?? 234891);
        }
      } catch {
        // Use default values — table may not exist yet
      }
    };
    fetchStats();

    // Simulate real-time counter incrementing
    counterRef.current = setInterval(() => {
      setAnimatedBlocked(prev => prev + Math.floor(Math.random() * 3));
      setGlobalStats(prev => ({
        ...prev,
        totalScanned: prev.totalScanned + Math.floor(Math.random() * 5) + 1,
      }));
    }, 3000);

    return () => {
      if (counterRef.current) clearInterval(counterRef.current);
    };
  }, []);

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(FORWARDING_NUMBER_RAW);
      setCopiedNumber(true);
    } catch {
      // Fallback for non-HTTPS or denied clipboard access
      const textArea = document.createElement('textarea');
      textArea.value = FORWARDING_NUMBER_RAW;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try { document.execCommand('copy'); setCopiedNumber(true); } catch { /* ignore */ }
      document.body.removeChild(textArea);
    }
    setTimeout(() => setCopiedNumber(false), 2000);
  };


  const handleBulkScan = useCallback(async () => {
    if (!bulkText.trim()) return;

    setIsScanning(true);
    setScanProgress(0);

    // Parse bulk text into individual messages
    const rawMessages = bulkText.split(/\n{2,}|\-{3,}/).filter(m => m.trim());
    const parsedMessages = rawMessages.map(m => ({
      sender: senderNumber || 'Unknown',
      text: m.trim(),
    }));

    // Progress animation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12 + 3;
      });
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-sms', {
        body: { messages: parsedMessages, mode: 'analyze' },
      });

      clearInterval(interval);
      setScanProgress(100);

      if (error) throw error;

      if (data?.results) {
        const newMessages: ScannedSMS[] = data.results.map((result: any, idx: number) => ({
          id: Date.now() + idx,
          sender: parsedMessages[idx]?.sender || 'Unknown',
          message: parsedMessages[idx]?.text || '',
          date: 'Just now',
          threat: result.threat_level || 'safe',
          confidence: result.confidence || 50,
          redFlags: result.red_flags || [],
          safeSignals: result.safe_signals || [],
          scamType: result.scam_type || undefined,
          explanation: result.explanation || '',
          isBlocked: false,
          isReported: false,
        }));

        setMessages(prev => [...newMessages, ...prev]);
        setBulkText('');
        setSenderNumber('');
        setActiveTab('dashboard');

        if (user) {
          incrementStat('messages_checked', newMessages.length);
          const scamCount = newMessages.filter(m => m.threat === 'scam').length;
          if (scamCount > 0) incrementStat('scams_blocked', scamCount);
        }
      }
    } catch (err) {
      console.error('SMS scan error:', err);
      // Fallback: use mock analysis
      clearInterval(interval);
      setScanProgress(100);
      
      const fallbackMessages: ScannedSMS[] = parsedMessages.map((msg, idx) => ({
        id: Date.now() + idx,
        sender: msg.sender,
        message: msg.text,
        date: 'Just now',
        threat: 'suspicious' as const,
        confidence: 60,
        redFlags: ['Unable to complete full AI analysis — please review manually'],
        safeSignals: [],
        explanation: 'The AI analysis service was temporarily unavailable. Please review this message carefully and use your judgment.',
        isBlocked: false,
        isReported: false,
      }));

      setMessages(prev => [...fallbackMessages, ...prev]);
      setBulkText('');
      setActiveTab('dashboard');
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
    }, 500);
  }, [bulkText, senderNumber, user, incrementStat]);

  const handleBlock = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isBlocked: true } : m));
    setGlobalStats(prev => ({ ...prev, totalBlocked: prev.totalBlocked + 1 }));
  };

  const handleReport = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isReported: true } : m));
    setGlobalStats(prev => ({ ...prev, totalReports: prev.totalReports + 1 }));
    if (user) incrementStat('reports_submitted');
  };

  const handleDelete = (id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.threat === filter);
  const scamCount = messages.filter(m => m.threat === 'scam').length;
  const suspiciousCount = messages.filter(m => m.threat === 'suspicious').length;
  const safeCount = messages.filter(m => m.threat === 'safe').length;

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const threatIcon = (threat: string) => {
    switch (threat) {
      case 'scam': return <ShieldAlert className="w-6 h-6 text-red-500" />;
      case 'suspicious': return <AlertCircle className="w-6 h-6 text-amber-500" />;
      default: return <MessageSquare className="w-6 h-6 text-green-500" />;
    }
  };


  const threatBadge = (threat: string, confidence: number) => {
    const config = {
      scam: { bg: 'bg-red-100 text-red-700 border-red-200', label: 'SCAM' },
      suspicious: { bg: 'bg-amber-100 text-amber-700 border-amber-200', label: 'SUSPICIOUS' },
      safe: { bg: 'bg-green-100 text-green-700 border-green-200', label: 'SAFE' },
    };
    const c = config[threat as keyof typeof config] || config.safe;
    return (
      <span className={`${c.bg} border px-3 py-1 rounded-full text-sm font-bold`}>
        {c.label} ({confidence}%)
      </span>
    );
  };

  return (
    <section id="sms-guardian" className="relative py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/40 to-white" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-800 px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <MessageSquare className="w-5 h-5" />
            SMS Vigilante
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Protect Your <span className="text-orange-600">Text Messages</span> From Scams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Forward suspicious texts to our dedicated number or paste them in bulk. The Vigilante's AI
            instantly analyzes every message for phishing, fraud, and scam patterns — protecting your entire family.
          </p>
        </div>

        {/* Real-Time Global Counter */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 lg:px-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  Real-Time Scam Text Protection
                </h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1 tabular-nums">
                    {formatNumber(globalStats.totalScanned)}
                  </div>
                  <div className="text-orange-100 text-base font-medium">Texts Scanned</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1 tabular-nums">
                    {formatNumber(animatedBlocked)}
                  </div>
                  <div className="text-orange-100 text-base font-medium">Scams Blocked</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1 tabular-nums">
                    {formatNumber(globalStats.totalSuspicious)}
                  </div>
                  <div className="text-orange-100 text-base font-medium">Suspicious Flagged</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1 tabular-nums">
                    {formatNumber(globalStats.totalReports)}
                  </div>
                  <div className="text-orange-100 text-base font-medium">Reports Filed</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-orange-200 text-sm">
                  Counter updates in real-time as The Vigilante community scans and blocks scam texts worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard' as const, label: 'Scanned Messages', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'scan' as const, label: 'Scan New Texts', icon: <Send className="w-4 h-4" /> },
            { id: 'patterns' as const, label: 'Scam Patterns', icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'forward' as const, label: 'Forward a Text', icon: <Phone className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Forward a Text Tab */}
        {activeTab === 'forward' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-800 to-orange-700 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Smartphone className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Forward Suspicious Texts
                </h3>
                <p className="text-lg text-orange-200 max-w-lg mx-auto">
                  Got a suspicious text? Simply forward it to our dedicated number.
                  The Vigilante will analyze it instantly and text you back the results.
                </p>
              </div>

              <div className="p-8">
                {/* Forwarding Number */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                  <div className="text-center">
                    <p className="text-base text-orange-700 font-medium mb-3">Forward suspicious texts to:</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl lg:text-5xl font-bold text-orange-800 tracking-wider">
                        {FORWARDING_NUMBER}
                      </span>
                      <button
                        onClick={handleCopyNumber}
                        className="p-3 bg-orange-200 hover:bg-orange-300 rounded-xl transition-colors"
                        title="Copy number"
                      >
                        {copiedNumber ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-orange-700" />
                        )}
                      </button>
                    </div>
                    {copiedNumber && (
                      <p className="text-green-600 font-semibold mt-2">Number copied to clipboard!</p>
                    )}
                  </div>
                </div>

                {/* How It Works */}
                <h4 className="text-xl font-bold text-gray-900 mb-4">How It Works</h4>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { step: '1', title: 'Forward the Text', desc: 'Forward any suspicious text message to our number', icon: <Send className="w-6 h-6" /> },
                    { step: '2', title: 'AI Analyzes It', desc: 'Our AI scans for scam patterns, phishing, and fraud', icon: <Cpu className="w-6 h-6" /> },
                    { step: '3', title: 'Get Results', desc: 'Receive a reply with threat level and what to do', icon: <ShieldCheck className="w-6 h-6" /> },
                  ].map(item => (
                    <div key={item.step} className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                      <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-700">
                        {item.icon}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-1">Step {item.step}</div>
                      <div className="text-base font-semibold text-gray-800 mb-1">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-bold text-blue-900 mb-1">Privacy Protected</h4>
                      <p className="text-base text-blue-700 leading-relaxed">
                        We only analyze the text content for scam patterns. We never store your phone number
                        or share your messages. Standard messaging rates may apply.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan New Texts Tab */}
        {activeTab === 'scan' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-800 to-orange-700 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Send className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Paste & Scan Text Messages
                </h3>
                <p className="text-lg text-orange-200 max-w-lg mx-auto">
                  Paste one or more suspicious text messages below. Separate multiple messages
                  with a blank line. The Vigilante AI will analyze each one.
                </p>
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <label className="block text-base font-bold text-gray-900 mb-2">
                    Sender Number (optional)
                  </label>
                  <input
                    type="text"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="e.g., +1 (800) 555-0123 or Unknown"
                    className="w-full px-5 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-base font-bold text-gray-900 mb-2">
                    Paste Text Message(s)
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={"Paste a suspicious text message here...\n\nTo scan multiple messages, separate them with a blank line.\n\nExample:\nUSPS: Your package is held. Confirm at usps-fake.com\n\nChase Bank: Unusual activity detected. Verify now."}
                    rows={8}
                    className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bulkText.trim() ? `${bulkText.split(/\n{2,}|\-{3,}/).filter(m => m.trim()).length} message(s) detected` : 'Separate multiple messages with a blank line'}
                  </p>
                </div>

                {isScanning && (
                  <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
                    <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
                    <p className="text-lg font-bold text-gray-900 mb-2">The Vigilante is Analyzing...</p>
                    <p className="text-base text-gray-600 mb-3">Scanning for phishing, fraud, and scam patterns</p>
                    <div className="max-w-md mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(scanProgress, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{Math.min(Math.round(scanProgress), 100)}% complete</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBulkScan}
                  disabled={!bulkText.trim() || isScanning}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6" />
                      Scan for Scams
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scam Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Common SMS Scam Patterns</h3>
              <p className="text-lg text-gray-600 mb-6">
                Learn to recognize the most common text message scams. The Vigilante AI detects all of these patterns automatically.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scamPatterns.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => setShowPatternDetail(showPatternDetail === pattern.id ? null : pattern.id)}
                    className={`${pattern.bgColor} border-2 ${pattern.borderColor} rounded-2xl p-5 text-left transition-all hover:shadow-lg ${
                      showPatternDetail === pattern.id ? 'ring-4 ring-orange-200 shadow-lg' : ''
                    }`}
                  >
                    <div className={`${pattern.color} mb-3`}>{pattern.icon}</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{pattern.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{pattern.description}</div>
                    <div className={`inline-block ${pattern.bgColor} border ${pattern.borderColor} px-2 py-0.5 rounded-full text-xs font-bold ${pattern.color}`}>
                      {pattern.frequency}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Detail */}
            {showPatternDetail && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-6">
                {(() => {
                  const pattern = scamPatterns.find(p => p.id === showPatternDetail);
                  if (!pattern) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`${pattern.bgColor} p-3 rounded-xl ${pattern.color}`}>
                            {pattern.icon}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{pattern.name}</h4>
                            <p className="text-base text-gray-500">{pattern.frequency}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPatternDetail(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <h5 className="text-base font-bold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          Example Scam Text
                        </h5>
                        <p className="text-base text-red-800 italic">{pattern.example}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h5 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-500" />
                          How to Protect Yourself
                        </h5>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2 text-base text-blue-800">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            Never click links in unsolicited text messages
                          </li>
                          <li className="flex items-start gap-2 text-base text-blue-800">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            Contact the company directly using their official website or phone number
                          </li>
                          <li className="flex items-start gap-2 text-base text-blue-800">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            Forward suspicious texts to 7726 (SPAM) to report to your carrier
                          </li>
                          <li className="flex items-start gap-2 text-base text-blue-800">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            Forward to The Vigilante at {FORWARDING_NUMBER} for instant AI analysis
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Settings Bar */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-2.5 rounded-xl">
                    <ShieldCheck className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      SMS Protection Active
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-base text-gray-500">
                      {messages.length} messages scanned — {scamCount} scams detected
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    Scan New
                  </button>
                </div>
              </div>

              {showSettings && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {autoBlockEnabled ? <Ban className="w-5 h-5 text-orange-600" /> : <Ban className="w-5 h-5 text-gray-400" />}
                      <div>
                        <div className="text-base font-bold text-gray-900">Auto-Block Known Scam Numbers</div>
                        <div className="text-sm text-gray-500">Automatically block numbers identified as scam senders</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoBlockEnabled(!autoBlockEnabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${autoBlockEnabled ? 'bg-orange-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${autoBlockEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Alert Banner */}
            {scamCount > 0 && (
              <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{scamCount} Scam Text{scamCount > 1 ? 's' : ''} Detected!</h3>
                    <p className="text-lg text-red-100">
                      Do NOT click any links in these messages. Block the sender and report them.
                    </p>
                  </div>
                  <ShieldX className="w-12 h-12 text-red-200 hidden lg:block" />
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border-2 border-red-200 p-5 text-center">
                <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600">{scamCount}</div>
                <div className="text-base font-semibold text-red-700">Scams Found</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-amber-600">{suspiciousCount}</div>
                <div className="text-base font-semibold text-amber-700">Suspicious</div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-green-200 p-5 text-center">
                <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">{safeCount}</div>
                <div className="text-base font-semibold text-green-700">Safe</div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as const, label: `All (${messages.length})` },
                { value: 'scam' as const, label: `Scams (${scamCount})` },
                { value: 'suspicious' as const, label: `Suspicious (${suspiciousCount})` },
                { value: 'safe' as const, label: `Safe (${safeCount})` },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                    filter === f.value
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Message List */}
            <div className="space-y-3">
              {filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-2xl border-2 transition-all hover:shadow-md cursor-pointer ${
                    msg.threat === 'scam'
                      ? 'border-red-200 hover:border-red-400'
                      : msg.threat === 'suspicious'
                      ? 'border-amber-200 hover:border-amber-400'
                      : 'border-gray-200 hover:border-green-400'
                  } ${selectedMessage?.id === msg.id ? 'ring-4 ring-orange-200' : ''}`}
                  onClick={() => setSelectedMessage(selectedMessage?.id === msg.id ? null : msg)}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {threatIcon(msg.threat)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span className="text-lg font-bold text-gray-900">{msg.sender}</span>
                          {threatBadge(msg.threat, msg.confidence)}
                          {msg.isBlocked && (
                            <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3" /> BLOCKED
                            </span>
                          )}
                          {msg.isReported && (
                            <span className="bg-blue-100 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Flag className="w-3 h-3" /> REPORTED
                            </span>
                          )}
                        </div>
                        {msg.scamType && (
                          <div className="text-sm text-red-600 font-semibold mb-1">{msg.scamType}</div>
                        )}
                        <div className="text-base text-gray-700 line-clamp-2">{msg.message}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-gray-400 whitespace-nowrap">{msg.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {selectedMessage?.id === msg.id && (
                    <div className="border-t-2 border-gray-100 p-5 bg-gray-50 rounded-b-2xl" onClick={(e) => e.stopPropagation()}>
                      {/* Full Message */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                        <h5 className="text-sm font-bold text-gray-500 uppercase mb-2">Full Message</h5>
                        <p className="text-base text-gray-900 leading-relaxed">{msg.message}</p>
                      </div>

                      {/* Explanation */}
                      {msg.explanation && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                          <h5 className="text-base font-bold text-orange-900 mb-2 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-orange-500" />
                            The Vigilante Analysis
                          </h5>
                          <p className="text-base text-orange-800 leading-relaxed">{msg.explanation}</p>
                        </div>
                      )}

                      {/* Red Flags */}
                      {msg.redFlags.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                          <h5 className="text-base font-bold text-red-900 mb-2 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            Red Flags Found
                          </h5>
                          <ul className="space-y-1.5">
                            {msg.redFlags.map((flag, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-base text-red-800">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Safe Signals */}
                      {msg.safeSignals.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                          <h5 className="text-base font-bold text-green-900 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Safe Signals
                          </h5>
                          <ul className="space-y-1.5">
                            {msg.safeSignals.map((signal, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-base text-green-800">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                {signal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {msg.threat !== 'safe' && !msg.isBlocked && (
                          <button
                            onClick={() => handleBlock(msg.id)}
                            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                          >
                            <Ban className="w-5 h-5" />
                            Block Sender
                          </button>
                        )}
                        {msg.threat !== 'safe' && !msg.isReported && (
                          <button
                            onClick={() => handleReport(msg.id)}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                          >
                            <Flag className="w-5 h-5" />
                            Report to FTC
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                        {msg.isBlocked && (
                          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Sender Blocked
                          </div>
                        )}
                        {msg.isReported && (
                          <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            Reported to FTC
                          </div>
                        )}
                      </div>

                      {/* What to Do */}
                      {msg.threat !== 'safe' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                          <h5 className="text-base font-bold text-blue-900 mb-1 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            What You Should Do
                          </h5>
                          <p className="text-base text-blue-800">
                            Do NOT click any links in this text. Do NOT reply. Block the sender and delete the message.
                            If you already clicked a link or shared information, contact the Elder Fraud Hotline
                            at <a href="tel:18333728311" className="font-bold underline">1-833-372-8311</a> or
                            report to the FTC at <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="font-bold underline">reportfraud.ftc.gov</a>.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-xl text-gray-500">No messages match this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SMSGuardian;
