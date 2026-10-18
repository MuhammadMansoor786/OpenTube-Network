// OpenTube Network - Decentralized Cryptography, P2P Swarm & Protocol Calculations

export interface SwarmCalculationResult {
  activeSeeders: number;
  healthStatus: 'optimal' | 'healthy' | 'degraded' | 'critical';
  bandwidthRatio: number;
  redundancyScore: number;
}

/**
 * Calculates swarm health and redundancy score based on replica nodes and offline state
 */
export function calculateSwarmEfficiency(
  baseSeeders: number,
  allReplicationNodeIds: string[],
  offlineNodeIds: string[]
): SwarmCalculationResult {
  const offlineSet = new Set(offlineNodeIds);
  const activeReplicas = allReplicationNodeIds.filter(id => !offlineSet.has(id)).length;
  const totalReplicas = Math.max(1, allReplicationNodeIds.length);
  const replicaRatio = activeReplicas / totalReplicas;

  // Active seeders drops proportionally if nodes go offline, but P2P swarm retains client seeds
  const effectiveSeeders = Math.max(1, Math.round(baseSeeders * (0.3 + 0.7 * replicaRatio)));
  const redundancyScore = Math.round(replicaRatio * 100);

  let healthStatus: 'optimal' | 'healthy' | 'degraded' | 'critical' = 'critical';
  if (redundancyScore >= 75 && effectiveSeeders >= 6) {
    healthStatus = 'optimal';
  } else if (redundancyScore >= 50 && effectiveSeeders >= 3) {
    healthStatus = 'healthy';
  } else if (redundancyScore > 0 || effectiveSeeders >= 1) {
    healthStatus = 'degraded';
  }

  return {
    activeSeeders: effectiveSeeders,
    healthStatus,
    bandwidthRatio: Number((replicaRatio * 1.5 + (effectiveSeeders / 10)).toFixed(2)),
    redundancyScore,
  };
}

/**
 * Resolves active replica node for failover routing
 */
export function resolveActiveNode(
  assignedNodeIds: string[],
  offlineNodeIds: string[]
): { selectedNodeId: string | null; isFailover: boolean } {
  const offlineSet = new Set(offlineNodeIds);
  const onlineNodes = assignedNodeIds.filter(id => !offlineSet.has(id));

  if (onlineNodes.length === 0) {
    return { selectedNodeId: null, isFailover: false };
  }

  // If primary node is offline, we've failed over to replica
  const isFailover = offlineSet.has(assignedNodeIds[0]);
  return {
    selectedNodeId: onlineNodes[0],
    isFailover,
  };
}

/**
 * Validates governance voting quorum and approval threshold
 */
export function calculateGovernanceQuorum(
  votesFor: number,
  votesAgainst: number,
  totalEligibleTokens: number,
  quorumThresholdPercent: number = 40,
  approvalThresholdPercent: number = 66
): { hasQuorum: boolean; isApproved: boolean; quorumTurnoutPercent: number; approvalPercent: number } {
  const totalVotesCast = votesFor + votesAgainst;
  const quorumTurnoutPercent = totalEligibleTokens > 0 
    ? Number(((totalVotesCast / totalEligibleTokens) * 100).toFixed(1)) 
    : 0;

  const approvalPercent = totalVotesCast > 0 
    ? Number(((votesFor / totalVotesCast) * 100).toFixed(1)) 
    : 0;

  const hasQuorum = quorumTurnoutPercent >= quorumThresholdPercent;
  const isApproved = hasQuorum && approvalPercent >= approvalThresholdPercent;

  return {
    hasQuorum,
    isApproved,
    quorumTurnoutPercent,
    approvalPercent,
  };
}

/**
 * User-controlled recommendation algorithm (no corporate black box)
 */
export interface RecommendationWeights {
  communityCurated: number;   // 0 - 100
  chronological: number;      // 0 - 100
  p2pAvailability: number;    // 0 - 100
  engagement: number;         // 0 - 100
}

export interface VideoScoreInput {
  id: string;
  views: number;
  likes: number;
  seeders: number;
  uploadTimestampDaysAgo: number;
  communityRatingScore: number; // 0 - 100
}

export function computeRecommendationScore(
  video: VideoScoreInput,
  weights: RecommendationWeights
): number {
  // Normalize each component to 0 - 100 scale
  const normChronological = Math.max(0, 100 - video.uploadTimestampDaysAgo * 8);
  const normEngagement = Math.min(100, Math.log10(Math.max(1, video.views)) * 20 + (video.likes / Math.max(1, video.views)) * 400);
  const normP2P = Math.min(100, video.seeders * 7);
  const normCommunity = video.communityRatingScore;

  const totalWeight = Math.max(1, 
    weights.communityCurated + 
    weights.chronological + 
    weights.p2pAvailability + 
    weights.engagement
  );

  const weightedScore = (
    normCommunity * weights.communityCurated +
    normChronological * weights.chronological +
    normP2P * weights.p2pAvailability +
    normEngagement * weights.engagement
  ) / totalWeight;

  return Number(weightedScore.toFixed(2));
}

/**
 * Deterministic pseudo-CIDv1 generator for simulated IPFS media
 */
export function generateIPFSCID(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let b32 = '';
  for (let i = 0; i < 32; i++) {
    const charCode = (seed.charCodeAt(i % seed.length) || 97) + (i * 7);
    b32 += base32Chars[charCode % base32Chars.length];
  }
  return `bafybeic${b32.slice(0, 24)}${hex.slice(0, 6)}`;
}

/**
 * Portable identity payload serializer / parser
 */
export function exportIdentityBundle(identity: {
  did: string;
  username: string;
  subscriptions: string[];
  playlists: Array<{ id: string; title: string; videoIds: string[] }>;
  tokenBalance: number;
}): string {
  return JSON.stringify({
    protocol: 'opentube/identity/v1',
    timestamp: new Date().toISOString(),
    identity: {
      ...identity,
    },
    exportSignature: `sig_ed25519_${Math.random().toString(36).substring(2, 12)}`,
  }, null, 2);
}

export function parseIdentityBundle(jsonStr: string): { success: boolean; data?: any; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || parsed.protocol !== 'opentube/identity/v1' || !parsed.identity?.did) {
      return { success: false, error: 'Invalid OpenTube identity bundle format.' };
    }
    return { success: true, data: parsed.identity };
  } catch (err: any) {
    return { success: false, error: 'Malformed JSON payload.' };
  }
}
