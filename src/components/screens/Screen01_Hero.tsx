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
    "SYSTEM OVERLOAD: MAXIMUM HAPPINESS DETECTED!",
    "LEVEL 22 UNLOCKED! STATS PERMANENTLY BUFFED!"
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
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center py-4">
      
      {/* Top Pre-header Status Bar */}
      <div className="w-full flex items-center justify-between border-b border-[#4ade80]/20 pb-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#4ade80] inline-block animate-pulse shadow-[0_0_8px_#4ade80]" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] font-bold uppercase font-mono text-[#4ade80]">
            INITIALIZING THE BIRTHDAY DASH....
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#fbbf24] tracking-widest uppercase">
          RECIPIENT: {birthdayConfig.recipientName}
        </div>
      </div>

      {/* Main 3-Panel Dashboard Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 items-stretch">
        
        {/* Left HUD Panel: Target Parameters */}
        <section className="lg:col-span-4 bg-[#080a08]/90 border border-[#4ade80]/30 p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(74,222,128,0.05)]">
          <div>
            <div className="flex items-center justify-between border-b border-[#4ade80]/20 pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#4ade80] uppercase">
                  TARGET_TELEMETRY
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#4ade80] text-black font-bold text-[9px]">
                LOCKED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50 uppercase">PLAYER_NAME:</span>
                <span className="text-[#fbbf24] font-bold tracking-wider">{birthdayConfig.recipientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50 uppercase">CURRENT_LEVEL:</span>
                <span className="text-[#4ade80] font-bold">LEVEL 22 // TURNING 22</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50 uppercase">SYSTEM_DATE:</span>
                <span className="text-white tracking-wider">{birthdayConfig.birthdayDate}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50 uppercase">FRIENDSHIP_SYNC:</span>
                <span className="text-[#4ade80] font-bold">{birthdayConfig.friendshipLevel}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50 uppercase">CO-OP_SINCE:</span>
                <span className="text-[#fbbf24] font-bold">{birthdayConfig.friendSinceYear}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[11px] font-mono text-[#4ade80] leading-relaxed">
            <span className="font-bold block mb-0.5 text-[#fbbf24]">DIRECTIVE:</span>
            Execute full 8-screen protocol loop to unlock the cake ceremony & personal letter for <strong className="text-white">{birthdayConfig.recipientName}</strong>.
          </div>
        </section>

        {/* Center Panel: Pixel Cat Companion */}
        <section className="lg:col-span-4 bg-[#080a08]/90 border border-[#4ade80]/30 p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.05)] relative">
          <div className="absolute top-2 left-2 text-[8px] font-mono opacity-40 text-[#4ade80]">
            SYS_CO-PILOT
          </div>
          <div className="absolute top-2 right-2 text-[8px] font-mono opacity-40 text-[#4ade80]">
            AI_MASCOT
          </div>

          <PixelCat
            size="lg"
            partyHat={true}
            showSpeech={true}
            speechText={speech}
            onClick={handleCatInteract}
          />
        </section>

        {/* Right HUD Panel: Mission Launch Actions */}
        <section className="lg:col-span-4 bg-[#080a08]/90 border border-[#4ade80]/30 p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(74,222,128,0.05)]">
          <div>
            <div className="flex items-center justify-between border-b border-[#4ade80]/20 pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#4ade80] uppercase">
                  MISSION_CONTROL
                </span>
              </div>
              <span className="text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 border border-[#fbbf24]/40">
                8 STAGES
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
                className="w-full text-left p-2.5 bg-[#121412] hover:bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#4ade80] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>02 // FRIENDSHIP STATS</span>
                <span className="opacity-40 group-hover:opacity-100">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.ANIME); }}
                className="w-full text-left p-2.5 bg-[#121412] hover:bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#4ade80] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>03 // ANIME ARCHIVE</span>
                <span className="opacity-40 group-hover:opacity-100">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
                className="w-full text-left p-2.5 bg-[#121412] hover:bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#4ade80] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>04 // MEMORY DATABASE</span>
                <span className="opacity-40 group-hover:opacity-100">▶</span>
              </button>

              <button
                type="button"
                onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
                className="w-full text-left p-2.5 bg-[#121412] hover:bg-[#4ade80]/15 border border-[#4ade80]/30 text-[#4ade80] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>05 // SAVE THE BIRTHDAY CAT</span>
                <span className="text-[#fbbf24]">★</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button
              id="btn-start-birthday-journey"
              type="button"
              onClick={handleStartJourney}
              className="w-full py-3.5 bg-[#4ade80] text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(74,222,128,0.7)] hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>[ START BIRTHDAY JOURNEY ]</span>
              <span>▶</span>
            </button>
          </div>
        </section>

      </div>

      {/* Bottom Bento Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.STATS); }}
          className="border border-[#4ade80]/30 p-4 hover:bg-[#4ade80]/5 transition-colors cursor-crosshair"
        >
          <span className="block text-[10px] opacity-50 mb-1 tracking-[0.2em] text-[#4ade80]">01 // ARCH</span>
          <h4 className="text-sm font-bold mb-2 tracking-wider text-[#4ade80]">FRIENDSHIP TELEMETRY</h4>
          <p className="text-[11px] leading-relaxed opacity-70 text-[#4ade80]">
            Real-time calculation of shared gaming hours, anime debates & revive support rates.
          </p>
        </div>

        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MEMORIES); }}
          className="border border-[#4ade80]/30 p-4 hover:bg-[#4ade80]/5 transition-colors cursor-crosshair"
        >
          <span className="block text-[10px] opacity-50 mb-1 tracking-[0.2em] text-[#4ade80]">02 // MEMORY</span>
          <h4 className="text-sm font-bold mb-2 tracking-wider text-[#4ade80]">DATABASE ARCHIVE</h4>
          <p className="text-[11px] leading-relaxed opacity-70 text-[#4ade80]">
            8-slot encrypted photo database with 4:3 fixed aspect ratio & glitch inspect modal.
          </p>
        </div>

        <div 
          onClick={() => { soundEngine.playSelect(); onNavigate(ScreenIndex.MINIGAME); }}
          className="border border-[#4ade80]/30 p-4 hover:bg-[#4ade80]/5 transition-colors cursor-crosshair"
        >
          <span className="block text-[10px] opacity-50 mb-1 tracking-[0.2em] text-[#4ade80]">03 // QUEST</span>
          <h4 className="text-sm font-bold mb-2 tracking-wider text-[#4ade80]">SAVE BIRTHDAY CAT</h4>
          <p className="text-[11px] leading-relaxed opacity-70 text-[#4ade80]">
            Arcade mini-game: catch cakes & stars to decrypt the Birthday Ceremony level.
          </p>
        </div>
      </div>

    </div>
  );
};


