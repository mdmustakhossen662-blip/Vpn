export type VpnStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';

export type VpnProtocol = 'WireGuard' | 'OpenVPN';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'VIP';

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  host: string;
  port: number;
  protocol: VpnProtocol;
  publicKey: string;
  configReference: string;
  enabled: boolean;
  load: number; // 0 - 100%
  ping: number; // ms
  isRecommended?: boolean;
  isFavorite?: boolean;
  tierRequired: SubscriptionTier;
  createdAt: string;
}

export interface UserAccount {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  plan: SubscriptionTier;
  status: 'active' | 'suspended';
  expiryDate: string;
  selectedServerId: string;
  isBlocked: boolean;
  avatarUrl?: string;
}

export interface VpnSessionLog {
  id: string;
  serverId: string;
  serverName: string;
  country: string;
  flag: string;
  connectedAt: string;
  disconnectedAt?: string;
  durationSeconds: number;
  bytesDownloaded: number;
  bytesUploaded: number;
  protocol: VpnProtocol;
  status: 'completed' | 'active' | 'terminated';
  assignedIp: string;
}

export interface PushNotificationMessage {
  id: string;
  title: string;
  body: string;
  type: 'maintenance' | 'new_server' | 'subscription' | 'announcement';
  timestamp: string;
  read?: boolean;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'urgent';
  createdAt: string;
  active: boolean;
}

export interface LiveNetworkStats {
  downloadSpeedBps: number; // bytes per sec
  uploadSpeedBps: number;   // bytes per sec
  totalDownloadedBytes: number;
  totalUploadedBytes: number;
  pingMs: number;
  currentIp: string;
  virtualIp: string;
}
