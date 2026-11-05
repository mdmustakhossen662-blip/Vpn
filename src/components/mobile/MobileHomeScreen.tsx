import React, { useState } from 'react';
import {
  Shield,
  Power,
  ChevronRight,
  Zap,
  ArrowDown,
  ArrowUp,
  Clock,
  HardDrive,
  Globe,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

interface MobileHomeScreenProps {
  onOpenServers: () => void;
  onOpenNotifications: () => void;
  onOpenPlans: () => void;
}

export const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({
  onOpenServers,
  onOpenNotifications,
  onOpenPlans,
}) => {
  const {
    selectedServer,
    vpnStatus,
    connectingStage,
    protocol,
    currentUser,
    liveStats,
    sessionSeconds,
    errorMessage,
    clearError,
    connectVpn,
    disconnectVpn,
    notifications,
    announcements,
  } = useVpn();

  // Android VPN Permission Dialog Simulator
  const [showVpnPermissionModal, setShowVpnPermissionModal] = useState(false);
  const [hasGrantedPermission, setHasGrantedPermission] = useState(true);

  // Format Duration HH:MM:SS
  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format Bytes (MB / GB)
  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Format Speed (Mbps)
  const formatSpeed = (bps: number) => {
    const mbps = (bps * 8) / 1000000;
    return `${mbps.toFixed(1)} Mbps`;
  };

  const handleConnectClick = () => {
    if (vpnStatus === 'CONNECTED') {
      disconnectVpn();
    } else if (vpnStatus === 'DISCONNECTED') {
      if (!hasGrantedPermission) {
        setShowVpnPermissionModal(true);
      } else {
        connectVpn();
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeAnnouncement = announcements.find((a) => a.active);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative overflow-y-auto">
      {/* Background Cyberpunk Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00F2FF]/5 blur-[90px] rounded-full pointer-events-none" />
      {vpnStatus === 'CONNECTED' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00FF88]/10 blur-[100px] rounded-full pointer-events-none transition-all duration-700" />
      )}

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F2FF] to-[#BC13FE] p-[1px] flex items-center justify-center shadow-lg shadow-[#00F2FF]/20">
            <div className="w-full h-full bg-[#05060A] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#00F2FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron text-sm font-bold tracking-wider text-white">BD VPN</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gradient-to-r from-[#00F2FF]/20 to-[#BC13FE]/20 text-[#00F2FF] border border-[#00F2FF]/30">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div
            id="btn-mobile-plan-badge"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/40 flex items-center gap-1 shadow-sm shadow-emerald-950/40"
          >
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>FREE VIP</span>
          </div>

          <button
            id="btn-mobile-notif"
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF3366] rounded-full ring-2 ring-[#05060A]" />
            )}
          </button>
        </div>
      </div>

      {/* Active System Announcement Banner */}
      {activeAnnouncement && (
        <div className="relative z-10 mt-2 bg-[#0D121F]/90 border border-[#00F2FF]/30 rounded-xl p-2.5 flex items-start gap-2 backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <AlertTriangle className="w-3.5 h-3.5 text-[#00F2FF] shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-tight">
            <span className="font-semibold text-white mr-1">{activeAnnouncement.title}:</span>
            <span className="text-slate-300">{activeAnnouncement.content}</span>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="relative z-10 mt-2 bg-[#FF3366]/15 border border-[#FF3366]/40 rounded-xl p-2.5 flex items-start justify-between gap-2 text-[11px] text-[#FF3366]">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={clearError} className="font-bold text-xs hover:text-white">✕</button>
        </div>
      )}

      {/* Center Circular VPN Connect Control */}
      <div className="relative z-10 flex flex-col items-center justify-center my-3">
        {/* Outer Pulsing Indicator Rings */}
        <div className="relative flex items-center justify-center">
          {/* Animated Connecting Ring */}
          {vpnStatus === 'CONNECTING' && (
            <div className="absolute w-56 h-56 rounded-full border border-[#FFCC00]/40 animate-pulse-ring pointer-events-none" />
          )}

          {/* Connected Neon Halo */}
          {vpnStatus === 'CONNECTED' && (
            <div className="absolute w-52 h-52 rounded-full border border-[#00FF88]/30 animate-pulse-ring pointer-events-none" />
          )}

          {/* Decorative Outer Scale Ring */}
          <div className="w-48 h-48 rounded-full border border-[#1E2638] flex items-center justify-center bg-[#070B14]/80 backdrop-blur-md shadow-inner">
            {/* The Main Connect Button */}
            <button
              id="btn-mobile-connect-vpn"
              onClick={handleConnectClick}
              disabled={vpnStatus === 'CONNECTING'}
              className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 group ${
                vpnStatus === 'CONNECTED'
                  ? 'bg-gradient-to-b from-[#0D2419] to-[#08150F] border-2 border-[#00FF88] neon-success-glow'
                  : vpnStatus === 'CONNECTING'
                  ? 'bg-gradient-to-b from-[#241E0D] to-[#151208] border-2 border-[#FFCC00]'
                  : 'bg-gradient-to-b from-[#111728] to-[#0A0E1A] border-2 border-[#00F2FF] neon-cyan-glow hover:border-cyan-300'
              }`}
            >
              <Power
                className={`w-12 h-12 mb-1.5 transition-all duration-300 ${
                  vpnStatus === 'CONNECTED'
                    ? 'text-[#00FF88] drop-shadow-[0_0_12px_#00FF88]'
                    : vpnStatus === 'CONNECTING'
                    ? 'text-[#FFCC00] animate-spin'
                    : 'text-[#00F2FF] group-hover:scale-110 drop-shadow-[0_0_8px_#00F2FF]'
                }`}
              />
              <span
                className={`font-orbitron text-[11px] font-bold tracking-wider ${
                  vpnStatus === 'CONNECTED'
                    ? 'text-[#00FF88]'
                    : vpnStatus === 'CONNECTING'
                    ? 'text-[#FFCC00]'
                    : 'text-white'
                }`}
              >
                {vpnStatus}
              </span>
            </button>
          </div>
        </div>

        {/* Handshake Progress Caption */}
        <div className="mt-3 text-center min-h-[22px]">
          {vpnStatus === 'CONNECTING' ? (
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#FFCC00] font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCC00] animate-ping" />
              <span>{connectingStage || 'Establishing VPN tunnel...'}</span>
            </div>
          ) : vpnStatus === 'CONNECTED' ? (
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#00FF88] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tunnel Active · WireGuard AES-Poly1305</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Tap to encrypt connection</span>
          )}
        </div>
      </div>

      {/* Selected Server Card */}
      <div className="relative z-10">
        <button
          id="btn-mobile-select-server"
          onClick={onOpenServers}
          className="w-full bg-[#0D121F] hover:bg-[#12192B] border border-[#1E2638] hover:border-[#00F2FF]/50 rounded-2xl p-3 flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow">{selectedServer.flag}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm">{selectedServer.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  {selectedServer.protocol}
                </span>
                {selectedServer.tierRequired === 'VIP' && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#BC13FE]/20 text-[#BC13FE] font-bold">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                {selectedServer.city}, {selectedServer.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-xs font-semibold text-[#00FF88]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>{selectedServer.ping} ms</span>
              </div>
              <span className="text-[10px] text-slate-400">Load {selectedServer.load}%</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00F2FF] group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>

      {/* Speed Monitor & Session Telemetry Card */}
      <div className="relative z-10 mt-3 bg-[#0D121F] border border-[#1E2638] rounded-2xl p-3">
        {/* Live Bandwidth Speed Gauges */}
        <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-[#1E2638]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-[#00F2FF]" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Download</div>
              <div className="font-orbitron text-xs font-bold text-[#00F2FF]">
                {vpnStatus === 'CONNECTED' ? formatSpeed(liveStats.downloadSpeedBps) : '0.0 Mbps'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#BC13FE]/10 border border-[#BC13FE]/30 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5 text-[#BC13FE]" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Upload</div>
              <div className="font-orbitron text-xs font-bold text-[#BC13FE]">
                {vpnStatus === 'CONNECTED' ? formatSpeed(liveStats.uploadSpeedBps) : '0.0 Mbps'}
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2.5 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium mb-0.5">
              <Clock className="w-2.5 h-2.5" />
              <span>DURATION</span>
            </div>
            <span className="font-mono text-xs font-bold text-white">
              {formatDuration(sessionSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium mb-0.5">
              <HardDrive className="w-2.5 h-2.5" />
              <span>DATA USED</span>
            </div>
            <span className="font-mono text-xs font-bold text-white">
              {formatBytes(liveStats.totalDownloadedBytes + liveStats.totalUploadedBytes)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium mb-0.5">
              <Globe className="w-2.5 h-2.5" />
              <span>VIRTUAL IP</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#00FF88] truncate max-w-full">
              {vpnStatus === 'CONNECTED' ? liveStats.virtualIp : 'Unsecured'}
            </span>
          </div>
        </div>
      </div>

      {/* Android Official VpnService Permission Prompt Modal */}
      {showVpnPermissionModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full bg-[#121624] border border-[#00F2FF]/40 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-[#00F2FF]/20 border border-[#00F2FF] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#00F2FF]" />
            </div>
            <h3 className="font-orbitron text-base font-bold text-white text-center mb-1">
              Connection Request
            </h3>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-4">
              <strong className="text-[#00F2FF]">BD VPN</strong> wants to set up a VPN connection that allows it to monitor network traffic. Only accept if you trust the source.
            </p>
            <div className="bg-[#090C15] p-2.5 rounded-xl border border-white/5 text-[11px] text-slate-400 mb-4">
              🛡️ Uses official Android <span className="text-white font-mono">VpnService</span> API. No root required. Traffic is fully encrypted.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVpnPermissionModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setHasGrantedPermission(true);
                  setShowVpnPermissionModal(false);
                  connectVpn();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 shadow-lg shadow-cyan-500/20"
              >
                OK (Allow)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
