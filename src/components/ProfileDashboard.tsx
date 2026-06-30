import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  User,
  Mail,
  Phone,
  PhoneCall,
  BarChart3,
  Clock,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Scan,
  Flag,
  Loader2,
  Save,
  Edit3,
  Trash2,
  Eye,
  MailCheck,
  MailX,
  MailWarning,
  Activity,
  CalendarDays,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WeeklyReportsTab from '@/components/WeeklyReportsTab';

type TabType = 'overview' | 'history' | 'reports' | 'weekly-reports' | 'settings';

const ProfileDashboard: React.FC = () => {
  const {
    user,
    profile,
    guardianSettings,
    protectionStats,
    scamHistory,
    reportedScams,
    isProfileOpen,
    closeProfile,
    signOut,
    updateProfile,
    updateGuardianSettings,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [expandedHistoryItem, setExpandedHistoryItem] = useState<string | null>(null);

  if (!isProfileOpen || !user) return null;

  const stats = protectionStats || {
    emails_scanned: 0,
    calls_monitored: 0,
    scams_blocked: 0,
    messages_checked: 0,
    reports_submitted: 0,
  };

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';

  const handleStartEdit = () => {
    setEditName(profile?.display_name || '');
    setEditPhone(profile?.phone || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({ display_name: editName, phone: editPhone } as any);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const verdictConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    safe: { bg: 'bg-green-100', text: 'text-green-700', icon: <ShieldCheck className="w-5 h-5 text-green-600" />, label: 'Safe' },
    suspicious: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <ShieldAlert className="w-5 h-5 text-amber-600" />, label: 'Suspicious' },
    scam: { bg: 'bg-red-100', text: 'text-red-700', icon: <ShieldX className="w-5 h-5 text-red-600" />, label: 'Scam' },
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'weekly-reports', label: 'Weekly Reports', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'history', label: 'Scam Checks', icon: <Scan className="w-5 h-5" /> },
    { id: 'reports', label: 'My Reports', icon: <Flag className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProfile} />

      {/* Panel */}
      <div className="relative bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 lg:px-8 pt-8 pb-6 sticky top-0 z-10">
          <button
            onClick={closeProfile}
            className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close profile"
          >
            <X className="w-7 h-7 text-white" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {displayName}
              </h2>
              <p className="text-base text-blue-200">{user.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm lg:text-base font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Protection Stats */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Your Protection Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Messages Checked', value: stats.messages_checked, icon: <Scan className="w-7 h-7 text-blue-500" />, bg: 'bg-blue-50 border-blue-200' },
                    { label: 'Emails Scanned', value: stats.emails_scanned, icon: <MailCheck className="w-7 h-7 text-indigo-500" />, bg: 'bg-indigo-50 border-indigo-200' },
                    { label: 'Calls Monitored', value: stats.calls_monitored, icon: <PhoneCall className="w-7 h-7 text-emerald-500" />, bg: 'bg-emerald-50 border-emerald-200' },
                    { label: 'Scams Blocked', value: stats.scams_blocked, icon: <ShieldX className="w-7 h-7 text-red-500" />, bg: 'bg-red-50 border-red-200' },
                    { label: 'Reports Filed', value: stats.reports_submitted, icon: <Flag className="w-7 h-7 text-orange-500" />, bg: 'bg-orange-50 border-orange-200' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} border-2 rounded-2xl p-4 text-center`}>
                      <div className="flex justify-center mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protection Level */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-900">Protection Active</h4>
                    <p className="text-base text-green-700">
                      Scam Agent is watching over you. Your account is protected.
                    </p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-green-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((guardianSettings?.email_connected ? 30 : 0) +
                          (guardianSettings?.call_monitoring_enabled ? 30 : 0) +
                          (stats.messages_checked > 0 ? 20 : 0) +
                          (stats.reports_submitted > 0 ? 20 : 0)),
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  {guardianSettings?.email_connected && guardianSettings?.call_monitoring_enabled
                    ? 'Full protection enabled'
                    : 'Enable Email Guardian and Call Guardian for full protection'}
                </p>
              </div>

              {/* Weekly Report Quick Access */}
              <button
                onClick={() => setActiveTab('weekly-reports')}
                className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-5 text-left hover:border-indigo-400 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                    <CalendarDays className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-indigo-900">Weekly Safety Report</h4>
                    <p className="text-base text-indigo-600">
                      View your latest personalized safety report with trending scams and tips.
                    </p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-indigo-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  Recent Activity
                </h3>
                {scamHistory.length === 0 && reportedScams.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg text-gray-500">No activity yet.</p>
                    <p className="text-base text-gray-400 mt-1">
                      Use the AI Scam Checker or Report a Scam to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scamHistory.slice(0, 5).map((item) => {
                      const vc = verdictConfig[item.verdict] || verdictConfig.safe;
                      return (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                          {vc.icon}
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-gray-900 truncate">
                              {item.title || `${item.message_type} check`}
                            </div>
                            <div className="text-sm text-gray-500">{formatDate(item.created_at)}</div>
                          </div>
                          <span className={`${vc.bg} ${vc.text} px-3 py-1 rounded-full text-sm font-bold`}>
                            {vc.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}

          {/* WEEKLY REPORTS TAB */}
          {activeTab === 'weekly-reports' && <WeeklyReportsTab />}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Scan className="w-6 h-6 text-blue-600" />
                Scam Check History
              </h3>

              {scamHistory.length === 0 ? (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-10 text-center">
                  <Scan className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xl text-gray-500">No scam checks yet.</p>
                  <p className="text-base text-gray-400 mt-1">
                    Use the AI Scam Checker to analyze suspicious messages. Your results will be saved here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scamHistory.map((item) => {
                    const vc = verdictConfig[item.verdict] || verdictConfig.safe;
                    const isExpanded = expandedHistoryItem === item.id;
                    return (
                      <div key={item.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedHistoryItem(isExpanded ? null : item.id)}
                          className="w-full p-4 text-left flex items-center gap-3"
                        >
                          {vc.icon}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-gray-900 truncate">
                                {item.title || `${item.message_type} analysis`}
                              </span>
                              <span className={`${vc.bg} ${vc.text} px-2.5 py-0.5 rounded-full text-xs font-bold`}>
                                {vc.label} ({item.confidence}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                              <span className="capitalize">{item.message_type}</span>
                              <span className="text-gray-300">|</span>
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                            {item.scam_type && item.scam_type !== 'None Detected' && (
                              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-sm font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                {item.scam_type}
                              </div>
                            )}
                            <p className="text-base text-gray-700">{item.explanation}</p>
                            {item.red_flags && item.red_flags.length > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <h5 className="text-sm font-bold text-red-900 mb-1">Red Flags</h5>
                                <ul className="space-y-1">
                                  {item.red_flags.map((f, i) => (
                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {item.safe_signals && item.safe_signals.length > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                <h5 className="text-sm font-bold text-green-900 mb-1">Safe Signals</h5>
                                <ul className="space-y-1">
                                  {item.safe_signals.map((s, i) => (
                                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                              <h5 className="text-sm font-bold text-blue-900 mb-1">Advice</h5>
                              <p className="text-sm text-blue-700">{item.advice}</p>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-3">
                              <h5 className="text-sm font-bold text-gray-700 mb-1">Original Message</h5>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
                                {item.message_text}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Flag className="w-6 h-6 text-red-600" />
                My Scam Reports
              </h3>

              {reportedScams.length === 0 ? (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-10 text-center">
                  <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xl text-gray-500">No reports filed yet.</p>
                  <p className="text-base text-gray-400 mt-1">
                    When you report a scam, it will appear here so you can track it.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reportedScams.map((report) => {
                    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
                      submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
                      reviewing: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Under Review' },
                      resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
                    };
                    const sc = statusConfig[report.status] || statusConfig.submitted;
                    return (
                      <div key={report.id} className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-lg font-bold text-gray-900">{report.scam_type}</span>
                              <span className={`${sc.bg} ${sc.text} px-3 py-0.5 rounded-full text-xs font-bold`}>
                                {sc.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              via {report.contact_method} | {formatDate(report.created_at)}
                            </div>
                          </div>
                        </div>
                        <p className="text-base text-gray-600 line-clamp-3">{report.description}</p>
                        {report.money_lost && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            <AlertTriangle className="w-4 h-4" />
                            Money lost: {report.money_lost}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Profile Information
                </h3>
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-base font-bold text-gray-900 mb-1.5">Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-gray-900 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="(555) 123-4567"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="text-lg font-semibold text-gray-900">{profile?.display_name || 'Not set'}</div>
                        </div>
                        <button
                          onClick={handleStartEdit}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-lg font-semibold text-gray-900">{user.email}</div>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="text-lg font-semibold text-gray-900">{profile?.phone || 'Not set'}</div>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {user.created_at ? formatDate(user.created_at) : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guardian Settings */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Guardian Settings
                </h3>
                <div className="space-y-3">
                  {/* Email Guardian */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2.5 rounded-xl">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Email Guardian</div>
                          <div className="text-sm text-gray-500">
                            {guardianSettings?.email_connected
                              ? `Connected to ${guardianSettings.email_provider || 'email'}`
                              : 'Not connected'}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        guardianSettings?.email_connected
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {guardianSettings?.email_connected ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    {guardianSettings?.email_connected && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-base font-semibold text-gray-900">Auto-Scan</div>
                            <div className="text-sm text-gray-500">Automatically scan new emails</div>
                          </div>
                          <button
                            onClick={() => updateGuardianSettings({ email_auto_scan: !guardianSettings.email_auto_scan })}
                            className={`relative w-14 h-8 rounded-full transition-colors ${
                              guardianSettings.email_auto_scan ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                              guardianSettings.email_auto_scan ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Call Guardian */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-xl">
                          <PhoneCall className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Call Guardian</div>
                          <div className="text-sm text-gray-500">
                            {guardianSettings?.call_monitoring_enabled
                              ? 'Monitoring active'
                              : 'Not enabled'}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        guardianSettings?.call_monitoring_enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {guardianSettings?.call_monitoring_enabled ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>

                  {/* Alert Level */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                    <div className="text-lg font-bold text-gray-900 mb-3">Alert Level</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'all', label: 'All Alerts', desc: 'Get notified about everything' },
                        { value: 'high', label: 'High Only', desc: 'Only scams and suspicious' },
                        { value: 'scam', label: 'Scams Only', desc: 'Only confirmed scams' },
                      ].map((level) => (
                        <button
                          key={level.value}
                          onClick={() => updateGuardianSettings({ alert_level: level.value })}
                          className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                            (guardianSettings?.alert_level || 'all') === level.value
                              ? 'bg-blue-900 text-white'
                              : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Report Settings Quick Link */}
                  <button
                    onClick={() => setActiveTab('weekly-reports')}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-indigo-300 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2.5 rounded-xl">
                          <CalendarDays className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Weekly Report Settings</div>
                          <div className="text-sm text-gray-500">
                            Configure email delivery and view past reports
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-700 text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-2 border-red-200"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
