import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSwarmEfficiency,
  resolveActiveNode,
  calculateGovernanceQuorum,
  computeRecommendationScore,
  generateIPFSCID,
  exportIdentityBundle,
  parseIdentityBundle
} from './crypto-p2p.ts';

test('calculateSwarmEfficiency returns optimal when all replicas are online', () => {
  const result = calculateSwarmEfficiency(12, ['node-1', 'node-2', 'node-3'], []);
  assert.equal(result.healthStatus, 'optimal');
  assert.equal(result.redundancyScore, 100);
  assert.equal(result.activeSeeders, 12);
});

test('calculateSwarmEfficiency degrades gracefully when replicas go offline', () => {
  const result = calculateSwarmEfficiency(12, ['node-1', 'node-2', 'node-3'], ['node-1', 'node-2']);
  assert.ok(result.activeSeeders < 12);
  assert.equal(result.redundancyScore, 33);
});

test('resolveActiveNode handles failover seamlessly when primary node fails', () => {
  const allNodes = ['node-lahore', 'node-frankfurt', 'node-singapore'];
  
  // Normal state
  const normal = resolveActiveNode(allNodes, []);
  assert.equal(normal.selectedNodeId, 'node-lahore');
  assert.equal(normal.isFailover, false);

  // When primary Lahore node goes down, it fails over to Frankfurt
  const failedOver = resolveActiveNode(allNodes, ['node-lahore']);
  assert.equal(failedOver.selectedNodeId, 'node-frankfurt');
  assert.equal(failedOver.isFailover, true);

  // When all nodes offline
  const allDown = resolveActiveNode(allNodes, ['node-lahore', 'node-frankfurt', 'node-singapore']);
  assert.equal(allDown.selectedNodeId, null);
});

test('calculateGovernanceQuorum validates turnout and required 66% supermajority', () => {
  // Case 1: 50% turnout (meets 40% quorum), 80% approval (meets 66%) -> Approved
  const res1 = calculateGovernanceQuorum(800, 200, 2000, 40, 66);
  assert.equal(res1.hasQuorum, true);
  assert.equal(res1.isApproved, true);
  assert.equal(res1.approvalPercent, 80);

  // Case 2: Turnout below quorum (200 out of 2000 = 10% < 40%) -> Not Approved
  const res2 = calculateGovernanceQuorum(190, 10, 2000, 40, 66);
  assert.equal(res2.hasQuorum, false);
  assert.equal(res2.isApproved, false);

  // Case 3: Turnout high (60%) but approval is 55% (< 66%) -> Rejected
  const res3 = calculateGovernanceQuorum(550, 450, 2000, 40, 66);
  assert.equal(res3.hasQuorum, true);
  assert.equal(res3.isApproved, false);
});

test('computeRecommendationScore adapts dynamically to user slider weights', () => {
  const freshVideo = {
    id: 'vid-1',
    views: 1000,
    likes: 80,
    seeders: 20,
    uploadTimestampDaysAgo: 1, // very recent
    communityRatingScore: 60,
  };

  const highP2PWeights = { communityCurated: 0, chronological: 0, p2pAvailability: 100, engagement: 0 };
  const p2pScore = computeRecommendationScore(freshVideo, highP2PWeights);
  assert.ok(p2pScore > 80);

  const chronoWeights = { communityCurated: 0, chronological: 100, p2pAvailability: 0, engagement: 0 };
  const chronoScore = computeRecommendationScore(freshVideo, chronoWeights);
  assert.ok(chronoScore >= 90);
});

test('generateIPFSCID creates standard bafybei prefix CID strings', () => {
  const cid1 = generateIPFSCID('opentube-intro-video');
  const cid2 = generateIPFSCID('opentube-intro-video');
  assert.equal(cid1, cid2);
  assert.ok(cid1.startsWith('bafybeic'));
  assert.ok(cid1.length >= 32);
});

test('export and parse IdentityBundle correctly roundtrips portable account', () => {
  const mockUser = {
    did: 'did:opentube:z6MkqGzwt1N2f5E4Vb...',
    username: 'muhammad_dev',
    subscriptions: ['did:opentube:node-lahore-stream'],
    playlists: [{ id: 'p1', title: 'Decentralized Tech', videoIds: ['v1', 'v2'] }],
    tokenBalance: 450,
  };

  const exported = exportIdentityBundle(mockUser);
  const parsed = parseIdentityBundle(exported);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data?.username, 'muhammad_dev');
  assert.equal(parsed.data?.did, mockUser.did);
  assert.equal(parsed.data?.tokenBalance, 450);

  const invalidParse = parseIdentityBundle('{"random": 123}');
  assert.equal(invalidParse.success, false);
});
