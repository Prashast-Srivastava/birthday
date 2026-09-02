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
      <div className="border border-[#4ade80]/40 bg-[#080a08]/95 p-4 sm:p-5 mb-4 box-glow-green relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4ade80]/20 pb-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              SECTOR 07 // FINAL TRANSMISSION // SECURE TERMINAL
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white glow-phosphor mt-0.5">
              DECRYPTED BIRTHDAY TRANSMISSION
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-[#121412] px-3 py-1.5 border border-[#4ade80]/40 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="text-[#4ade80] font-bold">256-BIT FRIENDSHIP ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* Telemetry Header Meta */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs font-mono">
          <div className="p-2 bg-[#121612] border border-[#4ade80]/20">
            <span className="opacity-50 block">RECIPIENT:</span>
            <span className="text-white font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
          </div>
          <div className="p-2 bg-[#121612] border border-[#4ade80]/20">
            <span className="opacity-50 block">DATE OF AWAKENING:</span>
            <span className="text-[#fbbf24] font-bold">{birthdayConfig.birthdayDate}</span>
          </div>
          <div className="p-2 bg-[#121612] border border-[#4ade80]/20">
            <span className="opacity-50 block">FRIENDSHIP LEVEL:</span>
            <span className="text-[#ec4899] font-bold">{birthdayConfig.friendshipLevel}</span>
          </div>
          <div className="p-2 bg-[#121612] border border-[#4ade80]/20">
            <span className="opacity-50 block">SYSTEM STATUS:</span>
            <span className="text-[#4ade80] font-bold">MISSION COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Letter Container */}
      <div className="relative border-2 border-[#4ade80] bg-[#060806] p-5 sm:p-8 shadow-[0_0_25px_rgba(74,222,128,0.25)] min-h-[360px] flex flex-col justify-between">
        
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-[#4ade80]/30 pb-3 mb-5 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#4ade80]">
            <Terminal className="w-4 h-4 text-[#fbbf24]" />
            <span className="font-bold">DECRYPTED_MESSAGE.LOG // READ-ONLY</span>
          </div>

          <div className="flex items-center gap-2">
            {!isTypingComplete && (
              <button
                type="button"
                onClick={handleSkipTyping}
                className="px-2.5 py-1 bg-[#121812] hover:bg-[#4ade80]/20 border border-[#4ade80]/40 text-[10px] text-[#4ade80] uppercase transition-all cursor-pointer"
              >
                [ FAST DECRYPT ]
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 bg-[#182018] hover:bg-[#4ade80] hover:text-black border border-[#4ade80] text-[10px] text-[#4ade80] uppercase transition-all cursor-pointer flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED!' : 'COPY LETTER'}</span>
            </button>
          </div>
        </div>

        {/* Letter Body (Typewriter Text) */}
        <div className="text-sm sm:text-base font-mono text-white/95 leading-relaxed space-y-4 whitespace-pre-line tracking-wide">
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-2.5 h-4 bg-[#4ade80] ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Verified Protocol Seal Badge */}
        <div className="mt-8 pt-4 border-t border-[#4ade80]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#fbbf24] bg-[#fbbf24]/10 rounded flex items-center justify-center">
              <Award className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#fbbf24] tracking-wider">
                CERTIFIED BEST FRIEND PROTOCOL
              </div>
              <div className="text-[10px] font-mono text-[#4ade80]/70">
                SERIAL: NEKO-2026-LVL22-ANUSHKA • PERMANENT MEMORY STORAGE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playFanfare();
                onNavigate(ScreenIndex.CAKE);
              }}
              className="px-3 py-1.5 bg-[#121612] border border-[#fbbf24]/50 text-[#fbbf24] text-xs font-mono uppercase hover:bg-[#fbbf24]/20 transition-all cursor-pointer flex items-center gap-1.5"
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
              className="px-3 py-1.5 bg-[#4ade80]/20 border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REBOOT OS [REPLAY ALL]</span>
            </button>
          </div>
        </div>

      </div>

      {/* Friendship Stats Recap Bar */}
      <div className="mt-4 p-3 bg-[#0d120d] border border-[#4ade80]/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {friendshipStats.map((stat, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[10px] text-[#4ade80]/70 truncate">{stat.label}</span>
            <span className="text-sm font-bold text-[#fbbf24]">{stat.displayValue}</span>
          </div>
        ))}
      </div>

      {/* Bottom Screen Navigation Bar */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-3 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-3.5 py-1.5 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV: BIRTHDAY CAKE
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-3.5 py-1.5 bg-[#121412] border border-[#fbbf24]/50 text-[#fbbf24] text-xs uppercase hover:bg-[#fbbf24]/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
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
          className="px-4 py-1.5 bg-[#4ade80]/20 border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>REBOOT NEKO.EXE</span>
        </button>
      </div>

    </div>
  );
};
