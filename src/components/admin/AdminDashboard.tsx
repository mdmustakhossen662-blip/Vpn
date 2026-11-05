import React, { useState } from 'react';
import {
  Users,
  Server,
  Shield,
  Activity,
  Bell,
  Radio,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Search,
  Sliders,
  Database,
  ExternalLink,
  Crown,
  Zap,
} from 'lucide-react';
import { useVpn } from '../../context/VpnContext';
import { VpnServer, SubscriptionTier, VpnProtocol } from '../../types/vpn';

export const AdminDashboard: React.FC = () => {
  const {
    servers,
    allUsers,
    sessionLogs,
    notifications,
    announcements,
    adminAddServer,
    adminUpdateServer,
    adminDeleteServer,
    adminToggleBlockUser,
    updateUserPlan,
    adminSendNotification,
    adminAddAnnouncement,
    adminDeleteAnnouncement,
  } = useVpn();

  const [activeTab, setActiveTab] = useState<'servers' | 'users' | 'logs' | 'notifications' | 'rules'>('servers');
  const [searchServerQuery, setSearchServerQuery] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Add Server Modal State
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerCountry, setNewServerCountry] = useState('Singapore');
  const [newServerCountryCode, setNewServerCountryCode] = useState('SG');
  const [newServerCity, setNewServerCity] = useState('Central');
  const [newServerFlag, setNewServerFlag] = useState('🇸🇬');
  const [newServerHost, setNewServerHost] = useState('139.180.201.79');
  const [newServerPort, setNewServerPort] = useState(51820);
  const [newServerProtocol, setNewServerProtocol] = useState<VpnProtocol>('WireGuard');
  const [newServerPublicKey, setNewServerPublicKey] = useState('wG+CustomNodePublicKey718290abLpQweRtYuIo=');
  const [newServerTier, setNewServerTier] = useState<SubscriptionTier>('FREE');

  // Edit Server Modal State
  const [editingServer, setEditingServer] = useState<VpnServer | null>(null);

  // Send Notification State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifType, setNotifType] = useState<'maintenance' | 'new_server' | 'subscription' | 'announcement'>('announcement');
  const [notifSentNotice, setNotifSentNotice] = useState(false);

  // New Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSeverity, setAnnSeverity] = useState<'info' | 'warning' | 'urgent'>('info');

  // Metrics Calculations
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u) => !u.isBlocked).length;
  const blockedUsers = allUsers.filter((u) => u.isBlocked).length;
  const premiumVipUsers = allUsers.filter((u) => u.plan === 'PREMIUM' || u.plan === 'VIP').length;
  const activeServersCount = servers.filter((s) => s.enabled).length;

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName || !newServerHost) return;

    adminAddServer({
      name: newServerName,
      country: newServerCountry,
      countryCode: newServerCountryCode,
      city: newServerCity,
      flag: newServerFlag,
      host: newServerHost,
      port: Number(newServerPort),
      protocol: newServerProtocol,
      publicKey: newServerPublicKey,
      configReference: `configs/${newServerProtocol.toLowerCase()}/${newServerCountryCode.toLowerCase()}_${Date.now()}.conf`,
      enabled: true,
      load: Math.floor(Math.random() * 30) + 15,
      ping: Math.floor(Math.random() * 40) + 20,
      isRecommended: false,
      tierRequired: newServerTier,
    });

    setShowAddServerModal(false);
    setNewServerName('');
  };

  const handleSaveEditServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServer) return;

    adminUpdateServer(editingServer.id, {
      name: editingServer.name,
      country: editingServer.country,
      city: editingServer.city,
      flag: editingServer.flag,
      host: editingServer.host,
      port: editingServer.port,
      load: editingServer.load,
      protocol: editingServer.protocol,
      tierRequired: editingServer.tierRequired,
      enabled: editingServer.enabled,
    });

    setEditingServer(null);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) return;

    adminSendNotification(notifTitle, notifBody, notifType);
    setNotifSentNotice(true);
    setNotifTitle('');
    setNotifBody('');
    setTimeout(() => setNotifSentNotice(false), 3000);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    adminAddAnnouncement(annTitle, annContent, annSeverity);
    setAnnTitle('');
    setAnnContent('');
  };

  const filteredServers = servers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchServerQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchServerQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchServerQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.uid.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#07090F] border border-[#1E2638] rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#BC13FE] to-[#00F2FF] p-[1px] flex items-center justify-center shadow-lg shadow-purple-900/30">
              <div className="w-full h-full bg-[#07090F] rounded-[11px] flex items-center justify-center text-[#00F2FF]">
                <Radio className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-orbitron text-lg font-bold text-white tracking-wider">BD VPN Admin Center</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 font-bold">
                  FIREBASE REALTIME DB CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Server Fleet Control, User Subscriptions &amp; Push Notification Broadcaster
              </p>
            </div>
          </div>
        </div>

        {/* Global Admin Status Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-slate-300">Admin Role:</span>
            <span className="text-[#00F2FF] font-mono font-bold">Authenticated (UID: adm-master)</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-[#00F2FF]" />
          </div>
          <div className="font-orbitron text-2xl font-bold text-white">{totalUsers}</div>
          <span className="text-[10px] text-slate-400">Registered accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Users</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="font-orbitron text-2xl font-bold text-[#00FF88]">{activeUsers}</div>
          <span className="text-[10px] text-slate-400">Unrestricted access</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Blocked Users</span>
            <XCircle className="w-4 h-4 text-[#FF3366]" />
          </div>
          <div className="font-orbitron text-2xl font-bold text-[#FF3366]">{blockedUsers}</div>
          <span className="text-[10px] text-slate-400">Revoked sessions</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Premium / VIP</span>
            <Crown className="w-4 h-4 text-[#BC13FE]" />
          </div>
          <div className="font-orbitron text-2xl font-bold text-[#BC13FE]">{premiumVipUsers}</div>
          <span className="text-[10px] text-slate-400">Paid subscribers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Servers</span>
            <Server className="w-4 h-4 text-[#00F2FF]" />
          </div>
          <div className="font-orbitron text-2xl font-bold text-white">
            {activeServersCount} <span className="text-xs text-slate-500 font-normal">/ {servers.length}</span>
          </div>
          <span className="text-[10px] text-[#00FF88]">Fleet operational</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E2638] pb-1 overflow-x-auto">
        {[
          { id: 'servers', label: 'VPN Server Fleet', icon: Server },
          { id: 'users', label: 'User Accounts & Plans', icon: Users },
          { id: 'logs', label: 'Connection Logs', icon: Activity },
          { id: 'notifications', label: 'Push Notifications & Alerts', icon: Bell },
          { id: 'rules', label: 'Firebase Security Rules', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#00F2FF]/20 to-cyan-500/20 text-[#00F2FF] border border-[#00F2FF]/40 shadow-sm shadow-cyan-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: VPN Server Fleet */}
      {activeTab === 'servers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchServerQuery}
                onChange={(e) => setSearchServerQuery(e.target.value)}
                placeholder="Search server fleet..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
              />
            </div>

            <button
              id="btn-admin-add-server"
              onClick={() => setShowAddServerModal(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add VPN Server</span>
            </button>
          </div>

          {/* Servers Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#1E2638] bg-[#0D121F]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111728] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E2638]">
                <tr>
                  <th className="py-3 px-4">Node / Location</th>
                  <th className="py-3 px-4">Endpoint &amp; Protocol</th>
                  <th className="py-3 px-4">WireGuard Public Key</th>
                  <th className="py-3 px-4">Tier Required</th>
                  <th className="py-3 px-4">Current Load</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] text-slate-300">
                {filteredServers.map((server) => (
                  <tr key={server.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{server.flag}</span>
                        <div>
                          <div className="font-semibold text-white">{server.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {server.city}, {server.country}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-white">
                        {server.host}:{server.port}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-[#00F2FF] font-semibold">
                        {server.protocol}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]" title={server.publicKey}>
                        {server.publicKey}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          server.tierRequired === 'VIP'
                            ? 'bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40'
                            : server.tierRequired === 'PREMIUM'
                            ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                            : 'bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40'
                        }`}
                      >
                        {server.tierRequired}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              server.load < 50 ? 'bg-[#00FF88]' : server.load < 80 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${server.load}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{server.load}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => adminUpdateServer(server.id, { enabled: !server.enabled })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          server.enabled
                            ? 'bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {server.enabled ? 'ONLINE' : 'OFFLINE'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingServer(server)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                          title="Edit server"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adminDeleteServer(server.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700"
                          title="Delete server"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts & Plans */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Search user name, email, or UID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
              />
            </div>
            <span className="text-xs text-slate-400">Total accounts: {allUsers.length}</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E2638] bg-[#0D121F]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111728] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E2638]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">UID</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Plan Expiry</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {user.uid}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={user.plan}
                        onChange={(e) => updateUserPlan(user.uid, e.target.value as SubscriptionTier)}
                        className="bg-[#111728] border border-[#1E2638] text-xs font-bold rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#00F2FF]"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(user.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          user.isBlocked
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                        }`}
                      >
                        {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => adminToggleBlockUser(user.uid)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          user.isBlocked
                            ? 'bg-[#00FF88]/20 text-[#00FF88] hover:bg-[#00FF88]/30'
                            : 'bg-[#FF3366]/20 text-[#FF3366] hover:bg-[#FF3366]/30'
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unblock</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Block User</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Connection Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron text-xs font-bold text-white uppercase tracking-wider">
              Recent VPN Session Telemetry
            </h3>
            <span className="text-xs text-slate-400">Zero-logs compliant: minimum required metadata only</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E2638] bg-[#0D121F]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111728] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E2638]">
                <tr>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Server Node</th>
                  <th className="py-3 px-4">Protocol</th>
                  <th className="py-3 px-4">Virtual Assigned IP</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Bytes Downloaded</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] text-slate-300">
                {sessionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-all font-mono text-[11px]">
                    <td className="py-3 px-4 text-[#00F2FF]">{log.id}</td>
                    <td className="py-3 px-4 text-white font-sans font-semibold">
                      {log.flag} {log.serverName}
                    </td>
                    <td className="py-3 px-4">{log.protocol}</td>
                    <td className="py-3 px-4 text-[#00FF88]">{log.assignedIp}</td>
                    <td className="py-3 px-4">{Math.floor(log.durationSeconds / 60)} min {log.durationSeconds % 60} sec</td>
                    <td className="py-3 px-4">{(log.bytesDownloaded / (1024 * 1024)).toFixed(1)} MB</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] font-sans font-bold">
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Push Notifications & System Announcements */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FCM Push Notification Broadcaster */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#00F2FF]" />
              <h3 className="font-orbitron text-sm font-bold text-white">Broadcast Firebase Cloud Message (FCM)</h3>
            </div>

            {notifSentNotice && (
              <div className="mb-3 p-2.5 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 text-xs text-[#00FF88] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>FCM payload dispatched to all registered device tokens!</span>
              </div>
            )}

            <form onSubmit={handleSendNotification} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Notification Title</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Scheduled Network Upgrade"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category / Type</label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="maintenance">Maintenance Alert</option>
                  <option value="new_server">New Server Available</option>
                  <option value="subscription">Subscription Promotion</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Notification Message Body</label>
                <textarea
                  rows={3}
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  placeholder="e.g. Singapore FastEdge latency improved by 40%..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send FCM Push to All Devices</span>
              </button>
            </form>
          </div>

          {/* System Announcements Manager */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-[#BC13FE]" />
              <h3 className="font-orbitron text-sm font-bold text-white">System Announcement Banner</h3>
            </div>

            <form onSubmit={handleAddAnnouncement} className="space-y-3 mb-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Amsterdam Stealth 10G Node Online"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#BC13FE]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Severity</label>
                <select
                  value={annSeverity}
                  onChange={(e) => setAnnSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#BC13FE]"
                >
                  <option value="info">Info (Cyan)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="urgent">Urgent (Rose)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Banner Content</label>
                <textarea
                  rows={2}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Description displayed on user app home screen..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#BC13FE]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#BC13FE] to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-900/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Announcement Banner</span>
              </button>
            </form>

            {/* List of active announcements */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Published Announcements</span>
              {announcements.map((ann) => (
                <div key={ann.id} className="p-2.5 rounded-xl bg-[#111728] border border-[#1E2638] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{ann.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{ann.content}</div>
                  </div>
                  <button
                    onClick={() => adminDeleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Firebase Security Rules & Architecture */}
      {activeTab === 'rules' && (
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00FF88]" />
              <h3 className="font-orbitron text-sm font-bold text-white">
                Firebase Realtime Database Security Rules (RBAC)
              </h3>
            </div>
            <span className="text-[11px] text-[#00FF88] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Private Keys in Client Nodes
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            These rules enforce role-based access control. Only users verified in the <code className="text-[#00F2FF]">admins/</code> node can modify VPN servers, alter user subscription tiers, or broadcast FCM push notifications. Client accounts can only read active servers and their own profile/session history.
          </p>

          <pre className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638] text-slate-300 font-mono text-xs overflow-x-auto">
{`{
  "rules": {
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)",
        ".write": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)",
        "isBlocked": {
          ".write": "root.child('admins').child(auth.uid).val() === true"
        },
        "plan": {
          ".write": "root.child('admins').child(auth.uid).val() === true || !data.exists()"
        }
      }
    },
    "servers": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true",
      "$serverId": {
        ".validate": "!newData.hasChild('privateKey') && !newData.hasChild('rootPassword')"
      }
    },
    "notifications": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    },
    "announcements": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}`}
          </pre>
        </div>
      )}

      {/* Modal: Add VPN Server */}
      {showAddServerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1322] border border-[#00F2FF]/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638] mb-4">
              <h3 className="font-orbitron text-sm font-bold text-white">Add New VPN Gateway Node</h3>
              <button onClick={() => setShowAddServerModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddServer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Server Name</label>
                  <input
                    type="text"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    placeholder="e.g. Singapore FastEdge-02"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Country</label>
                  <input
                    type="text"
                    value={newServerCountry}
                    onChange={(e) => setNewServerCountry(e.target.value)}
                    placeholder="Singapore"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={newServerCity}
                    onChange={(e) => setNewServerCity(e.target.value)}
                    placeholder="Jurong"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Country Flag</label>
                  <input
                    type="text"
                    value={newServerFlag}
                    onChange={(e) => setNewServerFlag(e.target.value)}
                    placeholder="🇸🇬"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">ISO Code</label>
                  <input
                    type="text"
                    value={newServerCountryCode}
                    onChange={(e) => setNewServerCountryCode(e.target.value.toUpperCase())}
                    placeholder="SG"
                    maxLength={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Host IP / FQDN</label>
                  <input
                    type="text"
                    value={newServerHost}
                    onChange={(e) => setNewServerHost(e.target.value)}
                    placeholder="139.180.201.78"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white font-mono focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Port</label>
                  <input
                    type="number"
                    value={newServerPort}
                    onChange={(e) => setNewServerPort(Number(e.target.value))}
                    placeholder="51820"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white font-mono focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Protocol</label>
                  <select
                    value={newServerProtocol}
                    onChange={(e) => setNewServerProtocol(e.target.value as VpnProtocol)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  >
                    <option value="WireGuard">WireGuard (UDP 51820)</option>
                    <option value="OpenVPN">OpenVPN (UDP/TCP 1194)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Required Tier</label>
                  <select
                    value={newServerTier}
                    onChange={(e) => setNewServerTier(e.target.value as SubscriptionTier)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  >
                    <option value="FREE">FREE (All Users)</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="VIP">VIP Exclusive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  WireGuard Server Public Key
                </label>
                <input
                  type="text"
                  value={newServerPublicKey}
                  onChange={(e) => setNewServerPublicKey(e.target.value)}
                  placeholder="Base64 Public Key from wg pubkey"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-slate-300 font-mono focus:outline-none focus:border-[#00F2FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServerModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
                >
                  Save &amp; Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit VPN Server */}
      {editingServer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1322] border border-[#00F2FF]/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638] mb-4">
              <h3 className="font-orbitron text-sm font-bold text-white">Edit Server Node: {editingServer.name}</h3>
              <button onClick={() => setEditingServer(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEditServer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Server Name</label>
                  <input
                    type="text"
                    value={editingServer.name}
                    onChange={(e) => setEditingServer({ ...editingServer, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Country</label>
                  <input
                    type="text"
                    value={editingServer.country}
                    onChange={(e) => setEditingServer({ ...editingServer, country: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Host</label>
                  <input
                    type="text"
                    value={editingServer.host}
                    onChange={(e) => setEditingServer({ ...editingServer, host: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white font-mono focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Port</label>
                  <input
                    type="number"
                    value={editingServer.port}
                    onChange={(e) => setEditingServer({ ...editingServer, port: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white font-mono focus:outline-none focus:border-[#00F2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Load %</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editingServer.load}
                    onChange={(e) => setEditingServer({ ...editingServer, load: Number(e.target.value) })}
                    className="w-full accent-[#00F2FF]"
                  />
                  <span className="text-xs font-mono text-[#00F2FF]">{editingServer.load}%</span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tier Requirement</label>
                  <select
                    value={editingServer.tierRequired}
                    onChange={(e) => setEditingServer({ ...editingServer, tierRequired: e.target.value as SubscriptionTier })}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-[#00F2FF]"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-enabled"
                  checked={editingServer.enabled}
                  onChange={(e) => setEditingServer({ ...editingServer, enabled: e.target.checked })}
                  className="rounded accent-[#00FF88]"
                />
                <label htmlFor="chk-enabled" className="text-xs text-white font-semibold">
                  Enable Node for User App Access
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingServer(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
                >
                  Update Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
