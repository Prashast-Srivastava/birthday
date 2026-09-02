import React, { useState, useEffect } from 'react';
import { Terminal, RotateCcw, Copy, Check, Sparkles, Heart, ShieldCheck, Home, Award, Printer, Share2 } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen07FinalMessageProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen07_FinalMessage: React.FC<Screen07FinalMessageProps> = ({ onNavigate }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const fullLetterText = birthdayConfig.finalLetter.fullMessage;

  // Typewriter effect
  useEffect(() => {
    if (isInstant) {
      setDisplayedText(fullLetterText);
      setIsTypingComplete(true);
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      currentIndex += 2; // Smooth 2-char typing speed
      if (currentIndex >= fullLetterText.length) {
        setDisplayedText(fullLetterText);
        setIsTypingComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedText(fullLetterText.slice(0, currentIndex));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullLetterText, isInstant]);

  const handleCopy = () => {
    soundEngine.playTone(750, 0.05, 'square', 0.08);
    navigator.clipboard.writeText(fullLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSkipTyping = () => {
    soundEngine.playSelect();
    setIsInstant(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Screen Top Header */}
      <div className="bg-[#ffd000] border-3 border-[#16192e] p-3 sm:p-4 mb-4 brutal-shadow relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#16192e]/20 pb-2.5">
          <div>
            <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
              SECTOR 07 // OFFICIAL TELEGRAM // CONFIDENTIAL TRANSMISSION
            </div>
            <h2 className="text-base sm:text-xl font-pixel font-black uppercase tracking-wide text-[#16192e] mt-0.5">
              BIRTHDAY TRANSMISSION DOCKET
            </h2>
          </div>

          <div className="flex items-center gap-2 font-pixel text-[10px]">
            <div className="bg-[#fffdf0] px-2.5 py-1 border-2 border-[#16192e] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span className="text-[#16192e] font-bold">256-BIT FRIENDSHIP ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* Telemetry Header Meta */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs font-mono">
          <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
            <span className="opacity-60 block text-[9px] font-bold">RECIPIENT:</span>
            <span className="text-[#16192e] font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
          </div>
          <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
            <span className="opacity-60 block text-[9px] font-bold">DATE OF AWAKENING:</span>
            <span className="text-[#16192e] font-bold">{birthdayConfig.birthdayDate}</span>
          </div>
          <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
            <span className="opacity-60 block text-[9px] font-bold">FRIENDSHIP LEVEL:</span>
            <span className="text-[#f43f5e] font-bold">{birthdayConfig.friendshipLevel}</span>
          </div>
          <div className="p-2 bg-[#fffdf0] border-2 border-[#16192e]">
            <span className="opacity-60 block text-[9px] font-bold">STATUS:</span>
            <span className="text-[#22c55e] font-bold">MISSION COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Main Telegram / Print Document Container */}
      <div className="relative border-4 border-[#16192e] bg-[#fffdf0] p-6 sm:p-10 brutal-shadow-lg min-h-[380px] flex flex-col justify-between overflow-hidden">
        
        {/* Vintage Postal / Ink Stamps */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2.5 pointer-events-none opacity-85 select-none z-10">
          <div className="border-3 border-[#f43f5e] text-[#f43f5e] font-pixel text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1 rotate-[-6deg] tracking-wider border-dashed">
            ★ TOP SECRET ★
          </div>
          <div className="border-3 border-[#22c55e] text-[#22c55e] font-pixel text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1 rotate-[4deg] tracking-wider">
            ✓ DELIVERED
          </div>
        </div>

        {/* Telegram Document Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between border-b-2 border-[#16192e] pb-3 mb-6 gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#16192e]" />
              <div>
                <span className="font-pixel font-bold text-xs sm:text-sm text-[#16192e] block">
                  TELEGRAM PROTOCOL // DOCKET_07.TXT
                </span>
                <span className="font-mono text-[10px] text-[#16192e]/60">
                  DISPATCHED VIA SECURE CYBER RELAY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTypingComplete && (
                <button
                  type="button"
                  onClick={handleSkipTyping}
                  className="px-2.5 py-1.5 bg-[#ffd000] border-2 border-[#16192e] text-[10px] font-pixel font-bold text-[#16192e] brutal-btn-sm cursor-pointer"
                >
                  [ FAST PRINT ]
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#22c55e] border-2 border-[#16192e] text-[10px] font-pixel font-bold text-[#16192e] brutal-btn-sm flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY LETTER'}</span>
              </button>
            </div>
          </div>

          {/* Letter Body (Typewriter Text on Paper) */}
          <div className="text-sm sm:text-base font-mono text-[#16192e] leading-relaxed space-y-4 whitespace-pre-line tracking-wide bg-white/70 p-4 sm:p-6 border-2 border-[#16192e]/20 relative">
            {displayedText}
            {!isTypingComplete && (
              <span className="inline-block w-2.5 h-4 bg-[#16192e] ml-1 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Verified Protocol Seal Badge & Replay Actions */}
        <div className="mt-8 pt-4 border-t-2 border-[#16192e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border-3 border-[#16192e] bg-[#ffd000] flex items-center justify-center brutal-shadow-sm">
              <Award className="w-6 h-6 text-[#16192e]" />
            </div>
            <div>
              <div className="text-xs font-pixel font-bold text-[#16192e] tracking-wide">
                CERTIFIED BEST FRIEND DOCKET
              </div>
              <div className="text-[10px] font-mono text-[#16192e]/70">
                SERIAL: NEKO-2026-LVL22-ANUSHKA • PERMANENT ARCHIVE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playFanfare();
                onNavigate(ScreenIndex.CAKE);
              }}
              className="px-3.5 py-2 bg-[#ff5e97] text-white border-2 border-[#16192e] text-[10px] font-pixel font-bold brutal-btn-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>REPLAY CAKE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPowerUp();
                onNavigate(ScreenIndex.BOOT);
              }}
              className="px-3.5 py-2 bg-[#22c55e] text-[#16192e] border-2 border-[#16192e] text-[10px] font-pixel font-bold brutal-btn-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REBOOT OS [REPLAY ALL]</span>
            </button>
          </div>
        </div>

      </div>

      {/* Friendship Stats Recap Bar */}
      <div className="mt-4 p-3 bg-[#ffd000] border-3 border-[#16192e] brutal-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {friendshipStats.map((stat, idx) => (
          <div key={idx} className="flex flex-col bg-[#fffdf0] p-2 border-2 border-[#16192e]">
            <span className="text-[9px] font-bold text-[#16192e]/70 truncate">{stat.label}</span>
            <span className="text-xs sm:text-sm font-pixel font-bold text-[#16192e]">{stat.displayValue}</span>
          </div>
        ))}
      </div>

      {/* Bottom Screen Navigation Bar */}
      <div className="mt-4 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-3.5 py-2 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm cursor-pointer"
        >
          ◀ PREV: BIRTHDAY CAKE
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-3.5 py-2 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>HERO HUB</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.BOOT);
          }}
          className="px-4 py-2 bg-[#22c55e] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>REBOOT NEKO.EXE</span>
        </button>
      </div>

    </div>
  );
};
