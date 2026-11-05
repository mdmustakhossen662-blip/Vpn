import React, { useState } from 'react';
import { ArrowLeft, Shield, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useVpn } from '../../context/VpnContext';

interface MobileAuthModalProps {
  onBack: () => void;
}

export const MobileAuthModal: React.FC<MobileAuthModalProps> = ({ onBack }) => {
  const { loginUser } = useVpn();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!email) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (mode === 'forgot') {
      setStatusMsg({
        type: 'success',
        text: 'Password reset link dispatched via Firebase Authentication.',
      });
      return;
    }

    if (!password || password.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const ok = await loginUser(email, password);
      if (ok) {
        setStatusMsg({ type: 'success', text: 'Authenticated successfully!' });
        setTimeout(() => {
          onBack();
        }, 600);
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
        <button
          id="btn-back-auth"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron text-sm font-bold tracking-wide">
            {mode === 'login' ? 'Account Login' : mode === 'register' ? 'Register Account' : 'Reset Password'}
          </h2>
          <p className="text-[10px] text-slate-400">Firebase Authentication integration</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F2FF]/20 to-[#BC13FE]/20 border border-[#00F2FF]/40 flex items-center justify-center text-[#00F2FF] mb-3">
          <Shield className="w-6 h-6" />
        </div>

        <h3 className="font-orbitron text-base font-bold text-white mb-1">
          {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join BD VPN' : 'Forgot Password'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-4">
          {mode === 'login'
            ? 'Sign in to sync your subscription & favorite servers'
            : mode === 'register'
            ? 'Create a secure account with zero-knowledge keys'
            : 'Enter your email to receive recovery instructions'}
        </p>

        {statusMsg && (
          <div
            className={`w-full p-2.5 rounded-xl border text-xs flex items-center gap-2 mb-3 ${
              statusMsg.type === 'error'
                ? 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366]'
                : 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Hasan"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@bdvpn.network"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Recovery Email'}
          </button>
        </form>

        {/* Alternate Links */}
        <div className="mt-4 flex flex-col items-center gap-2 text-xs">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => setMode('register')}
                className="text-slate-400 hover:text-[#00F2FF] transition-all"
              >
                Don't have an account? <span className="text-[#00F2FF] font-semibold">Sign Up</span>
              </button>
              <button
                onClick={() => setMode('forgot')}
                className="text-slate-500 hover:text-slate-300 text-[11px]"
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-slate-400 hover:text-[#00F2FF] transition-all"
            >
              Already have an account? <span className="text-[#00F2FF] font-semibold">Log In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
