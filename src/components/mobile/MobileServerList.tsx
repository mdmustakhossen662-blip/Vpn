import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Zap,
  Star,
  Check,
  Shield,
  SlidersHorizontal,
  Flame,
  Globe2,
} from 'lucide-react';
import { useVpn } from '../../context/VpnContext';
import { VpnServer } from '../../types/vpn';

interface MobileServerListProps {
  onBack: () => void;
  onOpenPlans: () => void;
}

export const MobileServerList: React.FC<MobileServerListProps> = ({ onBack, onOpenPlans }) => {
  const {
    servers,
    selectedServer,
    selectServer,
    toggleFavoriteServer,
    autoSelectFastestServer,
    vpnStatus,
    currentUser,
  } = useVpn();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'recommended' | 'favorites' | 'wireguard'>('all');
  const [sortBy, setSortBy] = useState<'ping' | 'load' | 'name'>('ping');

  // Filtered and sorted servers
  const filteredServers = useMemo(() => {
    return servers
      .filter((server) => {
        // Only enabled servers
        if (!server.enabled) return false;

        // Search match
        const matchesSearch =
          server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          server.city.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Tab match
        if (filterTab === 'recommended') return server.isRecommended;
        if (filterTab === 'favorites') return server.isFavorite;
        if (filterTab === 'wireguard') return server.protocol === 'WireGuard';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ping') return a.ping - b.ping;
        if (sortBy === 'load') return a.load - b.load;
        return a.name.localeCompare(b.name);
      });
  }, [servers, searchQuery, filterTab, sortBy]);

  const handleServerClick = (server: VpnServer) => {
    selectServer(server);
    onBack();
  };

  const handleAutoFastest = () => {
    autoSelectFastestServer();
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#05060A] text-white overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <button
            id="btn-back-server-list"
            onClick={onBack}
            className="p-1.5 rounded-lg bg-[#0D121F] border border-[#1E2638] text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-orbitron text-sm font-bold tracking-wide">Select Server</h2>
            <p className="text-[10px] text-slate-400">
              {filteredServers.length} Active Nodes available
            </p>
          </div>
        </div>

        {/* Auto-Select Fastest Button */}
        <button
          id="btn-auto-fastest-server"
          onClick={handleAutoFastest}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F2FF]/20 to-cyan-500/20 text-[#00F2FF] border border-[#00F2FF]/50 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#00F2FF]/30 transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Fastest</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-3 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search country, city, or server..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FF] transition-all"
        />
      </div>

      {/* Filter Tabs and Sort */}
      <div className="mt-2.5 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
        <div className="flex gap-1">
          {(['all', 'recommended', 'favorites', 'wireguard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize whitespace-nowrap transition-all ${
                filterTab === tab
                  ? 'bg-[#00F2FF] text-[#05060A] font-bold'
                  : 'bg-[#0D121F] text-slate-400 hover:text-white border border-[#1E2638]'
              }`}
            >
              {tab === 'wireguard' ? 'WireGuard' : tab}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-[#0D121F] border border-[#1E2638] text-[10px] text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
        >
          <option value="ping">Lowest Ping</option>
          <option value="load">Lowest Load</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Server List */}
      <div className="flex-1 mt-2.5 overflow-y-auto space-y-2 pr-1">
        {filteredServers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Globe2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No servers found matching your query.
          </div>
        ) : (
          filteredServers.map((server) => {
            const isSelected = selectedServer.id === server.id;

            return (
              <div
                key={server.id}
                onClick={() => handleServerClick(server)}
                className={`w-full p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#0B1522] border-[#00F2FF] shadow-lg shadow-cyan-950/30'
                    : 'bg-[#0D121F] border-[#1E2638] hover:border-slate-700 hover:bg-[#111728]'
                }`}
              >
                {/* Active Connection Highlight */}
                {isSelected && vpnStatus === 'CONNECTED' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FF88]/10 rounded-bl-full pointer-events-none" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow">{server.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-white text-xs">{server.name}</span>

                        {server.isRecommended && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 font-bold">
                            RECOMMENDED
                          </span>
                        )}

                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00F2FF]/15 text-[#00F2FF] border border-[#00F2FF]/30 font-bold">
                          FREE
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{server.city}, {server.country}</span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-[10px] text-slate-300">{server.protocol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side stats and actions */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#00FF88]">
                        <span className={`w-1.5 h-1.5 rounded-full ${server.ping < 50 ? 'bg-[#00FF88]' : server.ping < 120 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        <span>{server.ping} ms</span>
                      </div>

                      {/* Server Load Bar */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              server.load < 50
                                ? 'bg-[#00FF88]'
                                : server.load < 80
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${server.load}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400">{server.load}%</span>
                      </div>
                    </div>

                    {/* Favorite Star Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteServer(server.id);
                      }}
                      className="p-1 text-slate-500 hover:text-amber-400 transition-all"
                      title="Favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          server.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Checkmark */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#00F2FF] text-[#05060A] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
