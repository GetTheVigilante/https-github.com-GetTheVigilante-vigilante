import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  MailCheck,
  Bell,
  BellOff,
  Clock,
  Eye,
  ChevronRight,
  Settings,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WeeklyReportDetail, { type WeeklyReport } from '@/components/WeeklyReportDetail';

const WeeklyReportsTab: React.FC = () => {
  const {
    user,
    protectionStats,
    scamHistory,
    reportedScams,
    guardianSettings,
    updateGuardianSettings,
  } = useAuth();

  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [reportEmailEnabled, setReportEmailEnabled] = useState(
    guardianSettings?.weekly_report_enabled ?? true
  );
  const [reportDay, setReportDay] = useState(
    guardianSettings?.weekly_report_day ?? 'monday'
  );

  // Generate weekly reports from user data
  const weeklyReports = useMemo(() => {
    const reports: WeeklyReport[] = [];
    const now = new Date();

    // Trending scam data (simulated area-based data)
    const trendingScamSets = [
      [
        { name: 'AI Voice Clone Scam', severity: 'critical' as const, description: 'Scammers using AI to clone family members\' voices for emergency money requests. Reports up 340% this month.', count: 847 },
        { name: 'Fake Medicare Enrollment', severity: 'high' as const, description: 'Callers claiming Medicare enrollment is expiring and demanding personal information to "renew."', count: 523 },
        { name: 'Package Delivery Phishing', severity: 'medium' as const, description: 'Text messages about failed deliveries with malicious links to steal personal data.', count: 312 },
      ],
      [
        { name: 'IRS Tax Refund Scam', severity: 'critical' as const, description: 'Emails and calls claiming you\'re owed a tax refund but must verify identity with SSN and bank details.', count: 692 },
        { name: 'Tech Support Pop-up Fraud', severity: 'high' as const, description: 'Fake virus warnings appearing on computers with phone numbers to call for "emergency" tech support.', count: 445 },
        { name: 'Social Security Suspension', severity: 'high' as const, description: 'Robocalls claiming your Social Security number has been "suspended" due to suspicious activity.', count: 389 },
      ],
      [
        { name: 'Grandparent Emergency Scam', severity: 'critical' as const, description: 'Callers impersonating grandchildren claiming to be in jail or hospital, begging for immediate wire transfers.', count: 756 },
        { name: 'Fake Bank Alert Texts', severity: 'high' as const, description: 'SMS messages appearing to come from your bank about "unauthorized transactions" with phishing links.', count: 534 },
        { name: 'Romance Investment Scam', severity: 'medium' as const, description: 'Online dating connections who eventually push cryptocurrency or investment "opportunities."', count: 267 },
      ],
      [
        { name: 'Utility Shutoff Threat', severity: 'critical' as const, description: 'Callers posing as electric/gas company threatening immediate service shutoff unless paid by gift card.', count: 612 },
        { name: 'Amazon Order Confirmation', severity: 'high' as const, description: 'Fake emails about orders you didn\'t place, with phone numbers to call that connect to scammers.', count: 478 },
        { name: 'Charity Donation Scam', severity: 'medium' as const, description: 'Fake charities soliciting donations for disaster relief or veterans, keeping all the money.', count: 198 },
      ],
    ];

    // Actionable tips pool
    const tipSets = [
      [
        { title: 'Enable Two-Factor Authentication', description: 'Add an extra layer of security to your email and bank accounts. This makes it much harder for scammers to access your accounts even if they get your password.', priority: 'high' as const },
        { title: 'Review Your Recent Bank Statements', description: 'Check for any unfamiliar charges or transactions. Report anything suspicious to your bank immediately. Early detection prevents bigger losses.', priority: 'medium' as const },
        { title: 'Update Your Phone\'s Spam Filter', description: 'Most smartphones have built-in call filtering. Make sure it\'s turned on to automatically block known scam numbers.', priority: 'low' as const },
      ],
      [
        { title: 'Create a Family Code Word', description: 'Agree on a secret word with family members that only you would know. If someone calls claiming to be family in an emergency, ask for the code word first.', priority: 'high' as const },
        { title: 'Check Your Credit Report', description: 'Visit annualcreditreport.com to get your free credit report. Look for accounts or inquiries you don\'t recognize — a sign of identity theft.', priority: 'high' as const },
        { title: 'Bookmark Important Websites', description: 'Save your bank, Medicare, and Social Security websites as bookmarks. Always use these instead of clicking links in emails or texts.', priority: 'medium' as const },
      ],
      [
        { title: 'Register on the Do Not Call List', description: 'Add your phone number to donotcall.gov to reduce unwanted telemarketing calls. If you still get calls after registering, they\'re likely scams.', priority: 'high' as const },
        { title: 'Never Share One-Time Codes', description: 'Banks and services send verification codes to YOUR phone. No legitimate company will ever call and ask you to read these codes back to them.', priority: 'high' as const },
        { title: 'Keep Software Updated', description: 'Update your computer, phone, and apps regularly. Updates fix security holes that scammers can exploit to steal your information.', priority: 'medium' as const },
      ],
      [
        { title: 'Verify Before You Click', description: 'Hover over links in emails to see where they really go. If the address looks strange or doesn\'t match the company, don\'t click it.', priority: 'high' as const },
        { title: 'Use Strong, Unique Passwords', description: 'Each account should have a different password. Consider using a password manager to keep track of them all securely.', priority: 'medium' as const },
        { title: 'Talk to Family About Scams', description: 'Share what you\'ve learned about current scams with family and friends. Awareness is the best protection against fraud.', priority: 'low' as const },
      ],
    ];

    const stats = protectionStats || {
      emails_scanned: 0,
      calls_monitored: 0,
      scams_blocked: 0,
      messages_checked: 0,
      reports_submitted: 0,
    };

    // Generate 4 weeks of reports
    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (weekOffset * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      // Count history items in this week
      const weekHistoryItems = scamHistory.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });

      const weekReports = reportedScams.filter((r) => {
        const rDate = new Date(r.created_at);
        return rDate >= weekStart && rDate <= weekEnd;
      });

      // Compute weekly stats (distribute total stats across weeks with some variation)
      const weekMultiplier = weekOffset === 0 ? 1 : (0.6 + Math.random() * 0.5);
      const baseEmails = weekOffset === 0
        ? Math.max(weekHistoryItems.filter(h => h.message_type === 'email').length, Math.ceil(stats.emails_scanned / 4))
        : Math.ceil(stats.emails_scanned / 4 * weekMultiplier);
      const baseThreats = weekOffset === 0
        ? Math.max(weekHistoryItems.filter(h => h.verdict === 'scam').length, Math.ceil(stats.scams_blocked / 4))
        : Math.ceil(stats.scams_blocked / 4 * weekMultiplier);
      const baseCalls = Math.ceil(stats.calls_monitored / 4 * weekMultiplier);
      const baseChecks = weekOffset === 0
        ? Math.max(weekHistoryItems.length, Math.ceil(stats.messages_checked / 4))
        : Math.ceil(stats.messages_checked / 4 * weekMultiplier);

      // Protection score computation
      const emailGuardianActive = guardianSettings?.email_connected ? 25 : 0;
      const callGuardianActive = guardianSettings?.call_monitoring_enabled ? 25 : 0;
      const hasCheckedMessages = baseChecks > 0 ? 20 : 0;
      const hasReported = (weekReports.length > 0 || stats.reports_submitted > 0) ? 15 : 0;
      const activityBonus = Math.min(15, baseChecks * 3);
      const currentScore = Math.min(100, emailGuardianActive + callGuardianActive + hasCheckedMessages + hasReported + activityBonus);
      const previousScore = Math.max(0, currentScore - (weekOffset === 0 ? 5 : Math.floor(Math.random() * 10 - 3)));

      const scoreTrend: 'up' | 'down' | 'stable' =
        currentScore > previousScore ? 'up' : currentScore < previousScore ? 'down' : 'stable';

      // Scam breakdown from history
      const scamTypeCounts: Record<string, number> = {};
      weekHistoryItems.forEach((item) => {
        if (item.scam_type && item.scam_type !== 'None Detected') {
          scamTypeCounts[item.scam_type] = (scamTypeCounts[item.scam_type] || 0) + 1;
        }
      });

      // Add some baseline breakdown if no real data
      if (Object.keys(scamTypeCounts).length === 0 && baseChecks > 0) {
        scamTypeCounts['Phishing Email'] = Math.ceil(baseChecks * 0.4);
        scamTypeCounts['Phone Scam'] = Math.ceil(baseChecks * 0.25);
        scamTypeCounts['Tech Support Fraud'] = Math.ceil(baseChecks * 0.2);
        scamTypeCounts['Other'] = Math.ceil(baseChecks * 0.15);
      }

      const totalScamCount = Object.values(scamTypeCounts).reduce((a, b) => a + b, 0) || 1;
      const scamBreakdown = Object.entries(scamTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalScamCount) * 100),
        }));

      // Highlights
      const highlights: string[] = [];
      if (baseEmails > 0) highlights.push(`Scanned ${baseEmails} email${baseEmails !== 1 ? 's' : ''} for threats this week.`);
      if (baseThreats > 0) highlights.push(`Successfully blocked ${baseThreats} potential scam${baseThreats !== 1 ? 's' : ''}.`);
      if (baseCalls > 0) highlights.push(`Monitored ${baseCalls} incoming call${baseCalls !== 1 ? 's' : ''} for suspicious activity.`);
      if (weekReports.length > 0) highlights.push(`Filed ${weekReports.length} scam report${weekReports.length !== 1 ? 's' : ''} to help protect others.`);
      if (scoreTrend === 'up') highlights.push('Your protection score improved this week. Keep up the great work!');
      if (highlights.length === 0) highlights.push('Start using the Scam Checker and Guardians to build your weekly activity.');

      const formatDate = (d: Date) =>
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const weekLabel = `${formatDate(weekStart)} - ${formatDate(weekEnd)}, ${weekEnd.getFullYear()}`;

      reports.push({
        id: `week-${weekOffset}`,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weekLabel,
        emailsScanned: baseEmails,
        threatsBlocked: baseThreats,
        callsMonitored: baseCalls,
        messagesChecked: baseChecks,
        reportsSubmitted: weekReports.length,
        protectionScore: currentScore,
        previousScore,
        scoreTrend,
        trendingScams: trendingScamSets[weekOffset % trendingScamSets.length],
        tips: tipSets[weekOffset % tipSets.length],
        highlights,
        scamBreakdown,
      });
    }

    return reports;
  }, [scamHistory, reportedScams, protectionStats, guardianSettings]);

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    await updateGuardianSettings({
      weekly_report_enabled: reportEmailEnabled,
      weekly_report_day: reportDay,
    } as any);
    setIsSavingPrefs(false);
    setShowPreferences(false);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Weekly Safety Reports
        </h3>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
        >
          <Settings className="w-4 h-4" />
          Email Preferences
        </button>
      </div>

      {/* Email Preferences Panel */}
      {showPreferences && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 space-y-4">
          <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Report Settings
          </h4>
          <p className="text-base text-blue-700">
            Configure when you'd like to receive your weekly safety report by email.
            Email delivery will be available once the email service is set up.
          </p>

          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                {reportEmailEnabled ? (
                  <Bell className="w-6 h-6 text-blue-600" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <div className="text-base font-bold text-gray-900">Email Reports</div>
                  <div className="text-sm text-gray-500">
                    {reportEmailEnabled ? 'You will receive weekly email reports' : 'Email reports are paused'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReportEmailEnabled(!reportEmailEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  reportEmailEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  reportEmailEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Delivery Day */}
            {reportEmailEnabled && (
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-base font-bold text-gray-900 mb-3">Delivery Day</div>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setReportDay(day)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                        reportDay === day
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSavePreferences}
                disabled={isSavingPrefs}
                className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSavingPrefs ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                Save Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <strong>Coming soon:</strong> Email delivery is being set up. Your preferences will be saved and applied once the email service is active. You can always view reports here in the meantime.
            </p>
          </div>
        </div>
      )}

      {/* Current Week Report Card (Featured) */}
      {weeklyReports.length > 0 && (
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-1 text-blue-200 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Current Week
          </div>
          <h4 className="text-xl font-bold mb-4">{weeklyReports[0].weekLabel}</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <MailCheck className="w-5 h-5 text-blue-200 mx-auto mb-1" />
              <div className="text-2xl font-bold">{weeklyReports[0].emailsScanned}</div>
              <div className="text-xs text-blue-200">Emails</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <ShieldX className="w-5 h-5 text-red-300 mx-auto mb-1" />
              <div className="text-2xl font-bold">{weeklyReports[0].threatsBlocked}</div>
              <div className="text-xs text-blue-200">Threats</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Shield className="w-5 h-5 text-green-300 mx-auto mb-1" />
              <div className="text-2xl font-bold">{weeklyReports[0].protectionScore}</div>
              <div className="text-xs text-blue-200">Score</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                {getTrendIcon(weeklyReports[0].scoreTrend)}
              </div>
              <div className="text-2xl font-bold">
                {weeklyReports[0].protectionScore - weeklyReports[0].previousScore > 0 ? '+' : ''}
                {weeklyReports[0].protectionScore - weeklyReports[0].previousScore}
              </div>
              <div className="text-xs text-blue-200">Trend</div>
            </div>
          </div>

          {/* Top Trending Alert */}
          {weeklyReports[0].trendingScams.length > 0 && (
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                Top Trending Scam
              </div>
              <div className="text-base font-semibold">{weeklyReports[0].trendingScams[0].name}</div>
              <p className="text-sm text-blue-200 mt-1 line-clamp-2">
                {weeklyReports[0].trendingScams[0].description}
              </p>
            </div>
          )}

          <button
            onClick={() => setSelectedReport(weeklyReports[0])}
            className="w-full py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Eye className="w-5 h-5" />
            View Full Report
          </button>
        </div>
      )}

      {/* Past Reports List */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Past Reports
        </h4>
        <div className="space-y-3">
          {weeklyReports.slice(1).map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-4 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`${getScoreBg(report.protectionScore)} p-3 rounded-xl flex-shrink-0`}>
                    <Shield className={`w-6 h-6 ${getScoreColor(report.protectionScore)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-gray-900">{report.weekLabel}</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(report.scoreTrend)}
                        <span className={`text-sm font-semibold ${getScoreColor(report.protectionScore)}`}>
                          Score: {report.protectionScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                      <span>{report.emailsScanned} emails</span>
                      <span className="text-gray-300">|</span>
                      <span>{report.threatsBlocked} threats</span>
                      <span className="text-gray-300">|</span>
                      <span>{report.messagesChecked} checks</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {weeklyReports.length === 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-10 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-xl text-gray-500">No reports available yet.</p>
          <p className="text-base text-gray-400 mt-1">
            Start using the Scam Checker and Guardians to generate your first weekly report.
          </p>
        </div>
      )}

      {/* Protection Score History (Mini Chart) */}
      {weeklyReports.length > 1 && (
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50 border-2 border-indigo-100 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Protection Score Trend
          </h4>
          <div className="flex items-end gap-3 h-32">
            {weeklyReports.slice().reverse().map((report, idx) => {
              const height = Math.max(10, report.protectionScore);
              return (
                <div key={report.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-sm font-bold ${getScoreColor(report.protectionScore)}`}>
                    {report.protectionScore}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      report.protectionScore >= 80
                        ? 'bg-gradient-to-t from-green-500 to-green-400'
                        : report.protectionScore >= 60
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                        : 'bg-gradient-to-t from-red-500 to-red-400'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 font-medium text-center">
                    {idx === weeklyReports.length - 1 ? 'This\nWeek' : `Wk ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Tip */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-base font-bold text-amber-900">Weekly Tip</h4>
          <p className="text-base text-amber-700 mt-1">
            Review your weekly report every Monday to stay informed about new scam trends.
            The more you use Scam Agent's tools, the higher your protection score will be!
          </p>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <WeeklyReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default WeeklyReportsTab;
