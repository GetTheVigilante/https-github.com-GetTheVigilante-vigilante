import React from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  MailCheck,
  Phone,
  PhoneCall,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Calendar,
  ArrowRight,
  FileText,
  Eye,
  Flag,
  Activity,
  ChevronRight,
} from 'lucide-react';

export interface WeeklyReport {
  id: string;
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  emailsScanned: number;
  threatsBlocked: number;
  callsMonitored: number;
  messagesChecked: number;
  reportsSubmitted: number;
  protectionScore: number;
  previousScore: number;
  scoreTrend: 'up' | 'down' | 'stable';
  trendingScams: {
    name: string;
    severity: 'critical' | 'high' | 'medium';
    description: string;
    count: number;
  }[];
  tips: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  highlights: string[];
  scamBreakdown: {
    type: string;
    count: number;
    percentage: number;
  }[];
}

interface WeeklyReportDetailProps {
  report: WeeklyReport;
  onClose: () => void;
}

const WeeklyReportDetail: React.FC<WeeklyReportDetailProps> = ({ report, onClose }) => {
  const scoreDiff = report.protectionScore - report.previousScore;

  const getTrendIcon = () => {
    if (report.scoreTrend === 'up') return <TrendingUp className="w-6 h-6 text-green-500" />;
    if (report.scoreTrend === 'down') return <TrendingDown className="w-6 h-6 text-red-500" />;
    return <Minus className="w-6 h-6 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (report.scoreTrend === 'up') return 'text-green-600';
    if (report.scoreTrend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'At Risk';
  };

  const severityConfig = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  };

  const priorityConfig = {
    high: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500' },
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Report Header */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-6 lg:px-8 pt-8 pb-8 rounded-t-3xl sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close report"
          >
            <X className="w-7 h-7 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/15 p-2.5 rounded-xl">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Weekly Safety Report
              </h2>
              <div className="flex items-center gap-2 text-blue-200 text-base mt-1">
                <Calendar className="w-4 h-4" />
                {report.weekLabel}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Emails Scanned', value: report.emailsScanned, icon: <MailCheck className="w-5 h-5" /> },
              { label: 'Threats Blocked', value: report.threatsBlocked, icon: <ShieldX className="w-5 h-5" /> },
              { label: 'Calls Monitored', value: report.callsMonitored, icon: <PhoneCall className="w-5 h-5" /> },
              { label: 'Checks Run', value: report.messagesChecked, icon: <Scan className="w-5 h-5" /> },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex justify-center text-white/70 mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Protection Score Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Protection Score
            </h3>

            <div className="flex items-center gap-6">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="#e5e7eb" strokeWidth="8" fill="none"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke={report.protectionScore >= 80 ? '#22c55e' : report.protectionScore >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(report.protectionScore / 100) * 264} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(report.protectionScore)}`}>
                    {report.protectionScore}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ 100</span>
                </div>
              </div>

              <div className="flex-1">
                <div className={`text-lg font-bold ${getScoreColor(report.protectionScore)}`}>
                  {getScoreLabel(report.protectionScore)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon()}
                  <span className={`text-base font-semibold ${getTrendColor()}`}>
                    {scoreDiff > 0 ? '+' : ''}{scoreDiff} from last week
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${getScoreBarColor(report.protectionScore)} h-3 rounded-full transition-all duration-1000`}
                    style={{ width: `${report.protectionScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {report.protectionScore >= 80
                    ? 'Great job! Your protection level is strong. Keep it up!'
                    : report.protectionScore >= 60
                    ? 'Good progress! A few more steps will boost your protection.'
                    : 'Your protection needs attention. Follow the tips below to improve.'}
                </p>
              </div>
            </div>
          </div>

          {/* Week Highlights */}
          {report.highlights.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                This Week's Highlights
              </h3>
              <div className="space-y-2">
                {report.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-base text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Scams in Your Area */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Trending Scams This Week
            </h3>
            <div className="space-y-3">
              {report.trendingScams.map((scam, idx) => {
                const sc = severityConfig[scam.severity];
                return (
                  <div key={idx} className={`${sc.bg} border-2 ${sc.border} rounded-2xl p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                          <span className={`text-lg font-bold ${sc.text}`}>{scam.name}</span>
                          <span className={`${sc.bg} ${sc.text} px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${sc.border}`}>
                            {scam.severity}
                          </span>
                        </div>
                        <p className="text-base text-gray-700 mt-2">{scam.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl font-bold ${sc.text}`}>{scam.count}</div>
                        <div className="text-xs text-gray-500">reports</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scam Type Breakdown */}
          {report.scamBreakdown.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Scam Types Detected
              </h3>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-4">
                {report.scamBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-semibold text-gray-800">{item.type}</span>
                      <span className="text-sm font-bold text-gray-600">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Tips */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Personalized Safety Tips
            </h3>
            <div className="space-y-3">
              {report.tips.map((tip, idx) => {
                const pc = priorityConfig[tip.priority];
                return (
                  <div key={idx} className={`${pc.bg} border-2 ${pc.border} rounded-2xl p-5`}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className={`w-6 h-6 ${pc.icon} flex-shrink-0 mt-0.5`} />
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{tip.title}</h4>
                        <p className="text-base text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Delivery Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center">
            <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-blue-900">Email Delivery Coming Soon</h4>
            <p className="text-base text-blue-700 mt-1">
              Weekly reports will be delivered to your email automatically once email service is configured.
              For now, you can view all your reports right here in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportDetail;
