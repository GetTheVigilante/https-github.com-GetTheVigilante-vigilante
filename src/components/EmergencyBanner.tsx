import React, { useState } from 'react';
import { Phone, X, AlertTriangle, Shield } from 'lucide-react';

const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-red-700 to-rose-700 text-white shadow-2xl border-t-2 border-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Shield className="w-6 h-6 flex-shrink-0" />
            <span className="text-base lg:text-lg font-semibold truncate">
              The Vigilante Emergency Lines:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="tel:18004225678"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm lg:text-base transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Child Safety: 1-800-843-5678</span>
              <span className="md:hidden">Child</span>
            </a>
            <a
              href="tel:18333728311"
              className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-bold text-sm lg:text-base hover:bg-red-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Elder Fraud: 1-833-372-8311</span>
              <span className="md:hidden">Elder</span>
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 hover:bg-red-800 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
