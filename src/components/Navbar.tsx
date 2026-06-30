import React, { useState } from 'react';
import { Shield, Menu, X, Sparkles, Mail, PhoneCall, User, LogIn, Gamepad2, Map, Lock, Smartphone, MessageSquare } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, openAuthModal, openProfile } = useAuth();

  const navItems = [
    { label: 'AI Scam Checker', section: 'scam-checker', highlight: true, icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Email Vigilante', section: 'email-guardian', highlight: false, icon: <Mail className="w-4 h-4" /> },
    { label: 'SMS Vigilante', section: 'sms-guardian', highlight: false, icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Call Vigilante', section: 'call-guardian', highlight: false, icon: <PhoneCall className="w-4 h-4" /> },
    { label: 'Child Shield', section: 'child-shield', highlight: true, icon: <Gamepad2 className="w-4 h-4" /> },
    { label: 'Device Shield', section: 'device-shield', highlight: true, icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Scam Map', section: 'scam-map', highlight: false, icon: <Map className="w-4 h-4" /> },
  ];



  const handleNav = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white border-b-2 border-violet-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-violet-900 to-purple-800 p-2.5 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-violet-900 leading-tight block">
                The Vigilante
              </span>
              <span className="text-sm text-violet-600 font-medium">
                Full-Service Family Protection
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNav(item.section)}
                className={`px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  item.section === 'child-shield'
                    ? 'text-pink-700 bg-pink-50 hover:bg-pink-100 font-semibold'
                    : item.section === 'device-shield'
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                    : item.section === 'sms-guardian'
                    ? 'text-orange-700 bg-orange-50 hover:bg-orange-100 font-semibold'
                    : item.highlight
                    ? 'text-violet-700 bg-violet-50 hover:bg-violet-100 font-semibold'
                    : 'text-gray-700 hover:text-violet-900 hover:bg-violet-50'
                }`}


              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('report-scam')}
              className="ml-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-xl transition-colors shadow-md"
            >
              Report a Scam
            </button>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={openProfile}
                className="ml-2 flex items-center gap-2 px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-900 font-bold rounded-xl transition-colors border-2 border-violet-200"
              >
                <div className="bg-violet-900 p-1 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="max-w-[120px] truncate">{displayName}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="ml-2 flex items-center gap-2 px-5 py-2.5 bg-violet-900 hover:bg-violet-800 text-white text-base font-bold rounded-xl transition-colors shadow-md"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            {user ? (
              <button
                onClick={openProfile}
                className="p-2.5 bg-violet-50 rounded-xl border-2 border-violet-200"
              >
                <User className="w-6 h-6 text-violet-900" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="p-2.5 bg-violet-900 rounded-xl"
              >
                <LogIn className="w-6 h-6 text-white" />
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-3 rounded-xl hover:bg-violet-50 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <X className="w-8 h-8 text-violet-900" />
              ) : (
                <Menu className="w-8 h-8 text-violet-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-violet-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNav(item.section)}
                className={`w-full text-left px-5 py-4 text-xl font-medium rounded-xl transition-all flex items-center gap-2 ${
                  item.section === 'child-shield'
                    ? 'text-pink-700 bg-pink-50 hover:bg-pink-100 font-semibold'
                    : item.section === 'device-shield'
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                    : item.section === 'sms-guardian'
                    ? 'text-orange-700 bg-orange-50 hover:bg-orange-100 font-semibold'
                    : item.highlight
                    ? 'text-violet-700 bg-violet-50 hover:bg-violet-100 font-semibold'
                    : 'text-gray-700 hover:text-violet-900 hover:bg-violet-50'
                }`}

              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button

              onClick={() => handleNav('report-scam')}
              className="w-full px-5 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl transition-colors mt-3"
            >
              Report a Scam
            </button>

            {/* Mobile Auth */}
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openProfile();
                }}
                className="w-full px-5 py-4 bg-violet-50 text-violet-900 text-xl font-bold rounded-xl transition-colors flex items-center gap-3 border-2 border-violet-200"
              >
                <div className="bg-violet-900 p-1.5 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                My Profile — {displayName}
              </button>
            ) : (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 px-5 py-4 bg-violet-900 hover:bg-violet-800 text-white text-xl font-bold rounded-xl transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('signup');
                  }}
                  className="flex-1 px-5 py-4 bg-violet-50 text-violet-900 text-xl font-bold rounded-xl transition-colors border-2 border-violet-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
