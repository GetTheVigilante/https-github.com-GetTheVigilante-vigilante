import React, { useState, useCallback } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Eye,
  EyeOff,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  MessageSquare,
  Gamepad2,
  Smartphone,
  Monitor,
  Globe,
  Lock,
  Scan,
  Bell,
  Clock,
  TrendingUp,
  UserX,
  Heart,
  Send,
  Trash2,
  Settings,
  Info,
  Zap,
  Camera,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Types
interface MonitoredChild {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  platforms: string[];
  monitoringEnabled: boolean;
  alertCount: number;
  lastScan: string;
}

interface FlaggedAlert {
  id: string;
  childName: string;
  platform: string;
  contactName: string;
  contactUsername: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  threatScore: number;
  threatType: string;
  summary: string;
  redFlags: string[];
  recommendedActions: string[];
  detailedAnalysis: string;
  conversationSnippet: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'resolved';
}

// Platform data
const platformOptions = [
  { id: 'roblox', name: 'Roblox', icon: Gamepad2, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'fortnite', name: 'Fortnite', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'minecraft', name: 'Minecraft', icon: Gamepad2, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-gray-800', bg: 'bg-gray-50' },
  { id: 'snapchat', name: 'Snapchat', icon: Camera, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'facebook', name: 'Facebook Messenger', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'xbox', name: 'Xbox Live', icon: Gamepad2, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'playstation', name: 'PlayStation', icon: Gamepad2, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'email', name: 'Email', icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50' },
];

// Mock data
const mockChildren: MonitoredChild[] = [
  { id: '1', name: 'Emma', age: 12, avatarColor: 'pink', platforms: ['roblox', 'discord', 'instagram', 'tiktok'], monitoringEnabled: true, alertCount: 3, lastScan: '5 min ago' },
  { id: '2', name: 'Jake', age: 9, avatarColor: 'blue', platforms: ['roblox', 'minecraft', 'fortnite', 'xbox'], monitoringEnabled: true, alertCount: 1, lastScan: '12 min ago' },
  { id: '3', name: 'Sophie', age: 15, avatarColor: 'purple', platforms: ['instagram', 'tiktok', 'snapchat', 'discord', 'whatsapp'], monitoringEnabled: true, alertCount: 5, lastScan: '2 min ago' },
];

const mockAlerts: FlaggedAlert[] = [
  {
    id: '1',
    childName: 'Sophie',
    platform: 'Instagram',
    contactName: 'Jake_Photography',
    contactUsername: '@jake_photo_pro',
    threatLevel: 'critical',
    threatScore: 94,
    threatType: 'grooming',
    summary: 'Adult male posing as teen photographer attempting to isolate your child and request private photos.',
    redFlags: [
      'Claims to be 17 but language patterns suggest adult',
      'Requesting private/solo photo session',
      'Attempting to move conversation to private messaging',
      'Excessive compliments about physical appearance',
      'Asking child to keep conversation secret from parents',
      'Offering gifts and money for photos',
    ],
    recommendedActions: [
      'Block this contact immediately',
      'Save all conversation screenshots as evidence',
      'Report the account to Instagram',
      'Talk to your child about what happened',
      'Consider filing a report with NCMEC (CyberTipline)',
      'Contact local law enforcement if explicit content was shared',
    ],
    detailedAnalysis: 'This conversation exhibits classic grooming patterns. The contact claims to be 17 but uses language and manipulation tactics consistent with an adult predator. They are systematically building trust through flattery, offering material incentives, and attempting to isolate your child from parental oversight. The request for "private photos" and insistence on secrecy are major red flags indicating predatory intent.',
    conversationSnippet: 'Jake_Photography: Hey you\'re so pretty! I\'m a photographer and I think you could be a model 📸\nSophie: Thanks! That\'s cool\nJake_Photography: I could do a free photoshoot for you. Just us though, it works better one-on-one\nJake_Photography: Don\'t tell your parents yet, I want it to be a surprise portfolio for them\nJake_Photography: What school do you go to? I could pick you up after...',
    timestamp: '15 minutes ago',
    status: 'new',
  },
  {
    id: '2',
    childName: 'Emma',
    platform: 'Roblox',
    contactName: 'CoolGamer2024',
    contactUsername: 'CoolGamer2024',
    threatLevel: 'high',
    threatScore: 82,
    threatType: 'grooming',
    summary: 'Unknown user asking personal questions and attempting to establish private communication channel outside the game.',
    redFlags: [
      'Asking for real name and age repeatedly',
      'Requesting to move to Discord for "private chat"',
      'Asking about school location and daily schedule',
      'Offering in-game currency and gifts',
      'Claiming to be same age but asking adult-level questions',
    ],
    recommendedActions: [
      'Block this user in Roblox immediately',
      'Review your child\'s Roblox friend list',
      'Enable parental controls on Roblox',
      'Discuss safe online communication with your child',
      'Report the user to Roblox moderation',
    ],
    detailedAnalysis: 'This user is exhibiting information-gathering behavior typical of predatory grooming. They are systematically collecting personal details about your child while offering incentives to build trust. The attempt to move communication to Discord, a less monitored platform, is a significant red flag.',
    conversationSnippet: 'CoolGamer2024: What\'s your real name? I\'m Jake, 11\nEmma: I\'m Emma!\nCoolGamer2024: Cool! What school do you go to?\nCoolGamer2024: We should chat on Discord, it\'s way better. What\'s your username?\nCoolGamer2024: I\'ll give you 1000 Robux if you add me 😊',
    timestamp: '2 hours ago',
    status: 'new',
  },
  {
    id: '3',
    childName: 'Sophie',
    platform: 'TikTok',
    contactName: 'DanceMaster_Official',
    contactUsername: '@dancemaster_off',
    threatLevel: 'high',
    threatScore: 78,
    threatType: 'sextortion',
    summary: 'Account sending inappropriate DMs and attempting to solicit photos from your child.',
    redFlags: [
      'Sending unsolicited inappropriate messages',
      'Requesting photos with specific poses',
      'Using flattery and fame promises as manipulation',
      'Account has suspicious follower-to-following ratio',
    ],
    recommendedActions: [
      'Block and report this account immediately',
      'Check if your child sent any photos',
      'Enable restricted mode on TikTok',
      'Review DM settings to limit who can message',
    ],
    detailedAnalysis: 'This account is using the guise of a dance talent scout to solicit photos from minors. The messaging pattern is consistent with sextortion schemes where predators collect compromising images to later use as leverage.',
    conversationSnippet: 'DanceMaster_Official: OMG your dance videos are amazing! I\'m a talent scout\nDanceMaster_Official: I could get you on a real show! Send me some dance poses in DM\nDanceMaster_Official: The more unique the poses the better, show your flexibility...',
    timestamp: '4 hours ago',
    status: 'reviewed',
  },
  {
    id: '4',
    childName: 'Jake',
    platform: 'Fortnite',
    contactName: 'ProBuilder99',
    contactUsername: 'ProBuilder99',
    threatLevel: 'medium',
    threatScore: 55,
    threatType: 'manipulation',
    summary: 'Player pressuring your child to share account credentials and personal information.',
    redFlags: [
      'Asking for game account password',
      'Pressuring child to share parent\'s credit card info',
      'Using social pressure tactics ("everyone does it")',
    ],
    recommendedActions: [
      'Remind your child never to share passwords',
      'Check for unauthorized purchases on the account',
      'Block this player',
      'Enable two-factor authentication',
    ],
    detailedAnalysis: 'While this may not be a traditional predator scenario, the user is attempting to manipulate your child into sharing sensitive account and financial information. This could be a scam or a gateway to further exploitation.',
    conversationSnippet: 'ProBuilder99: Dude if you give me your account login I can get you free V-Bucks\nJake: Really? How?\nProBuilder99: Trust me everyone does it. Also what\'s your mom\'s card number? I need it for the hack...',
    timestamp: '1 day ago',
    status: 'resolved',
  },
  {
    id: '5',
    childName: 'Sophie',
    platform: 'Discord',
    contactName: 'NightOwl',
    contactUsername: 'NightOwl#4521',
    threatLevel: 'critical',
    threatScore: 91,
    threatType: 'grooming',
    summary: 'Adult user in gaming server sending late-night DMs, building emotional dependency and requesting video calls.',
    redFlags: [
      'Messaging exclusively late at night',
      'Building emotional dependency ("I\'m the only one who understands you")',
      'Requesting video calls with camera on',
      'Asking child to delete message history',
      'Creating "us vs them" dynamic against parents',
      'Sharing personal "secrets" to create false intimacy',
    ],
    recommendedActions: [
      'Block immediately and save all messages',
      'Report to Discord Trust & Safety team',
      'File a report with NCMEC CyberTipline (1-800-843-5678)',
      'Have a supportive conversation with your child',
      'Consider professional counseling if needed',
      'Contact local law enforcement',
    ],
    detailedAnalysis: 'This is a textbook grooming scenario. The contact is systematically isolating your child emotionally, creating dependency, and escalating toward video contact. The late-night messaging pattern, requests to delete messages, and attempts to undermine parental trust are all hallmarks of an experienced predator.',
    conversationSnippet: 'NightOwl: Hey are you still up? I can\'t sleep either\nSophie: Yeah my parents are asleep\nNightOwl: Good, we can talk freely now. Your parents just don\'t understand you like I do\nNightOwl: Want to video call? Turn your camera on so I can see you\nNightOwl: Make sure you delete these messages before morning ok? This is just between us...',
    timestamp: '6 hours ago',
    status: 'new',
  },
];

const avatarColors: Record<string, string> = {
  pink: 'bg-pink-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  yellow: 'bg-yellow-500',
};

const threatLevelConfig = {
  critical: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-500', light: 'bg-red-50', lightText: 'text-red-700', label: 'CRITICAL', icon: ShieldX },
  high: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-400', light: 'bg-orange-50', lightText: 'text-orange-700', label: 'HIGH RISK', icon: ShieldAlert },
  medium: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400', light: 'bg-amber-50', lightText: 'text-amber-700', label: 'MEDIUM', icon: ShieldAlert },
  low: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-400', light: 'bg-blue-50', lightText: 'text-blue-700', label: 'LOW', icon: Shield },
  safe: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-400', light: 'bg-green-50', lightText: 'text-green-700', label: 'SAFE', icon: ShieldCheck },
};

const ChildShieldDashboard: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'scanner' | 'alerts' | 'children'>('overview');
  const [children, setChildren] = useState<MonitoredChild[]>(mockChildren);
  const [alerts, setAlerts] = useState<FlaggedAlert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<FlaggedAlert | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  
  // Scanner state
  const [scannerPlatform, setScannerPlatform] = useState('');
  const [scannerChildName, setScannerChildName] = useState('');
  const [scannerChildAge, setScannerChildAge] = useState('');
  const [scannerContactName, setScannerContactName] = useState('');
  const [scannerConversation, setScannerConversation] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState('');
  
  // Add child state
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildColor, setNewChildColor] = useState('blue');
  const [newChildPlatforms, setNewChildPlatforms] = useState<string[]>([]);
  
  // Alert filter
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'new'>('all');

  // Handlers
  const handleScanConversation = useCallback(async () => {
    if (!scannerConversation.trim()) {
      setScanError('Please paste a conversation to analyze.');
      return;
    }
    
    setIsScanning(true);
    setScanError('');
    setScanResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-predator', {
        body: {
          conversation: scannerConversation,
          platform: scannerPlatform,
          childAge: scannerChildAge,
          contactName: scannerContactName,
        },
      });
      
      if (error) throw error;
      
      if (data?.analysis) {
        setScanResult(data.analysis);
        
        // If threat detected, add to alerts
        if (data.analysis.threat_level !== 'safe' && data.analysis.threat_score > 30) {
          const newAlert: FlaggedAlert = {
            id: Date.now().toString(),
            childName: scannerChildName || 'Unknown Child',
            platform: scannerPlatform || 'Unknown',
            contactName: scannerContactName || 'Unknown Contact',
            contactUsername: '',
            threatLevel: data.analysis.threat_level,
            threatScore: data.analysis.threat_score,
            threatType: data.analysis.threat_type,
            summary: data.analysis.summary,
            redFlags: data.analysis.red_flags || [],
            recommendedActions: data.analysis.recommended_actions || [],
            detailedAnalysis: data.analysis.detailed_analysis,
            conversationSnippet: scannerConversation.substring(0, 500),
            timestamp: 'Just now',
            status: 'new',
          };
          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    } catch (err: any) {
      setScanError(err.message || 'Failed to analyze conversation. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [scannerConversation, scannerPlatform, scannerChildAge, scannerContactName, scannerChildName]);

  const handleAddChild = () => {
    if (!newChildName.trim() || !newChildAge) return;
    
    const child: MonitoredChild = {
      id: Date.now().toString(),
      name: newChildName,
      age: parseInt(newChildAge),
      avatarColor: newChildColor,
      platforms: newChildPlatforms,
      monitoringEnabled: true,
      alertCount: 0,
      lastScan: 'Never',
    };
    
    setChildren(prev => [...prev, child]);
    setNewChildName('');
    setNewChildAge('');
    setNewChildColor('blue');
    setNewChildPlatforms([]);
    setShowAddChild(false);
  };

  const toggleChildMonitoring = (childId: string) => {
    setChildren(prev => prev.map(c => 
      c.id === childId ? { ...c, monitoringEnabled: !c.monitoringEnabled } : c
    ));
  };

  const removeChild = (childId: string) => {
    setChildren(prev => prev.filter(c => c.id !== childId));
  };

  const markAlertReviewed = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'reviewed' as const } : a
    ));
  };

  const markAlertResolved = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    ));
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'new') return a.status === 'new';
    return a.threatLevel === alertFilter;
  });

  const criticalCount = alerts.filter(a => a.threatLevel === 'critical' && a.status === 'new').length;
  const highCount = alerts.filter(a => a.threatLevel === 'high' && a.status === 'new').length;
  const totalNewAlerts = alerts.filter(a => a.status === 'new').length;
  const totalPlatforms = [...new Set(children.flatMap(c => c.platforms))].length;

  return (
    <section id="child-shield" className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 text-violet-800 px-5 py-2.5 rounded-full text-lg font-semibold mb-5">
            <Shield className="w-5 h-5" />
            Child Shield — Predator Protection
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Protect Your <span className="text-violet-700">Children</span> From Online Predators
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The Vigilante scans gaming chats, social media DMs, emails, and messaging apps for 
            predatory language patterns — grooming, sextortion, catfishing, and manipulation. 
            Get instant alerts when your child is at risk.
          </p>
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="mb-8 bg-red-600 text-white rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">
                  {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''} — Immediate Action Required
                </h3>
                <p className="text-lg text-red-100">
                  Potential predatory contact detected. Review alerts immediately and take action to protect your child.
                </p>
              </div>
              <button
                onClick={() => { setActiveTab('alerts'); setAlertFilter('critical'); }}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex-shrink-0"
              >
                View Alerts
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview' as const, label: 'Dashboard', icon: Monitor },
            { id: 'scanner' as const, label: 'Scan Conversation', icon: Scan },
            { id: 'alerts' as const, label: `Alerts${totalNewAlerts > 0 ? ` (${totalNewAlerts})` : ''}`, icon: Bell },
            { id: 'children' as const, label: 'Monitored Children', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-900 text-white shadow-lg'
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border-2 border-violet-200 p-5 text-center shadow-sm">
                <Users className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-violet-700">{children.length}</div>
                <div className="text-base font-semibold text-violet-600">Children Monitored</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-red-200 p-5 text-center shadow-sm">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600">{totalNewAlerts}</div>
                <div className="text-base font-semibold text-red-600">Active Alerts</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 text-center shadow-sm">
                <Gamepad2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">{totalPlatforms}</div>
                <div className="text-base font-semibold text-blue-600">Platforms Monitored</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-green-200 p-5 text-center shadow-sm">
                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-base font-semibold text-green-600">Always Watching</div>
              </div>
            </div>

            {/* Children Quick View */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-violet-900 to-purple-900 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Protected Children
                  </h3>
                  <button
                    onClick={() => setActiveTab('children')}
                    className="text-violet-200 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    Manage <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map(child => (
                    <div key={child.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-violet-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${avatarColors[child.avatarColor]} rounded-full flex items-center justify-center text-white text-lg font-bold`}>
                          {child.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{child.name}</div>
                          <div className="text-sm text-gray-500">Age {child.age} — {child.platforms.length} platforms</div>
                        </div>
                        {child.monitoringEnabled ? (
                          <ShieldCheck className="w-5 h-5 text-green-500 ml-auto" />
                        ) : (
                          <ShieldX className="w-5 h-5 text-gray-400 ml-auto" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last scan: {child.lastScan}</span>
                        {child.alertCount > 0 && (
                          <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold text-xs">
                            {child.alertCount} alerts
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Critical Alerts */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-700 to-rose-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Alerts Requiring Attention
                  </h3>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="text-red-200 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.filter(a => a.status === 'new').slice(0, 3).map(alert => {
                  const config = threatLevelConfig[alert.threatLevel];
                  return (
                    <button
                      key={alert.id}
                      onClick={() => { setSelectedAlert(alert); setActiveTab('alerts'); }}
                      className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`${config.bg} p-2.5 rounded-xl flex-shrink-0`}>
                        <config.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{alert.childName}</span>
                          <span className="text-gray-400">on</span>
                          <span className="font-semibold text-gray-700">{alert.platform}</span>
                          <span className={`${config.bg} ${config.text} px-2.5 py-0.5 rounded-full text-xs font-bold`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-base text-gray-600 truncate">{alert.summary}</p>
                      </div>
                      <div className="text-sm text-gray-400 flex-shrink-0">{alert.timestamp}</div>
                    </button>
                  );
                })}
                {alerts.filter(a => a.status === 'new').length === 0 && (
                  <div className="p-10 text-center">
                    <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-xl font-semibold text-gray-500">No new alerts — your children are safe!</p>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Scan className="w-8 h-8 text-violet-600" />,
                  title: 'Continuous Monitoring',
                  description: 'The Vigilante monitors gaming chats, social media DMs, emails, and messaging apps 24/7 for predatory language patterns.',
                },
                {
                  icon: <Zap className="w-8 h-8 text-amber-600" />,
                  title: 'AI-Powered Detection',
                  description: 'Advanced AI analyzes conversations for grooming, sextortion, catfishing, cyberbullying, and manipulation tactics in real-time.',
                },
                {
                  icon: <Bell className="w-8 h-8 text-red-600" />,
                  title: 'Instant Parent Alerts',
                  description: 'Get immediate alerts with threat analysis, red flags, and recommended actions when predatory behavior is detected.',
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

            {/* Threat Types */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-violet-600" />
                Threats We Detect
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'Grooming', desc: 'Adults building trust to exploit children', color: 'bg-red-50 border-red-200 text-red-700', icon: UserX },
                  { type: 'Sextortion', desc: 'Blackmail using intimate images or threats', color: 'bg-orange-50 border-orange-200 text-orange-700', icon: Lock },
                  { type: 'Catfishing', desc: 'Predators pretending to be peers', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: EyeOff },
                  { type: 'Cyberbullying', desc: 'Harassment, threats, and intimidation', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: MessageSquare },
                  { type: 'Exploitation', desc: 'Financial or labor exploitation of minors', color: 'bg-pink-50 border-pink-200 text-pink-700', icon: AlertTriangle },
                  { type: 'Manipulation', desc: 'Emotional control and isolation tactics', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: Heart },
                ].map((threat, idx) => (
                  <div key={idx} className={`${threat.color} border rounded-xl p-4 flex items-start gap-3`}>
                    <threat.icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-base">{threat.type}</div>
                      <div className="text-sm opacity-80">{threat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== SCANNER TAB ===== */}
        {activeTab === 'scanner' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-900 to-purple-800 px-8 py-8 text-center">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
                  <Scan className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Conversation Scanner
                </h3>
                <p className="text-lg text-violet-200 max-w-lg mx-auto">
                  Paste any conversation from a gaming app, social media, or messaging platform.
                  Our AI will analyze it for predatory language patterns.
                </p>
              </div>

              <div className="p-8 space-y-6">
                {/* Context Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Child's Name</label>
                    <input
                      type="text"
                      value={scannerChildName}
                      onChange={e => setScannerChildName(e.target.value)}
                      placeholder="e.g., Emma"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Child's Age</label>
                    <input
                      type="number"
                      value={scannerChildAge}
                      onChange={e => setScannerChildAge(e.target.value)}
                      placeholder="e.g., 12"
                      min="1"
                      max="17"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Platform</label>
                    <select
                      value={scannerPlatform}
                      onChange={e => setScannerPlatform(e.target.value)}
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all bg-white"
                    >
                      <option value="">Select platform...</option>
                      {platformOptions.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Contact/Username</label>
                    <input
                      type="text"
                      value={scannerContactName}
                      onChange={e => setScannerContactName(e.target.value)}
                      placeholder="e.g., CoolGamer2024"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Conversation Input */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    Paste Conversation Here
                  </label>
                  <textarea
                    value={scannerConversation}
                    onChange={e => { setScannerConversation(e.target.value); setScanError(''); }}
                    placeholder={"Paste the conversation text here...\n\nExample:\nUser123: Hey how old are you?\nMyChild: I'm 12\nUser123: Cool me too! What school do you go to?\nUser123: We should video chat, don't tell your parents though..."}
                    rows={10}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all resize-y font-mono"
                  />
                </div>

                {scanError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-base text-red-700">{scanError}</span>
                  </div>
                )}

                <button
                  onClick={handleScanConversation}
                  disabled={isScanning || !scannerConversation.trim()}
                  className="w-full py-4 bg-violet-700 hover:bg-violet-800 disabled:bg-gray-300 text-white text-xl font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing Conversation...
                    </>
                  ) : (
                    <>
                      <Scan className="w-6 h-6" />
                      Analyze for Predatory Language
                    </>
                  )}
                </button>

                {/* Scanning Animation */}
                {isScanning && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
                    <Loader2 className="w-10 h-10 text-violet-600 animate-spin mx-auto mb-3" />
                    <p className="text-lg font-semibold text-violet-800">AI is analyzing the conversation...</p>
                    <p className="text-base text-violet-600 mt-1">Checking for grooming, sextortion, catfishing, and manipulation patterns</p>
                  </div>
                )}

                {/* Scan Results */}
                {scanResult && !isScanning && (
                  <div className="space-y-4">
                    {/* Threat Level Banner */}
                    {(() => {
                      const config = threatLevelConfig[scanResult.threat_level as keyof typeof threatLevelConfig] || threatLevelConfig.safe;
                      return (
                        <div className={`${config.bg} ${config.text} rounded-2xl p-6`}>
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                              <config.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold">{config.label} — Threat Score: {scanResult.threat_score}/100</h3>
                              </div>
                              <p className="text-lg opacity-90">{scanResult.summary}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Threat Type */}
                    {scanResult.threat_type && scanResult.threat_type !== 'safe_conversation' && (
                      <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-xl text-base font-bold">
                        <AlertTriangle className="w-5 h-5" />
                        Detected: {scanResult.threat_type.charAt(0).toUpperCase() + scanResult.threat_type.slice(1).replace(/_/g, ' ')}
                      </div>
                    )}

                    {/* Red Flags */}
                    {scanResult.red_flags?.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          Red Flags Detected ({scanResult.red_flags.length})
                        </h4>
                        <ul className="space-y-2">
                          {scanResult.red_flags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-red-800">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safe Signals */}
                    {scanResult.safe_signals?.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Safe Signals
                        </h4>
                        <ul className="space-y-2">
                          {scanResult.safe_signals.map((signal: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              {signal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    {scanResult.detailed_analysis && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-gray-600" />
                          Detailed Analysis
                        </h4>
                        <p className="text-base text-gray-700 leading-relaxed">{scanResult.detailed_analysis}</p>
                      </div>
                    )}

                    {/* Recommended Actions */}
                    {scanResult.recommended_actions?.length > 0 && (
                      <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
                        <h4 className="text-lg font-bold text-violet-900 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-violet-600" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                          {scanResult.recommended_actions.map((action: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-base text-violet-800">
                              <CheckCircle2 className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {(scanResult.threat_level === 'critical' || scanResult.threat_level === 'high') && (
                      <div className="bg-red-600 text-white rounded-xl p-5">
                        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Emergency Resources
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <a href="tel:18004225678" className="bg-white/20 hover:bg-white/30 rounded-xl p-3 flex items-center gap-3 transition-colors">
                            <Shield className="w-6 h-6" />
                            <div>
                              <div className="font-bold">NCMEC CyberTipline</div>
                              <div className="text-red-200 text-sm">1-800-THE-LOST (1-800-843-5678)</div>
                            </div>
                          </a>
                          <a href="https://report.cybertip.org/" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 rounded-xl p-3 flex items-center gap-3 transition-colors">
                            <Globe className="w-6 h-6" />
                            <div>
                              <div className="font-bold">Report Online</div>
                              <div className="text-red-200 text-sm">CyberTipline.org</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => { setScanResult(null); setScannerConversation(''); }}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                      Scan Another Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-bold text-violet-900 mb-1">Privacy & Safety</h4>
                  <p className="text-base text-violet-700 leading-relaxed">
                    Conversations are analyzed by AI in real-time and are not stored on our servers.
                    Only threat alerts and analysis results are saved to your account for your records.
                    We never share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ALERTS TAB ===== */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Detail Modal */}
            {selectedAlert && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedAlert(null)}>
                <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  {(() => {
                    const config = threatLevelConfig[selectedAlert.threatLevel];
                    return (
                      <div className={`${config.bg} ${config.text} px-6 py-5 rounded-t-3xl`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <config.icon className="w-8 h-8" />
                            <div>
                              <h3 className="text-xl font-bold">{config.label} — Threat Score: {selectedAlert.threatScore}/100</h3>
                              <p className="text-sm opacity-80">{selectedAlert.childName} on {selectedAlert.platform} — {selectedAlert.timestamp}</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-6 space-y-5">
                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Suspicious Contact</div>
                      <div className="text-lg font-bold text-gray-900">{selectedAlert.contactName}</div>
                      {selectedAlert.contactUsername && (
                        <div className="text-base text-gray-600">{selectedAlert.contactUsername}</div>
                      )}
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Summary</h4>
                      <p className="text-base text-gray-700 leading-relaxed">{selectedAlert.summary}</p>
                    </div>

                    {/* Threat Type */}
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-xl text-base font-bold">
                      <AlertTriangle className="w-5 h-5" />
                      {selectedAlert.threatType.charAt(0).toUpperCase() + selectedAlert.threatType.slice(1)}
                    </div>

                    {/* Conversation Snippet */}
                    <div className="bg-gray-900 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        CONVERSATION EXCERPT
                      </h4>
                      <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                        {selectedAlert.conversationSnippet}
                      </pre>
                    </div>

                    {/* Red Flags */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                      <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Red Flags ({selectedAlert.redFlags.length})
                      </h4>
                      <ul className="space-y-2">
                        {selectedAlert.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-base text-red-800">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Analysis */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-gray-600" />
                        Detailed Analysis
                      </h4>
                      <p className="text-base text-gray-700 leading-relaxed">{selectedAlert.detailedAnalysis}</p>
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
                      <h4 className="text-lg font-bold text-violet-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-violet-600" />
                        Recommended Actions
                      </h4>
                      <ul className="space-y-2">
                        {selectedAlert.recommendedActions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-base text-violet-800">
                            <CheckCircle2 className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Emergency Resources */}
                    {(selectedAlert.threatLevel === 'critical' || selectedAlert.threatLevel === 'high') && (
                      <div className="bg-red-600 text-white rounded-xl p-5">
                        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Emergency Resources
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <a href="tel:18004225678" className="bg-white/20 hover:bg-white/30 rounded-xl p-3 flex items-center gap-3 transition-colors">
                            <Shield className="w-6 h-6" />
                            <div>
                              <div className="font-bold">NCMEC CyberTipline</div>
                              <div className="text-red-200 text-sm">1-800-843-5678</div>
                            </div>
                          </a>
                          <a href="tel:911" className="bg-white/20 hover:bg-white/30 rounded-xl p-3 flex items-center gap-3 transition-colors">
                            <AlertTriangle className="w-6 h-6" />
                            <div>
                              <div className="font-bold">Emergency: 911</div>
                              <div className="text-red-200 text-sm">If child is in immediate danger</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {selectedAlert.status === 'new' && (
                        <button
                          onClick={() => markAlertReviewed(selectedAlert.id)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-5 h-5" />
                          Mark as Reviewed
                        </button>
                      )}
                      <button
                        onClick={() => markAlertResolved(selectedAlert.id)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => setSelectedAlert(null)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as const, label: `All (${alerts.length})` },
                { value: 'new' as const, label: `New (${alerts.filter(a => a.status === 'new').length})` },
                { value: 'critical' as const, label: `Critical (${alerts.filter(a => a.threatLevel === 'critical').length})` },
                { value: 'high' as const, label: `High (${alerts.filter(a => a.threatLevel === 'high').length})` },
                { value: 'medium' as const, label: `Medium (${alerts.filter(a => a.threatLevel === 'medium').length})` },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setAlertFilter(f.value)}
                  className={`px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                    alertFilter === f.value
                      ? 'bg-violet-900 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-violet-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Alert List */}
            <div className="space-y-3">
              {filteredAlerts.map(alert => {
                const config = threatLevelConfig[alert.threatLevel];
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full bg-white rounded-2xl border-2 ${config.border} p-5 flex items-center gap-4 hover:shadow-md transition-all text-left ${
                      alert.status === 'resolved' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`${config.bg} p-2.5 rounded-xl flex-shrink-0`}>
                      <config.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-lg">{alert.childName}</span>
                        <span className="text-gray-400">—</span>
                        <span className="font-semibold text-gray-700">{alert.platform}</span>
                        <span className={`${config.bg} ${config.text} px-2.5 py-0.5 rounded-full text-xs font-bold`}>
                          {config.label}
                        </span>
                        {alert.status === 'new' && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">NEW</span>
                        )}
                        {alert.status === 'resolved' && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">RESOLVED</span>
                        )}
                      </div>
                      <p className="text-base text-gray-600 truncate">{alert.summary}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>Contact: {alert.contactName}</span>
                        <span>Score: {alert.threatScore}/100</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}

              {filteredAlerts.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
                  <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-xl font-semibold text-gray-500">No alerts match this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CHILDREN TAB ===== */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            {/* Add Child Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddChild(!showAddChild)}
                className="flex items-center gap-2 px-5 py-3 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-xl transition-colors shadow-md"
              >
                {showAddChild ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {showAddChild ? 'Cancel' : 'Add Child'}
              </button>
            </div>

            {/* Add Child Form */}
            {showAddChild && (
              <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-md overflow-hidden">
                <div className="bg-violet-50 px-6 py-4 border-b border-violet-200">
                  <h3 className="text-lg font-bold text-violet-900 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add a Child to Monitor
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newChildName}
                        onChange={e => setNewChildName(e.target.value)}
                        placeholder="Child's name"
                        className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        value={newChildAge}
                        onChange={e => setNewChildAge(e.target.value)}
                        placeholder="Age"
                        min="1"
                        max="17"
                        className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-violet-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">Avatar Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(avatarColors).map(([color, cls]) => (
                          <button
                            key={color}
                            onClick={() => setNewChildColor(color)}
                            className={`w-10 h-10 ${cls} rounded-full transition-all ${
                              newChildColor === color ? 'ring-4 ring-violet-300 scale-110' : 'hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">Platforms to Monitor</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {platformOptions.map(platform => {
                        const isSelected = newChildPlatforms.includes(platform.id);
                        return (
                          <button
                            key={platform.id}
                            onClick={() => {
                              setNewChildPlatforms(prev =>
                                isSelected ? prev.filter(p => p !== platform.id) : [...prev, platform.id]
                              );
                            }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                              isSelected
                                ? 'border-violet-400 bg-violet-50 text-violet-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <platform.icon className={`w-4 h-4 ${isSelected ? 'text-violet-500' : 'text-gray-400'}`} />
                            {platform.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddChild}
                    disabled={!newChildName.trim() || !newChildAge}
                    className="px-8 py-3 bg-violet-700 hover:bg-violet-800 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors"
                  >
                    Add Child
                  </button>
                </div>
              </div>
            )}

            {/* Children List */}
            <div className="space-y-4">
              {children.map(child => {
                const isExpanded = expandedChild === child.id;
                return (
                  <div key={child.id} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden hover:border-violet-300 transition-colors">
                    <div className="p-5 flex items-center gap-4">
                      <div className={`w-14 h-14 ${avatarColors[child.avatarColor]} rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                        {child.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xl font-bold text-gray-900">{child.name}</span>
                          <span className="text-base text-gray-500">Age {child.age}</span>
                          {child.monitoringEnabled ? (
                            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> PROTECTED
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-xs font-bold">PAUSED</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {child.platforms.map(pId => {
                            const platform = platformOptions.find(p => p.id === pId);
                            return platform ? (
                              <span key={pId} className={`${platform.bg} ${platform.color} px-2 py-0.5 rounded-lg text-xs font-semibold`}>
                                {platform.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {child.alertCount > 0 && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                            {child.alertCount} alerts
                          </span>
                        )}
                        <button
                          onClick={() => toggleChildMonitoring(child.id)}
                          className={`relative w-12 h-7 rounded-full transition-colors ${
                            child.monitoringEnabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                            child.monitoringEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                        <button
                          onClick={() => setExpandedChild(isExpanded ? null : child.id)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-200 p-5 bg-gray-50">
                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                            <div className="text-2xl font-bold text-violet-600">{child.platforms.length}</div>
                            <div className="text-sm text-gray-500">Platforms</div>
                          </div>
                          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                            <div className="text-2xl font-bold text-red-600">{child.alertCount}</div>
                            <div className="text-sm text-gray-500">Total Alerts</div>
                          </div>
                          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                            <div className="text-2xl font-bold text-green-600">{child.lastScan}</div>
                            <div className="text-sm text-gray-500">Last Scan</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setActiveTab('scanner'); setScannerChildName(child.name); setScannerChildAge(child.age.toString()); }}
                            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                          >
                            <Scan className="w-4 h-4" />
                            Scan Conversation
                          </button>
                          <button
                            onClick={() => removeChild(child.id)}
                            className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {children.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xl font-semibold text-gray-500 mb-3">No children added yet</p>
                  <button
                    onClick={() => setShowAddChild(true)}
                    className="px-6 py-3 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-xl transition-colors"
                  >
                    Add Your First Child
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChildShieldDashboard;
