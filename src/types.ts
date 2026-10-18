// OpenTube Network Types

export interface VideoCreator {
  name: string;
  handle: string;
  did: string;
  avatar: string;
  verified: boolean;
  federatedOriginNode: string;
  subscribersCount: number;
}

export interface VideoTranscode {
  resolution: '1080p' | '720p' | '480p' | '360p';
  cid: string;
  bitrateKbps: number;
  sizeMb: number;
}

export interface Video {
  id: string;
  title: string;
  titleUrdu?: string;
  description: string;
  descriptionUrdu?: string;
  creator: VideoCreator;
  cid: string;
  sha256Hash: string;
  filecoinDealId: string;
  duration: number; // in seconds
  durationFormatted: string;
  views: number;
  likes: number;
  dislikes: number;
  uploadDate: string;
  uploadTimestampDaysAgo: number;
  category: 'Tech & Open Source' | 'Decentralization' | 'Education' | 'Community & Culture' | 'Music & Art' | 'Podcasts';
  tags: string[];
  videoUrl: string;
  posterUrl: string;
  transcodes: VideoTranscode[];
  replicationNodes: string[]; // Node IDs storing copies
  p2pSeeders: number;
  p2pLeechers: number;
  swarmPieces: number;
  pieceSizeKb: number;
  communityRatingScore: number; // 0-100
  tipTotal: number;
  isCommunityFlagged?: boolean;
  flagReason?: string;
  federationOrigin: string; // e.g. 'opentube.global' or 'lahore.opentube.mesh'
}

export interface P2PNode {
  id: string;
  name: string;
  region: string;
  country: string;
  endpoint: string;
  status: 'online' | 'degraded' | 'offline';
  uptimePercent: number;
  latencyMs: number;
  pinnedVideosCount: number;
  bandwidthServedGb: number;
  reputationScore: number;
  isSelfNode?: boolean;
  coordinates: { x: number; y: number }; // Relative map positioning %
  operatorDid: string;
  storageCapacityTb: number;
  storageUsedTb: number;
  version: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  titleUrdu?: string;
  description: string;
  category: 'Protocol' | 'Moderation' | 'Storage/IPFS' | 'Tokenomics';
  proposer: string;
  proposerDid: string;
  votesFor: number;
  votesAgainst: number;
  totalEligibleTokens: number;
  quorumThresholdPercent: number;
  approvalThresholdPercent: number;
  status: 'active' | 'passed' | 'timelock' | 'rejected';
  deadline: string;
  timelockEta?: string;
  multisigRequired: number;
  multisigSigned: number;
  executionPayload: string;
  userVoted?: 'for' | 'against' | null;
}

export interface Comment {
  id: string;
  videoId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorDid: string;
  content: string;
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  cryptographicSignature: string;
  federatedOriginNode: string;
}

export interface UserIdentity {
  did: string;
  username: string;
  handle: string;
  avatar: string;
  bio: string;
  seedPhrase: string;
  publicKeyHex: string;
  tokenBalance: number; // OpenTube tokens (TUBE) for creator tips & governance
  subscribedChannelDids: string[];
  likedVideoIds: string[];
  watchHistory: { videoId: string; timestamp: number }[];
  playlists: { id: string; title: string; videoIds: string[] }[];
  preferredNodeId: string;
}

export interface FederatedInstance {
  id: string;
  name: string;
  domain: string;
  nodeCount: number;
  activeUsers: number;
  federationProtocol: string;
  description: string;
  status: 'peered' | 'syncing' | 'verified';
  region: string;
  policyNotes: string;
}

export interface ModerationReport {
  id: string;
  videoId: string;
  videoTitle: string;
  reporterDid: string;
  reason: 'copyright' | 'malware' | 'hate_speech' | 'spam' | 'decentralized_consensus';
  details: string;
  communityVotesToHide: number;
  communityVotesToRetain: number;
  status: 'under_review' | 'locally_masked' | 'dismissed';
  evidenceCid: string;
}
