import React, { useState } from 'react';
import { VpnProvider } from './context/VpnContext';
import { HeaderNav, AppViewMode } from './components/common/HeaderNav';
import { MobileFrame } from './components/mobile/MobileFrame';
import { MobileHomeScreen } from './components/mobile/MobileHomeScreen';
import { MobileServerList } from './components/mobile/MobileServerList';
import { MobileSubscription } from './components/mobile/MobileSubscription';
import { MobileHistory } from './components/mobile/MobileHistory';
import { MobileSettings } from './components/mobile/MobileSettings';
import { MobileNotificationsModal } from './components/mobile/MobileNotificationsModal';
import { MobileAuthModal } from './components/mobile/MobileAuthModal';
import { ApkDownloadScreen } from './components/export/ApkDownloadScreen';
import { AndroidProjectBrowser } from './components/export/AndroidProjectBrowser';
import { WireguardSetupGuide } from './components/guide/WireguardSetupGuide';
import { PhoneDirectConnect } from './components/phone/PhoneDirectConnect';

function MainAppContent() {
  const [viewMode, setViewMode] = useState<AppViewMode>('mobile');
  const [mobileTab, setMobileTab] = useState<'home' | 'servers' | 'plans' | 'history' | 'settings'>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Render active mobile screen inside the Android frame
  const renderMobileScreen = () => {
    if (showNotifications) {
      return <MobileNotificationsModal onBack={() => setShowNotifications(false)} />;
    }
    if (showAuthModal) {
      return <MobileAuthModal onBack={() => setShowAuthModal(false)} />;
    }

    switch (mobileTab) {
      case 'servers':
        return (
          <MobileServerList
            onBack={() => setMobileTab('home')}
            onOpenPlans={() => setMobileTab('plans')}
          />
        );
      case 'plans':
        return <MobileSubscription onBack={() => setMobileTab('home')} />;
      case 'history':
        return <MobileHistory onBack={() => setMobileTab('home')} />;
      case 'settings':
        return (
          <MobileSettings
            onBack={() => setMobileTab('home')}
            onOpenPlans={() => setMobileTab('plans')}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        );
      case 'home':
      default:
        return (
          <MobileHomeScreen
            onOpenServers={() => setMobileTab('servers')}
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenPlans={() => setMobileTab('plans')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 flex flex-col font-sans selection:bg-[#00F2FF]/30 selection:text-[#00F2FF]">
      {/* Top Header Navigation */}
      <HeaderNav
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDirectDownloadApk={() => setViewMode('apk')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Mobile View */}
        {viewMode === 'mobile' && (
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs font-orbitron font-bold text-[#00F2FF] uppercase tracking-wider">
                  BD VPN Android Mobile Application
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30">
                  ALL SERVERS FREE
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Official Android VpnService API · WireGuard/OpenVPN Tunnels · Sideload APK Ready
              </span>
            </div>

            <MobileFrame activeTab={mobileTab} setActiveTab={setMobileTab}>
              {renderMobileScreen()}
            </MobileFrame>
          </div>
        )}

        {/* Direct Phone Connection (No GitHub / No PC) */}
        {viewMode === 'phone' && (
          <div className="w-full py-2">
            <PhoneDirectConnect />
          </div>
        )}

        {/* Dedicated APK Download & Installation Screen */}
        {viewMode === 'apk' && (
          <div className="w-full py-2">
            <ApkDownloadScreen onSwitchToPhoneMode={() => setViewMode('phone')} />
          </div>
        )}

        {/* Export & Code Browser View */}
        {viewMode === 'export' && (
          <div className="w-full">
            <AndroidProjectBrowser onDownloadApk={() => setViewMode('apk')} />
          </div>
        )}

        {/* WireGuard VPS Setup Guide */}
        {viewMode === 'guide' && (
          <div className="w-full">
            <WireguardSetupGuide />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-[#1E2638] bg-[#07090F] py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
          <span>BD VPN Client · Android SDK 34 / Jetpack Compose / Direct APK Release (No AAB)</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Strict Security Standard: Zero Private Keys in Client APK · Curve25519 &amp; ChaCha20-Poly1305
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <VpnProvider>
      <MainAppContent />
    </VpnProvider>
  );
}
