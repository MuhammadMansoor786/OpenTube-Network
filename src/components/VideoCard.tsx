import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  HardDrive, 
  Copy, 
  Check, 
  Activity, 
  ShieldAlert, 
  Globe2 
} from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  language: 'en' | 'ur';
  offlineNodeIds: string[];
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  language,
  offlineNodeIds,
}) => {
  const [copied, setCopied] = useState(false);

  const activeReplicas = video.replicationNodes.filter(n => !offlineNodeIds.includes(n)).length;
  const totalReplicas = video.replicationNodes.length;
  const isHealthy = activeReplicas > 0;

  const handleCopyCID = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = language === 'ur' && video.titleUrdu ? video.titleUrdu : video.title;

  return (
    <div 
      onClick={() => onSelect(video)}
      className="group cursor-pointer flex flex-col bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/40 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(video); }}
      aria-label={`Watch video: ${title}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
        <img
          src={video.posterUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Play Overlay Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[11px] font-mono font-medium text-white">
          {video.durationFormatted}
        </div>

        {/* P2P Swarm Seeds & IPFS Status Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-950/85 backdrop-blur-sm border border-zinc-700/60 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{video.p2pSeeders} seeds</span>
          </div>
          <div className="px-1.5 py-0.5 rounded-full bg-zinc-950/85 backdrop-blur-sm border border-zinc-700/60 text-[10px] font-mono text-cyan-300">
            IPFS
          </div>
        </div>

        {/* Replica Health Pill */}
        <div className="absolute top-2 right-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm border text-[10px] font-mono ${
            activeReplicas === totalReplicas
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : activeReplicas > 0
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}>
            <HardDrive className="w-2.5 h-2.5" />
            <span>{activeReplicas}/{totalReplicas} pins</span>
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start gap-3">
            {/* Channel Avatar */}
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700 flex-shrink-0 mt-0.5"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors">
                {title}
              </h3>
              
              <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                <span className="font-medium truncate text-zinc-300">{video.creator.name}</span>
                {video.creator.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                )}
                <span className="text-[10px] text-zinc-600">•</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 truncate max-w-[90px]">
                  {video.federationOrigin}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Stats & Content Hash Preview */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span>{video.views.toLocaleString()} {language === 'ur' ? 'مناظر' : 'views'}</span>
            <span>•</span>
            <span>{video.uploadDate}</span>
          </div>

          {/* Quick Copy CID */}
          <button
            onClick={handleCopyCID}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
            title={`Copy IPFS CID: ${video.cid}`}
            aria-label="Copy IPFS Content Identifier"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px]">CID</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
