import React, { useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScamAlerts from '@/components/ScamAlerts';
import ScamChecker from '@/components/ScamChecker';
import EmailGuardian from '@/components/EmailGuardian';
import SMSGuardian from '@/components/SMSGuardian';
import CallGuardian from '@/components/CallGuardian';
import ChildShieldDashboard from '@/components/ChildShieldDashboard';
import DeviceShield from '@/components/DeviceShield';
import ScamTypesGrid from '@/components/ScamTypesGrid';
import QuickTips from '@/components/QuickTips';
import ProtectionSteps from '@/components/ProtectionSteps';
import ScamQuiz from '@/components/ScamQuiz';
import TestimonialsSection from '@/components/TestimonialsSection';
import FamilyToolkit from '@/components/FamilyToolkit';
import ReportScamForm from '@/components/ReportScamForm';
import ResourceLibrary from '@/components/ResourceLibrary';
import CommunityScamMap from '@/components/CommunityScamMap';
import Footer from '@/components/Footer';
import EmergencyBanner from '@/components/EmergencyBanner';
import FontSizeControl from '@/components/FontSizeControl';
import AuthModal from '@/components/AuthModal';
import ProfileDashboard from '@/components/ProfileDashboard';

const AppLayout: React.FC = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={scrollToSection} />
      <HeroSection onNavigate={scrollToSection} />
      <ScamAlerts />
      <ScamChecker />
      <EmailGuardian />
      <SMSGuardian />
      <CallGuardian />
      <ChildShieldDashboard />
      <DeviceShield />
      <CommunityScamMap />
      <ScamTypesGrid />
      <QuickTips />
      <ProtectionSteps />
      <ScamQuiz />
      <TestimonialsSection />
      <FamilyToolkit />
      <ReportScamForm />
      <ResourceLibrary />
      <Footer onNavigate={scrollToSection} />
      <EmergencyBanner />
      <FontSizeControl />
      <AuthModal />
      <ProfileDashboard />
    </div>
  );
};

export default AppLayout;

