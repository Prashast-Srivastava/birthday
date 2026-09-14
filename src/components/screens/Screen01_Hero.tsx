import React, { useState } from 'react';
import { motion } from 'motion/react';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';
import { soundEngine } from '../../utils/audio';
import { ScreenIndex } from '../../types';
import { screenContainerVariants, cardVariants } from '../../utils/animations';
import { Sparkles, Heart, Star, Film, Image, Gamepad2, ArrowRight } from 'lucide-react';

interface HeroScreenProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen01_Hero: React.FC<HeroScreenProps> = ({ onNavigate }) => {
  const [speech, setSpeech] = useState<string>(
    `HAPPY BIRTHDAY ${birthdayConfig.recipientName}! TAP ME FOR PURRS & LOVE!`
  );

  const meowPhrases = [
    `HAPPY BIRTHDAY ${birthdayConfig.recipientName}! 🎉`,
    "ANOTHER YEAR, ANOTHER EPIC ADVENTURE COMPLETE! ✨",
    "DID YOU BRING CAKE? BIRTHDAY CAT REQUIRES CAKE! 🍰",
    "LEVEL 22 UNLOCKED! ALL STATS BUFFED WITH JOY! 💖",
    "BEST FRIEND PROTOCOL FOREVER ACTIVE! 🐾"
  ];

  const handleCatInteract = () => {
    const randomPhrase = meowPhrases[Math.floor(Math.random() * meowPhrases.length)];
    setSpeech(randomPhrase);
    soundEngine.playCoin();
  };

  const handleStartJourney = () => {
    soundEngine.playSelect();
    onNavigate(ScreenIndex.STATS);
  };

  return (
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center py-2 sm:py-4 select-none"
    >
      {/* Top Eyebrow Tag Row */}
      <motion.div variants={cardVariants} className="w-full flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="dev-eyebrow-pill">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>BIRTHDAY HUB • ANUSHKA'S 22ND CELEBRATION</span>
        </div>
        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <span>STAR OF THE DAY:</span>
          <span className="text-pink-600 font-bold px-2.5 py-0.5 bg-pink-100/80 rounded-full border border-pink-200">
            {birthdayConfig.recipientName} (LEVEL 22 ✨)
          </span>
        </div>
      </motion.div>

      {/* Main 3-Panel Dashboard Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 items-stretch">
        
        {/* Left HUD Panel: Target Parameters / Birthday Star Profile */}
        <motion.section
          variants={cardVariants}
          className="lg:col-span-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-pink-100/40"
        >
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-pink-100/60">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
                  Birthday Star Profile
                </h3>
              </div>
              <span className="dev-status-pill">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                CELEBRATING
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-bold uppercase text-[11px]">Birthday Girl</span>
                <span className="font-bold text-pink-600 bg-pink-100/80 border border-pink-200 px-3 py-0.5 rounded-full">
                  {birthdayConfig.recipientName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-bold uppercase text-[11px]">Milestone</span>
                <span className="font-bold text-purple-700 bg-purple-100/80 border border-purple-200 px-3 py-0.5 rounded-full">
                  Level 22 // Turning 22 ✨
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-bold uppercase text-[11px]">Special Day</span>
                <span className="font-semibold text-slate-700">{birthdayConfig.birthdayDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-bold uppercase text-[11px]">Friendship Sync</span>
                <span className="font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-3 py-0.5 rounded-full">
                  {birthdayConfig.friendshipLevel}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-bold uppercase text-[11px]">Best Friends Since</span>
                <span className="font-semibold text-slate-700">{birthdayConfig.friendSinceYear}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 bg-white/60 border border-white/80 rounded-2xl text-xs leading-relaxed text-slate-600 shadow-xs">
            <span className="font-bold text-pink-600 block mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> CELEBRATION MISSION:
            </span>
            Explore our shared memories, anime favorites, arcade mini-game, and unwrap the sweet birthday cake ceremony for <strong className="text-slate-800">{birthdayConfig.recipientName}</strong>.
          </div>
        </motion.section>

        {/* Center Panel: Pixel Cat Companion + Floating Pastel Balloons */}
        <motion.section
          variants={cardVariants}
          className="lg:col-span-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl shadow-pink-100/40 relative overflow-hidden"
        >
          {/* Corner Badges */}
          <div className="absolute top-4 left-5 text-[11px] font-bold text-pink-600 bg-pink-100/70 border border-pink-200 rounded-full px-2.5 py-0.5">
            PARTY CAT
          </div>
          <div className="absolute top-4 right-5 text-[11px] font-bold text-purple-600 bg-purple-100/70 border border-purple-200 rounded-full px-2.5 py-0.5">
            TAP TO PET
          </div>

          {/* Floating Pastel Balloons */}
          <div className="absolute top-10 left-5 pointer-events-none animate-balloon-float opacity-85" aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64">
              <rect x="6" y="0" width="24" height="28" rx="12" fill="#f472b6" />
              <rect x="10" y="4" width="6" height="6" rx="3" fill="#ffffff" fillOpacity="0.6" />
              <polygon points="18,28 14,32 22,32" fill="#f472b6" />
              <path d="M18,32 Q14,46 18,60" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <div className="absolute top-10 right-5 pointer-events-none animate-balloon-float opacity-85" style={{ animationDelay: '1.5s' }} aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64">
              <rect x="6" y="0" width="24" height="28" rx="12" fill="#c084fc" />
              <rect x="10" y="4" width="6" height="6" rx="3" fill="#ffffff" fillOpacity="0.6" />
              <polygon points="18,28 14,32 22,32" fill="#c084fc" />
              <path d="M18,32 Q22,46 18,60" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <div className="my-3">
            <PixelCat
              size="lg"
              partyHat={true}
              idleBob={true}
              showSpeech={true}
              speechText={speech}
              onClick={handleCatInteract}
            />
          </div>
        </motion.section>

        {/* Right HUD Panel: Mission Launch Actions */}
        <motion.section
          variants={cardVariants}
          className="lg:col-span-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-pink-100/40"
        >
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-pink-100/60">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
                  Celebration Tour
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-700 px-3 py-0.5 bg-purple-100/80 border border-purple-200 rounded-full">
                8 STAGES
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
                className="w-full text-left p-3 bg-white/60 hover:bg-white border border-white/80 hover:border-pink-300 rounded-2xl text-slate-700 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  <span>02 // Friendship Synergy</span>
                </div>
                <span className="text-slate-400 font-bold">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.ANIME); }}
                className="w-full text-left p-3 bg-white/60 hover:bg-white border border-white/80 hover:border-pink-300 rounded-2xl text-slate-700 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-purple-500" />
                  <span>03 // Anime Favorites</span>
                </div>
                <span className="text-slate-400 font-bold">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
                className="w-full text-left p-3 bg-white/60 hover:bg-white border border-white/80 hover:border-pink-300 rounded-2xl text-slate-700 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Image className="w-3.5 h-3.5 text-blue-500" />
                  <span>04 // Memory Album</span>
                </div>
                <span className="text-slate-400 font-bold">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
                className="w-full text-left p-3 bg-white/60 hover:bg-white border border-white/80 hover:border-pink-300 rounded-2xl text-slate-700 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>05 // Arcade Quest</span>
                </div>
                <span className="text-pink-500">★</span>
              </button>
            </div>
          </div>

