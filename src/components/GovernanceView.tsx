import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Vote, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileCode, 
  Users, 
  KeyRound, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';
import { GovernanceProposal, UserIdentity } from '../types';
import { calculateGovernanceQuorum } from '../utils/crypto-p2p';
import confetti from 'canvas-confetti';

interface GovernanceViewProps {
  proposals: GovernanceProposal[];
  onVote: (proposalId: string, voteType: 'for' | 'against') => void;
  onSubmitProposal: (proposal: GovernanceProposal) => void;
  user: UserIdentity;
  language: 'en' | 'ur';
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({
  proposals,
  onVote,
  onSubmitProposal,
  user,
  language,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'timelock' | 'passed'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<GovernanceProposal['category']>('Protocol');
  const [newPayload, setNewPayload] = useState('OpenTubeNetwork.setDynamicGasConfig({ minStake: 100 })');

  const filteredProposals = proposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleCastVote = (proposalId: string, voteType: 'for' | 'against') => {
    onVote(proposalId, voteType);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: voteType === 'for' ? ['#10b981', '#34d399'] : ['#f43f5e', '#fb7185'],
    });
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProp: GovernanceProposal = {
      id: `OTP-${proposals.length + 28}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Community proposed protocol enhancement.',
      category: newCategory,
      proposer: user.username,
      proposerDid: user.did,
      votesFor: user.tokenBalance, // Proposer votes FOR with their balance
      votesAgainst: 0,
      totalEligibleTokens: 120000,
      quorumThresholdPercent: 40,
      approvalThresholdPercent: 66,
      status: 'active',
      deadline: '7 days remaining',
      multisigRequired: 5,
      multisigSigned: 1,
      executionPayload: newPayload.trim(),
      userVoted: 'for',
    };

    onSubmitProposal(newProp);
    setShowSubmitModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Heading & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'ur' ? 'عوامی خود مختار گورننس (DAO)' : 'Community DAO & Protocol Governance'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Phase 7: No single founder or company can change OpenTube rules. All protocol updates require community voting, multisig, and timelocks.
          </p>
        </div>

        {/* Propose Button */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Governance Rules Explainer Banner */}
      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200/90 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-purple-400" />
            <span>40% Quorum & 66% Supermajority</span>
          </div>
          <p className="text-[11px] text-purple-300/70">
            Proposals must reach at least 40% network voter turnout and 66% approval to pass.
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>5-of-7 Multisig Council</span>
          </div>
          <p className="text-[11px] text-purple-300/70">
            Emergency parameter changes require cryptographic signatures from 5 geographically separate maintainers.
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>48-Hour Execution Timelock</span>
          </div>
          <p className="text-[11px] text-purple-300/70">
            Approved proposals wait 48 hours in queue before on-chain execution so node operators can review code.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-800 gap-4 text-xs font-medium">
        {(['all', 'active', 'timelock', 'passed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-2.5 capitalize transition border-b-2 ${
              filter === tab
                ? 'border-purple-500 text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab === 'timelock' ? 'In Timelock Queue' : `${tab} Proposals`}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map(proposal => {
          const quorum = calculateGovernanceQuorum(
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.totalEligibleTokens,
            proposal.quorumThresholdPercent,
            proposal.approvalThresholdPercent
          );

          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercent = totalVotes > 0 ? ((proposal.votesFor / totalVotes) * 100).toFixed(1) : '0';
          const againstPercent = totalVotes > 0 ? ((proposal.votesAgainst / totalVotes) * 100).toFixed(1) : '0';

          return (
            <div
              key={proposal.id}
              className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition"
            >
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-purple-300 font-bold">
                      {proposal.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
                      {proposal.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      proposal.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : proposal.status === 'timelock'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-purple-950 text-purple-400 border border-purple-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {language === 'ur' && proposal.titleUrdu ? proposal.titleUrdu : proposal.title}
                  </h3>

                  <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                    <span>Proposed by: <span className="text-zinc-300">{proposal.proposer}</span></span>
                    <span>•</span>
                    <span>{proposal.deadline}</span>
                  </div>
                </div>

                {/* Voting Actions */}
                {proposal.status === 'active' && (
                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => handleCastVote(proposal.id, 'for')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                        proposal.userVoted === 'for'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-emerald-500/50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Vote FOR ({user.tokenBalance} Weight)</span>
                    </button>

                    <button
                      onClick={() => handleCastVote(proposal.id, 'against')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                        proposal.userVoted === 'against'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-rose-500/50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Vote AGAINST</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {proposal.description}
              </p>

              {/* Voting Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">FOR: {forPercent}% ({proposal.votesFor.toLocaleString()} TUBE)</span>
                  <span className="text-rose-400 font-bold">AGAINST: {againstPercent}% ({proposal.votesAgainst.toLocaleString()} TUBE)</span>
                </div>

                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden flex border border-zinc-800">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${forPercent}%` }}
                  />
                  <div 
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${againstPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>Turnout Quorum: {quorum.quorumTurnoutPercent}% / {proposal.quorumThresholdPercent}% required</span>
                  <span>Approval: {quorum.approvalPercent}% / {proposal.approvalThresholdPercent}% required</span>
                  <span>Multisig Council: {proposal.multisigSigned}/{proposal.multisigRequired} Signatures</span>
                </div>
              </div>

              {/* Timelock Execution Notice */}
              {proposal.timelockEta && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Timelock Queue: {proposal.timelockEta}</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">Reversible only via 5-of-7 multisig veto</span>
                </div>
              )}

              {/* Execution Payload Snippet */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono space-y-1">
                <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  <span>On-Chain Execution Call:</span>
                </div>
                <div className="text-zinc-300 truncate select-all">{proposal.executionPayload}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Proposal Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg text-white">Create Community DAO Proposal</h3>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Expand Storage Pinning Multiplier for Education Feeds"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Protocol">Protocol</option>
                  <option value="Storage/IPFS">Storage / IPFS</option>
                  <option value="Moderation">Moderation</option>
                  <option value="Tokenomics">Tokenomics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Detailed Rationale</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail why this change benefits the decentralized network and does not harm nodes..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Execution Code Snippet</label>
                <input
                  type="text"
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition"
                >
                  Publish to DAO Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
