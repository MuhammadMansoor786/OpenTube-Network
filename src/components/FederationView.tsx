import React, { useState } from 'react';
import { 
  Globe, 
  Share2, 
  CheckCircle2, 
  Users, 
  Server, 
  Activity, 
  Plus, 
  Link2, 
  ExternalLink,
  Shield
} from 'lucide-react';
import { FederatedInstance } from '../types';
import { FEDERATED_INSTANCES } from '../data/mockData';

interface FederationViewProps {
  language: 'en' | 'ur';
}

export const FederationView: React.FC<FederationViewProps> = ({ language }) => {
  const [instances, setInstances] = useState<FederatedInstance[]>(FEDERATED_INSTANCES);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newName, setNewName] = useState('');

  const [simulatedEvents, setSimulatedEvents] = useState([
    {
      id: 'e1',
      type: 'Announce',
      actor: '@ayesha_p2p (lahore.opentube.mesh)',
      action: 'federated video bafybeie9p... to libremedia.eu',
      time: '3m ago',
    },
    {
      id: 'e2',
      type: 'Follow',
      actor: '@elena_berlin (libremedia.eu)',
      action: 'subscribed to @muhammad_dev across network',
      time: '12m ago',
    },
    {
      id: 'e3',
      type: 'Create',
      actor: '@blender_org (libremedia.eu)',
      action: 'broadcast new 4K render CID bafybeihk...',
      time: '24m ago',
    },
    {
      id: 'e4',
      type: 'Like',
      actor: '@tariq_distrib (cybercommons.org)',
      action: 'endorsed Proposal OTP-24 via ActivityPub relay',
      time: '1h ago',
    },
  ]);

  const handleConnectInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const newInst: FederatedInstance = {
      id: `inst-${Date.now()}`,
      name: newName.trim() || newDomain.trim(),
      domain: newDomain.trim().toLowerCase(),
      nodeCount: 4,
      activeUsers: 1200,
      federationProtocol: 'ActivityPub v2.1 + IPFS Pinning',
      description: 'Community-operated independent video node federated via ActivityPub protocol.',
      status: 'peered',
      region: 'Custom Community',
      policyNotes: 'Local community terms enforced cryptographically.',
    };

    setInstances(prev => [newInst, ...prev]);
    setShowConnectModal(false);
    setNewDomain('');
    setNewName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'ur' ? 'ایکٹیویٹی پب فیڈریشن اور گلوبل نیٹ ورک' : 'ActivityPub Federation & Sovereign Communities'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Phase 6: Multiple independent video servers seamlessly exchanging subscriptions, comments, and media.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Peer New Instance</span>
        </button>
      </div>

      {/* Federation Architecture Callout */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
          <Link2 className="w-4 h-4" />
          <span>Why Federation Matters: PeerTube & ActivityPub Model</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          In a centralized system like YouTube, if your account or video is banned, you have nowhere to go. In OpenTube, you can migrate your profile to another instance (e.g. from <b>opentube.global</b> to <b>lahore.opentube.mesh</b>) without losing your cryptographic followers or IPFS content history.
        </p>
      </div>

      {/* Grid: Instances Directory & Live ActivityPub Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Instances Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Connected Federated Instances ({instances.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instances.map(instance => (
              <div
                key={instance.id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 space-y-3 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{instance.name}</h4>
                      <p className="text-xs font-mono text-amber-400 mt-0.5">{instance.domain}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {instance.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed">
                    {instance.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800/60 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Region:</span>
                    <span className="text-zinc-200">{instance.region}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Nodes / Users:</span>
                    <span className="text-emerald-400">{instance.nodeCount} nodes • {instance.activeUsers.toLocaleString()} peers</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Protocol:</span>
                    <span className="text-cyan-400 truncate max-w-[170px]">{instance.federationProtocol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live ActivityPub Events Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>ActivityPub Gossip Stream</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono animate-pulse">● Live</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            {simulatedEvents.map(event => (
              <div 
                key={event.id}
                className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/60 text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 uppercase">
                    {event.type}
                  </span>
                  <span className="text-[10px] text-zinc-500">{event.time}</span>
                </div>
                <div className="text-zinc-300 font-semibold truncate">{event.actor}</div>
                <div className="text-[11px] text-zinc-400">{event.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peer Instance Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-base text-white">Peer ActivityPub Instance</h3>
              <button onClick={() => setShowConnectModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConnectInstance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Instance Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. karachi.opentube.tv"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Community Display Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Karachi Mesh Collective"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold"
                >
                  Initiate Federation Handshake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
