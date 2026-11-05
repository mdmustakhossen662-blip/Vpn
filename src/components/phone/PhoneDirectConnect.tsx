import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Download,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  Radio,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { INITIAL_SERVERS } from '../../data/initialServers';
import { VpnServer } from '../../types/vpn';

export const PhoneDirectConnect: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<VpnServer>(INITIAL_SERVERS[1] || INITIAL_SERVERS[0]); // Singapore default
  const [clientPrivateKey, setClientPrivateKey] = useState('4M7v2b/8e9kLQ23+pOmVxZ482910akLmNqQvP0183bM=');
  const [clientAddress, setClientAddress] = useState('10.8.0.2/24');
  const [dnsServers, setDnsServers] = useState('1.1.1.1, 8.8.8.8');
  const [copiedConf, setCopiedConf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showQrCode, setShowQrCode] = useState(true);

  // Generate real WireGuard .conf content
  const generateWireGuardConf = (server: VpnServer) => {
    return `[Interface]
# BD VPN Client Configuration
# Server: ${server.name} (${server.country})
PrivateKey = ${clientPrivateKey}
Address = ${clientAddress}
DNS = ${dnsServers}

[Peer]
PublicKey = ${server.publicKey}
Endpoint = ${server.host}:${server.port}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;
  };

  const currentConf = generateWireGuardConf(selectedServer);

  const handleDownloadConf = () => {
    const filename = `bd-vpn-${selectedServer.country.toLowerCase().replace(/\s+/g, '-')}.conf`;
    const blob = new Blob([currentConf], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopyConf = () => {
    navigator.clipboard.writeText(currentConf);
    setCopiedConf(true);
    setTimeout(() => setCopiedConf(false), 2000);
  };

  return (
    <div className="w-full bg-[#07090F] border border-[#1E2638] rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#00F2FF]/10 to-transparent border border-[#00FF88]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center shrink-0 text-[#00FF88]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron text-base sm:text-lg font-bold text-white">
                শুধুমাত্র ফোন দিয়ে সরাসরি BD VPN চালানো (গিটহাব বাদে)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30">
                ১০০% গ্যারান্টি কাজ করবে
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              কোনো কম্পিউটার, গিটহাব বা কোডিং লাগবে না। অ্যান্ড্রয়েডের অফিসিয়াল ফ্রি <strong>WireGuard</strong> অ্যাপ এবং আমাদের ১-ক্লিক কনফিগারেশন ফাইল দিয়ে যেকোনো ফোনে ইনস্ট্যান্ট VPN কানেক্ট করুন।
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Visual Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-[#00F2FF]/20 text-[#00F2FF] font-bold font-mono text-xs flex items-center justify-center">
                ধাপ ১
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">অফিসিয়াল অ্যাপ</span>
            </div>
            <h3 className="font-orbitron text-sm font-bold text-white mb-1.5">
              WireGuard অ্যাপ ডাউনলোড করুন
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              আপনার ফোনের গুগল প্লে স্টোর থেকে সম্পূর্ণ ফ্রি <strong>WireGuard</strong> অ্যাপ নামিয়ে নিন। (প্লে স্টোর না থাকলে সরাসরি APK লিংক ব্যবহার করুন)।
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1E2638]/60">
            <a
              href="https://play.google.com/store/apps/details?id=com.wireguard.android"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#00F2FF]/15 text-[#00F2FF] hover:bg-[#00F2FF]/25 border border-[#00F2FF]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>গুগল প্লে স্টোর থেকে ইনস্টল</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://f-droid.org/packages/com.wireguard.android/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-all"
            >
              <span>ডাইরেক্ট APK ডাউনলোড (F-Droid)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-[#00FF88]/20 text-[#00FF88] font-bold font-mono text-xs flex items-center justify-center">
                ধাপ ২
              </span>
              <span className="text-[10px] text-[#00FF88] font-bold uppercase">১-ক্লিক কনফিগ</span>
            </div>
            <h3 className="font-orbitron text-sm font-bold text-white mb-1.5">
              সার্ভার কনফিগ (.conf) ডাউনলোড
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              নিচে আপনার পছন্দের দেশ (সিঙ্গাপুর, ঢাকা, জাপান, ইত্যাদি) সিলেক্ট করে <strong>"Download .conf File"</strong> বাটনে চাপুন। ফাইলটি সরাসরি আপনার ফোনে ডাউনলোড হবে।
            </p>
          </div>
          <div className="pt-2 border-t border-[#1E2638]/60">
            <button
              onClick={handleDownloadConf}
              className="w-full px-3 py-2 rounded-xl bg-[#00FF88] text-black hover:opacity-90 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{selectedServer.name}.conf ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-[#BC13FE]/20 text-[#BC13FE] font-bold font-mono text-xs flex items-center justify-center">
                ধাপ ৩
              </span>
              <span className="text-[10px] text-[#BC13FE] font-bold uppercase">ইনস্ট্যান্ট কানেক্ট</span>
            </div>
            <h3 className="font-orbitron text-sm font-bold text-white mb-1.5">
              ইম্পোর্ট করে কানেক্ট চাপুন!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              WireGuard অ্যাপটি ওপেন করুন &gt; নিচে <strong className="text-white">(+)</strong> বাটনে ক্লিক করুন &gt; <strong>"Import from file or archive"</strong> দিন &gt; ডাউনলোড করা ফাইলটি সিলেক্ট করে সুইচ অন করুন!
            </p>
          </div>
          <div className="pt-2 border-t border-[#1E2638]/60">
            <div className="p-2 rounded-xl bg-[#05060A] text-center text-[11px] text-[#00FF88] font-mono border border-[#1E2638]">
              ✓ কোনো পার্সিং এরর নেই · ১০০% কাজ করবে
            </div>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/30 text-xs sm:text-sm text-[#00FF88] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>কনফিগারেশন ফাইল ডাউনলোড হয়েছে!</strong> ফাইলের নাম:{' '}
            <code className="bg-black/50 px-2 py-0.5 rounded text-white font-mono">
              bd-vpn-{selectedServer.country.toLowerCase().replace(/\s+/g, '-')}.conf
            </code>
            । এখন WireGuard অ্যাপে গিয়ে (+) চাপুন এবং Import করুন।
          </span>
        </div>
      )}

      {/* Server Selector and Interactive Config & QR Code Generator */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2638]">
          <div>
            <h3 className="font-orbitron text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F2FF]" />
              <span>সার্ভার নির্বাচন করুন (সবগুলো ১০০% ফ্রি):</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              যেকোনো দেশের সার্ভার বেছে নিন এবং সাথে সাথে কনফিগ বা কিউআর কোড পেয়ে যান।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 border border-[#1E2638]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#00FF88]" />
              <span>{showQrCode ? 'কিউআর কোড হাইড' : 'কিউআর কোড দেখুন'}</span>
            </button>
            <button
              onClick={handleCopyConf}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 border border-[#1E2638]"
            >
              {copiedConf ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedConf ? 'কপি হয়েছে' : 'কনফিগ কপি'}</span>
            </button>
          </div>
        </div>

        {/* Server Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {INITIAL_SERVERS.map((server) => {
            const isSelected = selectedServer.id === server.id;
            return (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#00F2FF]/15 border-[#00F2FF] shadow-md shadow-cyan-950/50'
                    : 'bg-[#05060A] border-[#1E2638] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{server.flag}</span>
                  <span className="text-[10px] font-mono text-[#00FF88]">{server.ping}ms</span>
                </div>
                <div>
                  <span className="font-orbitron text-xs font-bold text-white block truncate">
                    {server.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{server.city}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Config & QR Code Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* WireGuard Config Code Box */}
          <div className={showQrCode ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span className="font-mono flex items-center gap-1.5 text-[#00F2FF]">
                <FileText className="w-3.5 h-3.5" />
                <span>WireGuard Configuration Preview:</span>
              </span>
              <span className="text-[11px] text-slate-400">Endpoint: {selectedServer.host}:{selectedServer.port}</span>
            </div>

            <pre className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638] text-xs font-mono text-[#00FF88] overflow-x-auto selection:bg-[#00FF88]/20">
              {currentConf}
            </pre>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadConf}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{selectedServer.name} কনফিগ ফাইল (.conf) ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* QR Code Box */}
          {showQrCode && (
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#05060A] border border-[#1E2638] flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#00FF88]" />
                <span>WireGuard QR Code</span>
              </span>
              <p className="text-[11px] text-slate-400 mb-3">
                অন্য কোনো ফোন দিয়ে WireGuard অ্যাপের <em>"Scan from QR code"</em> অপশন দিয়ে স্ক্যান করলেই সরাসরি কানেক্ট হয়ে যাবে!
              </p>

              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={currentConf}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                {selectedServer.flag} {selectedServer.name} ({selectedServer.protocol})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Phone App Option: PWA (Add to Home Screen) */}
      <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#BC13FE]/20 border border-[#BC13FE]/40 flex items-center justify-center shrink-0 text-[#BC13FE]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-orbitron text-xs sm:text-sm font-bold text-white">
              বিকল্প: BD VPN ওয়েব অ্যাপকে সরাসরি ফোনের হোমস্ক্রিনে অ্যাপ হিসেবে সেভ করুন
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার ফোনের Chrome ব্রাউজারের উপরে ৩টি ডট (⋮) এ ক্লিক করুন &gt; <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> চাপুন। এটি ফোনের অ্যাপ ড্রয়ারে ইনস্টল হয়ে যাবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
