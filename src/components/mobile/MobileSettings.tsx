import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Zap,
  Lock,
  Wifi,
  Power,
  Moon,
  Bell,
  Globe,
  FileText,
  Info,
  ExternalLink,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { useVpn } from '../../context/VpnContext';
import { VpnProtocol } from '../../types/vpn';

interface MobileSettingsProps {
  onBack: () => void;
  onOpenPlans: () => void;
  onOpenAuth: () => void;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({
  onBack,
  onOpenPlans,
  onOpenAuth,
}) => {
  const {
    protocol,
    setProtocol,
    killSwitchEnabled,
    setKillSwitchEnabled,
    autoConnectOnWifi,
    setAutoConnectOnWifi,
    connectOnStartup,
    setConnectOnStartup,
    currentUser,
    logoutUser,
  } = useVpn();

  const [showKillSwitchInfo, setShowKillSwitchInfo] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
        <button
          id="btn-back-settings"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron text-sm font-bold tracking-wide">Settings & Security</h2>
          <p className="text-[10px] text-slate-400">Tunnel protocols & Android configuration</p>
        </div>
      </div>

      <div className="mt-3 space-y-3 pb-6">
        {/* User Account Card */}
        <div className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FF]/20 to-[#BC13FE]/20 border border-[#00F2FF]/30 flex items-center justify-center text-[#00F2FF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">{currentUser.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenPlans}
              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40"
            >
              {currentUser.plan}
            </button>
            <button
              onClick={logoutUser}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* VPN Protocol Selection */}
        <div className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#00F2FF]" />
            <span className="text-xs font-semibold text-white">VPN Protocol</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="proto-wireguard"
              onClick={() => setProtocol('WireGuard')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                protocol === 'WireGuard'
                  ? 'bg-[#0B1524] border-[#00F2FF] shadow-sm shadow-cyan-950/40'
                  : 'bg-[#090C15] border-[#1E2638] text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">WireGuard</span>
                {protocol === 'WireGuard' && (
                  <span className="w-2 h-2 rounded-full bg-[#00F2FF]" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Fastest · ChaCha20-Poly1305 · Instant Reconnect
              </span>
            </button>

            <button
              id="proto-openvpn"
              onClick={() => setProtocol('OpenVPN')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                protocol === 'OpenVPN'
                  ? 'bg-[#0B1524] border-[#00F2FF] shadow-sm shadow-cyan-950/40'
                  : 'bg-[#090C15] border-[#1E2638] text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">OpenVPN</span>
                {protocol === 'OpenVPN' && (
                  <span className="w-2 h-2 rounded-full bg-[#00F2FF]" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Robust · TLS 1.3 · TCP/UDP Obfuscation
              </span>
            </button>
          </div>
        </div>

        {/* Security & System Automation Toggles */}
        <div className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-3">
          {/* Kill Switch */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF3366]" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">Kill Switch</span>
                    <button
                      onClick={() => setShowKillSwitchInfo(!showKillSwitchInfo)}
                      className="text-slate-400 hover:text-white"
                      title="Learn how Android Kill Switch works"
                    >
                      <Info className="w-3 h-3 text-[#00F2FF]" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Block internet if VPN drops</span>
                </div>
              </div>

              {/* Custom Cyberpunk Toggle */}
              <button
                id="toggle-kill-switch"
                onClick={() => setKillSwitchEnabled(!killSwitchEnabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all ${
                  killSwitchEnabled ? 'bg-[#FF3366]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    killSwitchEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {showKillSwitchInfo && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#080B14] border border-[#FF3366]/30 text-[10px] text-slate-300 space-y-1">
                <p className="font-semibold text-[#FF3366]">How Kill Switch works on Android:</p>
                <p>
                  BD VPN leverages Android system integration via{' '}
                  <span className="font-mono text-[#00F2FF]">Settings &gt; Network &gt; VPN &gt; Always-on VPN</span> and{' '}
                  <span className="text-white font-medium">"Block connections without VPN"</span>.
                  When active, non-VPN packets are dropped by the Linux kernel filter.
                </p>
              </div>
            )}
          </div>

          <div className="h-[1px] bg-[#1E2638]" />

          {/* Auto-Connect on Untrusted Wi-Fi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#00F2FF]" />
              <div>
                <div className="text-xs font-semibold text-white">Auto-Connect on Wi-Fi</div>
                <div className="text-[10px] text-slate-400">Secure public hotspots automatically</div>
              </div>
            </div>

            <button
              id="toggle-auto-wifi"
              onClick={() => setAutoConnectOnWifi(!autoConnectOnWifi)}
              className={`w-10 h-5 rounded-full p-0.5 transition-all ${
                autoConnectOnWifi ? 'bg-[#00F2FF]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoConnectOnWifi ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-[1px] bg-[#1E2638]" />

          {/* Connect on Startup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-[#00FF88]" />
              <div>
                <div className="text-xs font-semibold text-white">Connect on Boot</div>
                <div className="text-[10px] text-slate-400">RECEIVE_BOOT_COMPLETED receiver</div>
              </div>
            </div>

            <button
              id="toggle-boot-connect"
              onClick={() => setConnectOnStartup(!connectOnStartup)}
              className={`w-10 h-5 rounded-full p-0.5 transition-all ${
                connectOnStartup ? 'bg-[#00FF88]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  connectOnStartup ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preferences & System Info */}
        <div className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-2.5">
          {/* Language Selector */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Language</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  language === 'en' ? 'bg-[#00F2FF] text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  language === 'bn' ? 'bg-[#00F2FF] text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                বাংলা (Bengali)
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-[#1E2638]" />

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifications (FCM)</span>
            </div>
            <button
              onClick={() => setNotificationsAllowed(!notificationsAllowed)}
              className={`w-10 h-5 rounded-full p-0.5 transition-all ${
                notificationsAllowed ? 'bg-[#00F2FF]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsAllowed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-[1px] bg-[#1E2638]" />

          {/* Privacy & Zero-Logs */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Zero-Logs Privacy Policy</span>
            </div>
            <span className="text-[10px] text-[#00FF88] font-semibold">Verified</span>
          </div>

          <div className="h-[1px] bg-[#1E2638]" />

          {/* About BD VPN */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-4 h-4 text-slate-400" />
              <span>App Version</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">v1.0.0 (API 34)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
