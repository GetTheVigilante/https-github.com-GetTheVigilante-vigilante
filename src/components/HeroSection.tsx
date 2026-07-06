import React from 'react';
import { Shield, ArrowDown, AlertTriangle, Sparkles, Mail, PhoneCall, LogIn, User, Gamepad2, Users, Lock, Smartphone, Fingerprint } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { user, profile, openAuthModal, openProfile } = useAuth();
  const displayName = profile?.display_name || user?.email?.split('@')[0] || '';

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-blue-950" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-pink-400 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-48 h-48 bg-emerald-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Welcome Banner for logged-in users */}
        {user && (
          <div className="mb-8">
            <button
              onClick={openProfile}
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3 rounded-2xl transition-all group"
            >
              <div className="bg-green-500 p-2 rounded-xl">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">
                  Welcome back, {displayName}!
                </div>
                <div className="text-violet-200 text-sm">
                  Click to view your family protection dashboard
                </div>
              </div>
              <ArrowDown className="w-5 h-5 text-violet-200 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Alert Badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 px-5 py-2.5 rounded-full text-lg font-medium mb-8">
              <AlertTriangle className="w-5 h-5" />
              <span>Protecting Every Family Member — Every Device — Every Encryption</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              The{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Vigilante.</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-4xl text-blue-200">
                Full-Service Family Protection
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              One unified AI engine that spots <strong>"urgent money"</strong> language in grandma's emails 
              and <strong>grooming phrases</strong> in your kids' chats — even inside <strong>E2EE apps</strong> like 
              Signal, WhatsApp, and iMessage. On-device scanning, zero privacy compromise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('scam-checker')}
                className="px-8 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                AI Scam Checker
              </button>
              <button
                onClick={() => onNavigate('child-shield')}
                className="px-8 py-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-3"
              >
                <Gamepad2 className="w-6 h-6" />
                Child Shield
              </button>
              <button
                onClick={() => onNavigate('device-shield')}
                className="px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
              >
                <Lock className="w-6 h-6" />
                E2EE Scanner
              </button>
            </div>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('email-guardian')}
                className="flex items-center gap-2 bg-blue-800/50 border border-blue-600/30 text-blue-200 px-4 py-2.5 rounded-full text-base font-medium hover:bg-blue-700/50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Vigilante
              </button>
              <button
                onClick={() => onNavigate('call-guardian')}
                className="flex items-center gap-2 bg-emerald-800/50 border border-emerald-600/30 text-emerald-200 px-4 py-2.5 rounded-full text-base font-medium hover:bg-emerald-700/50 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Call Vigilante
              </button>
              <button
                onClick={() => onNavigate('device-shield')}
                className="flex items-center gap-2 bg-teal-800/50 border border-teal-600/30 text-teal-200 px-4 py-2.5 rounded-full text-base font-medium hover:bg-teal-700/50 transition-colors"
              >
                <Lock className="w-4 h-4" />
                E2EE Protection
              </button>
              <button
                onClick={() => onNavigate('device-shield')}
                className="flex items-center gap-2 bg-slate-700/50 border border-slate-500/30 text-slate-200 px-4 py-2.5 rounded-full text-base font-medium hover:bg-slate-600/50 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Device-Level AI
              </button>
              <button
                onClick={() => onNavigate('device-shield')}
                className="flex items-center gap-2 bg-amber-800/50 border border-amber-600/30 text-amber-200 px-4 py-2.5 rounded-full text-base font-medium hover:bg-amber-700/50 transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                Consent-First
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2.4M+</div>
                <div className="text-blue-200 text-lg">Families Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$180M+</div>
                <div className="text-blue-200 text-lg">Scams Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">12K+</div>
                <div className="text-blue-200 text-lg">Predators Flagged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">12</div>
                <div className="text-blue-200 text-lg">E2EE Apps Covered</div>
              </div>
            </div>
          </div>

          {/* Right Content - Protection Cards */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-400/20 to-emerald-400/20 rounded-3xl blur-xl" />
              
              {/* Protection Grid */}
              <div className="relative grid grid-cols-2 gap-4">
                {/* Senior Protection */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">Senior Scam Protection</div>
                      <div className="text-blue-200">Email scanning, call monitoring, AI scam detection</div>
                    </div>
                    <div className="ml-auto bg-green-500/20 px-3 py-1 rounded-full">
                      <span className="text-green-400 text-sm font-bold">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Child Protection */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-500/20 p-3 rounded-xl">
                      <Gamepad2 className="w-8 h-8 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">Child Predator Shield</div>
                      <div className="text-pink-200">Gaming chats, social media, messaging apps</div>
                    </div>
                    <div className="ml-auto bg-green-500/20 px-3 py-1 rounded-full">
                      <span className="text-green-400 text-sm font-bold">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* E2EE Device Shield */}
                <div className="bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-5 col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/20 p-3 rounded-xl">
                      <Lock className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">E2EE Device Shield</div>
                      <div className="text-emerald-200">Signal, WhatsApp, iMessage — on-device AI scanning</div>
                    </div>
                    <div className="ml-auto bg-emerald-500/20 px-3 py-1 rounded-full">
                      <span className="text-emerald-400 text-sm font-bold">E2EE SAFE</span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                  <Mail className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">847</div>
                  <div className="text-blue-200 text-sm">Scam Emails Blocked</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                  <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">E2EE</div>
                  <div className="text-emerald-200 text-sm">Encryption Preserved</div>
                </div>
              </div>

              {/* Floating Alert Card */}
              <div className="absolute -top-4 -right-4 bg-red-600 rounded-2xl shadow-xl p-4 max-w-[220px] animate-pulse">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Threat Blocked</div>
                    <div className="text-red-200 text-xs">Grooming attempt on Signal</div>
                  </div>
                </div>
              </div>

              {/* E2EE Privacy Badge */}
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 rounded-2xl shadow-xl p-4 max-w-[240px]">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-white flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Privacy Preserved</div>
                    <div className="text-emerald-200 text-xs">On-device scan — E2EE intact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate('scam-checker')}
            className="inline-flex flex-col items-center text-violet-200 hover:text-white transition-colors"
          >
            <span className="text-lg mb-2">Explore Full Family Protection</span>
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
