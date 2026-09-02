import React, { useState } from 'react';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';
import { soundEngine } from '../../utils/audio';
import { ScreenIndex } from '../../types';

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
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center py-2 sm:py-4 select-none">
      
      {/* Top Banner Tag */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-5 bg-[#ffd000] border-3 border-[#16192e] px-4 py-2.5 brutal-shadow">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#f43f5e] border-2 border-[#16192e] inline-block" />
          <span className="text-[10px] sm:text-xs font-pixel font-bold uppercase text-[#16192e] tracking-wider">
            SECTOR 01 // THE BIRTHDAY DASH // HERO HUB
          </span>
        </div>
        <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase">
          RECIPIENT: {birthdayConfig.recipientName} (LVL 22)
        </div>
      </div>

      {/* Main 3-Panel Dashboard Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 items-stretch">
        
        {/* Left HUD Panel: Target Parameters */}
        <section className="lg:col-span-4 bg-[#fffdf0] border-4 border-[#16192e] p-5 flex flex-col justify-between brutal-shadow-lg">
          <div>
            <div className="flex items-center justify-between bg-[#00f0ff] border-2 border-[#16192e] px-3 py-1.5 mb-4 brutal-shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
                <span className="text-xs font-pixel font-bold text-[#16192e] uppercase">
                  TARGET TELEMETRY
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-[#22c55e] border border-[#16192e] text-[#16192e] font-pixel font-bold text-[8px]">
                LOCKED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono text-[#16192e]">
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60 uppercase">PLAYER NAME:</span>
                <span className="font-pixel text-[11px] font-bold text-[#16192e] bg-[#ffd000] px-1 border border-[#16192e]">
                  {birthdayConfig.recipientName}
                </span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60 uppercase">CURRENT LEVEL:</span>
                <span className="font-bold text-[#16192e]">LEVEL 22 // TURNING 22</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60 uppercase">SYSTEM DATE:</span>
                <span className="font-bold text-[#16192e]">{birthdayConfig.birthdayDate}</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60 uppercase">FRIENDSHIP SYNC:</span>
                <span className="font-pixel text-[10px] font-bold text-[#22c55e]">
                  {birthdayConfig.friendshipLevel}
                </span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60 uppercase">CO-OP SINCE:</span>
                <span className="font-bold text-[#16192e]">{birthdayConfig.friendSinceYear}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 bg-[#ffd000] border-3 border-[#16192e] brutal-shadow-sm text-xs font-mono text-[#16192e] leading-relaxed">
            <span className="font-pixel font-bold block mb-1 text-[10px]">DIRECTIVE:</span>
            Clear all 8 birthday quest sectors to decrypt the Cake Ceremony & Decrypted Final Letter for <strong>{birthdayConfig.recipientName}</strong>.
          </div>
        </section>

        {/* Center Panel: Pixel Cat Companion + Ambient 8-bit Balloons */}
        <section className="lg:col-span-4 bg-[#fffdf0] border-4 border-[#16192e] p-6 flex flex-col items-center justify-center brutal-shadow-lg relative overflow-hidden">
          {/* Corner Tags */}
          <div className="absolute top-2.5 left-3 text-[9px] font-pixel font-bold text-[#16192e] opacity-70">
            SYS_CO-PILOT
          </div>
          <div className="absolute top-2.5 right-3 text-[9px] font-pixel font-bold text-[#16192e] opacity-70">
            AI_MASCOT
          </div>

          {/* Decorative 8-Bit Pixel Balloons Flanking the Cat */}
          <div className="absolute top-10 left-3 pointer-events-none animate-balloon-float" aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64" className="pixel-art">
              {/* Balloon 1: Purple */}
              <rect x="6" y="0" width="24" height="28" fill="#a855f7" stroke="#16192e" strokeWidth="2" />
              <rect x="10" y="4" width="6" height="6" fill="#ffffff" />
              <polygon points="18,28 14,32 22,32" fill="#a855f7" stroke="#16192e" strokeWidth="1.5" />
              <path d="M18,32 Q14,46 18,60" fill="none" stroke="#16192e" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <div className="absolute top-10 right-3 pointer-events-none animate-balloon-float" style={{ animationDelay: '1.5s' }} aria-hidden="true">
            <svg width="36" height="64" viewBox="0 0 36 64" className="pixel-art">
              {/* Balloon 2: Yellow */}
              <rect x="6" y="0" width="24" height="28" fill="#ffd000" stroke="#16192e" strokeWidth="2" />
              <rect x="10" y="4" width="6" height="6" fill="#ffffff" />
              <polygon points="18,28 14,32 22,32" fill="#ffd000" stroke="#16192e" strokeWidth="1.5" />
              <path d="M18,32 Q22,46 18,60" fill="none" stroke="#16192e" strokeWidth="1.5" strokeDasharray="2,2" />
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
        </section>

        {/* Right HUD Panel: Mission Launch Actions */}
        <section className="lg:col-span-4 bg-[#fffdf0] border-4 border-[#16192e] p-5 flex flex-col justify-between brutal-shadow-lg">
          <div>
            <div className="flex items-center justify-between bg-[#ffd000] border-2 border-[#16192e] px-3 py-1.5 mb-4 brutal-shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#22c55e] border border-[#16192e] inline-block" />
                <span className="text-xs font-pixel font-bold text-[#16192e] uppercase">
                  MISSION CONTROL
                </span>
              </div>
              <span className="text-[#16192e] font-pixel text-[9px] font-bold px-1.5 py-0.5 bg-white border border-[#16192e]">
                8 STAGES
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
                className="w-full text-left p-2.5 bg-[#fffdf0] hover:bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] font-pixel text-[10px] brutal-btn-sm flex items-center justify-between cursor-pointer"
              >
                <span>02 // FRIENDSHIP STATS</span>
                <span>▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.ANIME); }}
                className="w-full text-left p-2.5 bg-[#fffdf0] hover:bg-[#00f0ff] border-2 border-[#16192e] text-[#16192e] font-pixel text-[10px] brutal-btn-sm flex items-center justify-between cursor-pointer"
              >
                <span>03 // ANIME ARCHIVE</span>
                <span>▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
                className="w-full text-left p-2.5 bg-[#fffdf0] hover:bg-[#ff5e97] border-2 border-[#16192e] text-[#16192e] font-pixel text-[10px] brutal-btn-sm flex items-center justify-between cursor-pointer"
              >
                <span>04 // MEMORY DATABASE</span>
                <span>▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
                className="w-full text-left p-2.5 bg-[#fffdf0] hover:bg-[#22c55e] border-2 border-[#16192e] text-[#16192e] font-pixel text-[10px] brutal-btn-sm flex items-center justify-between cursor-pointer"
              >
                <span>05 // ARCADE QUEST</span>
                <span className="text-[#f43f5e]">★</span>
              </button>
            </div>
          </div>

          <div className="mt-5">
            <button
              id="btn-start-birthday-journey"
              type="button"
              onClick={handleStartJourney}
              className="w-full py-3.5 bg-[#22c55e] text-[#16192e] font-pixel text-xs sm:text-sm font-bold uppercase tracking-wider brutal-btn flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>[ START BIRTHDAY JOURNEY ]</span>
              <span>▶</span>
            </button>
          </div>
        </section>

      </div>

      {/* Bottom 3 Bento Feature Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
          className="bg-[#fffdf0] border-3 border-[#16192e] p-4 brutal-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform cursor-pointer"
        >
          <span className="block text-[9px] font-pixel font-bold text-[#16192e] opacity-60 mb-1">
            01 // ARCH
          </span>
          <h4 className="text-xs font-pixel font-bold text-[#16192e] mb-2 uppercase">
            FRIENDSHIP TELEMETRY
          </h4>
          <p className="text-xs font-mono leading-relaxed text-[#16192e]/80">
            Real-time calculation of shared gaming co-op hours, anime debates, and revive assist stats.
          </p>
        </div>

        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
          className="bg-[#fffdf0] border-3 border-[#16192e] p-4 brutal-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform cursor-pointer"
        >
          <span className="block text-[9px] font-pixel font-bold text-[#16192e] opacity-60 mb-1">
            02 // MEMORY
          </span>
          <h4 className="text-xs font-pixel font-bold text-[#16192e] mb-2 uppercase">
            DATABASE ARCHIVE
          </h4>
          <p className="text-xs font-mono leading-relaxed text-[#16192e]/80">
            8-slot encrypted photo gallery with 4:3 polaroid cartridges and retro asset fallback.
          </p>
        </div>

        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
          className="bg-[#fffdf0] border-3 border-[#16192e] p-4 brutal-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform cursor-pointer"
        >
          <span className="block text-[9px] font-pixel font-bold text-[#16192e] opacity-60 mb-1">
            03 // QUEST
          </span>
          <h4 className="text-xs font-pixel font-bold text-[#16192e] mb-2 uppercase">
            SAVE BIRTHDAY CAT
          </h4>
          <p className="text-xs font-mono leading-relaxed text-[#16192e]/80">
            5-lane arcade mini-game: catch falling cakes, stars, and fish to unlock the candle ceremony.
          </p>
        </div>
      </div>

    </div>
  );
};
