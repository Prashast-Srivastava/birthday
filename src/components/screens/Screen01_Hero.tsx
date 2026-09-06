import React, { useState } from 'react';
import { motion } from 'motion/react';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';
import { soundEngine } from '../../utils/audio';
import { ScreenIndex } from '../../types';
import { screenContainerVariants, cardVariants } from '../../utils/animations';

interface HeroScreenProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen01_Hero: React.FC<HeroScreenProps> = ({ onNavigate }) => {
  const [speech, setSpeech] = useState<string>(
    `HAPPY BIRTHDAY ${birthdayConfig.recipientName}! CLICK ME FOR PURRS!`
  );

  const meowPhrases = [
    `HAPPY BIRTHDAY ${birthdayConfig.recipientName}!`,
    "ANOTHER YEAR, ANOTHER EPIC BOSS DEFEATED!",
    "DID YOU BRING CAKE? BIRTHDAY CAT REQUIRES CAKE!",
    "LEVEL 22 UNLOCKED! STATS PERMANENTLY BUFFED!",
    "CO-OP ADVENTURE CONTINUES! BEST FRIEND PROTOCOL ACTIVE!"
  ];

  const handleCatInteract = () => {
    const randomPhrase = meowPhrases[Math.floor(Math.random() * meowPhrases.length)];
    setSpeech(randomPhrase);
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
          <span>SECTOR 01 // THE BIRTHDAY DASH · HERO HUB</span>
        </div>
        <div className="text-xs font-mono text-[#9ca3af]">
          RECIPIENT: <span className="text-[#f5f5f7] font-semibold">{birthdayConfig.recipientName}</span> (LVL 22)
        </div>
      </motion.div>

      {/* Main 3-Panel Dashboard Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 items-stretch">
        
        {/* Left HUD Panel: Target Parameters */}
        <motion.section variants={cardVariants} className="lg:col-span-4 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#ffffff1a]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f5a524]" />
                <span className="text-xs font-mono font-semibold text-[#f5f5f7] uppercase tracking-wider">
                  Target Telemetry
                </span>
              </div>
              <span className="dev-status-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                LOCKED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af] uppercase text-[11px]">Player Name</span>
                <span className="font-semibold text-[#f5a524] bg-[#f5a524]/10 border border-[#f5a524]/30 px-2 py-0.5 rounded text-xs">
                  {birthdayConfig.recipientName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af] uppercase text-[11px]">Current Level</span>
                <span className="font-medium text-[#f5f5f7]">Level 22 // Turning 22</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af] uppercase text-[11px]">System Date</span>
                <span className="font-medium text-[#f5f5f7]">{birthdayConfig.birthdayDate}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af] uppercase text-[11px]">Friendship Sync</span>
                <span className="font-semibold text-[#4ade80]">
                  {birthdayConfig.friendshipLevel}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#9ca3af] uppercase text-[11px]">Co-Op Since</span>
                <span className="font-medium text-[#f5f5f7]">{birthdayConfig.friendSinceYear}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg text-xs leading-relaxed text-[#9ca3af]">
            <span className="font-mono font-semibold text-[#f5a524] block mb-1 text-[11px] uppercase tracking-wider">DIRECTIVE:</span>
            Clear all 8 birthday quest sectors to decrypt the Cake Ceremony & Decrypted Final Letter for <strong className="text-[#f5f5f7]">{birthdayConfig.recipientName}</strong>.
          </div>
        </motion.section>

        {/* Center Panel: Pixel Cat Companion + Ambient 8-bit Balloons */}
        <motion.section variants={cardVariants} className="lg:col-span-4 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-6 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
          {/* Corner Tags */}
          <div className="absolute top-3 left-4 text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider">
            SYS_CO-PILOT
          </div>
          <div className="absolute top-3 right-4 text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider">
            AI_MASCOT
          </div>

          {/* Decorative 8-Bit Pixel Balloons Flanking the Cat */}
          <div className="absolute top-10 left-4 pointer-events-none animate-balloon-float opacity-80" aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64" className="pixel-art">
              <rect x="6" y="0" width="24" height="28" fill="#a855f7" stroke="#121723" strokeWidth="2" />
              <rect x="10" y="4" width="6" height="6" fill="#ffffff" />
              <polygon points="18,28 14,32 22,32" fill="#a855f7" stroke="#121723" strokeWidth="1.5" />
              <path d="M18,32 Q14,46 18,60" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <div className="absolute top-10 right-4 pointer-events-none animate-balloon-float opacity-80" style={{ animationDelay: '1.5s' }} aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64" className="pixel-art">
              <rect x="6" y="0" width="24" height="28" fill="#f5a524" stroke="#121723" strokeWidth="2" />
              <rect x="10" y="4" width="6" height="6" fill="#ffffff" />
              <polygon points="18,28 14,32 22,32" fill="#f5a524" stroke="#121723" strokeWidth="1.5" />
              <path d="M18,32 Q22,46 18,60" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <PixelCat
            size="lg"
            partyHat={true}
            idleBob={true}
            showSpeech={true}
            speechText={speech}
            onClick={handleCatInteract}
          />
        </motion.section>

        {/* Right HUD Panel: Mission Launch Actions */}
        <motion.section variants={cardVariants} className="lg:col-span-4 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#ffffff1a]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                <span className="text-xs font-mono font-semibold text-[#f5f5f7] uppercase tracking-wider">
                  Mission Control
                </span>
              </div>
              <span className="text-xs font-mono text-[#9ca3af] px-2 py-0.5 bg-white/5 border border-[#ffffff1a] rounded-full">
                8 STAGES
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
                className="w-full text-left p-2.5 bg-[#1a1f2e] hover:bg-white/5 border border-[#ffffff1a] hover:border-[#f5a524]/40 rounded-lg text-[#f5f5f7] text-xs font-mono flex items-center justify-between cursor-pointer transition-all"
              >
                <span>02 // FRIENDSHIP STATS</span>
                <span className="text-[#9ca3af]">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.ANIME); }}
                className="w-full text-left p-2.5 bg-[#1a1f2e] hover:bg-white/5 border border-[#ffffff1a] hover:border-[#f5a524]/40 rounded-lg text-[#f5f5f7] text-xs font-mono flex items-center justify-between cursor-pointer transition-all"
              >
                <span>03 // ANIME ARCHIVE</span>
                <span className="text-[#9ca3af]">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
                className="w-full text-left p-2.5 bg-[#1a1f2e] hover:bg-white/5 border border-[#ffffff1a] hover:border-[#f5a524]/40 rounded-lg text-[#f5f5f7] text-xs font-mono flex items-center justify-between cursor-pointer transition-all"
              >
                <span>04 // MEMORY DATABASE</span>
                <span className="text-[#9ca3af]">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
                className="w-full text-left p-2.5 bg-[#1a1f2e] hover:bg-white/5 border border-[#ffffff1a] hover:border-[#f5a524]/40 rounded-lg text-[#f5f5f7] text-xs font-mono flex items-center justify-between cursor-pointer transition-all"
              >
                <span>05 // ARCADE QUEST</span>
                <span className="text-[#f5a524]">★</span>
              </button>
            </div>
          </div>

          <div className="mt-5">
            <button
              id="btn-start-birthday-journey"
              type="button"
              onClick={handleStartJourney}
              className="w-full py-3 px-4 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] font-semibold text-sm rounded-xl shadow-lg shadow-[#f5a524]/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <span>Start Birthday Journey</span>
              <span className="text-xs">▶</span>
            </button>
          </div>
        </motion.section>

      </div>

      {/* Bottom 3 Bento Feature Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
          className="dev-card bg-[#121723]/80 hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-[#ffffff2a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <span className="block text-[10px] font-mono font-medium text-[#f5a524] mb-1.5 uppercase tracking-wider">
            01 // ARCH
          </span>
          <h4 className="text-sm font-semibold text-[#f5f5f7] group-hover:text-[#f5a524] mb-2 transition-colors">
            Friendship Telemetry
          </h4>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            Real-time calculation of shared gaming co-op hours, anime debates, and revive assist stats.
          </p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
          className="dev-card bg-[#121723]/80 hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-[#ffffff2a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <span className="block text-[10px] font-mono font-medium text-[#f5a524] mb-1.5 uppercase tracking-wider">
            02 // MEMORY
          </span>
          <h4 className="text-sm font-semibold text-[#f5f5f7] group-hover:text-[#f5a524] mb-2 transition-colors">
            Database Archive
          </h4>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            8-slot encrypted photo gallery with 4:3 polaroid cartridges and retro asset fallback.
          </p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
          className="dev-card bg-[#121723]/80 hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-[#ffffff2a] rounded-xl p-5 transition-all cursor-pointer group shadow-lg"
        >
          <span className="block text-[10px] font-mono font-medium text-[#f5a524] mb-1.5 uppercase tracking-wider">
            03 // QUEST
          </span>
          <h4 className="text-sm font-semibold text-[#f5f5f7] group-hover:text-[#f5a524] mb-2 transition-colors">
            Save Birthday Cat
          </h4>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            5-lane arcade mini-game: catch falling cakes, stars, and fish to unlock the candle ceremony.
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};
