import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, ChevronLeft, ChevronRight, Eye, Sparkles, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
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

  const tags = ['ALL', 'TRIP', 'CO-OP', 'PARTY', 'MEMORY'];

  const filteredMemories = activeFilter === 'ALL'
    ? memoryDatabaseData
    : memoryDatabaseData.filter(m => (m.tag || '').toUpperCase().includes(activeFilter));

  const handleOpenModal = (mem: MemoryItem) => {
    soundEngine.playSelect();
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
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="dev-eyebrow-pill mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>MEMORY ALBUM • 8 CHERISHED MOMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 tracking-tight">
            Cherished Moments & <span className="text-pink-600">Memories</span> 📸
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="dev-status-pill">
            <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            8 / 8 PHOTOS SAVED
          </span>
        </div>
      </motion.div>

      {/* 8-Card Uniform 4:3 Polaroid/Cartridge Tile Grid */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              className="bg-white/55 hover:bg-white/80 backdrop-blur-xl border border-white/80 hover:border-pink-200 rounded-3xl p-3.5 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden shadow-lg shadow-pink-100/30 hover:shadow-xl hover:shadow-pink-200/40 hover:-translate-y-1"
            >
              {/* Card Header Tag Bar */}
              <div className="px-2 py-1.5 flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">
                  Moment #{slotNumber}
                </span>
                <span className="px-2.5 py-0.5 bg-pink-100/80 text-pink-600 border border-pink-200 rounded-full text-[10px] font-bold uppercase">
                  {mem.tag || 'MEMORY'}
                </span>
              </div>

              {/* Fixed 4:3 Aspect Ratio Viewport */}
              <div className="relative w-full aspect-[4/3] bg-pink-50/50 rounded-2xl overflow-hidden flex items-center justify-center border border-white/80 shadow-inner">
                {mem.imageUrl && mem.imageUrl.trim() !== '' ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <MissingAssetPlaceholder
                    label="Special Moment"
                    subLabel="4:3 Memory Photo"
                    className="h-full border-none rounded-2xl"
                  />
                )}

                {/* Hover inspect pill */}
                {isHovered && (
                  <div className="absolute inset-0 bg-pink-900/20 backdrop-blur-[2px] pointer-events-none flex items-center justify-center transition-all">
                    <div className="px-4 py-1.5 bg-white/90 border border-white text-pink-700 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-pink-200/50">
                      <Eye className="w-3.5 h-3.5 text-pink-500" />
                      <span>OPEN PHOTO</span>
                    </div>
                  </div>
                )}

                {/* Slot date badge */}
                {mem.date && mem.date.trim() !== '' ? (
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-white/85 backdrop-blur-md border border-white/80 rounded-full text-slate-600 text-[10px] font-bold shadow-xs">
                    {mem.date}
                  </div>
                ) : null}
              </div>

              {/* Card Meta Body */}
              <div className="pt-3 px-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-heading font-bold text-slate-800 truncate">
                    {mem.title}
                  </h3>
                  
                  {mem.location && mem.location.trim() !== '' ? (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium truncate">
                      <MapPin className="w-3 h-3 text-pink-500 shrink-0" />
                      <span className="truncate">{mem.location}</span>
                    </div>
                  ) : null}

                  {mem.description && mem.description.trim() !== '' ? (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                      {mem.description}
                    </p>
                  ) : (
                    <div className="mt-2 p-1.5 border border-dashed border-pink-200 rounded-xl bg-pink-50/50 text-[11px] text-pink-600 text-center font-medium">
                      <span>Memories from our adventures</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-pink-100/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 text-[11px]">#{slotNumber}</span>
                  <span className="text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    Expand <span>♥</span>
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
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div
            id="memory-modal-content"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-2xl shadow-pink-200/50 flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Modal Title Bar */}
            <div className="px-6 py-4 bg-white/70 border-b border-pink-100/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Memory Snapshot // {selectedMemory.tag || 'MEMORY'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-pink-100/80 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* 4:3 Image Viewport */}
              <div className="relative w-full aspect-[4/3] bg-pink-50 rounded-2xl border border-white/80 overflow-hidden flex items-center justify-center shadow-inner">
                {selectedMemory.imageUrl && selectedMemory.imageUrl.trim() !== '' ? (
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MissingAssetPlaceholder
                    label="Special Memory Photo"
                    subLabel="Ready for Anushka's favorite photo"
                    className="h-full border-none rounded-2xl"
                  />
                )}
              </div>

              {/* Memory Data Fields */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100/80 pb-3">
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-800">
                    {selectedMemory.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedMemory.date && selectedMemory.date.trim() !== '' ? (
                      <span className="px-3 py-1 bg-white border border-pink-200 rounded-full text-slate-700 text-xs font-bold">
                        {selectedMemory.date}
                      </span>
                    ) : null}
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 border border-pink-200 rounded-full text-xs font-bold">
                      {selectedMemory.tag || 'CO-OP'}
                    </span>
                  </div>
                </div>

                {selectedMemory.location && selectedMemory.location.trim() !== '' ? (
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Location: {selectedMemory.location}</span>
                  </div>
                ) : null}

                <div className="p-4 bg-pink-50/70 border border-pink-100 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-bold text-pink-700 block mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Memory Story:
                  </span>
                  {selectedMemory.description && selectedMemory.description.trim() !== '' ? (
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {selectedMemory.description}
                    </p>
                  ) : (
                    <div className="py-2 text-xs text-slate-500">
                      An unforgettable shared moment with {birthdayConfig.recipientName}!
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
                    <span className="text-slate-400 block text-[11px] font-bold">RECIPIENT</span>
                    <span className="text-slate-800 font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
                  </div>
                  <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
                    <span className="text-slate-400 block text-[11px] font-bold">MEMORY STATUS</span>
                    <span className="text-emerald-600 font-bold">100% Unforgettable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-6 py-3.5 bg-white/80 border-t border-pink-100/80 flex items-center justify-between text-xs font-bold">
              <button
                type="button"
                onClick={handlePrevModal}
                className="px-4 py-1.5 bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4 text-pink-500" />
                <span>PREV</span>
              </button>

              <span className="text-xs text-slate-500">
                PHOTO {memoryDatabaseData.findIndex(m => m.id === selectedMemory.id) + 1} OF {memoryDatabaseData.length}
              </span>

              <button
                type="button"
                onClick={handleNextModal}
                className="px-4 py-1.5 bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4 text-pink-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: ANIME ARCHIVE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="hidden sm:flex px-4 py-2 bg-white/50 hover:bg-white text-slate-600 text-xs font-bold rounded-full border border-white/70"
        >
          HERO HUB
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-2"
        >
          <span>NEXT: ARCADE QUEST</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

    </motion.div>
  );
};
