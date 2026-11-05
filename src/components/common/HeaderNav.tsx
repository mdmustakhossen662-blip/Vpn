import React from 'react';
import {
  Smartphone,
  FolderTree,
  Terminal,
  Shield,
  Download,
  CheckCircle,
} from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

export type AppViewMode = 'mobile' | 'phone' | 'apk' | 'export' | 'guide';

interface HeaderNavProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  onDirectDownloadApk: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewMode,
  setViewMode,
  onDirectDownloadApk,
}) => {
  const { vpnStatus, selectedServer } = useVpn();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05060A]/95 backdrop-blur-md border-b border-[#1E2638] px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F2FF] via-[#BC13FE] to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full bg-[#05060A] rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00F2FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-lg font-black tracking-wider text-white">BD VPN</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30">
                100% FREE &amp; UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Android VpnService Client &amp; Direct Release APK Package (No AAB)
            </p>
          </div>
        </div>

        {/* Center View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0D121F] border border-[#1E2638] overflow-x-auto no-scrollbar">
          <button
            id="nav-tab-mobile"
            onClick={() => setViewMode('mobile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'mobile'
                ? 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>

          <button
            id="nav-tab-phone"
            onClick={() => setViewMode('phone')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'phone'
                ? 'bg-gradient-to-r from-[#00FF88] to-emerald-400 text-black shadow-md shadow-emerald-500/20'
                : 'text-[#00FF88] hover:text-white hover:bg-emerald-950/40 border border-[#00FF88]/30'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ফোনে চালান (No GitHub)</span>
          </button>

          <button
            id="nav-tab-apk"
            onClick={() => setViewMode('apk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'apk'
                ? 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>Download APK</span>
          </button>

          <button
            id="nav-tab-export"
            onClick={() => setViewMode('export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'export'
                ? 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Android Code (.ZIP)</span>
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => setViewMode('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'guide'
                ? 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>VPS Setup</span>
          </button>
        </nav>

        {/* Direct APK Download Quick Action */}
        <div className="flex items-center gap-3">
          <button
            id="btn-quick-download-apk"
            onClick={onDirectDownloadApk}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Get APK (.apk)</span>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-[#0D121F] border border-[#1E2638] text-xs flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  vpnStatus === 'CONNECTED'
                    ? 'bg-[#00FF88] animate-pulse'
                    : vpnStatus === 'CONNECTING'
                    ? 'bg-[#FFCC00] animate-ping'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-300 font-mono text-[11px]">
                {selectedServer.flag} {selectedServer.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
