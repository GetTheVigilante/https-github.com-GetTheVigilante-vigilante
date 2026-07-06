import React, { useState } from 'react';
import { Shield, Phone, Mail, Heart, ExternalLink, CheckCircle2, Gamepad2, Users, Lock, Smartphone } from 'lucide-react';


interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-10 h-10 text-violet-400 mx-auto mb-4" />
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">
              Get Weekly Family Safety Alerts
            </h3>
            <p className="text-lg text-slate-300 mb-6">
              Stay informed about the latest scams, predator tactics, and online threats 
              targeting your family. Simple, actionable alerts every week.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-3 bg-green-500/20 border border-green-400/30 rounded-xl p-5">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
                <span className="text-xl font-semibold text-green-300">
                  You are subscribed! Check your email for a confirmation.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className="w-full px-6 py-4 text-lg text-gray-900 rounded-xl border-2 border-transparent focus:border-violet-400 outline-none"
                  />
                  {emailError && (
                    <p className="text-red-300 text-base mt-2 text-left pl-2">
                      {emailError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-violet-700 to-purple-800 p-2 rounded-xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">The Vigilante</span>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              AI-powered full-service family protection — shielding seniors from scams, 
              children from predators, and everyone in between. Now with E2EE on-device scanning.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-900/50 border border-blue-700/50 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Scam Protection
              </div>
              <div className="bg-pink-900/50 border border-pink-700/50 px-3 py-1.5 rounded-lg text-sm font-semibold text-pink-300 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" />
                Child Shield
              </div>
              <div className="bg-emerald-900/50 border border-emerald-700/50 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                E2EE Protection
              </div>
              <div className="bg-slate-800/50 border border-slate-600/50 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Device Shield
              </div>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-5">Protection Tools</h4>
            <ul className="space-y-3">
              {[
                { label: 'AI Scam Checker', section: 'scam-checker' },
                { label: 'Email Vigilante', section: 'email-guardian' },
                { label: 'Call Vigilante', section: 'call-guardian' },
                { label: 'Child Shield', section: 'child-shield' },
                { label: 'Device Shield & E2EE', section: 'device-shield' },
                { label: 'Community Scam Map', section: 'scam-map' },
                { label: 'Protection Steps', section: 'protection-steps' },
                { label: 'Resources', section: 'resources' },
              ].map((link) => (

                <li key={link.section}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-slate-300 hover:text-white text-lg transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Numbers */}
          <div>
            <h4 className="text-xl font-bold mb-5">Emergency Numbers</h4>
            <ul className="space-y-3">
              {[
                { label: 'NCMEC CyberTipline', phone: '1-800-843-5678' },
                { label: 'Elder Fraud Hotline', phone: '1-833-372-8311' },
                { label: 'FTC Fraud Report', phone: '1-877-382-4357' },
                { label: 'AARP Helpline', phone: '1-877-908-3360' },
                { label: 'Social Security', phone: '1-800-772-1213' },
                { label: 'FBI IC3 (Cyber Crime)', phone: '1-800-225-5324' },
              ].map((item) => (
                <li key={item.phone}>
                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white text-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {item.label}: <strong>{item.phone}</strong>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trusted Partners */}
          <div>
            <h4 className="text-xl font-bold mb-5">Trusted Partners</h4>
            <ul className="space-y-3">
              {[
                { label: 'NCMEC', url: 'https://www.missingkids.org' },
                { label: 'FTC', url: 'https://www.ftc.gov' },
                { label: 'FBI IC3', url: 'https://www.ic3.gov' },
                { label: 'AARP', url: 'https://www.aarp.org' },
                { label: 'Internet Watch Foundation', url: 'https://www.iwf.org.uk' },
                { label: 'CISA', url: 'https://www.cisa.gov' },
                { label: 'NetSmartz (NCMEC)', url: 'https://www.netsmartz.org' },
              ].map((partner) => (
                <li key={partner.label}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-300 hover:text-white text-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    {partner.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-base">
            &copy; {new Date().getFullYear()} The Vigilante. Full-service AI-powered family protection.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-base">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>to protect every family member, every age</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
