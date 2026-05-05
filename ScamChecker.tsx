import React, { useState, useRef } from 'react';
import {
  Scan,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Save,
  LogIn,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AnalysisResult {
  verdict: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  title: string;
  explanation: string;
  redFlags: string[];
  safeSignals: string[];
  advice: string;
  scamType: string;
}

const messageTypes = [
  { value: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
  { value: 'text message', label: 'Text / SMS', icon: <MessageSquare className="w-5 h-5" /> },
  { value: 'phone call', label: 'Phone Call', icon: <Phone className="w-5 h-5" /> },
  { value: 'other', label: 'Other', icon: <FileText className="w-5 h-5" /> },
];

const exampleMessages = [
  {
    label: 'Suspicious IRS call',
    type: 'phone call',
    text: 'I received a phone call from someone claiming to be from the IRS. They said I owe $4,500 in back taxes and that a warrant has been issued for my arrest. They said I need to pay immediately using Apple gift cards or I will be arrested today. They gave me a badge number and told me not to hang up or tell anyone.',
  },
  {
    label: 'Fake bank email',
    type: 'email',
    text: 'Subject: Urgent - Your Bank of America Account Has Been Compromised\n\nDear Valued Customer,\n\nWe have detected unauthorized access to your account. Your account has been temporarily suspended. Please click the link below to verify your identity and restore access:\n\nhttp://bankofamerica-secure-verify.com/restore\n\nIf you do not verify within 24 hours, your account will be permanently closed.\n\nBank of America Security Team',
  },
  {
    label: 'Grandchild emergency',
    type: 'phone call',
    text: 'I got a call from someone who sounded like my grandson. He said "Grandma, it\'s me, I\'m in trouble." He said he was in a car accident in another state and got arrested. He said he needs $3,000 for bail and begged me not to tell his parents because they would be upset. He asked me to send the money through Western Union.',
  },
  {
    label: 'Legitimate appointment',
    type: 'text message',
    text: 'Reminder: You have an appointment with Dr. Smith at Valley Medical Center on Tuesday, April 2nd at 2:30 PM. Reply YES to confirm or call 555-0123 to reschedule. Reply STOP to opt out of reminders.',
  },
];

const ScamChecker: React.FC = () => {
  const { user, saveScamCheck, openAuthModal } = useAuth();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    if (!message.trim() || message.trim().length < 10) {
      setError('Please enter at least 10 characters so we can analyze the message properly.');
      return;
    }

    setError('');
    setResult(null);
    setIsAnalyzing(true);
    setSaved(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-scam', {
        body: { message: message.trim(), messageType },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to analyze message');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.analysis) {
        setResult(data.analysis);

        // Auto-save if user is logged in
        if (user) {
          try {
            await saveScamCheck({
              message_type: messageType,
              message_text: message.trim(),
              verdict: data.analysis.verdict,
              confidence: data.analysis.confidence,
              scam_type: data.analysis.scamType || '',
              title: data.analysis.title || '',
              explanation: data.analysis.explanation || '',
              red_flags: data.analysis.redFlags || [],
              safe_signals: data.analysis.safeSignals || [],
              advice: data.analysis.advice || '',
            });
            setSaved(true);
          } catch (saveErr) {
            console.error('Failed to save scam check:', saveErr);
          }
        }

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      } else {
        throw new Error('No analysis returned');
      }
    } catch (err: any) {
      setError(
        err.message ||
          'We are having trouble right now. Please try again in a moment, or call the Elder Fraud Hotline at 1-833-372-8311.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTryExample = (example: typeof exampleMessages[0]) => {
    setMessage(example.text);
    setMessageType(example.type);
    setResult(null);
    setError('');
    setSaved(false);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setMessage('');
    setResult(null);
    setError('');
    setSaved(false);
    textareaRef.current?.focus();
  };

  const verdictConfig = {
    safe: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      headerBg: 'bg-gradient-to-r from-green-600 to-emerald-600',
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      label: 'Looks Safe',
      labelColor: 'text-green-700',
      barColor: 'bg-green-500',
      badgeBg: 'bg-green-100 text-green-800',
    },
    suspicious: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      icon: <ShieldAlert className="w-10 h-10 text-white" />,
      label: 'Suspicious — Be Careful',
      labelColor: 'text-amber-700',
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    scam: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      headerBg: 'bg-gradient-to-r from-red-600 to-rose-600',
      icon: <ShieldX className="w-10 h-10 text-white" />,
      label: 'Likely a Scam',
      labelColor: 'text-red-700',
      barColor: 'bg-red-500',
      badgeBg: 'bg-red-100 text-red-800',
    },
  };

  return (
    <section id="scam-checker" className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-blue-950 to-blue-900" />
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <Sparkles className="w-5 h-5" />
            AI-Powered Protection
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">

            Is This a Scam?{' '}
            <span className="text-cyan-400">Let The Vigilante Check.</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Paste a suspicious email, text message, or describe a phone call you
            received. Our AI will analyze it instantly and tell you if it is safe
            or dangerous.
          </p>

          {!user && (
            <button
              onClick={() => openAuthModal('signup')}
              className="mt-4 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-base font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in to save your scam check history
            </button>
          )}
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Message Type Selector */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <label className="block text-base font-semibold text-gray-600 mb-3">
              What type of message did you receive?
            </label>
            <div className="flex flex-wrap gap-2">
              {messageTypes.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => setMessageType(mt.value)}
                  className={`flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                    messageType === mt.value
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-800'
                  }`}
                >
                  {mt.icon}
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="p-6">
            <label
              htmlFor="scam-input"
              className="block text-lg font-bold text-gray-900 mb-3"
            >
              Paste or type the suspicious message below:
            </label>
            <textarea
              ref={textareaRef}
              id="scam-input"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError('');
              }}
              rows={8}
              placeholder={
                messageType === 'phone call'
                  ? 'Describe the phone call you received. For example: "Someone called claiming to be from Medicare and asked for my Social Security number..."'
                  : messageType === 'email'
                  ? 'Paste the email content here. Include the subject line if possible...'
                  : messageType === 'text message'
                  ? 'Paste the text message here. For example: "Your package could not be delivered. Click here to reschedule..."'
                  : 'Paste or describe the suspicious message here...'
              }
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none leading-relaxed"
              disabled={isAnalyzing}
            />

            {/* Character count */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-400">
                {message.length > 0 ? `${message.length} characters` : ''}
              </span>
              {message.length > 0 && (
                <button
                  onClick={() => {
                    setMessage('');
                    setError('');
                  }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-lg text-red-700">{error}</p>
              </div>
            )}

            {/* Examples Toggle */}
            <div className="mt-4">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <Info className="w-5 h-5" />
                {showExamples ? 'Hide examples' : 'Not sure? Try an example'}
                {showExamples ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showExamples && (
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {exampleMessages.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTryExample(ex)}
                      className="text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                    >
                      <span className="text-base font-semibold text-blue-900">
                        {ex.label}
                      </span>
                      <span className="block text-sm text-blue-600 mt-0.5 truncate">
                        {ex.text.substring(0, 60)}...
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || message.trim().length < 10}
              className={`w-full mt-6 py-5 text-xl font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
                isAnalyzing
                  ? 'bg-blue-400 text-white cursor-wait'
                  : message.trim().length < 10
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing — This takes just a moment...
                </>
              ) : (
                <>
                  <Scan className="w-6 h-6" />
                  Check This Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-400/30 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-xl text-white font-semibold mb-2">
              The Vigilante is carefully reviewing your message...

            </p>
            <p className="text-lg text-blue-200">
              Checking for known scam patterns, suspicious language, and red flags.
            </p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div ref={resultRef} className="mt-8 scroll-mt-24">
            {(() => {
              const config = verdictConfig[result.verdict];
              return (
                <div
                  className={`${config.bg} ${config.border} border-2 rounded-3xl overflow-hidden shadow-xl`}
                >
                  {/* Verdict Header */}
                  <div className={`${config.headerBg} px-6 lg:px-8 py-6`}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl">
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-2xl lg:text-3xl font-bold text-white">
                            {config.label}
                          </h3>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {result.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-lg text-white/80 mt-1">
                          {result.title}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div
                          className="bg-white h-2.5 rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 lg:px-8 py-6 space-y-6">
                    {/* Saved indicator */}
                    {saved && (
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-base font-semibold">
                        <Save className="w-4 h-4" />
                        Saved to your profile
                      </div>
                    )}

                    {/* Sign in to save prompt */}
                    {!user && (
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-base font-semibold transition-colors border border-blue-200"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign in to save this result to your history
                      </button>
                    )}

                    {/* Scam Type Badge */}
                    {result.scamType && result.scamType !== 'None Detected' && (
                      <div className={`inline-flex items-center gap-2 ${config.badgeBg} px-4 py-2 rounded-xl text-base font-bold`}>
                        <AlertTriangle className="w-5 h-5" />
                        Identified as: {result.scamType}
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        What The Vigilante Found

                      </h4>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>

                    {/* Red Flags */}
                    {result.redFlags && result.redFlags.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                          <XCircle className="w-6 h-6 text-red-500" />
                          Red Flags Found
                        </h4>
                        <ul className="space-y-2">
                          {result.redFlags.map((flag, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-base text-red-800"
                            >
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safe Signals */}
                    {result.safeSignals && result.safeSignals.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                        <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                          Safe Signals
                        </h4>
                        <ul className="space-y-2">
                          {result.safeSignals.map((signal, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-base text-green-800"
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Advice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                      <h4 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        What You Should Do
                      </h4>
                      <p className="text-lg text-blue-800 leading-relaxed">
                        {result.advice}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleReset}
                        className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Check Another Message
                      </button>
                      {result.verdict !== 'safe' && (
                        <a
                          href="tel:18333728311"
                          className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-5 h-5" />
                          Call Elder Fraud Hotline
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Disclaimer */}
            <p className="mt-4 text-center text-sm text-blue-300/70">
              This AI analysis is a helpful guide but not a guarantee. When in
              doubt, always verify directly with the organization or call a
              trusted family member.
            </p>
          </div>
        )}

        {/* Trust Note */}
        {!result && !isAnalyzing && (
          <div className="mt-8 flex items-center justify-center gap-3 text-blue-300/60">
            <ShieldCheck className="w-5 h-5" />
            <p className="text-base">
              Your messages are analyzed securely and are never stored or shared.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScamChecker;
