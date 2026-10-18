import React from 'react';
import { Sliders, RotateCcw, ShieldCheck, Sparkles, Zap, Clock, Users, Wifi } from 'lucide-react';
import { RecommendationWeights } from '../utils/crypto-p2p';

interface RecommendationSlidersProps {
  weights: RecommendationWeights;
  onChangeWeights: (weights: RecommendationWeights) => void;
  language: 'en' | 'ur';
}

export const RecommendationSliders: React.FC<RecommendationSlidersProps> = ({
  weights,
  onChangeWeights,
  language,
}) => {
  const handleSliderChange = (key: keyof RecommendationWeights, val: number) => {
    onChangeWeights({
      ...weights,
      [key]: val,
    });
  };

  const applyPreset = (preset: 'chronological' | 'p2p' | 'community' | 'balanced') => {
    switch (preset) {
      case 'chronological':
        onChangeWeights({ communityCurated: 10, chronological: 90, p2pAvailability: 20, engagement: 10 });
        break;
      case 'p2p':
        onChangeWeights({ communityCurated: 20, chronological: 20, p2pAvailability: 90, engagement: 10 });
        break;
      case 'community':
        onChangeWeights({ communityCurated: 90, chronological: 20, p2pAvailability: 30, engagement: 20 });
        break;
      case 'balanced':
        onChangeWeights({ communityCurated: 50, chronological: 50, p2pAvailability: 50, engagement: 50 });
        break;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            {language === 'ur' ? 'شفاف الگورتھم: آپ خود رینکنگ طے کریں' : 'Algorithmic Sovereignty: You Control The Feed'}
          </h3>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => applyPreset('chronological')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-300 transition"
          >
            Chronological
          </button>
          <button
            onClick={() => applyPreset('p2p')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-cyan-300 transition"
          >
            P2P Speed
          </button>
          <button
            onClick={() => applyPreset('community')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-purple-300 transition"
          >
            Community Score
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-[11px] font-mono text-emerald-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">
        Phase 11: Corporate platforms use opaque algorithms to maximize addiction and advertising revenue. On OpenTube, ranking coefficients are 100% user-directed and computed in your browser.
      </p>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* Slider 1: Community Curated */}
        <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/70">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-purple-300 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Community
            </span>
            <span className="text-zinc-400">{weights.communityCurated}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.communityCurated}
            onChange={(e) => handleSliderChange('communityCurated', Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Slider 2: Chronological */}
        <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/70">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-200 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Freshness
            </span>
            <span className="text-zinc-400">{weights.chronological}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.chronological}
            onChange={(e) => handleSliderChange('chronological', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Slider 3: P2P Availability */}
        <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/70">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-300 font-semibold flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              P2P Seeders
            </span>
            <span className="text-zinc-400">{weights.p2pAvailability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.p2pAvailability}
            onChange={(e) => handleSliderChange('p2pAvailability', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Slider 4: Engagement */}
        <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/70">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Views & Likes
            </span>
            <span className="text-zinc-400">{weights.engagement}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.engagement}
            onChange={(e) => handleSliderChange('engagement', Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
