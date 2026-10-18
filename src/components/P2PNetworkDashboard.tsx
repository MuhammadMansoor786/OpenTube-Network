import React, { useState } from 'react';
import { 
  Server, 
  Radio, 
  Power, 
  Wifi, 
  WifiOff, 
  Activity, 
  ShieldCheck, 
  HardDrive, 
  Globe2, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { P2PNode } from '../types';

interface P2PNetworkDashboardProps {
  nodes: P2PNode[];
  offlineNodeIds: string[];
  onToggleNodeOffline: (nodeId: string) => void;
  onResetAllNodes: () => void;
  language: 'en' | 'ur';
}

export const P2PNetworkDashboard: React.FC<P2PNetworkDashboardProps> = ({
  nodes,
  offlineNodeIds,
  onToggleNodeOffline,
  onResetAllNodes,
  language,
}) => {
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'topology' | 'runner'>('monitor');
  const [lastFailoverAlert, setLastFailoverAlert] = useState<string | null>(null);

  const onlineNodes = nodes.filter(n => !offlineNodeIds.includes(n.id));
  const offlineNodes = nodes.filter(n => offlineNodeIds.includes(n.id));

  const totalBandwidthGb = nodes.reduce((acc, n) => acc + n.bandwidthServedGb, 0);
  const totalPinnedVideos = nodes.reduce((acc, n) => acc + n.pinnedVideosCount, 0);

  const handleToggle = (node: P2PNode) => {
    const willBeOffline = !offlineNodeIds.includes(node.id);
    onToggleNodeOffline(node.id);

    if (willBeOffline) {
      const alternate = onlineNodes.find(n => n.id !== node.id);
      setLastFailoverAlert(
        `Disaster Recovery Triggered: '${node.name}' went offline. libp2p GossipSub rerouted video traffic to '${alternate?.name || 'Secondary Replica'}' seamlessly without dropping viewer packets.`
      );
    } else {
      setLastFailoverAlert(
        `Node Reconnected: '${node.name}' is back online. Swarm re-indexed ${node.pinnedVideosCount} pinned media CIDs.`
      );
    }
  };

  const dockerCommand = 'docker run -d --name opentube-node \\\n  -p 4001:4001 -p 8080:8080 -p 5001:5001 \\\n  -v ~/.opentube:/data/ipfs \\\n  -e RELAY_ENABLED=true \\\n  -e MESH_HUB=lahore.opentube.mesh \\\n  opentubeprotocol/node:v2.4.1';

  const copyDockerCmd = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'ur' ? 'پیئر ٹو پیئر نیٹ ورک اور ڈیزاسٹر ریکوری' : 'P2P Swarm & Disaster Recovery Simulator'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Phase 4 & 9: Testing unshutdownability. Toggle any node offline to observe instant automated failover.
          </p>
        </div>

        {/* Global Reset & Metrics */}
        <div className="flex items-center gap-3">
          {offlineNodeIds.length > 0 && (
            <button
              onClick={onResetAllNodes}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore All Nodes</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-zinc-200">{onlineNodes.length}/{nodes.length} Online</span>
          </div>
        </div>
      </div>

      {/* Live Failover Alert Toast if triggered */}
      {lastFailoverAlert && (
        <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-amber-300">Live Resilience Event</div>
            <p className="text-xs text-amber-200/90 mt-0.5">{lastFailoverAlert}</p>
          </div>
          <button onClick={() => setLastFailoverAlert(null)} className="text-amber-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* High-level stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            Active Relays
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {onlineNodes.length} <span className="text-xs font-normal text-zinc-500">/ {nodes.length}</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {offlineNodeIds.length === 0 ? '100% Swarm Capacity' : `${offlineNodeIds.length} Nodes Simulated Offline`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            Media Pinned CIDs
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalPinnedVideos.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Replicated across continents
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Bandwidth Served
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {(totalBandwidthGb / 1024).toFixed(1)} <span className="text-xs font-normal text-zinc-500">TB</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            P2P Offload Ratio: 82%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Sovereign Identity
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            Zero
          </div>
          <div className="text-[11px] text-amber-400 font-mono">
            Central Authority Dependencies
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'monitor'
              ? 'border-emerald-500 text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Nodes & Failover Control</span>
        </button>

        <button
          onClick={() => setActiveTab('topology')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'topology'
              ? 'border-emerald-500 text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>Interactive Mesh Topology Map</span>
        </button>

        <button
          onClick={() => setActiveTab('runner')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'runner'
              ? 'border-emerald-500 text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Run an Independent Node</span>
        </button>
      </div>

      {/* TAB 1: NODES MONITOR & FAILOVER CONTROLS */}
      {activeTab === 'monitor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map(node => {
            const isOffline = offlineNodeIds.includes(node.id);
            return (
              <div
                key={node.id}
                className={`p-4 rounded-xl border transition-all duration-200 space-y-3 ${
                  isOffline
                    ? 'bg-rose-950/10 border-rose-800/40 opacity-75'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Node Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-100">{node.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {node.country}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{node.region}</p>
                  </div>

                  {/* Power Toggle Button (Disaster recovery test) */}
                  <button
                    onClick={() => handleToggle(node)}
                    aria-label={`Simulate Crash on ${node.name}`}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
                      isOffline
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300'
                    }`}
                    title={isOffline ? 'Re-enable this node' : 'Simulate server crash / shutdown'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isOffline ? 'Power On' : 'Simulate Crash'}</span>
                  </button>
                </div>

                {/* Node Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                    <span className="text-zinc-500 text-[10px] uppercase">Latency</span>
                    <div className="font-bold text-zinc-200 mt-0.5">
                      {isOffline ? 'TIMED OUT' : `${node.latencyMs} ms`}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                    <span className="text-zinc-500 text-[10px] uppercase">Uptime</span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {node.uptimePercent}%
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                    <span className="text-zinc-500 text-[10px] uppercase">Pinned Media</span>
                    <div className="font-bold text-cyan-400 mt-0.5">
                      {node.pinnedVideosCount} CIDs
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                    <span className="text-zinc-500 text-[10px] uppercase">Served Bandwidth</span>
                    <div className="font-bold text-purple-400 mt-0.5">
                      {(node.bandwidthServedGb / 1024).toFixed(1)} TB
                    </div>
                  </div>
                </div>

                {/* Endpoint & Version */}
                <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 space-y-1">
                  <div className="truncate">
                    <span className="text-zinc-600">Endpoint: </span>
                    <span className="text-zinc-400">{node.endpoint}</span>
                  </div>
                  <div className="truncate text-[10px]">
                    <span className="text-zinc-600">Daemon: </span>
                    <span className="text-zinc-400">{node.version}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TOPOLOGY VISUAL MAP */}
      {activeTab === 'topology' && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">libp2p GossipSub Swarm Connectivity Graph</h3>
              <p className="text-xs text-zinc-400">
                Visual representation of cross-continent mesh links. When one node goes dark, neighboring nodes dynamically route around the disruption.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Crashed / Offline
              </span>
            </div>
          </div>

          {/* Interactive World Grid SVG Map */}
          <div className="relative w-full aspect-[2/1] bg-zinc-900/40 rounded-xl border border-zinc-800/80 overflow-hidden flex items-center justify-center">
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

            {/* SVG Connecting Lines between Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node, i) => {
                const nextNode = nodes[(i + 1) % nodes.length];
                const isLineActive = !offlineNodeIds.includes(node.id) && !offlineNodeIds.includes(nextNode.id);
                return (
                  <line
                    key={`${node.id}-${nextNode.id}`}
                    x1={`${node.coordinates.x}%`}
                    y1={`${node.coordinates.y}%`}
                    x2={`${nextNode.coordinates.x}%`}
                    y2={`${nextNode.coordinates.y}%`}
                    stroke={isLineActive ? '#10b981' : '#f43f5e'}
                    strokeWidth={isLineActive ? '1.5' : '1'}
                    strokeDasharray={isLineActive ? '4 2' : '2 2'}
                    opacity={isLineActive ? 0.6 : 0.2}
                  />
                );
              })}
            </svg>

            {/* Node Pins on Map */}
            {nodes.map(node => {
              const isOffline = offlineNodeIds.includes(node.id);
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => handleToggle(node)}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isOffline
                      ? 'bg-rose-950 border-rose-500 text-rose-400 scale-90'
                      : 'bg-zinc-950 border-emerald-400 text-emerald-400 shadow-lg shadow-emerald-500/30'
                  }`}>
                    {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Server className="w-3.5 h-3.5" />}
                    
                    {!isOffline && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-9 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-700 text-[10px] font-mono text-zinc-200 whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <div className="font-bold">{node.name}</div>
                    <div className="text-zinc-400">{isOffline ? 'STATUS: CRASHED' : `${node.latencyMs}ms • ${node.pinnedVideosCount} CIDs`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RUN AN INDEPENDENT NODE ONBOARDING (Phase 12) */}
      {activeTab === 'runner' && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div>
            <h3 className="font-bold text-white text-base">Run Your Own OpenTube Node in 2 Minutes</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Phase 12: Grow the network through community-operated infrastructure. Anyone can run a validator, relay or pinning node.
            </p>
          </div>

          {/* Docker Run Code Snippet */}
          <div className="relative p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-2 border-b border-zinc-900">
              <span>BASH / DOCKER CLI</span>
              <button
                onClick={copyDockerCmd}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                {copiedDocker ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDocker ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="text-emerald-400 overflow-x-auto py-1">{dockerCommand}</pre>
          </div>

          {/* Hardware Specs & Rewards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 uppercase text-[10px]">Minimum Specs</div>
              <div className="text-zinc-200 font-bold">2 vCPU, 4GB RAM</div>
              <div className="text-zinc-500 text-[10px]">500GB SSD for IPFS cache</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 uppercase text-[10px]">Mesh Relay Port</div>
              <div className="text-cyan-400 font-bold">TCP/UDP 4001</div>
              <div className="text-zinc-500 text-[10px]">libp2p swarm discovery</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 uppercase text-[10px]">Operator Rewards</div>
              <div className="text-amber-400 font-bold">0.05 TUBE / GB</div>
              <div className="text-zinc-500 text-[10px]">Earned per video seeded</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
