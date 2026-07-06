import React, { useState, useCallback } from 'react';
import {
  Mail,
  Shield,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Inbox,
  Trash2,
  Link2,
  Unlink,
  Loader2,
  Settings,
  Bell,
  BellOff,
  MailWarning,
  MailCheck,
  MailX,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';



interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface ScannedEmail {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  date: string;
  threat: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  redFlags: string[];
  safeSignals: string[];
  scamType?: string;
}

const emailProviders: EmailProvider[] = [
  { id: 'gmail', name: 'Gmail', icon: 'G', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200 hover:border-red-400' },
  { id: 'outlook', name: 'Outlook', icon: 'O', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
  { id: 'yahoo', name: 'Yahoo Mail', icon: 'Y', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200 hover:border-purple-400' },
  { id: 'aol', name: 'AOL Mail', icon: 'A', color: 'text-blue-800', bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
];

const mockScannedEmails: ScannedEmail[] = [
  {
    id: 1,
    from: 'IRS Tax Department',
    fromEmail: 'irs-refund@tax-claim-center.com',
    subject: 'URGENT: Your Tax Refund of $4,832.00 is Pending',
    preview: 'Dear Taxpayer, Your federal tax refund has been approved. Click the link below to claim your refund within 24 hours or it will be forfeited...',
    date: '2 hours ago',
    threat: 'scam',
    confidence: 97,
    redFlags: [
      'Fake IRS email — IRS never contacts by email for refunds',
      'Urgency tactic: "24 hours or forfeited"',
      'Suspicious domain: tax-claim-center.com is not irs.gov',
      'Asks you to click a link to "claim" money',
    ],
    safeSignals: [],
    scamType: 'IRS Impersonation Scam',
  },
  {
    id: 2,
    from: 'Bank of America Security',
    fromEmail: 'security-alert@boa-verify-account.net',
    subject: 'Account Suspended — Verify Your Identity Now',
    preview: 'We detected unusual activity on your Bank of America account. Your account has been temporarily suspended. Please verify your identity immediately...',
    date: '5 hours ago',
    threat: 'scam',
    confidence: 95,
    redFlags: [
      'Fake bank domain: boa-verify-account.net is not bankofamerica.com',
      'Claims account is "suspended" to create panic',
      'Asks you to verify identity via email link',
      'Uses fear and urgency to bypass your judgment',
    ],
    safeSignals: [],
    scamType: 'Bank Phishing Scam',
  },
  {
    id: 3,
    from: 'Amazon Customer Service',
    fromEmail: 'order-confirm@amazon.com',
    subject: 'Your Amazon Order #112-4839271 Has Shipped',
    preview: 'Hello, your order of Kindle Paperwhite has shipped and will arrive by Thursday. Track your package at...',
    date: '8 hours ago',
    threat: 'safe',
    confidence: 92,
    redFlags: [],
    safeSignals: [
      'Sent from legitimate amazon.com domain',
      'References a specific order number',
      'No urgent demands or threats',
      'Standard shipping notification format',
    ],
  },
  {
    id: 4,
    from: 'Medicare Benefits Center',
    fromEmail: 'benefits@medicare-new-card.org',
    subject: 'Your New Medicare Card is Ready — Call Now',
    preview: 'Dear Medicare Beneficiary, Your new Medicare card with enhanced benefits is ready. Call 1-800-555-0199 to activate your card and receive your free...',
    date: '1 day ago',
    threat: 'scam',
    confidence: 94,
    redFlags: [
      'Medicare never emails about new cards',
      'Fake domain: medicare-new-card.org is not medicare.gov',
      'Asks you to call a suspicious number',
      'Promises "free" items to lure you in',
    ],
    safeSignals: [],
    scamType: 'Medicare Fraud',
  },
  {
    id: 5,
    from: 'Dr. Smith Office',
    fromEmail: 'appointments@valleymedical.org',
    subject: 'Appointment Reminder — Tuesday at 2:30 PM',
    preview: 'This is a reminder that you have an appointment with Dr. Smith on Tuesday, April 2nd at 2:30 PM. Please arrive 15 minutes early...',
    date: '1 day ago',
    threat: 'safe',
    confidence: 88,
    redFlags: [],
    safeSignals: [
      'Legitimate medical office domain',
      'Standard appointment reminder format',
      'No requests for personal information',
      'No links to click or payments to make',
    ],
  },
  {
    id: 6,
    from: 'Prize Notification Center',
    fromEmail: 'winner@international-lottery-uk.com',
    subject: 'Congratulations! You Have Won $750,000.00!',
    preview: 'We are pleased to inform you that your email was selected in our international sweepstakes. To claim your prize of $750,000, please send a processing fee of...',
    date: '2 days ago',
    threat: 'scam',
    confidence: 99,
    redFlags: [
      'You cannot win a lottery you never entered',
      'Asks for upfront "processing fee"',
      'International lottery scam pattern',
      'Claims your email was "randomly selected"',
    ],
    safeSignals: [],
    scamType: 'Lottery/Prize Scam',
  },
  {
    id: 7,
    from: 'Netflix',
    fromEmail: 'info@netflix.com',
    subject: 'New login to your account',
    preview: 'Hi, a new device logged into your Netflix account. If this was you, no action is needed. If not, please secure your account...',
    date: '2 days ago',
    threat: 'suspicious',
    confidence: 65,
    redFlags: [
      'Could be a phishing attempt mimicking Netflix',
      'Contains a link to "secure your account"',
    ],
    safeSignals: [
      'Appears to come from netflix.com domain',
      'Standard security notification format',
      'Does not demand immediate payment',
    ],
  },
  {
    id: 8,
    from: 'Social Security Administration',
    fromEmail: 'ssa-benefits@social-security-update.com',
    subject: 'Your Social Security Number Has Been Compromised',
    preview: 'ALERT: Your Social Security number has been used in suspicious activity. Your benefits will be suspended unless you verify your identity by calling...',
    date: '3 days ago',
    threat: 'scam',
    confidence: 98,
    redFlags: [
      'SSA never emails about compromised numbers',
      'Fake domain: social-security-update.com is not ssa.gov',
      'Threatens to suspend benefits',
      'Demands immediate phone call to verify identity',
    ],
    safeSignals: [],
    scamType: 'Social Security Scam',
  },
];

const EmailGuardian: React.FC = () => {
  const { user, updateGuardianSettings, incrementStat, openAuthModal } = useAuth();
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [emails, setEmails] = useState<ScannedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ScannedEmail | null>(null);
  const [filter, setFilter] = useState<'all' | 'scam' | 'suspicious' | 'safe'>('all');
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const handleConnect = useCallback((providerId: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setConnectedProvider(providerId);
      setIsConnecting(false);
      if (user) {
        updateGuardianSettings({
          email_provider: providerId,
          email_connected: true,
          email_auto_scan: true,
        });
      }
      handleScan();
    }, 2000);
  }, [user, updateGuardianSettings]);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setEmails([]);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);
      setScanComplete(true);
      setEmails(mockScannedEmails);
      if (user) {
        incrementStat('emails_scanned', mockScannedEmails.length);
        const scams = mockScannedEmails.filter(e => e.threat === 'scam').length;
        if (scams > 0) incrementStat('scams_blocked', scams);
      }
    }, 3000);
  }, [user, incrementStat]);

  const handleDisconnect = () => {
    setConnectedProvider(null);
    setScanComplete(false);
    setEmails([]);
    setSelectedEmail(null);
    if (user) {
      updateGuardianSettings({
        email_provider: '',
        email_connected: false,
      });
    }
  };

  const handleDeleteEmail = (id: number) => {
    setEmails(emails.filter((e) => e.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const filteredEmails = filter === 'all' ? emails : emails.filter((e) => e.threat === filter);

  const scamCount = emails.filter((e) => e.threat === 'scam').length;
  const suspiciousCount = emails.filter((e) => e.threat === 'suspicious').length;
  const safeCount = emails.filter((e) => e.threat === 'safe').length;

  const threatIcon = (threat: string) => {
    switch (threat) {
      case 'scam': return <MailX className="w-6 h-6 text-red-500" />;
      case 'suspicious': return <MailWarning className="w-6 h-6 text-amber-500" />;
      default: return <MailCheck className="w-6 h-6 text-green-500" />;
    }
  };

  const threatBadge = (threat: string, confidence: number) => {
    const config = {
      scam: { bg: 'bg-red-100 text-red-700 border-red-200', label: 'SCAM DETECTED' },
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
    <section id="email-guardian" className="relative py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50 to-white" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-800 px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <Mail className="w-5 h-5" />
            Email Vigilante
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Protect Your <span className="text-blue-700">Inbox</span> Automatically
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect your email account and let The Vigilante automatically scan every incoming
            message for phishing, fraud, and scam attempts. Get instant alerts when danger is found.
          </p>
        </div>

        {!connectedProvider && !isConnecting && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Inbox className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Connect Your Email
                </h3>
                <p className="text-lg text-blue-200 max-w-lg mx-auto">
                  Choose your email provider below. The Vigilante will scan your inbox for dangerous
                  messages and alert you immediately.
                </p>
              </div>

              <div className="p-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {emailProviders.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleConnect(provider.id)}
                      className={`${provider.bgColor} border-2 rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-lg group`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${provider.color} bg-white shadow-sm`}>
                        {provider.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-gray-900">{provider.name}</div>
                        <div className="text-base text-gray-500">Click to connect</div>
                      </div>
                      <Link2 className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-bold text-blue-900 mb-1">Your Privacy is Protected</h4>
                      <p className="text-base text-blue-700 leading-relaxed">
                        We only scan email headers and content for scam patterns. We never read, store,
                        or share your personal emails. You can disconnect at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-12 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
                <Mail className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Connecting to Your Email...</h3>
              <p className="text-lg text-gray-600">Securely establishing connection. This will only take a moment.</p>
            </div>
          </div>
        )}

        {connectedProvider && !isConnecting && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2.5 rounded-xl">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      Connected to {emailProviders.find((p) => p.id === connectedProvider)?.name}
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-base text-gray-500">
                      {autoScanEnabled ? 'The Vigilante is auto-scanning — checking new emails continuously' : 'Auto-scan paused'}
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
                    onClick={handleScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Now'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors"
                  >
                    <Unlink className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>

              {showSettings && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {autoScanEnabled ? <Bell className="w-5 h-5 text-blue-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
                      <div>
                        <div className="text-base font-bold text-gray-900">Auto-Scan New Emails</div>
                        <div className="text-sm text-gray-500">Automatically check every new email as it arrives</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${autoScanEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${autoScanEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isScanning && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Vigilante is Scanning Your Inbox...</h3>
                <p className="text-lg text-gray-600 mb-4">Analyzing emails for phishing, fraud, and scam patterns</p>
                <div className="max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.min(scanProgress, 100)}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{Math.min(Math.round(scanProgress), 100)}% complete</p>
                </div>
              </div>
            )}

            {scanComplete && !isScanning && (
              <>
                {scamCount > 0 && (
                  <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{scamCount} Scam Email{scamCount > 1 ? 's' : ''} Detected!</h3>
                        <p className="text-lg text-red-100">The Vigilante found dangerous emails in your inbox. Do NOT click any links or reply to these messages.</p>
                      </div>
                      <ShieldX className="w-12 h-12 text-red-200 hidden lg:block" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border-2 border-red-200 p-5 text-center">
                    <MailX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-600">{scamCount}</div>
                    <div className="text-base font-semibold text-red-700">Scams Found</div>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 text-center">
                    <MailWarning className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-amber-600">{suspiciousCount}</div>
                    <div className="text-base font-semibold text-amber-700">Suspicious</div>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-green-200 p-5 text-center">
                    <MailCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600">{safeCount}</div>
                    <div className="text-base font-semibold text-green-700">Safe</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all' as const, label: `All (${emails.length})` },
                    { value: 'scam' as const, label: `Scams (${scamCount})` },
                    { value: 'suspicious' as const, label: `Suspicious (${suspiciousCount})` },
                    { value: 'safe' as const, label: `Safe (${safeCount})` },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                        filter === f.value
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`bg-white rounded-2xl border-2 transition-all hover:shadow-md cursor-pointer ${
                        email.threat === 'scam'
                          ? 'border-red-200 hover:border-red-400'
                          : email.threat === 'suspicious'
                          ? 'border-amber-200 hover:border-amber-400'
                          : 'border-gray-200 hover:border-green-400'
                      } ${selectedEmail?.id === email.id ? 'ring-4 ring-blue-200' : ''}`}
                      onClick={() => setSelectedEmail(selectedEmail?.id === email.id ? null : email)}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {threatIcon(email.threat)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <span className="text-lg font-bold text-gray-900 truncate">{email.from}</span>
                              {threatBadge(email.threat, email.confidence)}
                            </div>
                            <div className="text-sm text-gray-500 mb-1 truncate">{email.fromEmail}</div>
                            <div className="text-base font-semibold text-gray-800 mb-1">{email.subject}</div>
                            <div className="text-base text-gray-500 truncate">{email.preview}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm text-gray-400 whitespace-nowrap">{email.date}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteEmail(email.id); }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete from inbox"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {selectedEmail?.id === email.id && (
                        <div className="border-t-2 border-gray-100 p-5 bg-gray-50 rounded-b-2xl">
                          {email.scamType && (
                            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-xl text-base font-bold mb-4">
                              <AlertTriangle className="w-5 h-5" />
                              {email.scamType}
                            </div>
                          )}

                          {email.redFlags.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                              <h4 className="text-base font-bold text-red-900 mb-2 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                Red Flags Found
                              </h4>
                              <ul className="space-y-1.5">
                                {email.redFlags.map((flag, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-base text-red-800">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                    {flag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {email.safeSignals.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                              <h4 className="text-base font-bold text-green-900 mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Safe Signals
                              </h4>
                              <ul className="space-y-1.5">
                                {email.safeSignals.map((signal, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-base text-green-800">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                    {signal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {email.threat !== 'safe' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                              <h4 className="text-base font-bold text-blue-900 mb-1 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                What You Should Do
                              </h4>
                              <p className="text-base text-blue-800">
                                Do NOT click any links in this email. Do NOT reply. Delete it from your inbox.
                                If you already clicked a link or shared information, call the Elder Fraud Hotline
                                at <a href="tel:18333728311" className="font-bold underline">1-833-372-8311</a> immediately.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredEmails.length === 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
                    <MailCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-xl text-gray-500">No emails match this filter.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmailGuardian;
