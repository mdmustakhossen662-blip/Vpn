import React, { useState } from 'react';
import { Terminal, Shield, Check, Copy, AlertTriangle, Key, ExternalLink, Cpu } from 'lucide-react';

export const WireguardSetupGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const serverConfigContent = `# /etc/wireguard/wg0.conf on Ubuntu / Debian Server
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <YOUR_SERVER_PRIVATE_KEY>
SaveConfig = false

# Masquerade outbound packets through the server's public network interface (eth0)
PostUp = ufw route allow in on wg0 out on eth0
PostUp = iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
PostUp = ip6tables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
PreDown = ufw route delete allow in on wg0 out on eth0
PreDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
PreDown = ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client Peer Dynamic Allocation (Assigned Client IP)
[Peer]
PublicKey = <CLIENT_PUBLIC_KEY_FROM_ANDROID_APP>
AllowedIPs = 10.8.0.2/32
PersistentKeepalive = 25`;

  return (
    <div className="w-full bg-[#07090F] border border-[#1E2638] rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FF88] to-emerald-500 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <div className="w-full h-full bg-[#07090F] rounded-[11px] flex items-center justify-center text-[#00FF88]">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white tracking-wider">
                Production WireGuard VPS Setup Guide
              </h2>
              <p className="text-xs text-slate-400">
                How to configure legitimate Linux VPN endpoints and link them to BD VPN Admin
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 font-semibold flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Standard Kernel WireGuard Module
          </span>
        </div>
      </div>

      {/* Security Architecture Rule Callout */}
      <div className="p-4 rounded-2xl bg-[#0D1524] border border-[#00F2FF]/30 flex items-start gap-3">
        <Key className="w-5 h-5 text-[#00F2FF] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Strict Zero-Knowledge Private Key Architecture:</strong>
          <p className="mt-1">
            In compliance with production security standards, server private keys (<code className="text-[#00F2FF]">wg_private.key</code>) must NEVER be committed to the Android application or stored in public Firebase nodes. Only the public key (<code className="text-[#00FF88]">wg_public.key</code>) is shared with the client for cryptographic peer verification.
          </p>
        </div>
      </div>

      {/* Step by Step Commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00F2FF] font-orbitron">STEP 1</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Ubuntu / Debian</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Install WireGuard and Tools</h3>
            <p className="text-xs text-slate-400 mb-3">
              Install the official kernel tools and IP packet routing utilities:
            </p>
            <pre className="p-3 rounded-xl bg-[#05060A] border border-[#1E2638] text-xs font-mono text-slate-300 overflow-x-auto">
{`sudo apt update
sudo apt install -y wireguard iptables qrencode`}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(`sudo apt update && sudo apt install -y wireguard iptables qrencode`, 'step1')}
            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 self-start"
          >
            {copiedSection === 'step1' ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Commands</span>
          </button>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00F2FF] font-orbitron">STEP 2</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Key Generation</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Generate Cryptographic Keys</h3>
            <p className="text-xs text-slate-400 mb-3">
              Generate 256-bit Curve25519 keypair with strict file permissions:
            </p>
            <pre className="p-3 rounded-xl bg-[#05060A] border border-[#1E2638] text-xs font-mono text-slate-300 overflow-x-auto">
{`cd /etc/wireguard
umask 077
wg genkey | tee server_private.key | wg pubkey > server_public.key`}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(`cd /etc/wireguard && umask 077 && wg genkey | tee server_private.key | wg pubkey > server_public.key`, 'step2')}
            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 self-start"
          >
            {copiedSection === 'step2' ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Commands</span>
          </button>
        </div>
      </div>

      {/* Step 3: wg0.conf */}
      <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-[#00F2FF] font-orbitron">STEP 3</span>
            <h3 className="text-sm font-bold text-white">Create /etc/wireguard/wg0.conf</h3>
          </div>
          <button
            onClick={() => copyToClipboard(serverConfigContent, 'step3')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            {copiedSection === 'step3' ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Configuration</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638] text-xs font-mono text-slate-300 overflow-x-auto">
          <code>{serverConfigContent}</code>
        </pre>
      </div>

      {/* Step 4: Enable Service */}
      <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
        <span className="text-xs font-bold text-[#00F2FF] font-orbitron">STEP 4</span>
        <h3 className="text-sm font-bold text-white mb-2">Enable IP Packet Forwarding &amp; Launch Systemd Daemon</h3>
        <pre className="p-3 rounded-xl bg-[#05060A] border border-[#1E2638] text-xs font-mono text-slate-300 overflow-x-auto">
{`# Enable IP Forwarding in Linux kernel
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start and enable WireGuard interface
sudo systemctl enable --now wg-quick@wg0
sudo wg show`}
        </pre>
      </div>
    </div>
  );
};
