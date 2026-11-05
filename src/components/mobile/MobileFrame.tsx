import React from 'react';
import { Wifi, Battery, Shield } from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'home' | 'servers' | 'plans' | 'history' | 'settings';
  setActiveTab: (tab: 'home' | 'servers' | 'plans' | 'history' | 'settings') => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, activeTab, setActiveTab }) => {
  const { vpnStatus } = useVpn();

  // Simulated current time
  const timeStr = '12:45';

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] bg-[#05060A] rounded-[44px] p-3 shadow-2xl border-4 border-[#1E2638] flex flex-col overflow-hidden select-none ring-1 ring-white/10">
      {/* Outer Phone Bezel Gloss */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Screen Frame Container */}
      <div className="relative w-full h-full bg-[#05060A] rounded-[34px] overflow-hidden flex flex-col border border-white/5">
        {/* Android Status Bar */}
        <div className="relative z-20 h-8 px-5 flex items-center justify-between text-xs text-slate-400 bg-[#05060A]/80 backdrop-blur-sm">
          {/* Time & Active VPN Shield Key */}
          <div className="flex items-center gap-1.5 font-medium tracking-tight">
            <span>{timeStr}</span>
            {vpnStatus === 'CONNECTED' && (
              <span className="flex items-center gap-0.5 text-[#00FF88] text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00FF88]/10 border border-[#00FF88]/30">
                <Shield className="w-2.5 h-2.5" />
                VPN
              </span>
            )}
          </div>

          {/* Android Camera Punch Hole / Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF]/20" />
          </div>

          {/* Connectivity Icons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-slate-300">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">98%</span>
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Dynamic Screen View Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {children}
        </div>

        {/* Bottom Android Navigation Pill & Tab Bar */}
        <div className="relative z-20 bg-[#080B14] border-t border-[#1E2638] px-2 py-1.5 flex flex-col">
          {/* Tabs */}
          <div className="grid grid-cols-4 gap-1 text-center py-1">
            <button
              id="tab-mobile-home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'text-[#00F2FF] bg-[#00F2FF]/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            <button
              id="tab-mobile-servers"
              onClick={() => setActiveTab('servers')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'servers'
                  ? 'text-[#00F2FF] bg-[#00F2FF]/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-semibold">Servers</span>
            </button>

            <button
              id="tab-mobile-history"
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'text-[#00F2FF] bg-[#00F2FF]/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-semibold">History</span>
            </button>

            <button
              id="tab-mobile-settings"
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'text-[#00F2FF] bg-[#00F2FF]/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-semibold">Settings</span>
            </button>
          </div>

          {/* Android Home Navigation Bar Line */}
          <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto my-1" />
        </div>
      </div>
    </div>
  );
};
