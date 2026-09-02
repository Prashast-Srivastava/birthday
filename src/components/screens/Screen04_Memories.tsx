import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, MapPin, Calendar, Tag, ChevronLeft, ChevronRight, Lock, Eye } from 'lucide-react';
import { ScreenIndex, MemoryItem } from '../../types';
import { birthdayConfig, memoryDatabaseData } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen04MemoriesProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen04_Memories: React.FC<Screen04MemoriesProps> = ({ onNavigate }) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Filter memories if desired (default ALL)
  const filteredMemories = activeFilter === 'ALL'
    ? memoryDatabaseData
    : memoryDatabaseData.filter(m => m.tag === activeFilter);

  // Sound effects on open/close modal
  const handleOpenModal = (mem: MemoryItem) => {
    soundEngine.playGlitch();
    setSelectedMemory(mem);
  };

  const handleCloseModal = () => {
    soundEngine.playSelect();
    setSelectedMemory(null);
  };

  // Keyboard navigation for modal (ESC to close, Left/Right arrow to cycle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMemory) return;

      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = memoryDatabaseData.findIndex(m => m.id === selectedMemory.id);
        const nextIndex = (currentIndex + 1) % memoryDatabaseData.length;
        soundEngine.playKeyClick();
        setSelectedMemory(memoryDatabaseData[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = memoryDatabaseData.findIndex(m => m.id === selectedMemory.id);
        const prevIndex = (currentIndex - 1 + memoryDatabaseData.length) % memoryDatabaseData.length;
        soundEngine.playKeyClick();
        setSelectedMemory(memoryDatabaseData[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory]);

  const handleNextModal = () => {
    if (!selectedMemory) return;
    const currentIndex = memoryDatabaseData.findIndex(m => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % memoryDatabaseData.length;
    soundEngine.playKeyClick();
    setSelectedMemory(memoryDatabaseData[nextIndex]);
  };

  const handlePrevModal = () => {
    if (!selectedMemory) return;
    const currentIndex = memoryDatabaseData.findIndex(m => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + memoryDatabaseData.length) % memoryDatabaseData.length;
    soundEngine.playKeyClick();
    setSelectedMemory(memoryDatabaseData[prevIndex]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-4 select-none">
      
      {/* Screen Header Bar */}
      <div className="border border-[#4ade80]/40 bg-[#080a08]/90 p-4 sm:p-5 mb-6 box-glow-green relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4ade80]/20 pb-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              DATABASE_MODULE // SECTOR 04 // 8 MEMORY SLOTS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white glow-phosphor mt-0.5">
              MEMORY DATABASE // CO-OP LOGS
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono opacity-80 text-[#4ade80] bg-[#121412] px-3 py-1.5 border border-[#4ade80]/30">
              SLOTS_OCCUPIED: <span className="text-[#fbbf24] font-bold">8 / 8 [SYNCED]</span>
            </div>
          </div>
        </div>

        {/* Database Quick Instructions & Status */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#4ade80]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#fbbf24]">▶ INSTRUCTION:</span>
            <span>Hover card for glitch matrix telemetry. Click any slot to decrypt full 4:3 hologram viewer.</span>
          </div>
          <div className="text-[10px] text-white/50">
            PRESS [ESC] TO CLOSE MODAL • [◀ / ▶] TO CYCLE
          </div>
        </div>
      </div>

      {/* 8-Card Uniform 4:3 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredMemories.map((mem, index) => {
          const isHovered = hoveredCardId === mem.id;
          const slotNumber = String(index + 1).padStart(2, '0');

          return (
            <div
              key={mem.id}
              id={`memory-card-${mem.id}`}
              onClick={() => handleOpenModal(mem)}
              onMouseEnter={() => {
                setHoveredCardId(mem.id);
                soundEngine.playTone(320 + index * 40, 0.04, 'sine', 0.03);
              }}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`group relative bg-[#0d100d] border transition-all duration-200 cursor-pointer flex flex-col overflow-hidden ${
                isHovered
                  ? 'border-[#4ade80] shadow-[0_0_16px_rgba(74,222,128,0.35)] scale-[1.02] z-10'
                  : 'border-[#4ade80]/30 hover:border-[#4ade80]/70'
              }`}
            >
              {/* Card Header Tag Bar */}
              <div className="px-3 py-1.5 bg-[#121612] border-b border-[#4ade80]/20 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#fbbf24] font-bold">
                  SLOT_{slotNumber}
                </span>
                <span className="px-1.5 py-0.2 bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 text-[9px] uppercase tracking-wider">
                  {mem.tag || 'ARCHIVE'}
                </span>
              </div>

              {/* 
                ========================================================================
                FIXED 4:3 ASPECT RATIO CROP (object-fit: cover) WITH ASSET MISSING BOX
                ========================================================================
              */}
              <div className="relative w-full aspect-[4/3] bg-[#111111] overflow-hidden flex items-center justify-center">
                {mem.imageUrl && mem.imageUrl.trim() !== '' ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  /* Specified Missing Photo Placeholder: dashed pixel-style border, #111111 bg, centered [ ASSET MISSING ] in #8E8E8E */
                  <div className="w-full h-full p-3 flex flex-col items-center justify-center text-center">
                    <div className="w-full h-full border-2 border-dashed border-[#8E8E8E]/40 bg-[#111111] flex flex-col items-center justify-center gap-1.5 p-2 transition-colors group-hover:border-[#4ade80]/60">
                      <ImageIcon className="w-5 h-5 text-[#8E8E8E] opacity-60 group-hover:text-[#4ade80] group-hover:opacity-100 transition-all" />
                      <span className="font-mono text-[11px] sm:text-xs tracking-widest text-[#8E8E8E] font-bold select-none group-hover:text-[#4ade80] transition-colors">
                        [ ASSET MISSING ]
                      </span>
                      <span className="text-[9px] font-mono text-[#8E8E8E]/60 tracking-wider">
                        4:3 CO-OP HOLOGRAM
                      </span>
                    </div>
                  </div>
                )}

                {/* CRT Scanline Overlay on Image Container */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/10 to-black/50" />

                {/* Hover Glitch Overlay FX */}
                {isHovered && (
                  <div className="absolute inset-0 bg-[#4ade80]/10 pointer-events-none flex items-center justify-center backdrop-blur-[0.5px]">
                    <div className="px-3 py-1 bg-black/85 border border-[#4ade80] text-[#4ade80] text-[10px] font-mono font-bold tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_#4ade80]">
                      <Eye className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
                      <span>DECRYPT_VIEW</span>
                    </div>
                  </div>
                )}

                {/* Slot index badge in top corner */}
                <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 bg-black/80 border border-[#4ade80]/40 text-[#4ade80] text-[9px] font-mono">
                  {mem.date}
                </div>
              </div>

              {/* Card Meta & Description Body */}
              <div className="p-3 flex-1 flex flex-col justify-between bg-[#080a08]/90">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wide text-white group-hover:text-[#4ade80] transition-colors line-clamp-1">
                    {mem.title}
                  </h3>
                  
                  {mem.location && mem.location.trim() !== '' ? (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-[#4ade80]/70 truncate">
                      <MapPin className="w-3 h-3 text-[#fbbf24] shrink-0" />
                      <span className="truncate">{mem.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-[#8E8E8E]/60 truncate">
                      <MapPin className="w-3 h-3 opacity-40 shrink-0" />
                      <span className="truncate tracking-wider">[ LOCATION_UNSET ]</span>
                    </div>
                  )}

                  {mem.description && mem.description.trim() !== '' ? (
                    <p className="mt-2 text-[11px] font-mono text-[#4ade80]/80 leading-relaxed line-clamp-2">
                      {mem.description}
                    </p>
                  ) : (
                    <div className="mt-2 p-2 border border-dashed border-[#8E8E8E]/30 bg-[#111111]/80 text-[10px] font-mono text-[#8E8E8E] flex items-center justify-center text-center">
                      <span>[ MEMORY LOG PENDING ENTRY ]</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[#4ade80]/15 flex items-center justify-between text-[9px] font-mono text-white/50">
                  <span className="text-[#fbbf24]">SLOT {slotNumber}</span>
                  <span className="group-hover:text-[#4ade80] group-hover:translate-x-0.5 transition-all">
                    CLICK TO EXPAND ▶
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 
        ========================================================================
        MODAL VIEWER POPUP (CRT HUD / 4:3 ENLARGED VIEW + RETRO DECRYPTION TELEMETRY)
        ========================================================================
      */}
      {selectedMemory && (
        <div
          id="memory-modal-backdrop"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            id="memory-modal-content"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0a0d0a] border-2 border-[#4ade80] shadow-[0_0_30px_rgba(74,222,128,0.4)] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Modal Title Bar */}
            <div className="px-4 py-2.5 bg-[#121612] border-b border-[#4ade80] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fbbf24] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#fbbf24] uppercase">
                  DECRYPTED MEMORY // {selectedMemory.tag || 'SLOT_ARCHIVE'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-2 py-1 bg-[#1a201a] border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLOSE [ESC]</span>
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* 4:3 Image Modal Viewport */}
              <div className="relative w-full aspect-[4/3] bg-[#111111] border border-[#4ade80]/50 overflow-hidden flex items-center justify-center shadow-inner">
                {selectedMemory.imageUrl && selectedMemory.imageUrl.trim() !== '' ? (
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-full h-full border-2 border-dashed border-[#8E8E8E]/50 bg-[#111111] flex flex-col items-center justify-center gap-2 p-4">
                      <ImageIcon className="w-10 h-10 text-[#8E8E8E] opacity-70" />
                      <span className="font-mono text-sm sm:text-base tracking-widest text-[#8E8E8E] font-bold">
                        [ ASSET MISSING ]
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-[#8E8E8E]/70 max-w-xs">
                        MEMORY IMAGE NOT YET UPLOADED. DROP REAL 4:3 PHOTO IN BIRTHDAY DATA.
                      </span>
                    </div>
                  </div>
                )}

                {/* Scanline CRT overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/10 to-black/40" />

                {/* Corner Crosshairs */}
                <div className="absolute top-2 left-2 text-[10px] font-mono text-[#4ade80]/60">╔</div>
                <div className="absolute top-2 right-2 text-[10px] font-mono text-[#4ade80]/60">╗</div>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#4ade80]/60">╚</div>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#4ade80]/60">╝</div>
              </div>

              {/* Memory Data Fields */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#4ade80]/20 pb-2">
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-white glow-phosphor">
                    {selectedMemory.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#4ade80]/15 border border-[#4ade80] text-[#4ade80] text-xs font-mono font-bold">
                      {selectedMemory.date}
                    </span>
                    <span className="px-2 py-0.5 bg-[#fbbf24]/15 border border-[#fbbf24] text-[#fbbf24] text-xs font-mono font-bold">
                      {selectedMemory.tag || 'CO_OP'}
                    </span>
                  </div>
                </div>

                {selectedMemory.location && selectedMemory.location.trim() !== '' ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#fbbf24]">
                    <MapPin className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span>LOCATION: {selectedMemory.location}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E8E]/70">
                    <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                    <span>LOCATION: [ UNCONFIGURED_GEO_DATA ]</span>
                  </div>
                )}

                <div className="p-3.5 bg-[#121612] border border-[#4ade80]/30">
                  <span className="text-[10px] uppercase font-mono text-[#4ade80]/60 block mb-1">
                    MEMORY LOG ENTRY // CIPHER DECRYPTED:
                  </span>
                  {selectedMemory.description && selectedMemory.description.trim() !== '' ? (
                    <p className="text-sm font-mono text-[#4ade80] leading-relaxed">
                      {selectedMemory.description}
                    </p>
                  ) : (
                    <div className="py-3 px-3 border border-dashed border-[#8E8E8E]/40 bg-[#0d100d] text-center text-xs font-mono text-[#8E8E8E]">
                      [ NO MEMORY LOG ENTERED YET — READY FOR USER INPUT IN BIRTHDAY DATA ]
                    </div>
                  )}
                </div>

                {/* Additional Memory Lore Meta */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-2 bg-[#0d100d] border border-[#4ade80]/20">
                    <span className="opacity-50 block">RECIPIENT_SYNC:</span>
                    <span className="text-white font-bold">{birthdayConfig.recipientName} // LEVEL 22</span>
                  </div>
                  <div className="p-2 bg-[#0d100d] border border-[#4ade80]/20">
                    <span className="opacity-50 block">INTEGRITY_INDEX:</span>
                    <span className="text-[#fbbf24] font-bold">100% UNFORGETTABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Navigation Cycling Controls */}
            <div className="px-4 py-3 bg-[#121612] border-t border-[#4ade80]/40 flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={handlePrevModal}
                className="px-3 py-1.5 bg-[#1a201a] border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80] hover:text-black font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV SLOT</span>
              </button>

              <span className="text-[11px] text-[#fbbf24]">
                SLOT {memoryDatabaseData.findIndex(m => m.id === selectedMemory.id) + 1} OF {memoryDatabaseData.length}
              </span>

              <button
                type="button"
                onClick={handleNextModal}
                className="px-3 py-1.5 bg-[#1a201a] border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80] hover:text-black font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
              >
                <span>NEXT SLOT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Navigation Footer Controls */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-4 py-2 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV: ANIME ARCHIVE
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
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-5 py-2 bg-[#4ade80] text-black text-xs font-bold uppercase hover:bg-white active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.5)]"
        >
          NEXT: MINI-GAME QUEST ▶
        </button>
      </div>

    </div>
  );
};
