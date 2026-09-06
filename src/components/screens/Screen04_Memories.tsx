import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ScreenIndex, MemoryItem } from '../../types';
import { birthdayConfig, memoryDatabaseData } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { MissingAssetPlaceholder } from '../common/MissingAssetPlaceholder';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';

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
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Screen Header Banner */}
      <motion.div variants={cardVariants} className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="dev-eyebrow-pill mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
            <span>SECTOR 04 // 8 MEMORY CARTRIDGES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#f5f5f7] tracking-tight">
            Memory Database // <span className="text-[#f5a524]">Co-Op Logs</span>
          </h2>
        </div>
        <span className="dev-status-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
          8 / 8 CARTRIDGES
        </span>
      </motion.div>

      {/* 8-Card Uniform 4:3 Polaroid/Cartridge Tile Grid */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredMemories.map((mem, index) => {
          const isHovered = hoveredCardId === mem.id;
          const slotNumber = String(index + 1).padStart(2, '0');

          return (
            <motion.div
              key={mem.id}
              variants={itemVariants}
              id={`memory-card-${mem.id}`}
              onClick={() => handleOpenModal(mem)}
              onMouseEnter={() => {
                setHoveredCardId(mem.id);
                soundEngine.playTone(320 + index * 40, 0.04, 'sine', 0.03);
              }}
              onMouseLeave={() => setHoveredCardId(null)}
              className="dev-card group relative bg-[#121723]/90 hover:bg-[#1a1f2e]/80 border border-[#ffffff1a] hover:border-[#ffffff2a] rounded-xl transition-all duration-150 cursor-pointer flex flex-col overflow-hidden select-none shadow-md hover:shadow-xl"
            >
              {/* Card Header Tag Bar */}
              <div className="px-3.5 py-2 bg-[#1a1f2e] border-b border-[#ffffff1a] flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#f5f5f7]">
                  SLOT_{slotNumber}
                </span>
                <span className="px-2 py-0.5 bg-[#f5a524]/10 text-[#f5a524] border border-[#f5a524]/30 rounded-full text-[10px] font-medium uppercase">
                  {mem.tag || 'ARCHIVE'}
                </span>
              </div>

              {/* Fixed 4:3 Aspect Ratio Viewport */}
              <div className="relative w-full aspect-[4/3] bg-[#0a0e17] overflow-hidden flex items-center justify-center border-b border-[#ffffff1a]">
                {mem.imageUrl && mem.imageUrl.trim() !== '' ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <div className="absolute inset-0 bg-[#0a0e17]/60 pointer-events-none flex items-center justify-center backdrop-blur-[2px] transition-all">
                    <div className="px-3 py-1 bg-[#121723] border border-[#ffffff1a] text-[#f5f5f7] text-xs font-mono rounded-lg flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#f5a524]" />
                      <span>INSPECT</span>
                    </div>
                  </div>
                )}

                {/* Slot date badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#121723]/90 backdrop-blur-sm border border-[#ffffff1a] rounded text-[#9ca3af] text-[10px] font-mono">
                  {mem.date}
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between text-[#f5f5f7]">
                <div>
                  <h3 className="text-sm font-semibold text-[#f5f5f7] truncate">
                    {mem.title}
                  </h3>
                  
                  {mem.location && mem.location.trim() !== '' ? (
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#9ca3af] truncate">
                      <MapPin className="w-3 h-3 text-[#f5a524] shrink-0" />
                      <span className="truncate">{mem.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#9ca3af]/60 truncate">
                      <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                      <span className="truncate">[ LOCATION UNSET ]</span>
                    </div>
                  )}

                  {mem.description && mem.description.trim() !== '' ? (
                    <p className="mt-2 text-xs font-mono text-[#9ca3af] leading-relaxed line-clamp-2">
                      {mem.description}
                    </p>
                  ) : (
                    <div className="mt-2 p-1.5 border border-dashed border-[#ffffff1a] rounded bg-[#1a1f2e]/40 text-[11px] font-mono text-[#9ca3af]/60 text-center">
                      <span>[ PENDING ENTRY ]</span>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#ffffff0f] flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                  <span className="text-[#9ca3af]">SLOT {slotNumber}</span>
                  <span className="font-medium group-hover:text-[#f5a524] group-hover:translate-x-0.5 transition-all">
                    EXPAND ▶
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modal Hologram Cartridge Viewer */}
      {selectedMemory && (
        <div
          id="memory-modal-backdrop"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-[#0a0e17]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <div
            id="memory-modal-content"
            onClick={e => e.stopPropagation()}
            className="dev-card relative w-full max-w-2xl bg-[#121723] border border-[#ffffff1a] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Modal Title Bar */}
            <div className="px-5 py-3.5 bg-[#1a1f2e] border-b border-[#ffffff1a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f5a524]" />
                <span className="text-xs font-mono font-medium text-[#f5f5f7] uppercase tracking-wider">
                  Decrypted Cartridge // {selectedMemory.tag || 'ARCHIVE'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-[#ffffff1a] rounded-lg text-[#f5f5f7] text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLOSE [ESC]</span>
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* 4:3 Image Viewport */}
              <div className="relative w-full aspect-[4/3] bg-[#0a0e17] border border-[#ffffff1a] rounded-xl overflow-hidden flex items-center justify-center">
                {selectedMemory.imageUrl && selectedMemory.imageUrl.trim() !== '' ? (
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
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
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ffffff1a] pb-3">
                  <h3 className="text-lg sm:text-xl font-sans font-bold text-[#f5f5f7]">
                    {selectedMemory.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-white/5 border border-[#ffffff1a] rounded-full text-[#f5f5f7] text-xs font-mono">
                      {selectedMemory.date}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#f5a524]/10 text-[#f5a524] border border-[#f5a524]/30 rounded-full text-xs font-mono">
                      {selectedMemory.tag || 'CO_OP'}
                    </span>
                  </div>
                </div>

                {selectedMemory.location && selectedMemory.location.trim() !== '' ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
                    <MapPin className="w-4 h-4 text-[#f5a524] shrink-0" />
                    <span>LOCATION: {selectedMemory.location}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]/60">
                    <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                    <span>LOCATION: [ UNCONFIGURED GEO DATA ]</span>
                  </div>
                )}

                <div className="p-4 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl">
                  <span className="text-[11px] font-mono font-semibold text-[#f5a524] block mb-1 uppercase tracking-wider">
                    Memory Log Entry // Cipher Decrypted:
                  </span>
                  {selectedMemory.description && selectedMemory.description.trim() !== '' ? (
                    <p className="text-sm font-sans text-[#f5f5f7] leading-relaxed">
                      {selectedMemory.description}
                    </p>
                  ) : (
                    <div className="py-3 px-3 border border-dashed border-[#ffffff1a] rounded-lg bg-[#121723]/40 text-center text-xs font-mono text-[#9ca3af]/70">
                      [ NO MEMORY LOG ENTERED YET — READY FOR USER INPUT IN BIRTHDAY DATA ]
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="p-3 bg-[#1a1f2e]/60 border border-[#ffffff1a] rounded-lg">
                    <span className="text-[#9ca3af] block text-[11px]">RECIPIENT:</span>
                    <span className="text-[#f5f5f7] font-medium">{birthdayConfig.recipientName} (LVL 22)</span>
                  </div>
                  <div className="p-3 bg-[#1a1f2e]/60 border border-[#ffffff1a] rounded-lg">
                    <span className="text-[#9ca3af] block text-[11px]">INTEGRITY:</span>
                    <span className="text-[#4ade80] font-medium">100% UNFORGETTABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-5 py-3.5 bg-[#1a1f2e] border-t border-[#ffffff1a] flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={handlePrevModal}
                className="px-3 py-1.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] text-[#f5f5f7] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV</span>
              </button>

              <span className="text-xs text-[#9ca3af]">
                SLOT {memoryDatabaseData.findIndex(m => m.id === selectedMemory.id) + 1} OF {memoryDatabaseData.length}
              </span>

              <button
                type="button"
                onClick={handleNextModal}
                className="px-3 py-1.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] text-[#f5f5f7] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          ◀ PREV: ANIME ARCHIVE
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
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl shadow-lg shadow-[#f5a524]/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          NEXT: MINI-GAME QUEST ▶
        </button>
      </motion.div>

    </motion.div>
  );
};
