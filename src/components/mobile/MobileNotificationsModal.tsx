import React from 'react';
import { ArrowLeft, Bell, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

interface MobileNotificationsModalProps {
  onBack: () => void;
}

export const MobileNotificationsModal: React.FC<MobileNotificationsModalProps> = ({ onBack }) => {
  const { notifications } = useVpn();

  const getIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-[#FFCC00]" />;
      case 'new_server':
        return <ShieldCheck className="w-4 h-4 text-[#00FF88]" />;
      case 'subscription':
        return <Zap className="w-4 h-4 text-[#BC13FE]" />;
      default:
        return <Bell className="w-4 h-4 text-[#00F2FF]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
        <button
          id="btn-back-notifs"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron text-sm font-bold tracking-wide">FCM Notifications</h2>
          <p className="text-[10px] text-slate-400">Alerts from Admin and Network Ops</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 pb-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No new notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] hover:border-slate-700 transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{n.title}</span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
