import React, { useState, useEffect } from 'react';
import { X, MapPin, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ScreenIndex, MemoryItem } from '../../types';
import { birthdayConfig, memoryDatabaseData } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { MissingAssetPlaceholder } from '../common/MissingAssetPlaceholder';

interface Screen04MemoriesProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen04_Memories: React.FC<Screen04MemoriesProps> = ({ onNavigate }) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredMemories = activeFilter === 'ALL'
    ? memoryDatabaseData
    : memoryDatabaseData.filter(m => m.tag === activeFilter);

  const handleOpenModal = (mem: MemoryItem) => {
    soundEngine.playGlitch();
    setSelectedMemory(mem);
  };

  const handleCloseModal = () => {
    soundEngine.playSelect();
    setSelectedMemory(null);
  };

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
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Screen Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 bg-[#ffd000] border-3 border-[#16192e] px-4 py-2.5 brutal-shadow">
        <div>
          <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase flex items-center gap-2 mb-0.5">
            <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
            <span>SECTOR 04 // 8 MEMORY CARTRIDGES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-pixel font-black text-[#16192e] uppercase">
            MEMORY DATABASE // CO-OP LOGS
          </h2>
        </div>
        <div className="px-2.5 py-1 bg-[#fffdf0] border-2 border-[#16192e] text-[10px] font-pixel font-bold text-[#16192e]">
          8 / 8 CARTRIDGES
        </div>
      </div>

      {/* 8-Card Uniform 4:3 Polaroid/Cartridge Tile Grid */}
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
              className={`group relative bg-[#fffdf0] border-3 border-[#16192e] transition-all duration-100 cursor-pointer flex flex-col overflow-hidden select-none ${
                isHovered
                  ? 'translate-x-[2px] translate-y-[2px] shadow-[3px_3px_0px_#16192e]'
                  : 'shadow-[6px_6px_0px_#16192e]'
              }`}
            >
              {/* Card Header Tag Bar */}
              <div className="px-3 py-1.5 bg-[#ffd000] border-b-2 border-[#16192e] flex items-center justify-between text-[10px] font-pixel">
                <span className="font-bold text-[#16192e]">
                  SLOT_{slotNumber}
                </span>
                <span className="px-1.5 py-0.5 bg-[#fffdf0] text-[#16192e] border border-[#16192e] text-[8px] font-bold uppercase">
                  {mem.tag || 'ARCHIVE'}
                </span>
              </div>

              {/* Fixed 4:3 Aspect Ratio Viewport */}
              <div className="relative w-full aspect-[4/3] bg-[#111111] overflow-hidden flex items-center justify-center border-b-2 border-[#16192e]">
                {mem.imageUrl && mem.imageUrl.trim() !== '' ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <MissingAssetPlaceholder
                    label="[ ASSET MISSING ]"
                    subLabel="4:3 CARTRIDGE IMAGE"
                    className="h-full border-none"
                  />
                )}

                {/* Hover inspect pill */}
                {isHovered && (
                  <div className="absolute inset-0 bg-[#16192e]/40 pointer-events-none flex items-center justify-center">
                    <div className="px-3 py-1 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] text-[9px] font-pixel font-bold tracking-wider flex items-center gap-1 brutal-shadow-sm">
                      <Eye className="w-3 h-3 text-[#16192e]" />
                      <span>INSPECT</span>
                    </div>
                  </div>
                )}

                {/* Slot index badge */}
                <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 bg-[#fffdf0] border border-[#16192e] text-[#16192e] text-[8px] font-pixel font-bold">
                  {mem.date}
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-3 flex-1 flex flex-col justify-between bg-[#fffdf0] text-[#16192e]">
                <div>
                  <h3 className="text-xs font-pixel font-bold uppercase text-[#16192e] truncate">
                    {mem.title}
                  </h3>
                  
                  {mem.location && mem.location.trim() !== '' ? (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-[#16192e] truncate">
                      <MapPin className="w-3 h-3 text-[#f43f5e] shrink-0" />
                      <span className="truncate">{mem.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-[#16192e]/75 truncate">
                      <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                      <span className="truncate">[ LOCATION UNSET ]</span>
                    </div>
                  )}

                  {mem.description && mem.description.trim() !== '' ? (
                    <p className="mt-2 text-xs font-mono text-[#16192e]/80 leading-relaxed line-clamp-2">
                      {mem.description}
                    </p>
                  ) : (
                    <div className="mt-2 p-1.5 border border-dashed border-[#16192e]/40 bg-[#fffdf0] text-[9px] font-pixel text-[#16192e]/75 text-center">
                      <span>[ PENDING ENTRY ]</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[#16192e]/20 flex items-center justify-between text-[9px] font-pixel text-[#16192e]">
                  <span className="text-[#16192e] font-bold">SLOT {slotNumber}</span>
                  <span className="font-bold group-hover:translate-x-0.5 transition-transform">
                    EXPAND ▶
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Hologram Cartridge Viewer */}
      {selectedMemory && (
        <div
          id="memory-modal-backdrop"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-[#16192e]/70 flex items-center justify-center p-3 sm:p-6"
        >
          <div
            id="memory-modal-content"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#fffdf0] border-4 border-[#16192e] brutal-shadow-lg flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Modal Title Bar */}
            <div className="px-4 py-2.5 bg-[#ffd000] border-b-3 border-[#16192e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
                <span className="text-xs font-pixel font-bold text-[#16192e] uppercase">
                  DECRYPTED CARTRIDGE // {selectedMemory.tag || 'ARCHIVE'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-2 py-1 bg-[#fffdf0] hover:bg-[#f43f5e] hover:text-white border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold transition-colors cursor-pointer flex items-center gap-1 brutal-btn-sm"
              >
                <X className="w-3 h-3" />
                <span>CLOSE [ESC]</span>
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* 4:3 Image Viewport */}
              <div className="relative w-full aspect-[4/3] bg-[#111111] border-3 border-[#16192e] overflow-hidden flex items-center justify-center">
                {selectedMemory.imageUrl && selectedMemory.imageUrl.trim() !== '' ? (
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <MissingAssetPlaceholder
                    label="[ ASSET MISSING ]"
                    subLabel="MEMORY IMAGE NOT YET UPLOADED. DROP REAL 4:3 PHOTO IN BIRTHDAY DATA."
                    className="h-full border-none"
                  />
                )}
              </div>

              {/* Memory Data Fields */}
              <div className="space-y-3 text-[#16192e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#16192e]/20 pb-2">
                  <h3 className="text-base sm:text-lg font-pixel font-bold text-[#16192e]">
                    {selectedMemory.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#00f0ff] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold">
                      {selectedMemory.date}
                    </span>
                    <span className="px-2 py-0.5 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold">
                      {selectedMemory.tag || 'CO_OP'}
                    </span>
                  </div>
                </div>

                {selectedMemory.location && selectedMemory.location.trim() !== '' ? (
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#16192e]">
                    <MapPin className="w-4 h-4 text-[#f43f5e] shrink-0" />
                    <span>LOCATION: {selectedMemory.location}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#16192e]/60">
                    <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                    <span>LOCATION: [ UNCONFIGURED GEO DATA ]</span>
                  </div>
                )}

                <div className="p-3.5 bg-[#ffd000] border-3 border-[#16192e] brutal-shadow-sm">
                  <span className="text-[10px] font-pixel font-bold text-[#16192e] block mb-1">
                    MEMORY LOG ENTRY // CIPHER DECRYPTED:
                  </span>
                  {selectedMemory.description && selectedMemory.description.trim() !== '' ? (
                    <p className="text-sm font-mono text-[#16192e] leading-relaxed">
                      {selectedMemory.description}
                    </p>
                  ) : (
                    <div className="py-2.5 px-3 border-2 border-dashed border-[#16192e]/40 bg-[#fffdf0] text-center text-xs font-mono text-[#16192e]/70">
                      [ NO MEMORY LOG ENTERED YET — READY FOR USER INPUT IN BIRTHDAY DATA ]
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
                    <span className="opacity-60 block">RECIPIENT:</span>
                    <span className="text-[#16192e] font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
                  </div>
                  <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
                    <span className="opacity-60 block">INTEGRITY:</span>
                    <span className="text-[#16192e] font-bold">100% UNFORGETTABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-4 py-3 bg-[#ffd000] border-t-3 border-[#16192e] flex items-center justify-between font-pixel text-xs">
              <button
                type="button"
                onClick={handlePrevModal}
                className="px-3 py-1.5 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] font-bold uppercase brutal-btn-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV</span>
              </button>

              <span className="text-[10px] text-[#16192e] font-bold">
                SLOT {memoryDatabaseData.findIndex(m => m.id === selectedMemory.id) + 1} OF {memoryDatabaseData.length}
              </span>

              <button
                type="button"
                onClick={handleNextModal}
                className="px-3 py-1.5 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] font-bold uppercase brutal-btn-sm flex items-center gap-1 cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Navigation Footer Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-4 py-2.5 bg-[#fffdf0] border-3 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          ◀ PREV: ANIME ARCHIVE
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
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-5 py-2.5 bg-[#22c55e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          NEXT: MINI-GAME QUEST ▶
        </button>
      </div>

    </div>
  );
};
