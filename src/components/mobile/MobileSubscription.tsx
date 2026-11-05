import React from 'react';
import { ArrowLeft, Check, Zap, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { useVpn } from '../../context/VpnContext';
import { SubscriptionTier } from '../../types/vpn';

interface MobileSubscriptionProps {
  onBack: () => void;
}

export const MobileSubscription: React.FC<MobileSubscriptionProps> = ({ onBack }) => {
  const { currentUser, updateUserPlan } = useVpn();

  const plans: Array<{
    tier: SubscriptionTier;
    title: string;
    price: string;
    badge?: string;
    color: string;
    features: string[];
  }> = [
    {
      tier: 'FREE',
      title: 'Free Basic',
      price: '$0 / mo',
      color: '#00F2FF',
      features: [
        'Access to 4 standard nodes (BD, SG, DE, IN)',
        'Standard speed cap (50 Mbps)',
        '1 simultaneous device',
        'Standard WireGuard encryption',
        '60-minute session duration',
      ],
    },
    {
      tier: 'PREMIUM',
      title: 'Cyber Pro',
      price: '$4.99 / mo',
      badge: 'POPULAR',
      color: '#00FF88',
      features: [
        'Access to all Global & High-Speed nodes',
        'High-speed streaming (Up to 500 Mbps)',
        '5 simultaneous devices',
        'WireGuard & OpenVPN Protocol choice',
        '24-hour continuous sessions',
        'Kill-Switch protection',
        'Ad & Malware blocking DNS',
      ],
    },
    {
      tier: 'VIP',
      title: 'VIP Ghost Elite',
      price: '$9.99 / mo',
      badge: 'MAX SPEED',
      color: '#BC13FE',
      features: [
        'Exclusive Amsterdam Stealth & 10G nodes',
        'Unmetered Gigabit bandwidth (1+ Gbps)',
        'Unlimited simultaneous devices',
        'Zero-latency gaming routing',
        'Unlimited 24/7 session duration',
        'Dedicated VIP tunnel isolation',
        'Priority 24/7 Discord/Email support',
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
        <button
          id="btn-back-plans"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron text-sm font-bold tracking-wide">Subscription Plans</h2>
          <p className="text-[10px] text-slate-400">Upgrade for gigabit servers and zero logs</p>
        </div>
      </div>

      {/* Current Active Plan Status */}
      <div className="mt-3 p-3 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Current Tier</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-orbitron text-sm font-bold text-[#00F2FF]">{currentUser.plan}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00F2FF]/10 text-[#00F2FF]">ACTIVE</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Renews / Expiry</span>
          <div className="text-xs font-mono text-slate-300">Dec 31, 2026</div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mt-3 space-y-3 pb-4">
        {plans.map((p) => {
          const isCurrent = currentUser.plan === p.tier;

          return (
            <div
              key={p.tier}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-[#0E1726] border-[#00F2FF] shadow-lg shadow-cyan-950/20'
                  : 'bg-[#0D121F] border-[#1E2638] hover:border-slate-700'
              }`}
            >
              {p.badge && (
                <span
                  className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: `${p.color}20`,
                    color: p.color,
                    border: `1px solid ${p.color}50`,
                  }}
                >
                  {p.badge}
                </span>
              )}

              <div className="flex items-center gap-2">
                {p.tier === 'VIP' ? (
                  <Crown className="w-5 h-5 text-[#BC13FE]" />
                ) : p.tier === 'PREMIUM' ? (
                  <Sparkles className="w-5 h-5 text-[#00FF88]" />
                ) : (
                  <Zap className="w-5 h-5 text-[#00F2FF]" />
                )}
                <div>
                  <h3 className="font-orbitron text-xs font-bold text-white">{p.title}</h3>
                  <div className="text-sm font-bold mt-0.5" style={{ color: p.color }}>
                    {p.price}
                  </div>
                </div>
              </div>

              {/* Feature items */}
              <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-300">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-[#00FF88] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-[#1E2638]/70">
                <button
                  id={`btn-select-plan-${p.tier.toLowerCase()}`}
                  onClick={() => updateUserPlan(currentUser.uid, p.tier)}
                  disabled={isCurrent}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black hover:opacity-90 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${p.tier}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
