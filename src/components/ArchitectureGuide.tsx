import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Server, 
  ShieldCheck, 
  Radio, 
  HardDrive, 
  Key, 
  Globe, 
  Coins, 
  Sliders, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Code2
} from 'lucide-react';

interface ArchitectureGuideProps {
  language: 'en' | 'ur';
  onOpenRomanUrduDocs?: () => void;
}

export const ArchitectureGuide: React.FC<ArchitectureGuideProps> = ({ language, onOpenRomanUrduDocs }) => {
  const [activePhase, setActivePhase] = useState<number>(1);

  const phases = [
    {
      num: 1,
      title: 'Core Architecture',
      titleUrdu: 'بنیادی غیر مرکزی ڈھانچہ',
      icon: Layers,
      summary: 'Open-source, no single central server, community-governed protocol, multiple independently operated nodes.',
      details: [
        'No single company or individual owns the database or infrastructure.',
        'Nodes communicate over peer-to-peer gossip channels rather than a centralized cloud gateway.',
        'Deterministic builds and public open-source codebase prevent backdoor modifications.',
        'Resilience rule: The network remains operational as long as at least two nodes are running anywhere on Earth.'
      ]
    },
    {
      num: 2,
      title: 'Frontend & User Experience',
      titleUrdu: 'فرنٹ اینڈ اور صارف کا تجربہ',
      icon: Code2,
      summary: 'Rich responsive feed, HTML5 video player, live swarm HUD, multilingual Urdu & English support, playlists, and channels.',
      details: [
        'Responsive layout tuned for mobile phones, desktop screens, and low-bandwidth connections.',
        'Real-time P2P Swarm overlay displays active seeder count, chunk buffering, and failover notifications.',
        'Bilingual interface enabling native Urdu/Roman Urdu terminology for Pakistani community nodes.',
        'Zero tracking cookies or corporate advertising telemetry.'
      ]
    },
    {
      num: 3,
      title: 'Distributed Video Storage',
      titleUrdu: 'غیر مرکزی ویڈیو اسٹوریج (IPFS اور فائل کوائن)',
      icon: HardDrive,
      summary: 'IPFS content addressing (CIDs), UnixFS Merkle DAGs, Filecoin perpetual archiving, and multi-node pinning.',
      details: [
        'Videos are split into 1MB chunks and cryptographically hashed into an IPFS CID (e.g. bafybei...).',
        'Files are pinned across multiple geographical storage providers (Lahore, Frankfurt, Singapore, Tokyo).',
        'Filecoin smart-contract storage deals guarantee decentralized economic incentives for long-term preservation.',
        'Important technical reality: Permanent availability requires continuous pinning by active nodes—no blockchain can physically store petabytes of video for free indefinitely.'
      ]
    },
    {
      num: 4,
      title: 'Peer-to-Peer Network',
      titleUrdu: 'پیئر ٹو پیئر نیٹ ورک (libp2p اور سوارم)',
      icon: Radio,
      summary: 'libp2p DHT peer discovery, WebRTC browser-to-browser stream sharing, and automatic replica failover.',
      details: [
        'When thousands of users watch a video simultaneously, they seed chunks to nearby peers via WebSockets and WebRTC.',
        'Bandwidth load on origin nodes decreases as audience size grows (inverse scaling of traditional clouds).',
        'GossipSub v1.2 mesh protocol monitors node heartbeats and transparently reroutes streams when nodes disconnect.',
        'Abuse-resistant rate limiting and peer reputation scoring protect nodes from Sybil flooding.'
      ]
    },
    {
      num: 5,
      title: 'Decentralized Identity & Accounts',
      titleUrdu: 'غیر مرکزی شناخت اور پرائیویٹ کیز',
      icon: Key,
      summary: 'Cryptographic public/private keypairs, DIDs (did:opentube:...), BIP-39 recovery seed phrases, portable account JSON.',
      details: [
        'Users own their identity via ed25519 cryptographic keypairs. No email or phone verification required.',
        'Subscriptions, playlists, and channel history can be exported as standard JSON bundles and imported onto any federated node.',
        'No single identity server can delete, freeze, or take over your user profile.'
      ]
    },
    {
      num: 6,
      title: 'Federation & Global Network',
      titleUrdu: 'ایکٹیویٹی پب فیڈریشن اور آزاد کمیونٹیز',
      icon: Globe,
      summary: 'ActivityPub protocol allows independent community servers (like PeerTube) to cross-subscribe and federate.',
      details: [
        'Communities can host their own instance with local cultural policies (e.g. Lahore Mesh Node, LibreMedia Europe).',
        'Cross-server subscriptions: A user on opentube.global can follow and comment on videos hosted on lahore.opentube.mesh.',
        'Creators can migrate between instances without losing followers or video CIDs.'
      ]
    },
    {
      num: 7,
      title: 'Community Governance (DAO)',
      titleUrdu: 'عوامی خود مختار گورننس اور ووٹنگ',
      icon: ShieldCheck,
      summary: 'Transparent DAO proposals, 66% supermajority quorum, 5-of-7 multisig council, and 48-hour timelocks.',
      details: [
        'No single founder or administrator holds root administrator privileges over protocol rules.',
        'Protocol upgrades and parameter changes require transparent voting with a 40% quorum requirement.',
        'All approved code changes enter a 48-hour timelock queue to allow independent node operators to audit before deployment.'
      ]
    },
    {
      num: 8,
      title: 'Content Integrity & Moderation',
      titleUrdu: 'مواد کی تصدیق اور جمہوری ماڈریشن',
      icon: ShieldCheck,
      summary: 'Cryptographic SHA-256 digests verify media authenticity. Zero arbitrary unilateral censorship.',
      details: [
        'Content hashes guarantee that video bytes cannot be secretly edited or tampered with by any intermediary.',
        'Harmful, illegal, or malicious content is reported to a decentralized community jury (100 randomly sampled tokenholders).',
        'Takedowns only mask content locally upon 75% consensus; no single administrator can delete files globally from user hard drives.'
      ]
    },
    {
      num: 9,
      title: 'Cybersecurity & Reliability',
      titleUrdu: 'سائبر سیکیورٹی اور خود کار ڈیزاسٹر ریکوری',
      icon: Server,
      summary: 'End-to-end encryption in transit, automated node failover, DDoS mitigation, and disaster recovery testing.',
      details: [
        'Automated heartbeat monitoring switches active video stream sources within milliseconds if a primary node crashes.',
        'Decentralized topology eliminates single target IP addresses for distributed denial-of-service (DDoS) attacks.',
        'Regular disaster recovery drills simulate offline nodes to verify network self-healing.'
      ]
    },
    {
      num: 10,
      title: 'Creator Economy & Monetization',
      titleUrdu: 'کریئٹر معیشت اور بلاک چین ٹپنگ',
      icon: Coins,
      summary: 'Direct peer-to-peer micro-tipping with zero platform cut (100% to creator), open payment APIs.',
      details: [
        'Viewers tip creators directly in cryptographic tokens (TUBE) with zero intermediaries taking a 30-45% cut like legacy platforms.',
        'Creator-owned payment addresses and transparent smart-contract revenue sharing.',
        'No demonetization strikes by arbitrary corporate bots.'
      ]
    },
    {
      num: 11,
      title: 'Search & Recommendation Engine',
      titleUrdu: 'شفاف سرچ اور صارف کے کنٹرول میں الگورتھم',
      icon: Sliders,
      summary: 'Distributed indexing, tag search, and user-controlled recommendation sliders instead of black-box corporate engines.',
      details: [
        'Users adjust four transparent coefficients: Community Score, Freshness, P2P Seeders, and Engagement.',
        'Zero surveillance advertising profiles or behavioral telemetry.',
        'Search index metadata is distributed across multiple federated nodes.'
      ]
    },
    {
      num: 12,
      title: 'Deployment & Node Expansion',
      titleUrdu: 'تنصیب اور نوڈز کی شمولیت',
      icon: Terminal,
      summary: 'One-click Docker node deployment, operator incentive tokenomics, and public network health telemetry.',
      details: [
        'Community members can spin up an OpenTube node using a single Docker CLI command.',
        'Operators earn micro-reward tokens for serving bandwidth and pinning media for high-demand creators.',
        'Public reliability dashboards display network-wide uptime and storage capacity in real time.'
      ]
    },
  ];

  const currentPhaseData = phases.find(p => p.num === activePhase) || phases[0];
  const IconComponent = currentPhaseData.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === 'ur' ? 'اوپن ٹیوب نیٹ ورک: مکمل 12 فیز کا روڈ میپ' : 'OpenTube Network: 12-Phase Decentralization Blueprint'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          {language === 'ur'
            ? 'محمد بھائی! یہ مکمل تکنیکی دستاویز ہے جس میں وضاحت کی گئی ہے کہ کس طرح ایک ایسا ویڈیو نیٹ ورک بنایا جائے جس کا کوئی ایک مالک یا سنٹرل سرور نہ ہو اور کوئی اسے یکطرفہ طور پر بند نہ کر سکے۔'
            : 'Detailed architectural specification for a community-governed video network with zero single points of failure, IPFS content addressing, libp2p swarms, and sovereign user identity.'
          }
        </p>
      </div>

      {/* Critical Technical Realism Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3.5 text-xs text-amber-200/90 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-300">Technical Foundation: Why "Permanent" Means Distributed Replication</div>
          <p className="mt-1">
            {language === 'ur'
              ? 'انٹرنیٹ پر کسی بھی سسٹم کو 100 فیصد مستقل ناقابل بندش بنانا تکنیکی طور پر ممکن نہیں، لیکن ملٹیپل نوڈز، آزاد آپریٹرز اور آئی پی ایف ایس کے ذریعے سنگل پوائنٹ آف فیلئر کو ختم کیا جا سکتا ہے۔ جب تک دنیا میں کم از کم 2 نوڈز ایکٹو ہیں، ویڈیو دستیاب رہے گی۔'
              : 'It is technically impossible to guarantee 100% permanent unshutdownability on the physical internet. However, OpenTube eliminates single points of failure: media availability is distributed across multiple independent node operators, IPFS pinned replicas, and libp2p mesh relays.'
            }
          </p>
        </div>
      </div>

      {/* Roman Urdu PDF & Complete Explanation Banner */}
      {onOpenRomanUrduDocs && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 uppercase">
                Official PDF Document
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Roman Urdu Technical Blueprint
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Is Project Ka Pora Explanation, Kaam Karne Ka Tareeqa Aur Tech Stack
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Mukammal Roman Urdu documentation parhein aur 1-click se formatted PDF file download karein.
            </p>
          </div>

          <button
            onClick={onOpenRomanUrduDocs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Roman Urdu Guide & PDF</span>
          </button>
        </div>
      )}

      {/* Phase Navigator Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {phases.map(phase => {
          const isSelected = activePhase === phase.num;
          return (
            <button
              key={phase.num}
              onClick={() => setActivePhase(phase.num)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div className="text-[10px] font-mono text-zinc-500">Phase {phase.num}</div>
              <div className="text-xs font-semibold truncate mt-0.5">{phase.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Phase {currentPhaseData.num} Specification
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {language === 'ur' ? currentPhaseData.titleUrdu : currentPhaseData.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              {currentPhaseData.summary}
            </p>
          </div>
        </div>

        {/* Detailed Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {currentPhaseData.details.map((detail, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Technology Stack Matrix */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-base">Recommended Technology Architecture Stack</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                <th className="py-2.5 px-3">System Layer</th>
                <th className="py-2.5 px-3">Technology & Protocol</th>
                <th className="py-2.5 px-3">Decentralization Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Frontend Client</td>
                <td className="py-2.5 px-3">React 19 + TypeScript + Tailwind CSS</td>
                <td className="py-2.5 px-3">Local in-browser Merkle hashing, cryptographic signing & P2P swarm player</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-cyan-400">Distributed Storage</td>
                <td className="py-2.5 px-3">IPFS (Kubo) + Filecoin + Storj</td>
                <td className="py-2.5 px-3">Content addressing by CID hashes, multi-provider geographic replication</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-purple-400">P2P Networking</td>
                <td className="py-2.5 px-3">libp2p (GossipSub v1.2) + WebRTC</td>
                <td className="py-2.5 px-3">Browser-to-browser chunk delivery, active peer discovery, and node failover</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-amber-400">Identity & Auth</td>
                <td className="py-2.5 px-3">W3C DIDs (did:opentube:...) + ed25519 Keys</td>
                <td className="py-2.5 px-3">Self-sovereign accounts without centralized auth servers or passwords</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-rose-400">Federation Relay</td>
                <td className="py-2.5 px-3">ActivityPub v2.1 (PeerTube Compatible)</td>
                <td className="py-2.5 px-3">Cross-server channel subscriptions, comments sync, and instance peering</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-400">Governance DAO</td>
                <td className="py-2.5 px-3">Cryptographic Multisig + Timelock Contracts</td>
                <td className="py-2.5 px-3">Community voting on protocol upgrades, zero unilateral dictator admin powers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
