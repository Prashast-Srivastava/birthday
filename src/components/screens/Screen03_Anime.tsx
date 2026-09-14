import React, { useState } from 'react';
import { motion } from 'motion/react';
import { animeArchiveData, birthdayConfig } from '../../birthdayData';
import { AnimeItem, ScreenIndex } from '../../types';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';
import { Film, Sparkles, Heart, Star, ArrowLeft, ArrowRight, BookmarkCheck } from 'lucide-react';

interface Screen03AnimeProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen03_Anime: React.FC<Screen03AnimeProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem>(animeArchiveData[0]);

  const categories = ['ALL', 'ISEKAI', 'ACTION', 'ROMCOM', 'FANTASY'];

  const filteredAnime = activeCategory === 'ALL'
    ? animeArchiveData
    : animeArchiveData.filter((item) => item.genre.toUpperCase().includes(activeCategory));

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    soundEngine.playKeyClick();
  };

  const handleSelectAnime = (item: AnimeItem) => {
    setSelectedAnime(item);
    soundEngine.playSelect();
  };

  return (
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      {/* Header Banner */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="dev-eyebrow-pill mb-2">
            <Film className="w-3.5 h-3.5 text-pink-500" />
            <span>ANIME ARCHIVE • OUR SHARED FAVORITES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 tracking-tight">
            Our Shared <span className="text-pink-600">Anime Favorites</span> 🍿
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md shadow-pink-300/40'
                  : 'bg-white/60 hover:bg-white text-slate-600 hover:text-pink-600 border border-white/80'
              }`}
            >
              {cat}
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
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-white/85 border-pink-300 shadow-xl shadow-pink-200/40 translate-x-1'
                    : 'bg-white/55 hover:bg-white/75 backdrop-blur-xl border-white/80 hover:border-pink-200 shadow-md shadow-pink-100/20'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-pink-600 uppercase mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {item.genre}
                    </div>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-slate-800 tracking-tight">
                      {item.title}
                    </h3>
                    {item.japaneseTitle && (
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">
                        {item.japaneseTitle}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-pink-100/60 flex items-center justify-between text-xs">
                  <span className="italic text-slate-600 truncate max-w-[75%] font-medium">
                    "{item.quote}"
                  </span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-pink-600' : 'text-slate-400'}`}>
                    {isSelected ? '● SELECTED' : 'VIEW DETAILS ▶'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Column: Spotlight & Memory Inspector */}
        <motion.div variants={cardVariants} className="lg:col-span-5 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-pink-100/40 relative">
          <div>
            <div className="border-b border-pink-100/60 pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                Spotlight // {selectedAnime.title}
              </span>
              <span className="dev-status-pill">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                WATCHED
              </span>
            </div>

            {/* Quote Box */}
            <div className="p-4 bg-pink-50/80 border border-pink-100 rounded-2xl my-3 shadow-xs">
              <div className="text-[11px] font-bold text-pink-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                Iconic Anime Quote:
              </div>
              <blockquote className="text-sm italic text-slate-700 leading-relaxed font-medium">
                "{selectedAnime.quote}"
              </blockquote>
            </div>

            {/* Details Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm mt-4">
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Genre:</span>
                <span className="font-bold text-slate-800">{selectedAnime.genre}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Tier Rating:</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100/80 border border-amber-200 px-3 py-0.5 rounded-full">
                  {selectedAnime.rating}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Anushka's Rating:</span>
                <span className="font-bold text-pink-600">10 / 10 Masterpiece ✨</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-medium">Watch Status:</span>
                <span className="font-bold text-emerald-600">Archived with Smiles</span>
              </div>
            </div>

            <div className="mt-5 p-4 bg-purple-50/70 border border-purple-100 rounded-2xl text-xs leading-relaxed text-slate-600 shadow-xs">
              <span className="font-bold text-purple-700 block mb-1 text-[11px] uppercase tracking-wider">SHARED ANIME MEMORY:</span>
              Countless marathons, tier-list debates, and voice impression laughs shared with <strong className="text-slate-800">{birthdayConfig.recipientName}</strong>. These shows are forever part of our story!
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-pink-100/60 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>MEMORIES LOGGED</span>
            <span className="text-pink-600">STAGE 03 / 07</span>
          </div>
        </motion.div>

      </div>

      {/* Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.STATS);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: STATS</span>
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
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-2"
        >
          <span>NEXT: MEMORY ALBUM</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
};
