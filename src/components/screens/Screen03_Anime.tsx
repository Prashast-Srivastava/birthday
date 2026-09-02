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
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Screen Header Banner */}
      <div className="flex flex-col gap-3 mb-5 bg-[#ffd000] border-3 border-[#16192e] px-4 py-3 brutal-shadow">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase flex items-center gap-2 mb-0.5">
              <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
              <span>SECTOR 03 // ANIME ARCHIVE VAULT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-pixel font-black text-[#16192e] uppercase">
              SHARED ANIME MASTERPIECES
            </h2>
          </div>
          <div className="px-2.5 py-1 bg-[#fffdf0] border-2 border-[#16192e] text-[10px] font-pixel font-bold text-[#16192e]">
            5 SHOWS UNLOCKED
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t-2 border-[#16192e]/20">
          <span className="text-[9px] font-pixel font-bold text-[#16192e] uppercase mr-1">
            FILTERS:
          </span>
          {SHOW_TAGS.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleFilterClick(tag)}
              className={`px-2.5 py-1 text-[9px] font-pixel font-bold uppercase transition-all cursor-pointer border-2 border-[#16192e] ${
                activeFilterId === tag.id
                  ? 'bg-[#00f0ff] text-[#16192e] translate-x-[-1px] translate-y-[-1px] shadow-[3px_3px_0px_#16192e]'
                  : 'bg-[#fffdf0] text-[#16192e] hover:bg-[#fff9d9] shadow-[2px_2px_0px_#16192e]'
              }`}
            >
              <span>{tag.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Anime Cards with "Press into Page" Hover Interaction */}
        <div className="lg:col-span-7 space-y-3.5">
          {filteredAnime.map((item) => {
            const isSelected = selectedAnime.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectAnime(item)}
                className={`p-4 border-3 border-[#16192e] transition-all duration-100 cursor-pointer relative select-none ${
                  isSelected
                    ? 'bg-[#00f0ff] translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0px_#16192e]'
                    : 'bg-[#fffdf0] shadow-[5px_5px_0px_#16192e] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_#16192e]'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="text-[9px] font-pixel font-bold text-[#16192e] uppercase mb-1">
                      {item.genre}
                    </div>
                    <h3 className="text-sm sm:text-base font-pixel font-bold text-[#16192e] tracking-wide">
                      {item.title}
                    </h3>
                    {item.japaneseTitle && (
                      <div className="text-xs font-mono font-bold opacity-70 text-[#16192e] mt-0.5">
                        {item.japaneseTitle}
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-0.5 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] text-[9px] font-pixel font-bold">
                    {item.rating}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t-2 border-[#16192e]/20 flex items-center justify-between text-xs font-mono">
                  <span className="italic font-bold text-[#16192e] truncate max-w-[75%]">
                    "{item.quote}"
                  </span>
                  <span className="text-[9px] font-pixel font-bold text-[#16192e]">
                    {isSelected ? '[INSPECTING]' : 'SELECT ▶'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Terminal Quote & Memory Inspector */}
        <div className="lg:col-span-5 bg-[#fffdf0] border-4 border-[#16192e] p-5 flex flex-col justify-between brutal-shadow-lg relative">
          <div>
            <div className="border-b-3 border-[#16192e] pb-2.5 mb-4 flex items-center justify-between">
              <span className="text-xs font-pixel font-bold text-[#16192e] uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ffd000] border border-[#16192e] inline-block" />
                DECODER // {selectedAnime.title}
              </span>
              <span className="text-[9px] font-pixel bg-[#22c55e] text-[#16192e] border border-[#16192e] px-1.5 py-0.5 font-bold">
                ACTIVE
              </span>
            </div>

            {/* Quote Box */}
            <div className="p-4 bg-[#ffd000] border-3 border-[#16192e] brutal-shadow-sm my-3">
              <div className="text-[9px] font-pixel font-bold text-[#16192e] uppercase tracking-wider mb-2">
                ICONIC DECODED QUOTE:
              </div>
              <blockquote className="text-xs sm:text-sm font-pixel font-bold text-[#16192e] leading-relaxed">
                "{selectedAnime.quote}"
              </blockquote>
            </div>

            {/* Telemetry Breakdown */}
            <div className="space-y-2.5 text-xs font-mono text-[#16192e] mt-4">
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">GENRE:</span>
                <span className="font-bold">{selectedAnime.genre}</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">TIER RATING:</span>
                <span className="font-pixel text-[10px] font-bold text-[#16192e] bg-[#00f0ff] px-1 border border-[#16192e]">
                  {selectedAnime.rating}
                </span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">RECIPIENT RATING:</span>
                <span className="font-bold">10 / 10 MUST-WATCH</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold opacity-60">CO-OP WATCH STATUS:</span>
                <span className="font-bold text-[#22c55e]">COMPLETED // ARCHIVED</span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-[#ff5e97] border-3 border-[#16192e] brutal-shadow-sm text-xs font-mono text-[#16192e] leading-relaxed">
              <span className="font-pixel font-bold block mb-1 text-[10px] text-[#16192e]">CO-OP LOG NOTE:</span>
              Countless marathons and endless theories shared with <strong>{birthdayConfig.recipientName}</strong>. These shows define our co-op journey!
            </div>
          </div>

          <div className="mt-5 pt-3 border-t-2 border-[#16192e]/20 flex justify-between items-center text-[10px] font-pixel text-[#16192e]">
            <span>CIPHER: 256-BIT NEKO</span>
            <span>SLOT 03/07</span>
          </div>
        </div>

      </div>

      {/* Navigation Footer Controls */}
      <div className="mt-5 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.STATS);
          }}
          className="px-4 py-2.5 bg-[#fffdf0] border-3 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          ◀ PREV: STATS
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#ffd000] border-3 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-5 py-2.5 bg-[#22c55e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          NEXT: MEMORY DATABASE ▶
        </button>
      </div>

    </div>
  );
};
