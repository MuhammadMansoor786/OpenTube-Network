import React, { useState, useMemo } from 'react';
import { 
  PlaySquare, 
  Radio, 
  ShieldCheck, 
  Globe, 
  BookOpen, 
  Upload, 
  Sliders, 
  Server, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerView } from './components/VideoPlayerView';
import { UploadModal } from './components/UploadModal';
import { P2PNetworkDashboard } from './components/P2PNetworkDashboard';
import { GovernanceView } from './components/GovernanceView';
import { FederationView } from './components/FederationView';
import { IdentityWalletModal } from './components/IdentityWalletModal';
import { RecommendationSliders } from './components/RecommendationSliders';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { RomanUrduDocModal } from './components/RomanUrduDocModal';

import { 
  INITIAL_VIDEOS, 
  INITIAL_NODES, 
  INITIAL_PROPOSALS, 
  INITIAL_COMMENTS, 
  INITIAL_USER,
  UI_TRANSLATIONS 
} from './data/mockData';
import { Video, P2PNode, GovernanceProposal, Comment, UserIdentity } from './types';
import { computeRecommendationScore, RecommendationWeights } from './utils/crypto-p2p';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'p2p' | 'governance' | 'federation' | 'architecture'>('feed');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  // Application Data States
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [nodes, setNodes] = useState<P2PNode[]>(INITIAL_NODES);
  const [offlineNodeIds, setOfflineNodeIds] = useState<string[]>([]);
  const [proposals, setProposals] = useState<GovernanceProposal[]>(INITIAL_PROPOSALS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [user, setUser] = useState<UserIdentity>(INITIAL_USER);

  // Modals & Sliders
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showRomanUrduModal, setShowRomanUrduModal] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const [recommendationWeights, setRecommendationWeights] = useState<RecommendationWeights>({
    communityCurated: 40,
    chronological: 30,
    p2pAvailability: 50,
    engagement: 40,
  });

  const t = UI_TRANSLATIONS[language];

  // Categories
  const categories = useMemo(() => [
    'All',
    'Decentralization',
    'Tech & Open Source',
    'Community & Culture',
    'Music & Art',
    'Education',
    'Podcasts',
  ], []);

  // Node Failover Management
  const handleToggleNodeOffline = (nodeId: string) => {
    setOfflineNodeIds(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleResetAllNodes = () => {
    setOfflineNodeIds([]);
  };

  // Video Publishing
  const handleVideoPublished = (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev]);
    setSelectedVideo(newVideo);
  };

  // Governance Actions
  const handleVoteProposal = (proposalId: string, voteType: 'for' | 'against') => {
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      return {
        ...p,
        votesFor: voteType === 'for' ? p.votesFor + user.tokenBalance : p.votesFor,
        votesAgainst: voteType === 'against' ? p.votesAgainst + user.tokenBalance : p.votesAgainst,
        userVoted: voteType,
      };
    }));
  };

  const handleSubmitProposal = (newProp: GovernanceProposal) => {
    setProposals(prev => [newProp, ...prev]);
  };

  // Comments
  const handleAddComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  };

  // Dynamic Feed Ranking & Search Filtering (Phase 11)
  const rankedVideos = useMemo(() => {
    return videos
      .map(video => {
        const score = computeRecommendationScore(
          {
            id: video.id,
            views: video.views,
            likes: video.likes,
            seeders: video.p2pSeeders,
            uploadTimestampDaysAgo: video.uploadTimestampDaysAgo,
            communityRatingScore: video.communityRatingScore,
          },
          recommendationWeights
        );
        return { video, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.video)
      .filter(video => {
        // Category filter
        if (selectedCategory !== 'All' && video.category !== selectedCategory) {
          return false;
        }

        // Search query filter (checks title, tags, CID, creator name)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = video.title.toLowerCase().includes(q) || (video.titleUrdu && video.titleUrdu.toLowerCase().includes(q));
          const matchCid = video.cid.toLowerCase().includes(q);
          const matchCreator = video.creator.name.toLowerCase().includes(q) || video.creator.handle.toLowerCase().includes(q);
          const matchTag = video.tags.some(tag => tag.toLowerCase().includes(q));
          return matchTitle || matchCid || matchCreator || matchTag;
        }

        return true;
      });
  }, [videos, recommendationWeights, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedVideo(null); // Return to list if switching tab
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        language={language}
        setLanguage={setLanguage}
        nodes={nodes}
        user={user}
        onOpenUpload={() => setShowUploadModal(true)}
        onOpenIdentity={() => setShowIdentityModal(true)}
        onOpenRomanUrduDocs={() => setShowRomanUrduModal(true)}
        showSliders={showSliders}
        setShowSliders={setShowSliders}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Disaster Recovery Active Alert Banner */}
        {offlineNodeIds.length > 0 && (
          <div className="bg-amber-950/60 border-b border-amber-500/40 px-4 py-2 text-xs font-mono text-amber-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                <span>
                  {offlineNodeIds.length} node(s) simulated offline ({offlineNodeIds.join(', ')}). libp2p automatic replica rerouting is active.
                </span>
              </div>
              <button
                onClick={handleResetAllNodes}
                className="px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore Nodes</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: VIDEO PLAYER (When a video is opened) */}
        {selectedVideo ? (
          <VideoPlayerView
            video={selectedVideo}
            onBack={() => setSelectedVideo(null)}
            onSelectVideo={(v) => setSelectedVideo(v)}
            allVideos={videos}
            nodes={nodes}
            offlineNodeIds={offlineNodeIds}
            user={user}
            onUpdateUser={setUser}
            comments={comments}
            onAddComment={handleAddComment}
            language={language}
          />
        ) : (
          <>
            {/* VIEW 2: FEED TAB */}
            {currentTab === 'feed' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Algorithmic Sovereign Sliders Tray */}
                {showSliders && (
                  <RecommendationSliders
                    weights={recommendationWeights}
                    onChangeWeights={setRecommendationWeights}
                    language={language}
                  />
                )}

                {/* Hero / Network Protocol Status Pill */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        P2P Swarm Active • Zero Central Servers
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {language === 'ur' 
                        ? 'اوپن ٹیوب: سنسرشپ سے آزاد اور عوامی خود مختار ویڈیو نیٹ ورک' 
                        : 'OpenTube: Uncensorable, Distributed Video Media Network'
                      }
                    </h2>
                    <p className="text-xs text-zinc-400 max-w-2xl">
                      {language === 'ur'
                        ? 'ویڈیوز IPFS ہیشز کے ذریعے لاہور، فرینکفرٹ، سنگاپور اور سان فرانسسکو کے آزاد نوڈز پر محفوظ ہیں۔'
                        : 'Content-addressed via IPFS CID hashes and streamed peer-to-peer across global independent nodes.'
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentTab('architecture')}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.architectureDocs}</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('p2p')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/50 border border-cyan-800/60 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Test Failover Simulation</span>
                    </button>
                  </div>
                </div>

                {/* Category Pills Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat === 'All' ? t.allCategories : cat}
                    </button>
                  ))}
                </div>

                {/* Video Feed Grid */}
                {rankedVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rankedVideos.map(video => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={(v) => setSelectedVideo(v)}
                        language={language}
                        offlineNodeIds={offlineNodeIds}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <Search className="w-10 h-10 text-zinc-600 mx-auto" />
                    <h3 className="text-base font-bold text-zinc-300">No videos found</h3>
                    <p className="text-xs text-zinc-500">
                      No media matched "{searchQuery}" in the decentralized IPFS index.
                    </p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: P2P NETWORK & FAILOVER TAB (Phase 4 & 9) */}
            {currentTab === 'p2p' && (
              <P2PNetworkDashboard
                nodes={nodes}
                offlineNodeIds={offlineNodeIds}
                onToggleNodeOffline={handleToggleNodeOffline}
                onResetAllNodes={handleResetAllNodes}
                language={language}
              />
            )}

            {/* VIEW 4: DAO GOVERNANCE TAB (Phase 7) */}
            {currentTab === 'governance' && (
              <GovernanceView
                proposals={proposals}
                onVote={handleVoteProposal}
                onSubmitProposal={handleSubmitProposal}
                user={user}
                language={language}
              />
            )}

            {/* VIEW 5: FEDERATION TAB (Phase 6) */}
            {currentTab === 'federation' && (
              <FederationView language={language} />
            )}

            {/* VIEW 6: ARCHITECTURE GUIDE (12 Phases) */}
            {currentTab === 'architecture' && (
              <ArchitectureGuide 
                language={language} 
                onOpenRomanUrduDocs={() => setShowRomanUrduModal(true)} 
              />
            )}
          </>
        )}
      </main>

      {/* Upload Media Modal (Phase 3) */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onVideoPublished={handleVideoPublished}
        nodes={nodes}
        user={user}
        language={language}
      />

      {/* Identity & Wallet Modal (Phase 5) */}
      <IdentityWalletModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        user={user}
        onUpdateUser={setUser}
        nodes={nodes}
        language={language}
      />

      {/* Roman Urdu Documentation & PDF Exporter Modal */}
      <RomanUrduDocModal
        isOpen={showRomanUrduModal}
        onClose={() => setShowRomanUrduModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-300">OpenTube Protocol v2.4</span>
            <span>•</span>
            <span>Decentralized & Community-Governed</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 flex-wrap justify-center">
            <button onClick={() => setShowRomanUrduModal(true)} className="text-emerald-400 font-bold hover:underline transition flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Roman Urdu Guide (PDF)</span>
            </button>
            <button onClick={() => setCurrentTab('architecture')} className="hover:text-emerald-400 transition">
              12-Phase Roadmap
            </button>
            <button onClick={() => setCurrentTab('p2p')} className="hover:text-emerald-400 transition">
              Swarm Topology
            </button>
            <button onClick={() => setCurrentTab('governance')} className="hover:text-emerald-400 transition">
              DAO Timelock
            </button>
            <button onClick={() => setCurrentTab('federation')} className="hover:text-emerald-400 transition">
              ActivityPub Mesh
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
