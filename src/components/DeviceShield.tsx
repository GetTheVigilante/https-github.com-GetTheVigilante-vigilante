import React, { useState, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Smartphone,
  Laptop,
  Tablet,
  Eye,
  Scan,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  Phone,
  Globe,
  Key,
  Fingerprint,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Types
interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: 'parent' | 'teen' | 'child' | 'senior';
  avatarColor: string;
  consentGiven: boolean;
  consentDate: string | null;
  devices: DeviceInfo[];
  e2eeApps: string[];
  monitoringLevel: 'full' | 'metadata' | 'keywords' | 'off';
  lastScan: string;
  threatCount: number;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'desktop';
  os: string;
  enrolled: boolean;
  lastSync: string;
  scanStatus: 'active' | 'paused' | 'pending';
}

interface MetadataAlert {
  id: string;
  memberName: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  details: string;
}

// E2EE Platform data
const e2eePlatforms = [
  { id: 'signal', name: 'Signal', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'End-to-end encrypted messaging' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', desc: 'E2EE messaging & calls' },
  { id: 'telegram', name: 'Telegram Secret Chats', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', desc: 'Secret chat E2EE mode' },
  { id: 'imessage', name: 'iMessage', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Apple E2EE messaging' },
  { id: 'facetime', name: 'FaceTime', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', desc: 'Apple E2EE video calls' },
  { id: 'wire', name: 'Wire', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', desc: 'Secure E2EE collaboration' },
  { id: 'threema', name: 'Threema', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Privacy-focused E2EE' },
  { id: 'wickr', name: 'Wickr Me', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', desc: 'Ephemeral E2EE messaging' },
  { id: 'discord', name: 'Discord (DMs)', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', desc: 'Direct messages' },
  { id: 'snapchat', name: 'Snapchat', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', desc: 'Ephemeral messaging' },
  { id: 'messenger', name: 'FB Messenger (E2EE)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Meta E2EE mode' },
  { id: 'zoom', name: 'Zoom (E2EE)', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'E2EE video meetings' },
];

// Mock data
const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1', name: 'Margaret', age: 72, role: 'senior', avatarColor: 'bg-blue-500',
    consentGiven: true, consentDate: '2026-03-15',
    devices: [
      { id: 'd1', name: 'iPad Pro', type: 'tablet', os: 'iPadOS 19', enrolled: true, lastSync: '2 min ago', scanStatus: 'active' },
      { id: 'd2', name: 'iPhone 16', type: 'phone', os: 'iOS 19', enrolled: true, lastSync: '5 min ago', scanStatus: 'active' },
    ],
    e2eeApps: ['imessage', 'facetime', 'whatsapp'],
    monitoringLevel: 'full', lastScan: '2 min ago', threatCount: 2,
  },
  {
    id: '2', name: 'Robert', age: 45, role: 'parent', avatarColor: 'bg-violet-500',
    consentGiven: true, consentDate: '2026-03-15',
    devices: [
      { id: 'd3', name: 'MacBook Pro', type: 'laptop', os: 'macOS 16', enrolled: true, lastSync: '10 min ago', scanStatus: 'active' },
      { id: 'd4', name: 'iPhone 16 Pro', type: 'phone', os: 'iOS 19', enrolled: true, lastSync: '1 min ago', scanStatus: 'active' },
    ],
    e2eeApps: ['signal', 'imessage', 'whatsapp', 'telegram'],
    monitoringLevel: 'metadata', lastScan: '10 min ago', threatCount: 0,
  },
  {
    id: '3', name: 'Sophie', age: 15, role: 'teen', avatarColor: 'bg-pink-500',
    consentGiven: true, consentDate: '2026-03-20',
    devices: [
      { id: 'd5', name: 'iPhone 15', type: 'phone', os: 'iOS 19', enrolled: true, lastSync: '3 min ago', scanStatus: 'active' },
      { id: 'd6', name: 'Chromebook', type: 'laptop', os: 'ChromeOS', enrolled: true, lastSync: '1 hr ago', scanStatus: 'active' },
    ],
    e2eeApps: ['imessage', 'snapchat', 'discord', 'whatsapp', 'messenger'],
    monitoringLevel: 'full', lastScan: '3 min ago', threatCount: 5,
  },
  {
    id: '4', name: 'Jake', age: 9, role: 'child', avatarColor: 'bg-green-500',
    consentGiven: true, consentDate: '2026-03-20',
    devices: [
      { id: 'd7', name: 'iPad Mini', type: 'tablet', os: 'iPadOS 19', enrolled: true, lastSync: '15 min ago', scanStatus: 'active' },
    ],
    e2eeApps: ['imessage', 'facetime'],
    monitoringLevel: 'full', lastScan: '15 min ago', threatCount: 1,
  },
  {
    id: '5', name: 'Emma', age: 12, role: 'child', avatarColor: 'bg-orange-500',
    consentGiven: false, consentDate: null,
    devices: [],
    e2eeApps: [],
    monitoringLevel: 'off', lastScan: 'Never', threatCount: 0,
  },
];

const mockMetadataAlerts: MetadataAlert[] = [
  { id: '1', memberName: 'Sophie', type: 'Late Night Messaging', description: 'Unusual message volume detected between 11 PM - 3 AM with unknown contact on Snapchat', severity: 'high', timestamp: '6 hours ago', details: '47 messages exchanged between 11:15 PM and 2:45 AM. Contact "NightOwl" not in known contacts list. Message frequency increased 340% compared to normal pattern.' },
  { id: '2', memberName: 'Margaret', type: 'New Contact Pattern', description: 'Rapid escalation with new WhatsApp contact — 200+ messages in 3 days', severity: 'high', timestamp: '1 day ago', details: 'New contact "Michael_Investments" initiated conversation. Message volume escalated from 5 messages on day 1 to 87 messages on day 3. Pattern consistent with romance/investment scam grooming.' },
  { id: '3', memberName: 'Sophie', type: 'Platform Switching', description: 'Contact attempted to move conversation from Instagram to Signal (more private)', severity: 'medium', timestamp: '2 days ago', details: 'Contact "Jake_Photography" sent 3 messages suggesting they continue chatting on Signal. Platform switching from monitored to less-monitored apps is a common isolation tactic.' },
  { id: '4', memberName: 'Jake', type: 'Age Discrepancy', description: 'Contact claims to be 10 but account metadata suggests adult user', severity: 'high', timestamp: '3 hours ago', details: 'Contact "CoolGamer2024" on iMessage claims to be 10 years old. However, account creation date is 6+ years old, device timezone has changed 4 times, and message composition patterns (typing speed, vocabulary) are inconsistent with claimed age.' },
  { id: '5', memberName: 'Margaret', type: 'Unusual Call Pattern', description: 'Repeated calls from spoofed number claiming to be Social Security Administration', severity: 'medium', timestamp: '5 hours ago', details: '4 calls from different numbers all claiming to be SSA. Call duration: 2 min, 8 min, 15 min, 22 min — escalating engagement pattern. Caller ID shows different states for each call.' },
];

const deviceIcons = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Laptop,
};

const roleColors = {
  parent: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Parent/Guardian' },
  teen: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Teen' },
  child: { bg: 'bg-green-100', text: 'text-green-700', label: 'Child' },
  senior: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Senior' },
};

const monitoringLevels = [
  { id: 'full' as const, label: 'Full Protection', desc: 'On-device content scanning + metadata analysis', icon: ShieldCheck, color: 'text-green-600' },
  { id: 'metadata' as const, label: 'Metadata Only', desc: 'Timing, frequency, and contact pattern analysis', icon: BarChart3, color: 'text-blue-600' },
  { id: 'keywords' as const, label: 'Keyword Flags', desc: 'Flag conversations containing concerning keywords', icon: FileText, color: 'text-amber-600' },
  { id: 'off' as const, label: 'Off', desc: 'No monitoring active', icon: ShieldX, color: 'text-gray-400' },
];

const DeviceShield: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'consent' | 'e2ee' | 'metadata' | 'engine'>('overview');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [metadataAlerts, setMetadataAlerts] = useState<MetadataAlert[]>(mockMetadataAlerts);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [selectedMetadataAlert, setSelectedMetadataAlert] = useState<MetadataAlert | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentMemberId, setConsentMemberId] = useState<string | null>(null);
  
  // E2EE Scanner state
  const [e2eePlatform, setE2eePlatform] = useState('');
  const [e2eeMemberName, setE2eeMemberName] = useState('');
  const [e2eeMemberAge, setE2eeMemberAge] = useState('');
  const [e2eeContactName, setE2eeContactName] = useState('');
  const [e2eeConversation, setE2eeConversation] = useState('');
  const [e2eeTimePattern, setE2eeTimePattern] = useState('');
  const [e2eeFrequency, setE2eeFrequency] = useState('');
  const [isE2eeScanning, setIsE2eeScanning] = useState(false);
  const [e2eeScanResult, setE2eeScanResult] = useState<any>(null);
  const [e2eeScanError, setE2eeScanError] = useState('');

  // Consent handlers
  const grantConsent = (memberId: string) => {
    setFamilyMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, consentGiven: true, consentDate: new Date().toISOString().split('T')[0] } : m
    ));
    setShowConsentModal(false);
    setConsentMemberId(null);
  };

  const revokeConsent = (memberId: string) => {
    setFamilyMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, consentGiven: false, consentDate: null, monitoringLevel: 'off' as const } : m
    ));
  };

  const updateMonitoringLevel = (memberId: string, level: FamilyMember['monitoringLevel']) => {
    setFamilyMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, monitoringLevel: level } : m
    ));
  };

  // E2EE scan handler
  const handleE2eeScan = useCallback(async () => {
    if (!e2eeConversation.trim()) {
      setE2eeScanError('Please paste the decrypted conversation to analyze.');
      return;
    }

    setIsE2eeScanning(true);
    setE2eeScanError('');
    setE2eeScanResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-predator', {
        body: {
          conversation: e2eeConversation,
          platform: e2eePlatform,
          memberName: e2eeMemberName,
          memberAge: e2eeMemberAge,
          contactName: e2eeContactName,
          analysisMode: 'e2ee_scan',
          e2eeContext: {
            platform: e2eePlatform,
            timePattern: e2eeTimePattern,
            messageFrequency: e2eeFrequency,
          },
        },
      });

      if (error) throw error;
      if (data?.analysis) {
        setE2eeScanResult(data.analysis);
      }
    } catch (err: any) {
      setE2eeScanError(err.message || 'Failed to analyze E2EE conversation.');
    } finally {
      setIsE2eeScanning(false);
    }
  }, [e2eeConversation, e2eePlatform, e2eeMemberName, e2eeMemberAge, e2eeContactName, e2eeTimePattern, e2eeFrequency]);

  const enrolledDevices = familyMembers.flatMap(m => m.devices).filter(d => d.enrolled).length;
  const totalDevices = familyMembers.flatMap(m => m.devices).length;
  const consentedMembers = familyMembers.filter(m => m.consentGiven).length;
  const totalThreats = familyMembers.reduce((sum, m) => sum + m.threatCount, 0);
  const highAlerts = metadataAlerts.filter(a => a.severity === 'high').length;

  const threatLevelConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    critical: { bg: 'bg-red-600', text: 'text-white', icon: ShieldX, label: 'CRITICAL' },
    high: { bg: 'bg-orange-500', text: 'text-white', icon: ShieldAlert, label: 'HIGH RISK' },
    medium: { bg: 'bg-amber-500', text: 'text-white', icon: ShieldAlert, label: 'MEDIUM' },
    low: { bg: 'bg-blue-500', text: 'text-white', icon: Shield, label: 'LOW' },
    safe: { bg: 'bg-green-500', text: 'text-white', icon: ShieldCheck, label: 'SAFE' },
  };

  return (
    <section id="device-shield" className="relative py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <Lock className="w-5 h-5" />
            Device Shield — On-Device AI Protection
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Protect <span className="text-violet-700">Every Device</span>, Respect{' '}
            <span className="text-emerald-600">Every Encryption</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The Vigilante's on-device AI scans conversations <strong>locally</strong> — after decryption on the device itself — 
            so E2EE privacy is never broken. The same AI that spots "urgent money" language in grandma's emails 
            catches grooming phrases in your kids' chats. One unified engine, full family protection.
          </p>
        </div>

        {/* How E2EE Scanning Works Banner */}
        <div className="mb-8 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 lg:p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 flex items-center gap-3">
                <Lock className="w-8 h-8 text-emerald-300" />
                How E2EE Scanning Works
              </h3>
              <p className="text-lg text-emerald-100 leading-relaxed mb-4">
                End-to-end encryption means only the sender and receiver can read messages. 
                The Vigilante <strong>never breaks this encryption</strong>. Instead, our AI runs 
                <strong> directly on the family member's device</strong>, analyzing messages after 
                they're decrypted locally — just like your eyes read them.
              </p>
              <p className="text-lg text-emerald-200 leading-relaxed">
                Only threat assessments (not message content) are sent to the family dashboard. 
                This means <strong>full protection with zero privacy compromise</strong>.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Message arrives encrypted', desc: 'E2EE keeps data secure in transit', icon: Lock },
                { step: '2', title: 'Device decrypts locally', desc: 'Only the device can read the message', icon: Key },
                { step: '3', title: 'On-device AI scans content', desc: 'AI analyzes for threats locally', icon: Scan },
                { step: '4', title: 'Threat score sent to dashboard', desc: 'Only the risk level is shared — not content', icon: ShieldCheck },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-4 bg-white/10 rounded-xl p-3">
                  <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-emerald-200 text-sm">{item.desc}</div>
                  </div>
                  <item.icon className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview' as const, label: 'Dashboard', icon: Activity },
            { id: 'consent' as const, label: 'Family Consent', icon: UserCheck },
            { id: 'e2ee' as const, label: 'E2EE Scanner', icon: Lock },
            { id: 'metadata' as const, label: `Metadata Alerts${highAlerts > 0 ? ` (${highAlerts})` : ''}`, icon: BarChart3 },
            { id: 'engine' as const, label: 'Unified AI Engine', icon: Zap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-violet-400 hover:text-violet-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Family Members', value: consentedMembers, sub: `of ${familyMembers.length} consented`, icon: Users, color: 'text-violet-600', border: 'border-violet-200' },
                { label: 'Devices Enrolled', value: enrolledDevices, sub: `of ${totalDevices} total`, icon: Smartphone, color: 'text-blue-600', border: 'border-blue-200' },
                { label: 'E2EE Apps Covered', value: [...new Set(familyMembers.flatMap(m => m.e2eeApps))].length, sub: 'platforms monitored', icon: Lock, color: 'text-emerald-600', border: 'border-emerald-200' },
                { label: 'Active Threats', value: totalThreats, sub: 'across all members', icon: AlertTriangle, color: 'text-red-600', border: 'border-red-200' },
                { label: 'Metadata Alerts', value: highAlerts, sub: 'high severity', icon: BarChart3, color: 'text-amber-600', border: 'border-amber-200' },
              ].map((stat, idx) => (
                <div key={idx} className={`bg-white rounded-2xl border-2 ${stat.border} p-5 text-center shadow-sm`}>
                  <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-500">{stat.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Family Members Overview */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-violet-900 px-6 py-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family Protection Status
                </h3>
                <p className="text-violet-200 text-sm mt-1">Every member, every device, every encrypted app — one unified shield</p>
              </div>
              <div className="divide-y divide-gray-100">
                {familyMembers.map(member => {
                  const roleConfig = roleColors[member.role];
                  const isExpanded = expandedMember === member.id;
                  return (
                    <div key={member.id}>
                      <button
                        onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                        className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-12 h-12 ${member.avatarColor} rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                          {member.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-gray-900 text-lg">{member.name}</span>
                            <span className="text-gray-400">Age {member.age}</span>
                            <span className={`${roleConfig.bg} ${roleConfig.text} px-2 py-0.5 rounded-full text-xs font-bold`}>
                              {roleConfig.label}
                            </span>
                            {member.consentGiven ? (
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> CONSENTED
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">
                                PENDING CONSENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{member.devices.length} device{member.devices.length !== 1 ? 's' : ''}</span>
                            <span>{member.e2eeApps.length} E2EE app{member.e2eeApps.length !== 1 ? 's' : ''}</span>
                            <span>Last scan: {member.lastScan}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {member.threatCount > 0 && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                              {member.threatCount} threats
                            </span>
                          )}
                          {member.consentGiven && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              member.monitoringLevel === 'full' ? 'bg-green-100 text-green-700' :
                              member.monitoringLevel === 'metadata' ? 'bg-blue-100 text-blue-700' :
                              member.monitoringLevel === 'keywords' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {member.monitoringLevel === 'full' ? 'Full' : member.monitoringLevel === 'metadata' ? 'Metadata' : member.monitoringLevel === 'keywords' ? 'Keywords' : 'Off'}
                            </div>
                          )}
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 p-5 bg-gray-50 space-y-4">
                          {/* Devices */}
                          <div>
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <Smartphone className="w-4 h-4" /> Enrolled Devices
                            </h4>
                            {member.devices.length > 0 ? (
                              <div className="grid sm:grid-cols-2 gap-2">
                                {member.devices.map(device => {
                                  const DevIcon = deviceIcons[device.type];
                                  return (
                                    <div key={device.id} className="bg-white rounded-xl p-3 border border-gray-200 flex items-center gap-3">
                                      <DevIcon className="w-5 h-5 text-gray-500" />
                                      <div className="flex-1">
                                        <div className="font-semibold text-gray-900 text-sm">{device.name}</div>
                                        <div className="text-xs text-gray-500">{device.os} — Synced {device.lastSync}</div>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        device.scanStatus === 'active' ? 'bg-green-100 text-green-700' :
                                        device.scanStatus === 'paused' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-500'
                                      }`}>
                                        {device.scanStatus.toUpperCase()}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No devices enrolled yet</p>
                            )}
                          </div>

                          {/* E2EE Apps */}
                          <div>
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <Lock className="w-4 h-4" /> E2EE Apps Monitored
                            </h4>
                            {member.e2eeApps.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {member.e2eeApps.map(appId => {
                                  const app = e2eePlatforms.find(p => p.id === appId);
                                  return app ? (
                                    <span key={appId} className={`${app.bg} ${app.color} border ${app.border} px-3 py-1 rounded-lg text-xs font-semibold`}>
                                      {app.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No E2EE apps configured</p>
                            )}
                          </div>

                          {/* Monitoring Level */}
                          <div>
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <Settings className="w-4 h-4" /> Monitoring Level
                            </h4>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                              {monitoringLevels.map(level => (
                                <button
                                  key={level.id}
                                  onClick={() => member.consentGiven && updateMonitoringLevel(member.id, level.id)}
                                  disabled={!member.consentGiven}
                                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                                    member.monitoringLevel === level.id
                                      ? 'border-violet-400 bg-violet-50'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  } ${!member.consentGiven ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <level.icon className={`w-5 h-5 ${level.color} mb-1`} />
                                  <div className="font-bold text-sm text-gray-900">{level.label}</div>
                                  <div className="text-xs text-gray-500">{level.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            {!member.consentGiven ? (
                              <button
                                onClick={() => { setConsentMemberId(member.id); setShowConsentModal(true); }}
                                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                              >
                                <UserCheck className="w-4 h-4" />
                                Request Consent
                              </button>
                            ) : (
                              <button
                                onClick={() => revokeConsent(member.id)}
                                className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                              >
                                <UserX className="w-4 h-4" />
                                Revoke Consent
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== CONSENT TAB ===== */}
        {activeTab === 'consent' && (
          <div className="space-y-8">
            {/* Consent Philosophy */}
            <div className="bg-gradient-to-r from-violet-50 to-blue-50 border-2 border-violet-200 rounded-2xl p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl flex-shrink-0">
                  <Fingerprint className="w-8 h-8 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Consent-First Protection</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The Vigilante requires <strong>explicit, informed consent</strong> from every family member before 
                    any monitoring begins. For minors, a parent or guardian provides consent. Every member can see 
                    exactly what is being monitored, adjust their monitoring level, or revoke consent at any time.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { icon: Eye, title: 'Full Transparency', desc: 'Members see exactly what\'s monitored' },
                      { icon: Key, title: 'Revocable Anytime', desc: 'Consent can be withdrawn instantly' },
                      { icon: Lock, title: 'Privacy Preserved', desc: 'Content stays on-device' },
                      { icon: UserCheck, title: 'Age-Appropriate', desc: 'Monitoring adapts to member age' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-3 border border-violet-100">
                        <item.icon className="w-5 h-5 text-violet-600 mb-1" />
                        <div className="font-bold text-sm text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Status Grid */}
            <div className="grid gap-4">
              {familyMembers.map(member => {
                const roleConfig = roleColors[member.role];
                return (
                  <div key={member.id} className={`bg-white rounded-2xl border-2 ${member.consentGiven ? 'border-green-200' : 'border-gray-200'} p-6 shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${member.avatarColor} rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                        {member.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xl font-bold text-gray-900">{member.name}</span>
                          <span className="text-gray-400">Age {member.age}</span>
                          <span className={`${roleConfig.bg} ${roleConfig.text} px-2 py-0.5 rounded-full text-xs font-bold`}>
                            {roleConfig.label}
                          </span>
                        </div>
                        {member.consentGiven ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-semibold">Consent granted on {member.consentDate}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm text-gray-500">Monitoring: {member.monitoringLevel}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Awaiting consent</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {member.consentGiven ? (
                          <>
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> Protected
                            </span>
                            <button
                              onClick={() => revokeConsent(member.id)}
                              className="px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded-xl text-sm font-bold transition-colors"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { setConsentMemberId(member.id); setShowConsentModal(true); }}
                            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Grant Consent
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What's monitored */}
                    {member.consentGiven && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm font-bold text-gray-500 mb-2">WHAT'S BEING MONITORED:</div>
                        <div className="flex flex-wrap gap-2">
                          {member.devices.map(d => (
                            <span key={d.id} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                              <Smartphone className="w-3 h-3" /> {d.name}
                            </span>
                          ))}
                          {member.e2eeApps.map(appId => {
                            const app = e2eePlatforms.find(p => p.id === appId);
                            return app ? (
                              <span key={appId} className={`${app.bg} ${app.color} border ${app.border} px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1`}>
                                <Lock className="w-3 h-3" /> {app.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Consent Modal */}
            {showConsentModal && consentMemberId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowConsentModal(false)}>
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                  <div className="bg-gradient-to-r from-violet-900 to-purple-900 px-6 py-5 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Fingerprint className="w-6 h-6" />
                        Family Consent Agreement
                      </h3>
                      <button onClick={() => setShowConsentModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-base text-gray-700 leading-relaxed">
                      By granting consent, you agree to the following for <strong>{familyMembers.find(m => m.id === consentMemberId)?.name}</strong>:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'On-device AI will scan communications for threats',
                        'Message content stays on the device — only threat scores are shared',
                        'Metadata (timing, frequency) may be analyzed for patterns',
                        'Alerts will be sent to the family guardian dashboard',
                        'Consent can be revoked at any time, immediately stopping all monitoring',
                        'No data is sold or shared with third parties',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => grantConsent(consentMemberId)}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        I Agree — Grant Consent
                      </button>
                      <button
                        onClick={() => setShowConsentModal(false)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== E2EE SCANNER TAB ===== */}
        {activeTab === 'e2ee' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-800 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  E2EE Conversation Scanner
                </h3>
                <p className="text-lg text-emerald-200 max-w-lg mx-auto">
                  Paste a decrypted conversation from any E2EE platform. Our AI analyzes it on-device 
                  for threats — the same engine that protects grandma from scams protects kids from predators.
                </p>
              </div>

              <div className="p-8 space-y-6">
                {/* Supported E2EE Platforms */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-3">Select E2EE Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {e2eePlatforms.map(platform => (
                      <button
                        key={platform.id}
                        onClick={() => setE2eePlatform(platform.name)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                          e2eePlatform === platform.name
                            ? `${platform.border} ${platform.bg} ${platform.color}`
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Lock className={`w-3.5 h-3.5 ${e2eePlatform === platform.name ? platform.color : 'text-gray-400'}`} />
                        {platform.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Family Member Name</label>
                    <input
                      type="text"
                      value={e2eeMemberName}
                      onChange={e => setE2eeMemberName(e.target.value)}
                      placeholder="e.g., Sophie or Margaret"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Member Age</label>
                    <input
                      type="number"
                      value={e2eeMemberAge}
                      onChange={e => setE2eeMemberAge(e.target.value)}
                      placeholder="e.g., 15 or 72"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={e2eeContactName}
                      onChange={e => setE2eeContactName(e.target.value)}
                      placeholder="e.g., Unknown or Michael_Investments"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Message Time Pattern</label>
                    <select
                      value={e2eeTimePattern}
                      onChange={e => setE2eeTimePattern(e.target.value)}
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white"
                    >
                      <option value="">Select pattern...</option>
                      <option value="normal_hours">Normal hours (8 AM - 10 PM)</option>
                      <option value="late_night">Late night (10 PM - 6 AM)</option>
                      <option value="school_hours">During school hours</option>
                      <option value="all_hours">Around the clock</option>
                      <option value="weekends_only">Weekends only</option>
                    </select>
                  </div>
                </div>

                {/* Conversation Input */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    Paste Decrypted Conversation
                  </label>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-700">
                      <strong>Privacy Note:</strong> In production, this analysis happens entirely on-device. 
                      The conversation never leaves the device — only the threat assessment is shared.
                    </p>
                  </div>
                  <textarea
                    value={e2eeConversation}
                    onChange={e => { setE2eeConversation(e.target.value); setE2eeScanError(''); }}
                    placeholder={"Paste the E2EE conversation here...\n\nThis works for any family member:\n- Kids: Detect grooming, sextortion, catfishing\n- Seniors: Detect scams, fraud, manipulation\n- Everyone: Detect harassment, threats, exploitation"}
                    rows={10}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-y font-mono"
                  />
                </div>

                {e2eeScanError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-base text-red-700">{e2eeScanError}</span>
                  </div>
                )}

                <button
                  onClick={handleE2eeScan}
                  disabled={isE2eeScanning || !e2eeConversation.trim()}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {isE2eeScanning ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing E2EE Conversation...
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      Analyze E2EE Conversation
                    </>
                  )}
                </button>

                {/* Scanning Animation */}
                {isE2eeScanning && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
                    <p className="text-lg font-semibold text-emerald-800">On-device AI analyzing conversation...</p>
                    <p className="text-base text-emerald-600 mt-1">Checking for predatory patterns, scam language, and manipulation tactics</p>
                    <p className="text-sm text-emerald-500 mt-2">Encryption status: PRESERVED — content stays on-device</p>
                  </div>
                )}

                {/* E2EE Scan Results */}
                {e2eeScanResult && !isE2eeScanning && (
                  <div className="space-y-4">
                    {/* E2EE Privacy Badge */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        E2EE Privacy Preserved — Analysis performed on-device, encryption intact
                      </span>
                    </div>

                    {/* Threat Level Banner */}
                    {(() => {
                      const config = threatLevelConfig[e2eeScanResult.threat_level] || threatLevelConfig.safe;
                      return (
                        <div className={`${config.bg} ${config.text} rounded-2xl p-6`}>
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                              <config.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold">{config.label} — Threat Score: {e2eeScanResult.threat_score}/100</h3>
                              <p className="text-lg opacity-90">{e2eeScanResult.summary}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Red Flags */}
                    {e2eeScanResult.red_flags?.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          Red Flags ({e2eeScanResult.red_flags.length})
                        </h4>
                        <ul className="space-y-2">
                          {e2eeScanResult.red_flags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-red-800">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safe Signals */}
                    {e2eeScanResult.safe_signals?.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Safe Signals
                        </h4>
                        <ul className="space-y-2">
                          {e2eeScanResult.safe_signals.map((signal: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              {signal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    {e2eeScanResult.detailed_analysis && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Detailed Analysis</h4>
                        <p className="text-base text-gray-700 leading-relaxed">{e2eeScanResult.detailed_analysis}</p>
                      </div>
                    )}

                    {/* Recommended Actions */}
                    {e2eeScanResult.recommended_actions?.length > 0 && (
                      <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-violet-900 mb-3">Recommended Actions</h4>
                        <ul className="space-y-2">
                          {e2eeScanResult.recommended_actions.map((action: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-violet-800">
                              <CheckCircle2 className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => { setE2eeScanResult(null); setE2eeConversation(''); }}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                      Scan Another E2EE Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== METADATA TAB ===== */}
        {activeTab === 'metadata' && (
          <div className="space-y-6">
            {/* Metadata Explanation */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <BarChart3 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Metadata Analysis — No Content Access Required</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Even without reading message content, The Vigilante can detect threats by analyzing <strong>metadata patterns</strong>: 
                    message timing, frequency changes, contact behavior, platform switching, and age discrepancies. 
                    This catches predators and scammers <strong>without ever breaking encryption</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Pattern Types */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Clock, title: 'Timing Analysis', desc: 'Late-night messaging with minors, unusual hours for seniors', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: TrendingUp, title: 'Frequency Spikes', desc: 'Sudden increase in messages with unknown contacts', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: Globe, title: 'Platform Switching', desc: 'Attempts to move from monitored to private platforms', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: Users, title: 'Age Discrepancy', desc: 'Account metadata inconsistent with claimed age', color: 'text-red-600', bg: 'bg-red-50' },
                { icon: Phone, title: 'Call Patterns', desc: 'Repeated calls from spoofed numbers or unknown sources', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Activity, title: 'Behavioral Shifts', desc: 'Changes in communication patterns indicating manipulation', color: 'text-pink-600', bg: 'bg-pink-50' },
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} rounded-xl p-4 border border-gray-200`}>
                  <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Metadata Alerts */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Metadata Pattern Alerts
                </h3>
                <p className="text-blue-200 text-sm mt-1">Suspicious patterns detected without accessing message content</p>
              </div>
              <div className="divide-y divide-gray-100">
                {metadataAlerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedMetadataAlert(selectedMetadataAlert?.id === alert.id ? null : alert)}
                    className="w-full p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                        alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        <BarChart3 className={`w-5 h-5 ${
                          alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-gray-900">{alert.memberName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{alert.type}</span>
                        </div>
                        <p className="text-base text-gray-600 truncate">{alert.description}</p>
                      </div>
                      <span className="text-sm text-gray-400 flex-shrink-0">{alert.timestamp}</span>
                    </div>

                    {selectedMetadataAlert?.id === alert.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Detailed Pattern Analysis
                          </h4>
                          <p className="text-base text-gray-700 leading-relaxed">{alert.details}</p>
                        </div>
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-700 font-semibold">
                            No message content was accessed — this analysis is based entirely on metadata patterns
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== UNIFIED ENGINE TAB ===== */}
        {activeTab === 'engine' && (
          <div className="space-y-8">
            {/* Engine Overview */}
            <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 rounded-3xl p-8 lg:p-12 text-white">
              <div className="text-center mb-8">
                <div className="bg-white/10 p-5 rounded-2xl inline-block mb-4">
                  <Zap className="w-14 h-14 text-yellow-300" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  One AI Engine. Every Threat. Every Age.
                </h3>
                <p className="text-xl text-violet-200 max-w-3xl mx-auto leading-relaxed">
                  The Vigilante uses a single, unified AI threat engine that understands the full spectrum 
                  of online dangers — from the "urgent money" language targeting grandma to the grooming 
                  phrases targeting your kids. Same AI, different threat profiles, complete family protection.
                </p>
              </div>

              {/* Engine Capabilities */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Senior Protection */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/30 p-2 rounded-xl">
                      <Shield className="w-7 h-7 text-blue-300" />
                    </div>
                    <h4 className="text-xl font-bold">Senior Scam Detection</h4>
                  </div>
                  <ul className="space-y-2">
                    {[
                      '"Your Social Security number has been compromised"',
                      '"Act now or your account will be closed"',
                      '"I need you to buy gift cards and read me the numbers"',
                      '"This is the IRS — you owe back taxes"',
                      '"I\'m a Microsoft tech support agent"',
                      '"Your grandson is in jail and needs bail money"',
                      '"Guaranteed 500% returns on this crypto investment"',
                      '"I love you — can you wire me money for a plane ticket?"',
                    ].map((pattern, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-100">
                        <AlertTriangle className="w-3.5 h-3.5 text-blue-300 mt-0.5 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Child Protection */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-500/30 p-2 rounded-xl">
                      <ShieldAlert className="w-7 h-7 text-pink-300" />
                    </div>
                    <h4 className="text-xl font-bold">Child Predator Detection</h4>
                  </div>
                  <ul className="space-y-2">
                    {[
                      '"Don\'t tell your parents — this is our secret"',
                      '"You\'re so mature for your age"',
                      '"Let\'s video call — turn your camera on"',
                      '"What school do you go to? I could pick you up"',
                      '"I\'ll give you Robux/V-Bucks if you add me"',
                      '"Send me a photo — just for me"',
                      '"Your parents don\'t understand you like I do"',
                      '"Delete these messages before morning"',
                    ].map((pattern, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-pink-100">
                        <AlertTriangle className="w-3.5 h-3.5 text-pink-300 mt-0.5 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Universal Patterns */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-500/30 p-2 rounded-xl">
                    <Globe className="w-7 h-7 text-amber-300" />
                  </div>
                  <h4 className="text-xl font-bold">Universal Threat Patterns (All Ages)</h4>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Identity Theft', desc: 'SSN, bank details, personal data harvesting' },
                    { label: 'Harassment', desc: 'Threats, intimidation, cyberstalking' },
                    { label: 'Phishing', desc: 'Fake links, credential theft, malware' },
                    { label: 'Manipulation', desc: 'Emotional control, gaslighting, isolation' },
                    { label: 'Financial Fraud', desc: 'Fake investments, Ponzi schemes, wire fraud' },
                    { label: 'Impersonation', desc: 'Pretending to be someone else' },
                    { label: 'Sextortion', desc: 'Blackmail using intimate content' },
                    { label: 'Radicalization', desc: 'Extremist recruitment and propaganda' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="font-bold text-amber-200 text-sm">{item.label}</div>
                      <div className="text-xs text-amber-100/70">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How the Engine Works */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Scan className="w-8 h-8 text-violet-600" />,
                  title: 'Multi-Layer Analysis',
                  description: 'The AI examines language patterns, sentiment, intent, context, and behavioral signals simultaneously across all communication types.',
                },
                {
                  icon: <Activity className="w-8 h-8 text-emerald-600" />,
                  title: 'Adaptive Threat Profiles',
                  description: 'The engine automatically adjusts its threat model based on the family member\'s age — detecting age-appropriate threats for each person.',
                },
                {
                  icon: <Lock className="w-8 h-8 text-blue-600" />,
                  title: 'Privacy-First Architecture',
                  description: 'On-device processing means E2EE is never broken. Content analysis happens locally; only threat scores reach the family dashboard.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center hover:border-violet-300 transition-colors shadow-sm">
                  <div className="bg-gray-50 p-4 rounded-2xl inline-block mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Supported Platforms */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Lock className="w-6 h-6 text-emerald-600" />
                Supported E2EE Platforms
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {e2eePlatforms.map(platform => (
                  <div key={platform.id} className={`${platform.bg} border ${platform.border} rounded-xl p-4 flex items-center gap-3`}>
                    <Lock className={`w-5 h-5 ${platform.color}`} />
                    <div>
                      <div className={`font-bold text-sm ${platform.color}`}>{platform.name}</div>
                      <div className="text-xs text-gray-500">{platform.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DeviceShield;
