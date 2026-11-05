import React from 'react';
import { ArrowLeft, Clock, HardDrive, Shield, CheckCircle2 } from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

interface MobileHistoryProps {
  onBack: () => void;
}

export const MobileHistory: React.FC<MobileHistoryProps> = ({ onBack }) => {
  const { sessionLogs } = useVpn();

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 60) {
      const h = Math.floor(m / 60);
      return `${h}h ${m % 60}m`;
    }
    return `${m}m ${s}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
        <button
          id="btn-back-history"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron text-sm font-bold tracking-wide">Connection History</h2>
          <p className="text-[10px] text-slate-400">Privacy-conscious audit logs</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 pb-6">
        {sessionLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No prior sessions recorded yet. Connect to a VPN server to begin.
          </div>
        ) : (
          sessionLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{log.flag}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{log.serverName}</div>
                    <div className="text-[10px] text-slate-400">{log.country}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-[#00FF88] px-2 py-0.5 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Success</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-[#1E2638]/60 text-[10px]">
                <div>
                  <span className="text-slate-500 block">CONNECTED</span>
                  <span className="text-slate-300 font-mono">
                    {new Date(log.connectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">DURATION</span>
                  <span className="text-slate-300 font-mono">{formatDuration(log.durationSeconds)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">DATA TRANSFERRED</span>
                  <span className="text-[#00F2FF] font-mono">
                    {formatBytes(log.bytesDownloaded + log.bytesUploaded)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
