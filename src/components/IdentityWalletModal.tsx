import React, { useState } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  Coins, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  ShieldCheck, 
  X, 
  FileJson,
  Sparkles,
  Server
} from 'lucide-react';
import { UserIdentity, P2PNode } from '../types';
import { exportIdentityBundle, parseIdentityBundle } from '../utils/crypto-p2p';
import confetti from 'canvas-confetti';

interface IdentityWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserIdentity;
  onUpdateUser: (updater: (prev: UserIdentity) => UserIdentity) => void;
  nodes: P2PNode[];
  language: 'en' | 'ur';
}

export const IdentityWalletModal: React.FC<IdentityWalletModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  nodes,
  language,
}) => {
  const [showSeed, setShowSeed] = useState(false);
  const [copiedDid, setCopiedDid] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyDid = () => {
    navigator.clipboard.writeText(user.did);
    setCopiedDid(true);
    setTimeout(() => setCopiedDid(false), 2000);
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(user.seedPhrase);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleClaimFaucet = () => {
    onUpdateUser(prev => ({
      ...prev,
      tokenBalance: prev.tokenBalance + 100,
    }));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#10b981'],
    });
  };

  const handleExportJSON = () => {
    const bundle = exportIdentityBundle({
      did: user.did,
      username: user.username,
      subscriptions: user.subscribedChannelDids,
      playlists: user.playlists,
      tokenBalance: user.tokenBalance,
    });

    const blob = new Blob([bundle], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opentube-identity-${user.username.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const res = parseIdentityBundle(importJsonText);
    if (!res.success || !res.data) {
      setImportStatus(res.error || 'Invalid identity payload');
      return;
    }

    onUpdateUser(prev => ({
      ...prev,
      username: res.data.username || prev.username,
      did: res.data.did || prev.did,
      subscribedChannelDids: res.data.subscriptions || prev.subscribedChannelDids,
      playlists: res.data.playlists || prev.playlists,
      tokenBalance: res.data.tokenBalance || prev.tokenBalance,
    }));

    setImportStatus('Identity imported successfully across federated nodes!');
    setTimeout(() => setImportStatus(null), 3000);
    setImportJsonText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {language === 'ur' ? 'غیر مرکزی شناخت اور والیٹ' : 'Cryptographic Sovereign Identity & Wallet'}
              </h2>
              <p className="text-xs text-zinc-400">
                Phase 5: Self-sovereign cryptographic keys. No corporate password server exists.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Balance */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <h3 className="font-bold text-white text-base">{user.username}</h3>
              <p className="text-xs text-zinc-400 font-mono">{user.handle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono uppercase">Token Balance</div>
              <div className="text-lg font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>{user.tokenBalance} TUBE</span>
              </div>
            </div>
            <button
              onClick={handleClaimFaucet}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-mono transition"
              title="Claim 100 test TUBE tokens"
            >
              +100 Faucet
            </button>
          </div>
        </div>

        {/* DID Section */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Decentralized Identifier (DID):</span>
            <button
              onClick={handleCopyDid}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
            >
              {copiedDid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDid ? 'Copied' : 'Copy DID'}</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 break-all select-all font-semibold">
            {user.did}
          </div>
        </div>

        {/* 12-Word Recovery Seed Phrase */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>BIP-39 Cryptographic Seed Phrase</span>
            </span>
            <button
              onClick={() => setShowSeed(!showSeed)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
            >
              {showSeed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{showSeed ? 'Hide Seed' : 'Reveal Seed'}</span>
            </button>
          </div>

          {showSeed ? (
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs font-mono">
                {user.seedPhrase.split(' ').map((word, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-center">
                    <span className="text-zinc-600 mr-1">{idx + 1}.</span>{word}
                  </div>
                ))}
              </div>
              <button
                onClick={handleCopySeed}
                className="w-full text-center text-xs text-amber-400 hover:underline pt-1"
              >
                {copiedSeed ? '✓ Copied to clipboard' : 'Copy 12-word seed phrase'}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 font-mono text-center">
              •••••••••••••••••••••••••••••••••••••••• (Click Reveal to view seed)
            </div>
          )}
        </div>

        {/* Portability: Export & Import */}
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          <div className="text-xs font-semibold text-zinc-300">
            Profile Portability (Migrate Across Any OpenTube Node)
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportJSON}
              className="flex-1 p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-mono flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Portable Account (JSON)</span>
            </button>

            <button
              onClick={() => {
                const sample = exportIdentityBundle({
                  did: 'did:opentube:z6MkqMigratedAccount99',
                  username: 'Ali Sovereign Creator',
                  subscriptions: ['did:opentube:z6MkqFarooqLahoreMeshCore'],
                  playlists: [{ id: 'p99', title: 'Decentralized Future', videoIds: ['vid-opentube-intro'] }],
                  tokenBalance: 920,
                });
                setImportJsonText(sample);
              }}
              className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs font-mono"
              title="Load Sample Migrated Account JSON"
            >
              Load Sample Import
            </button>
          </div>

          {importJsonText && (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste identity JSON bundle here..."
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleImportJSON}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Apply Imported Sovereign Identity
              </button>
            </div>
          )}

          {importStatus && (
            <div className="text-xs text-center font-mono text-emerald-400">
              {importStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
