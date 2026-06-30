import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  phone: string;
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}


interface GuardianSettings {
  email_provider: string;
  email_connected: boolean;
  email_auto_scan: boolean;
  call_monitoring_enabled: boolean;
  alert_level: string;
  weekly_report_enabled: boolean;
  weekly_report_day: string;
}


interface ProtectionStats {
  emails_scanned: number;
  calls_monitored: number;
  scams_blocked: number;
  messages_checked: number;
  reports_submitted: number;
}

interface ScamCheckHistoryItem {
  id: string;
  message_type: string;
  message_text: string;
  verdict: string;
  confidence: number;
  scam_type: string;
  title: string;
  explanation: string;
  red_flags: string[];
  safe_signals: string[];
  advice: string;
  created_at: string;
}

interface ReportedScam {
  id: string;
  scam_type: string;
  description: string;
  contact_method: string;
  date_occurred: string;
  money_lost: string;
  status: string;
  created_at: string;
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}


interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  guardianSettings: GuardianSettings | null;
  protectionStats: ProtectionStats | null;
  scamHistory: ScamCheckHistoryItem[];
  reportedScams: ReportedScam[];
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'signup';
  isProfileOpen: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  openAuthModal: (view?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateGuardianSettings: (data: Partial<GuardianSettings>) => Promise<void>;
  saveScamCheck: (data: Omit<ScamCheckHistoryItem, 'id' | 'created_at'>) => Promise<void>;
  saveReport: (data: Omit<ReportedScam, 'id' | 'created_at' | 'status'>) => Promise<void>;
  incrementStat: (stat: keyof ProtectionStats, amount?: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [guardianSettings, setGuardianSettings] = useState<GuardianSettings | null>(null);
  const [protectionStats, setProtectionStats] = useState<ProtectionStats | null>(null);
  const [scamHistory, setScamHistory] = useState<ScamCheckHistoryItem[]>([]);
  const [reportedScams, setReportedScams] = useState<ReportedScam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (profileData) setProfile(profileData);

      // Fetch guardian settings
      const { data: settingsData } = await supabase
        .from('guardian_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (settingsData) setGuardianSettings(settingsData);

      // Fetch protection stats
      const { data: statsData } = await supabase
        .from('protection_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (statsData) setProtectionStats(statsData);

      // Fetch scam check history
      const { data: historyData } = await supabase
        .from('scam_check_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (historyData) setScamHistory(historyData);

      // Fetch reported scams
      const { data: reportsData } = await supabase
        .from('reported_scams')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (reportsData) setReportedScams(reportsData);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, []);

  const initializeUserRecords = useCallback(async (userId: string, displayName: string = '') => {
    try {
      // Create profile if doesn't exist
      await supabase.from('user_profiles').upsert({
        user_id: userId,
        display_name: displayName,
      }, { onConflict: 'user_id' });

      // Create guardian settings if doesn't exist
      await supabase.from('guardian_settings').upsert({
        user_id: userId,
      }, { onConflict: 'user_id' });

      // Create protection stats if doesn't exist
      await supabase.from('protection_stats').upsert({
        user_id: userId,
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('Error initializing user records:', err);
    }
  }, []);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await initializeUserRecords(session.user.id);
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setGuardianSettings(null);
        setProtectionStats(null);
        setScamHistory([]);
        setReportedScams([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData, initializeUserRecords]);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        await initializeUserRecords(data.user.id, displayName);
        await fetchUserData(data.user.id);
        setIsAuthModalOpen(false);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Something went wrong' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        await initializeUserRecords(data.user.id);
        await fetchUserData(data.user.id);
        setIsAuthModalOpen(false);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Something went wrong' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };

  const openAuthModal = (view: 'login' | 'signup' = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await supabase
      .from('user_profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    await fetchUserData(user.id);
  };

  const updateGuardianSettings = async (data: Partial<GuardianSettings>) => {
    if (!user) return;
    await supabase
      .from('guardian_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    await fetchUserData(user.id);
  };

  const saveScamCheck = async (data: Omit<ScamCheckHistoryItem, 'id' | 'created_at'>) => {
    if (!user) return;
    await supabase.from('scam_check_history').insert({
      user_id: user.id,
      ...data,
    });
    // Increment stat
    await incrementStat('messages_checked');
    if (data.verdict === 'scam') {
      await incrementStat('scams_blocked');
    }
    await fetchUserData(user.id);
  };

  const saveReport = async (data: Omit<ReportedScam, 'id' | 'created_at' | 'status'>) => {
    if (!user) return;
    await supabase.from('reported_scams').insert({
      user_id: user.id,
      ...data,
    });
    await incrementStat('reports_submitted');
    await fetchUserData(user.id);
  };

  const incrementStat = async (stat: keyof ProtectionStats, amount: number = 1) => {
    if (!user) return;
    const currentStats = protectionStats || {
      emails_scanned: 0,
      calls_monitored: 0,
      scams_blocked: 0,
      messages_checked: 0,
      reports_submitted: 0,
    };
    const newValue = (currentStats[stat] || 0) + amount;
    await supabase
      .from('protection_stats')
      .update({ [stat]: newValue, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  };

  const refreshData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        guardianSettings,
        protectionStats,
        scamHistory,
        reportedScams,
        isLoading,
        isAuthModalOpen,
        authModalView,
        isProfileOpen,
        signUp,
        signIn,
        signOut,
        openAuthModal,
        closeAuthModal,
        openProfile,
        closeProfile,
        updateProfile,
        updateGuardianSettings,
        saveScamCheck,
        saveReport,
        incrementStat,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