          <div className="mt-5">
            <button
              id="btn-start-birthday-journey"
              type="button"
              onClick={handleStartJourney}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Start Birthday Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.section>

      </div>

      {/* Bottom 3 Bento Feature Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
          className="bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-pink-200 rounded-3xl p-6 transition-all cursor-pointer group shadow-lg shadow-pink-100/30 hover:shadow-xl hover:shadow-pink-200/40 hover:-translate-y-1"
        >
          <span className="inline-block text-[11px] font-bold text-pink-600 bg-pink-100/70 border border-pink-200 rounded-full px-2.5 py-0.5 mb-2">
            STAGE 02
          </span>
          <h4 className="font-heading text-base font-bold text-slate-800 group-hover:text-pink-600 mb-1.5 transition-colors">
            Friendship Synergy 💕
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Look back at hours of late night calls, hilarious anime tier-list arguments, and endless loyalty.
          </p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
          className="bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-purple-200 rounded-3xl p-6 transition-all cursor-pointer group shadow-lg shadow-purple-100/30 hover:shadow-xl hover:shadow-purple-200/40 hover:-translate-y-1"
        >
          <span className="inline-block text-[11px] font-bold text-purple-600 bg-purple-100/70 border border-purple-200 rounded-full px-2.5 py-0.5 mb-2">
            STAGE 04
          </span>
          <h4 className="font-heading text-base font-bold text-slate-800 group-hover:text-purple-600 mb-1.5 transition-colors">
            Cherished Memories 📸
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            8-card scrapbook album with polaroid snapshots and lovely memories from 2023 to 2026.
          </p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
          className="bg-white/55 hover:bg-white/75 backdrop-blur-xl border border-white/80 hover:border-amber-200 rounded-3xl p-6 transition-all cursor-pointer group shadow-lg shadow-amber-100/30 hover:shadow-xl hover:shadow-amber-200/40 hover:-translate-y-1"
        >
          <span className="inline-block text-[11px] font-bold text-amber-600 bg-amber-100/70 border border-amber-200 rounded-full px-2.5 py-0.5 mb-2">
            STAGE 05
          </span>
          <h4 className="font-heading text-base font-bold text-slate-800 group-hover:text-amber-600 mb-1.5 transition-colors">
            Catch the Birthday Cakes 🎮
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Catch falling cakes, stars, and sweet treats to unlock the 22nd birthday cake ceremony!
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};
