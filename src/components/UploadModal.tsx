import React, { useState } from 'react';
import { 
  UploadCloud, 
  HardDrive, 
  FileVideo, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  X,
  Server
} from 'lucide-react';
import { Video, P2PNode, UserIdentity } from '../types';
import { generateIPFSCID } from '../utils/crypto-p2p';
import confetti from 'canvas-confetti';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoPublished: (video: Video) => void;
  nodes: P2PNode[];
  user: UserIdentity;
  language: 'en' | 'ur';
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onVideoPublished,
  nodes,
  user,
  language,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Video['category']>('Decentralization');
  const [tags, setTags] = useState('P2P, IPFS, Decentralized');
  const [selectedNodes, setSelectedNodes] = useState<string[]>(['node-lahore', 'node-frankfurt', 'node-singapore']);
  const [filecoinBackup, setFilecoinBackup] = useState(true);
  const [uploadStep, setUploadStep] = useState<'form' | 'chunking' | 'complete'>('form');
  const [progress, setProgress] = useState(0);
  const [generatedCID, setGeneratedCID] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');

  if (!isOpen) return null;

  const handleToggleNode = (nodeId: string) => {
    setSelectedNodes(prev => 
      prev.includes(nodeId)
        ? (prev.length > 1 ? prev.filter(id => id !== nodeId) : prev) // keep at least 1
        : [...prev, nodeId]
    );
  };

  const handleStartPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploadStep('chunking');
    setProgress(10);

    const cid = generateIPFSCID(title + Date.now().toString());
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedCID(cid);
    setGeneratedHash(hash);

    // Simulate multi-step distributed pipeline:
    // 1. Chunker -> 2. CID Merkle DAG -> 3. Transcoding (1080p/720p) -> 4. Multi-node pinning
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStep('complete');
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#10b981', '#06b6d4', '#3b82f6'],
          });
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  const handleFinalizeAndWatch = () => {
    const newVideo: Video = {
      id: `vid-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A community-published decentralized video on OpenTube Network.',
      creator: {
        name: user.username,
        handle: user.handle,
        did: user.did,
        avatar: user.avatar,
        verified: true,
        federatedOriginNode: 'lahore.opentube.mesh',
        subscribersCount: 1,
      },
      cid: generatedCID,
      sha256Hash: generatedHash,
      filecoinDealId: `f01984220-deal-${Math.floor(100000 + Math.random() * 900000)}`,
      duration: 340,
      durationFormatted: '05:40',
      views: 1,
      likes: 1,
      dislikes: 0,
      uploadDate: 'Just now',
      uploadTimestampDaysAgo: 0,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      transcodes: [
        { resolution: '1080p', cid: `${generatedCID}-1080p`, bitrateKbps: 4500, sizeMb: 180 },
        { resolution: '720p', cid: `${generatedCID}-720p`, bitrateKbps: 2200, sizeMb: 92 },
      ],
      replicationNodes: selectedNodes,
      p2pSeeders: selectedNodes.length * 3,
      p2pLeechers: 1,
      swarmPieces: 72,
      pieceSizeKb: 1024,
      communityRatingScore: 99,
      tipTotal: 0,
      federationOrigin: 'lahore.opentube.mesh',
    };

    onVideoPublished(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {language === 'ur' ? 'ویڈیو پبلش کریں (IPFS اور پیئر ٹو پیئر)' : 'Publish Media to Distributed Swarm'}
              </h2>
              <p className="text-xs text-zinc-400">
                Phase 3: Resumable chunking, UnixFS Merkle DAG & multi-node pinning
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadStep === 'form' && (
          <form onSubmit={handleStartPublish} className="space-y-4">
            
            {/* File Drag Simulator */}
            <div className="p-6 border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-xl bg-zinc-950/60 text-center space-y-2 cursor-pointer transition">
              <FileVideo className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-semibold text-zinc-200">
                Select video file or drag and drop
              </div>
              <p className="text-xs text-zinc-500">
                MP4, WebM, MKV up to 4K • Automatically transcoded into 1080p, 720p, 480p chunks
              </p>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-400">
                Sample Video Attached: 4K Open Creative Commons Stream (5m 40s)
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Video Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Setting Up an Offline-First Mesh Video Relay in Lahore"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this video covers and provide context for federated viewers..."
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Decentralization">Decentralization</option>
                  <option value="Tech & Open Source">Tech & Open Source</option>
                  <option value="Education">Education</option>
                  <option value="Community & Culture">Community & Culture</option>
                  <option value="Music & Art">Music & Art</option>
                  <option value="Podcasts">Podcasts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Replication Nodes Selection (Phase 3 Requirement) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Initial Pinning Nodes ({selectedNodes.length} selected)</span>
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  More replicas = higher resilience
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nodes.map(node => {
                  const isChecked = selectedNodes.includes(node.id);
                  return (
                    <button
                      type="button"
                      key={node.id}
                      onClick={() => handleToggleNode(node.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-zinc-200 truncate">{node.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-zinc-400">{node.country}</div>
                      </div>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filecoin Backup Option */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Filecoin Perpetual Archive Deal</div>
                  <div className="text-[10px] text-zinc-500">Long-term cryptographic proof of storage (PoSt)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={filecoinBackup}
                onChange={(e) => setFilecoinBackup(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 active:scale-95 transition"
              >
                Chunk & Publish to IPFS
              </button>
            </div>
          </form>
        )}

        {/* Upload in Progress */}
        {uploadStep === 'chunking' && (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-white">Transcoding & Ingesting Video Pieces</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Computing SHA-256 Checksums • Building UnixFS DAG • Pinning across {selectedNodes.length} nodes
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-500">
                <span>{progress}% Completed</span>
                <span>Chunk 48/64</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload Complete */}
        {uploadStep === 'complete' && (
          <div className="py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-white">Successfully Published to OpenTube Network!</h3>
              <p className="text-xs text-zinc-400">
                Your video is now content-addressed and pinned to independent nodes.
              </p>
            </div>

            {/* Generated Hash Box */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-left font-mono text-xs space-y-2">
              <div>
                <span className="text-zinc-500">IPFS CIDv1:</span>
                <p className="text-emerald-400 break-all select-all font-semibold mt-0.5">{generatedCID}</p>
              </div>
              <div>
                <span className="text-zinc-500">SHA-256 Digest:</span>
                <p className="text-cyan-400 break-all select-all mt-0.5">{generatedHash}</p>
              </div>
            </div>

            <button
              onClick={handleFinalizeAndWatch}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              View in Feed & Watch P2P Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
