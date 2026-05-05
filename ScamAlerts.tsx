import React, { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { activeScamAlerts } from '@/data/scamData';

const ScamAlerts: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const visibleAlerts = activeScamAlerts.filter(
    (alert) => !dismissedIds.includes(alert.id)
  );

  const severityColors = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      badge: 'bg-red-600 text-white',
      icon: 'text-red-600',
      title: 'text-red-900',
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      badge: 'bg-orange-500 text-white',
      icon: 'text-orange-600',
      title: 'text-orange-900',
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      badge: 'bg-yellow-500 text-white',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
    },
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <section id="scam-alerts" className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-red-100 p-3 rounded-xl">
            <Bell className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Active Scam Alerts
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              Current scams being reported in communities like yours
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {visibleAlerts.map((alert) => {
            const colors = severityColors[alert.severity];
            const isExpanded = expandedId === alert.id;

            return (
              <div
                key={alert.id}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl overflow-hidden transition-all duration-300`}
              >
                <div className="p-5 lg:p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`w-7 h-7 ${colors.icon} flex-shrink-0 mt-1`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className={`${colors.badge} px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide`}>
                          {alert.severity}
                        </span>
                        <span className="text-gray-500 text-base">{alert.date}</span>
                      </div>
                      <h3 className={`text-xl lg:text-2xl font-bold ${colors.title} mb-2`}>
                        {alert.title}
                      </h3>
                      {isExpanded && (
                        <p className="text-lg text-gray-700 leading-relaxed mt-3">
                          {alert.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : alert.id)
                        }
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setDismissedIds([...dismissedIds, alert.id])
                        }
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        aria-label="Dismiss alert"
                      >
                        <X className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScamAlerts;
