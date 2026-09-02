import React, { useState } from 'react';
import { ScreenIndex, AnimeItem } from '../../types';
import { animeArchiveData, birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen03AnimeProps {
  onNavigate: (index: ScreenIndex) => void;
}

interface ShowFilterTag {
  id: string;
  label: string;
  shortLabel: string;
}

const SHOW_TAGS: ShowFilterTag[] = [
  { id: 'ALL', label: 'ALL ARCHIVES', shortLabel: 'ALL' },
  { id: 'anime-slime', label: 'THAT TIME I GOT REINCARNATED AS A SLIME', shortLabel: 'REINCARNATED AS A SLIME' },
  { id: 'anime-demon-slayer', label: 'DEMON SLAYER', shortLabel: 'DEMON SLAYER' },
  { id: 'anime-dangers-heart', label: 'THE DANGERS IN MY HEART', shortLabel: 'THE DANGERS IN MY HEART' },
  { id: 'anime-solo-leveling', label: 'SOLO LEVELING', shortLabel: 'SOLO LEVELING' },
  { id: 'anime-aot', label: 'ATTACK ON TITAN', shortLabel: 'ATTACK ON TITAN' }
];

export const Screen03_Anime: React.FC<Screen03AnimeProps> = ({ onNavigate }) => {
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem>(animeArchiveData[0]);
  const [activeFilterId, setActiveFilterId] = useState<string>('ALL');

  const filteredAnime = activeFilterId === 'ALL'
    ? animeArchiveData
    : animeArchiveData.filter(item => item.id === activeFilterId);

  const handleSelectAnime = (item: AnimeItem) => {
    setSelectedAnime(item);
    soundEngine.playSelect();
  };

  const handleFilterClick = (tag: ShowFilterTag) => {
    soundEngine.playKeyClick();
    setActiveFilterId(tag.id);
    if (tag.id !== 'ALL') {
      const match = animeArchiveData.find(item => item.id === tag.id);
      if (match) {
        setSelectedAnime(match);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-4">
      {/* Screen Header */}
      <div className="border-b border-[#4ade80]/30 pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[10px] text-[#fbbf24] font-mono tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              <span>SCREEN 03 // ANIME ARCHIVE VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-[#4ade80] glow-phosphor uppercase">
              SHARED ANIME MASTERPIECES
            </h2>
          </div>
          <div className="text-xs font-mono opacity-70 text-[#4ade80]">
            ARCHIVE ENCRYPTION: <span className="text-[#fbbf24] font-bold">5 SHOWS UNLOCKED</span>
          </div>
        </div>

        {/* Unlocked Show Tags / Archive Filters */}
        <div className="mt-4">
          <div className="text-[10px] uppercase font-mono opacity-50 mb-2 text-[#4ade80] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#4ade80]" />
            <span>UNLOCKED ARCHIVE ENTRIES // SELECT TITLE TO INSPECT:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SHOW_TAGS.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleFilterClick(tag)}
                className={`px-2.5 sm:px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilterId === tag.id
                    ? 'bg-[#4ade80] text-black shadow-[0_0_10px_rgba(74,222,128,0.7)]'
                    : 'bg-[#121412] text-[#4ade80]/80 border border-[#4ade80]/30 hover:border-[#4ade80] hover:text-[#4ade80] hover:bg-[#4ade80]/10'
                }`}
              >
                <span className={activeFilterId === tag.id ? 'text-black' : 'text-[#fbbf24]'}>
                  {activeFilterId === tag.id ? '▶' : '◆'}
                </span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Anime Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAnime.map((item) => {
            const isSelected = selectedAnime.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectAnime(item)}
                className={`p-4 border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#4ade80] bg-[#4ade80]/15 shadow-[0_0_15px_rgba(74,222,128,0.15)]'
                    : 'border-[#4ade80]/30 bg-[#080a08]/90 hover:border-[#4ade80]/60 hover:bg-[#121412]'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="text-[9px] font-mono text-[#fbbf24] tracking-widest uppercase mb-0.5">
                      {item.genre}
                    </div>
                    <h3 className="text-base sm:text-lg font-black font-mono text-white tracking-wider">
                      {item.title}
                    </h3>
                    {item.japaneseTitle && (
                      <div className="text-xs font-mono opacity-60 text-[#4ade80]">
                        {item.japaneseTitle}
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-0.5 bg-black border border-[#4ade80]/40 text-[#4ade80] text-[10px] font-bold font-mono">
                    {item.rating}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#4ade80]/20 flex items-center justify-between text-xs font-mono">
                  <span className="italic opacity-80 text-white truncate max-w-[80%]">
                    "{item.quote}"
                  </span>
                  <span className="text-[#4ade80] font-bold">
                    {isSelected ? '▶ [INSPECTING]' : 'SELECT ▶'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Terminal Quote & Memory Inspector */}
        <div className="lg:col-span-5 bg-[#080a08]/95 border border-[#4ade80]/30 p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(74,222,128,0.05)] relative">
          <div>
            <div className="border-b border-[#4ade80]/20 pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-widest text-[#fbbf24] uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
                TERMINAL DECODER // {selectedAnime.title}
              </span>
              <span className="text-[9px] font-mono text-[#4ade80] border border-[#4ade80]/40 px-1.5 py-0.5">
                ACTIVE
              </span>
            </div>

            {/* Quote Box */}
            <div className="p-4 bg-[#121412] border border-[#4ade80]/30 my-3">
              <div className="text-[9px] text-[#fbbf24] font-mono uppercase tracking-widest mb-1.5">
                ICONIC DECODED QUOTE:
              </div>
              <blockquote className="text-sm sm:text-base font-bold font-mono text-white leading-relaxed italic">
                "{selectedAnime.quote}"
              </blockquote>
            </div>

            {/* Telemetry Breakdown */}
            <div className="space-y-2.5 text-xs font-mono mt-4">
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">GENRE:</span>
                <span className="text-[#4ade80] font-bold">{selectedAnime.genre}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">TIER RATING:</span>
                <span className="text-[#fbbf24] font-bold">{selectedAnime.rating}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">RECIPIENT RATING:</span>
                <span className="text-white font-bold">10 / 10 MUST-WATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">CO-OP WATCH STATUS:</span>
                <span className="text-[#4ade80] font-bold">COMPLETED // ARCHIVED</span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[11px] font-mono text-[#4ade80] leading-relaxed">
              <span className="font-bold block mb-1 text-[#fbbf24]">CO-OP LOG NOTE:</span>
              Countless marathons and endless theories shared with <strong>{birthdayConfig.recipientName}</strong>. These shows define our co-op journey!
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#4ade80]/20 flex justify-between items-center text-[10px] font-mono opacity-60">
            <span>DATA ENCRYPTION: 256-BIT NEKO_CIPHER</span>
            <span>SLOT 03/07</span>
          </div>
        </div>

      </div>

      {/* Navigation Footer Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.STATS);
          }}
          className="px-4 py-2 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV: STATS
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2 bg-[#121412] border border-[#fbbf24]/50 text-[#fbbf24] text-xs uppercase hover:bg-[#fbbf24]/20 active:scale-95 transition-all cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-5 py-2 bg-[#4ade80] text-black text-xs font-bold uppercase hover:bg-white active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.5)]"
        >
          NEXT: MEMORY DATABASE ▶
        </button>
      </div>
    </div>
  );
};
