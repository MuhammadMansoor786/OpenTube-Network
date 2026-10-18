import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  Coins, 
  ShieldCheck, 
  HardDrive, 
  Server, 
  Radio, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Flag,
  ExternalLink,
  Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Video, P2PNode, UserIdentity, Comment } from '../types';
import { calculateSwarmEfficiency, resolveActiveNode } from '../utils/crypto-p2p';
import { UI_TRANSLATIONS } from '../data/mockData';

interface VideoPlayerViewProps {
  video: Video;
  onBack: () => void;
  onSelectVideo: (video: Video) => void;
  allVideos: Video[];
  nodes: P2PNode[];
  offlineNodeIds: string[];
  user: UserIdentity;
  onUpdateUser: (updater: (prev: UserIdentity) => UserIdentity) => void;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  language: 'en' | 'ur';
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  video,
  onBack,
  onSelectVideo,
  allVideos,
  nodes,
  offlineNodeIds,
  user,
  onUpdateUser,
  comments,
  onAddComment,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedResolution, setSelectedResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [likes, setLikes] = useState(video.likes);
  const [hasLiked, setHasLiked] = useState(user.likedVideoIds.includes(video.id));
  const [hasDisliked, setHasDisliked] = useState(false);
  const [copiedCid, setCopiedCid] = useState(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(25);
  const [newCommentText, setNewCommentText] = useState('');
  const [verifiedHashMatch, setVerifiedHashMatch] = useState<boolean | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('copyright');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const t = UI_TRANSLATIONS[language];

  // Swarm calculations
  const swarm = calculateSwarmEfficiency(video.p2pSeeders, video.replicationNodes, offlineNodeIds);
  const routing = resolveActiveNode(video.replicationNodes, offlineNodeIds);
  const activeServingNode = nodes.find(n => n.id === routing.selectedNodeId);

  const isSubscribed = user.subscribedChannelDids.includes(video.creator.did);

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
      onUpdateUser(prev => ({
        ...prev,
        likedVideoIds: prev.likedVideoIds.filter(id => id !== video.id),
      }));
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      setHasDisliked(false);
      onUpdateUser(prev => ({
        ...prev,
        likedVideoIds: [...prev.likedVideoIds, video.id],
      }));
    }
  };

  const handleToggleSubscribe = () => {
    onUpdateUser(prev => {
      const exists = prev.subscribedChannelDids.includes(video.creator.did);
      return {
        ...prev,
        subscribedChannelDids: exists
          ? prev.subscribedChannelDids.filter(d => d !== video.creator.did)
          : [...prev.subscribedChannelDids, video.creator.did],
      };
    });
  };

  const handleTipCreator = () => {
    if (user.tokenBalance < tipAmount) {
      alert(`Insufficient TUBE balance. You have ${user.tokenBalance} TUBE.`);
      return;
    }

    onUpdateUser(prev => ({
      ...prev,
      tokenBalance: prev.tokenBalance - tipAmount,
    }));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6'],
    });

    setShowTipModal(false);
  };

  const handleCopyCID = () => {
    navigator.clipboard.writeText(video.cid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 2000);
  };

  const handleVerifyIntegrity = () => {
    // Simulates cryptographic hash check
    setVerifiedHashMatch(null);
    setTimeout(() => {
      setVerifiedHashMatch(true);
    }, 400);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      videoId: video.id,
      authorName: user.username,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorDid: user.did,
      content: newCommentText.trim(),
      timestamp: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      cryptographicSignature: `sig_ed25519_${Math.random().toString(36).substring(2, 10)}`,
      federatedOriginNode: 'lahore.opentube.mesh',
    };

    onAddComment(newComment);
    setNewCommentText('');
  };

  const videoComments = comments.filter(c => c.videoId === video.id);
  const relatedVideos = allVideos.filter(v => v.id !== video.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Back button and Quick Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
          aria-label="Back to Feed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ur' ? 'واپس فیڈ پر جائیں' : 'Back to Feed'}</span>
        </button>

        {/* Live Swarm State Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
            routing.isFailover
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <Wifi className="w-3.5 h-3.5" />
            <span>
              {routing.isFailover 
                ? (language === 'ur' ? 'متبادل نوڈ فعال ہے' : '⚡ Failover Active') 
                : (language === 'ur' ? 'براہ راست سوارم کنکشن' : 'Optimal P2P Stream')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Main Video & Details Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Video Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {/* P2P Live Swarm HUD overlay bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md border border-zinc-700/80 text-[11px] font-mono text-zinc-200 shadow-lg">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">{swarm.activeSeeders}</span>
                  <span className="text-zinc-400">peers seeding</span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md border border-zinc-700/80 text-[11px] font-mono text-zinc-300 shadow-lg">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-zinc-400">Gateway:</span>
                  <span className="text-cyan-300 font-semibold truncate max-w-[130px]">
                    {activeServingNode?.name || 'P2P Swarm Relay'}
                  </span>
                </div>
              </div>

              {/* Resolution pill */}
              <div className="pointer-events-auto flex items-center gap-1 bg-zinc-950/85 backdrop-blur-md border border-zinc-700/80 rounded-md p-0.5 text-[10px] font-mono text-zinc-300">
                {(['1080p', '720p', '480p'] as const).map(res => (
                  <button
                    key={res}
                    onClick={() => setSelectedResolution(res)}
                    className={`px-1.5 py-0.5 rounded transition ${
                      selectedResolution === res
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Failover notification banner if primary node is offline */}
            {routing.isFailover && (
              <div className="absolute bottom-16 left-3 right-3 bg-amber-950/90 border border-amber-500/60 text-amber-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 backdrop-blur-md shadow-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Primary node offline. Stream seamlessly switched to replica node <b>{activeServingNode?.name}</b> without interruption.
                </span>
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {language === 'ur' && video.titleUrdu ? video.titleUrdu : video.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              
              {/* Creator Info */}
              <div className="flex items-center gap-3">
                <img
                  src={video.creator.avatar}
                  alt={video.creator.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-100 text-sm">{video.creator.name}</span>
                    {video.creator.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                    <span>{video.creator.subscribersCount.toLocaleString()} {t.subscribers}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                      {video.creator.federatedOriginNode}
                    </span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={handleToggleSubscribe}
                  className={`ml-2 px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    isSubscribed
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                  }`}
                >
                  {isSubscribed ? t.subscribed : t.subscribe}
                </button>
              </div>

              {/* Action Buttons: Likes, Tips, CID Copy, Provenance */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                
                {/* Like / Dislike pill */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-0.5">
                  <button
                    onClick={handleToggleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
                      hasLiked ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:text-white'
                    }`}
                    title="Cryptographically endorse content"
                  >
                    <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{likes.toLocaleString()}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-800" />
                  <button
                    onClick={() => { setHasDisliked(!hasDisliked); setHasLiked(false); }}
                    className={`px-2.5 py-1.5 text-xs transition ${
                      hasDisliked ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tip Creator Button */}
                <button
                  onClick={() => setShowTipModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-500/70 text-amber-300 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
                  title="Direct peer-to-peer crypto micro-donation"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{t.tipCreator}</span>
                </button>

                {/* Inspect Content Hash & Integrity */}
                <button
                  onClick={() => setShowIntegrityModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition"
                  title="View cryptographic provenance, SHA-256 and Filecoin deal"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Provenance</span>
                </button>

                {/* Copy IPFS CID */}
                <button
                  onClick={handleCopyCID}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-mono transition"
                  title="Copy IPFS Content Identifier (CID)"
                >
                  {copiedCid ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span className="hidden sm:inline">CID</span>
                    </>
                  )}
                </button>

                {/* Report to Community Jury */}
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-zinc-900 transition"
                  title="Report to decentralized community moderation jury"
                  aria-label="Report content"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description & P2P Details Box */}
            <div className="mt-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{video.views.toLocaleString()} {t.views} • Uploaded {video.uploadDate}</span>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {video.category}
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {language === 'ur' && video.descriptionUrdu ? video.descriptionUrdu : video.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
                {video.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded hover:text-emerald-400 transition cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Swarm Metrics Bar */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono border-t border-zinc-800/60">
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                  <div className="text-zinc-500 text-[10px] uppercase">Replication Nodes</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    {swarm.redundancyScore}% ({video.replicationNodes.length} pinned)
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                  <div className="text-zinc-500 text-[10px] uppercase">Swarm Pieces</div>
                  <div className="font-semibold text-cyan-400 mt-0.5">
                    {video.swarmPieces} chunks ({video.pieceSizeKb}KB)
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                  <div className="text-zinc-500 text-[10px] uppercase">Filecoin Deal</div>
                  <div className="font-semibold text-purple-400 mt-0.5 truncate">
                    {video.filecoinDealId}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50">
                  <div className="text-zinc-500 text-[10px] uppercase">Community Rating</div>
                  <div className="font-semibold text-amber-400 mt-0.5">
                    {video.communityRatingScore} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decentralized Comments Section */}
          <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  {t.comments} ({videoComments.length})
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Cryptographically signed with ed25519
              </span>
            </div>

            {/* Comment Input Box */}
            <form onSubmit={handlePostComment} className="flex gap-3">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500/40 flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={t.leaveComment}
                  rows={2}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none transition"
                />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Signed as: {user.handle}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-lg text-xs font-medium shadow-md shadow-emerald-600/20 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.signAndPost}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {videoComments.map(comment => (
                <div 
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-zinc-200">{comment.authorName}</span>
                          <span className="text-[10px] text-zinc-500">{comment.authorHandle}</span>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {comment.federatedOriginNode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">{comment.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 pl-9 leading-relaxed">
                    {comment.content}
                  </p>

                  <div className="pl-9 flex items-center gap-4 text-xs text-zinc-500 font-mono">
                    <button className="flex items-center gap-1 hover:text-emerald-400 transition">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.upvotes}</span>
                    </button>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{comment.cryptographicSignature.slice(0, 14)}...</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Related Videos & Live Swarm Status */}
        <div className="space-y-6">
          
          {/* Swarm Nodes Pinning This Video */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Replicating Nodes</span>
              </h4>
              <span className="text-[11px] font-mono text-emerald-400">
                {video.replicationNodes.length} pinned
              </span>
            </div>

            <div className="space-y-2">
              {video.replicationNodes.map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                const isOffline = offlineNodeIds.includes(nodeId);
                return (
                  <div 
                    key={nodeId}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      isOffline
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-400'
                        : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{node?.name || nodeId}</div>
                      <div className="text-[10px] text-zinc-500">{node?.region}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isOffline ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {isOffline ? 'OFFLINE' : `${node?.latencyMs}ms`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Videos List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              {t.relatedVideos}
            </h4>

            <div className="space-y-3">
              {relatedVideos.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectVideo(rel)}
                  className="group cursor-pointer flex gap-3 p-2 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                    <img
                      src={rel.posterUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white">
                      {rel.durationFormatted}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-zinc-200 group-hover:text-emerald-400 line-clamp-2 leading-snug">
                      {language === 'ur' && rel.titleUrdu ? rel.titleUrdu : rel.title}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-1 truncate">{rel.creator.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-0.5">
                      <span>{rel.views.toLocaleString()} {t.views}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{rel.p2pSeeders} seeds</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tip Creator Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Tip Creator (Direct P2P)</h3>
              </div>
              <button 
                onClick={() => setShowTipModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              100% of your micro-donation goes directly to <b>{video.creator.name}</b>'s cryptographic address (<span className="font-mono text-emerald-400">{video.creator.did.slice(0, 18)}...</span>) with 0% platform fee.
            </p>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 20, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTipAmount(amt)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition ${
                    tipAmount === amt
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {amt} TUBE
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Your Available Balance:</span>
              <span className="text-amber-400 font-bold">{user.tokenBalance} TUBE</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTipCreator}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                Send {tipAmount} TUBE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Integrity & Provenance Modal */}
      {showIntegrityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">Cryptographic Content Provenance</h3>
              </div>
              <button 
                onClick={() => setShowIntegrityModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Every video on OpenTube is content-addressed using IPFS CID and SHA-256 digest. Content hashes ensure no third party or node operator can alter video bytes without changing the hash.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500">IPFS Content Identifier (CIDv1):</div>
                <div className="text-emerald-400 break-all select-all">{video.cid}</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500">SHA-256 Integrity Checksum:</div>
                <div className="text-cyan-400 break-all select-all">{video.sha256Hash}</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500">Filecoin Perpetual Storage Deal:</div>
                <div className="text-purple-400 break-all select-all">{video.filecoinDealId}</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500">Creator Sovereign Identity (DID):</div>
                <div className="text-zinc-300 break-all select-all">{video.creator.did}</div>
              </div>
            </div>

            {/* Verify Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleVerifyIntegrity}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Verify Checksum Against Local Stream</span>
              </button>

              {verifiedHashMatch && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hash 100% Validated (Match)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Community Moderation Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-base text-white">Report to Community Moderation Jury</h3>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            {reportSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-zinc-100">Report Dispatched to Swarm Jury</h4>
                <p className="text-xs text-zinc-400">
                  In accordance with Phase 8, this report has been broadcast to 100 randomized tokenholder jurors for cryptographic consensus. No single administrator can delete files arbitrarily.
                </p>
                <button
                  onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-400">
                  OpenTube has no unilateral admin censors. If this content violates copyright, contains malware, or harms individuals, submit evidence to the decentralized jury.
                </p>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-300 font-medium">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="copyright">Copyright Infringement (DMCA Proof Required)</option>
                    <option value="malware">Malicious Payload / Phishing</option>
                    <option value="illegal">Unlawful Harmful Material</option>
                    <option value="spam">Sybil Network Spam / Bot Duplication</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReportSubmitted(true)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    Submit to DAO Jury
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
