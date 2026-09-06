import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScreenIndex, AnimeItem } from '../../types';
import { animeArchiveData, birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';

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
  { id: 'anime-slime', label: 'REINCARNATED AS A SLIME', shortLabel: 'SLIME' },
  { id: 'anime-demon-slayer', label: 'DEMON SLAYER', shortLabel: 'DEMON SLAYER' },
  { id: 'anime-dangers-heart', label: 'DANGERS IN MY HEART', shortLabel: 'DANGERS' },
  { id: 'anime-solo-leveling', label: 'SOLO LEVELING', shortLabel: 'SOLO LEVELING' },
  { id: 'anime-aot', label: 'ATTACK ON TITAN', shortLabel: 'AOT' }
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
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Screen Header Banner */}
      <motion.div variants={cardVariants} className="flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="dev-eyebrow-pill mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
              <span>SECTOR 03 // ANIME ARCHIVE VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#f5f5f7] tracking-tight">
              Shared Anime <span className="text-[#f5a524]">Masterpieces</span>
            </h2>
          </div>
          <span className="dev-status-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            5 SHOWS UNLOCKED
          </span>
        </div>

        {/* Filter Tags (Rounded Pill Badges) */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-mono text-[#9ca3af] mr-1 uppercase">
            Filters:
          </span>
          {SHOW_TAGS.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleFilterClick(tag)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeFilterId === tag.id
                  ? 'bg-[#f5a524] text-[#0a0e17] font-semibold shadow-sm'
                  : 'bg-[#121723] hover:bg-[#1a1f2e] text-[#9ca3af] hover:text-[#f5f5f7] border border-[#ffffff1a]'
              }`}
            >
              <span>{tag.shortLabel}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Anime Cards */}
        <motion.div variants={cardVariants} className="lg:col-span-7 space-y-3.5">
          {filteredAnime.map((item) => {
            const isSelected = selectedAnime.id === item.id;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onClick={() => handleSelectAnime(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative select-none ${
                  isSelected
                    ? 'dev-card bg-[#1a1f2e] border-[#f5a524]/60 shadow-lg'
                    : 'dev-card bg-[#121723]/90 hover:bg-[#1a1f2e]/70 border-[#ffffff1a] hover:border-[#ffffff2a] shadow-md'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#f5a524] uppercase mb-1">
                      {item.genre}
                    </div>
                    <h3 className="text-base font-semibold text-[#f5f5f7] tracking-tight">
                      {item.title}
                    </h3>
                    {item.japaneseTitle && (
                      <div className="text-xs font-mono text-[#9ca3af] mt-0.5">
                        {item.japaneseTitle}
                      </div>
                    )}
                  </div>
                  <div className="px-2.5 py-0.5 bg-white/5 border border-[#ffffff1a] rounded-full text-[#f5f5f7] text-xs font-mono">
                    {item.rating}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#ffffff0f] flex items-center justify-between text-xs font-mono">
                  <span className="italic text-[#9ca3af] truncate max-w-[75%]">
                    "{item.quote}"
                  </span>
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-[#f5a524]' : 'text-[#9ca3af]'}`}>
                    {isSelected ? '● INSPECTING' : 'SELECT ▶'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Column: Terminal Quote & Memory Inspector */}
        <motion.div variants={cardVariants} className="lg:col-span-5 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative">
          <div>
            <div className="border-b border-[#ffffff1a] pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-[#f5f5f7] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f5a524]" />
                Decoder // {selectedAnime.title}
              </span>
              <span className="dev-status-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                ACTIVE
              </span>
            </div>

            {/* Quote Box */}
            <div className="p-4 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl my-4">
              <div className="text-[11px] font-mono font-semibold text-[#f5a524] uppercase tracking-wider mb-2">
                Iconic Decoded Quote:
              </div>
              <blockquote className="text-sm font-sans italic text-[#f5f5f7] leading-relaxed">
                "{selectedAnime.quote}"
              </blockquote>
            </div>

            {/* Telemetry Breakdown */}
            <div className="space-y-3 text-xs font-mono mt-4">
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">GENRE:</span>
                <span className="font-medium text-[#f5f5f7]">{selectedAnime.genre}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">TIER RATING:</span>
                <span className="font-mono text-xs text-[#f5a524] bg-[#f5a524]/10 border border-[#f5a524]/30 px-2 py-0.5 rounded">
                  {selectedAnime.rating}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">RECIPIENT RATING:</span>
                <span className="font-medium text-[#f5f5f7]">10 / 10 MUST-WATCH</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#9ca3af]">CO-OP WATCH STATUS:</span>
                <span className="font-medium text-[#4ade80]">COMPLETED // ARCHIVED</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg text-xs leading-relaxed text-[#9ca3af]">
              <span className="font-mono font-semibold text-[#f5a524] block mb-1 text-[11px] uppercase tracking-wider">CO-OP LOG NOTE:</span>
              Countless marathons and endless theories shared with <strong className="text-[#f5f5f7]">{birthdayConfig.recipientName}</strong>. These shows define our co-op journey!
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#ffffff1a] flex justify-between items-center text-xs font-mono text-[#9ca3af]">
            <span>CIPHER: 256-BIT NEKO</span>
            <span>SLOT 03/07</span>
          </div>
        </motion.div>

      </div>

      {/* Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.STATS);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          ◀ PREV: STATS
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#9ca3af] hover:text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl shadow-lg shadow-[#f5a524]/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          NEXT: MEMORY DATABASE ▶
        </button>
      </motion.div>

    </motion.div>
  );
};
