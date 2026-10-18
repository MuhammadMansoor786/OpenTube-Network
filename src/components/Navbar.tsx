import React, { useState } from 'react';
import { 
  PlaySquare, 
  Search, 
  Upload, 
  ShieldCheck, 
  Globe, 
  Radio, 
  Coins, 
  Key, 
  BookOpen, 
  Sliders, 
  Menu, 
  X,
  Server,
  Sparkles
} from 'lucide-react';
import { UserIdentity, P2PNode } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface NavbarProps {
  currentTab: 'feed' | 'p2p' | 'governance' | 'federation' | 'architecture';
  setCurrentTab: (tab: 'feed' | 'p2p' | 'governance' | 'federation' | 'architecture') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  nodes: P2PNode[];
  user: UserIdentity;
  onOpenUpload: () => void;
  onOpenIdentity: () => void;
  onOpenRomanUrduDocs: () => void;
  showSliders: boolean;
  setShowSliders: (val: boolean) => void;
  onSelectVideoById?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
  nodes,
  user,
  onOpenUpload,
  onOpenIdentity,
  onOpenRomanUrduDocs,
  showSliders,
  setShowSliders,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[language];

  const onlineNodes = nodes.filter(n => n.status === 'online').length;
  const totalNodes = nodes.length;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('feed')}
              className="flex items-center gap-2.5 group text-left"
              aria-label="OpenTube Network Home"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <PlaySquare className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    OpenTube
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    P2P Mesh
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 hidden md:block">
                  {t.tagline}
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Algorithm sliders toggle */}
            <button
              onClick={() => setShowSliders(!showSliders)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                showSliders 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title="Algorithmic Sovereign Sliders"
              aria-label="Toggle recommendation algorithm sliders"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden xl:inline font-medium">Algo Sliders</span>
            </button>

            {/* Network Health Indicator Pill */}
            <button
              onClick={() => setCurrentTab('p2p')}
              className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
                onlineNodes === totalNodes 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
              title="Click to view P2P Network Map & Node Failover Simulator"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{onlineNodes}/{totalNodes} Nodes</span>
              <span className={`w-1.5 h-1.5 rounded-full ${onlineNodes === totalNodes ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>

            {/* Roman Urdu Documentation & PDF Button */}
            <button
              onClick={onOpenRomanUrduDocs}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Roman Urdu Mukammal Guide aur PDF Download"
              aria-label="Open Roman Urdu Technical Guide and PDF Download"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Roman Urdu Guide</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500 text-zinc-950 font-bold uppercase">
                PDF
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="px-2 sm:px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition"
              title="Switch language: English / Urdu (اردو)"
              aria-label="Toggle language between English and Urdu"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono">{language === 'en' ? 'UR' : 'EN'}</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t.studioUpload}</span>
            </button>

            {/* User DID / Wallet Button */}
            <button
              onClick={onOpenIdentity}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-full transition group"
              title="Cryptographic Identity & Wallet"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/50"
              />
              <div className="hidden lg:flex items-center gap-1 text-xs">
                <Coins className="w-3 h-3 text-amber-400" />
                <span className="font-semibold text-zinc-200">{user.tokenBalance}</span>
                <span className="text-[10px] text-zinc-500">TUBE</span>
              </div>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search for mobile */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1 py-1.5 border-t border-zinc-900 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setCurrentTab('feed')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'feed'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.exploreFeed}</span>
          </button>

          <button
            onClick={() => setCurrentTab('p2p')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'p2p'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.p2pNetwork}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Live Swarm
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('governance')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'governance'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.governance}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">
              DAO
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('federation')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'federation'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.federation}</span>
          </button>

          <button
            onClick={() => setCurrentTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              currentTab === 'architecture'
                ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-800/50'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.architectureDocs}</span>
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2">
          <button
            onClick={() => { setCurrentTab('feed'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left ${
              currentTab === 'feed' ? 'bg-zinc-800 text-white' : 'text-zinc-300'
            }`}
          >
            <PlaySquare className="w-4 h-4 text-emerald-400" />
            {t.exploreFeed}
          </button>
          <button
            onClick={() => { setCurrentTab('p2p'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left ${
              currentTab === 'p2p' ? 'bg-zinc-800 text-white' : 'text-zinc-300'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            {t.p2pNetwork} ({onlineNodes}/{totalNodes} Online)
          </button>
          <button
            onClick={() => { setCurrentTab('governance'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left ${
              currentTab === 'governance' ? 'bg-zinc-800 text-white' : 'text-zinc-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            {t.governance}
          </button>
          <button
            onClick={() => { setCurrentTab('federation'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left ${
              currentTab === 'federation' ? 'bg-zinc-800 text-white' : 'text-zinc-300'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            {t.federation}
          </button>
          <button
            onClick={() => { onOpenRomanUrduDocs(); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-semibold`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Roman Urdu Guide & PDF</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold uppercase">
              Download PDF
            </span>
          </button>
          <button
            onClick={() => { setCurrentTab('architecture'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-emerald-400 bg-emerald-950/30 border border-emerald-900/50`}
          >
            <BookOpen className="w-4 h-4" />
            {t.architectureDocs}
          </button>
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => { onOpenIdentity(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-xs text-zinc-300"
            >
              <Key className="w-4 h-4 text-emerald-400" />
              <span>DID: {user.username}</span>
            </button>
            <div className="text-xs font-mono text-amber-400">
              {user.tokenBalance} TUBE
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
