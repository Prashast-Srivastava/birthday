import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, RotateCcw, Copy, Check, Sparkles, Heart, ShieldCheck, Home, Award, Printer, Share2 } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';

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
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Screen Top Header */}
      <motion.div variants={cardVariants} className="dev-card bg-[#121723]/90 border border-[#ffffff1a] p-4 sm:p-5 mb-5 rounded-xl shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ffffff1a] pb-3">
          <div>
            <div className="dev-eyebrow-pill mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
              <span>SECTOR 07 // OFFICIAL TRANSMISSION // CONFIDENTIAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-[#f5f5f7] tracking-tight">
              Birthday Transmission <span className="text-[#f5a524]">Docket</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-[#1a1f2e] px-3 py-1.5 border border-[#ffffff1a] rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="text-[#f5f5f7] font-medium">256-BIT ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* Telemetry Header Meta */}
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl">
            <span className="text-[#9ca3af] block text-[10px] uppercase">RECIPIENT:</span>
            <span className="text-[#f5f5f7] font-semibold">{birthdayConfig.recipientName} (LVL 22)</span>
          </div>
          <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl">
            <span className="text-[#9ca3af] block text-[10px] uppercase">AWAKENING DATE:</span>
            <span className="text-[#f5f5f7] font-semibold">{birthdayConfig.birthdayDate}</span>
          </div>
          <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl">
            <span className="text-[#9ca3af] block text-[10px] uppercase">FRIENDSHIP LEVEL:</span>
            <span className="text-[#f5a524] font-semibold">{birthdayConfig.friendshipLevel}</span>
          </div>
          <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl">
            <span className="text-[#9ca3af] block text-[10px] uppercase">STATUS:</span>
            <span className="text-[#4ade80] font-semibold">MISSION COMPLETE</span>
          </div>
        </div>
      </motion.div>

      {/* Main Telegram / Document Container */}
      <motion.div variants={cardVariants} className="relative border border-[#ffffff1a] bg-[#121723] p-6 sm:p-10 rounded-2xl shadow-2xl min-h-[380px] flex flex-col justify-between overflow-hidden">
        
        {/* Status Stamps */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 pointer-events-none select-none z-10">
          <div className="border border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e] font-mono text-xs px-3 py-1 rounded-full font-medium">
            ★ TOP SECRET
          </div>
          <div className="border border-[#4ade80]/40 bg-[#4ade80]/10 text-[#4ade80] font-mono text-xs px-3 py-1 rounded-full font-medium">
            ✓ DELIVERED
          </div>
        </div>

        {/* Document Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between border-b border-[#ffffff1a] pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1a1f2e] border border-[#ffffff1a] flex items-center justify-center text-[#f5a524]">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="font-sans font-bold text-sm text-[#f5f5f7] block">
                  TELEGRAM PROTOCOL // DOCKET_07.MD
                </span>
                <span className="font-mono text-xs text-[#9ca3af]">
                  Dispatched via secure cyber relay
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTypingComplete && (
                <button
                  type="button"
                  onClick={handleSkipTyping}
                  className="px-3 py-1.5 bg-[#1a1f2e] hover:bg-[#222838] border border-[#ffffff1a] rounded-lg text-xs font-mono text-[#f5f5f7] cursor-pointer transition-all"
                >
                  [ FAST PRINT ]
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#f5a524]/20 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY LETTER'}</span>
              </button>
            </div>
          </div>

          {/* Letter Body (Typewriter Text) */}
          <div className="text-sm sm:text-base font-mono text-[#f5f5f7] leading-relaxed space-y-4 whitespace-pre-line bg-[#0a0e17] p-5 sm:p-8 rounded-xl border border-[#ffffff1a] shadow-inner relative">
            {displayedText}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-[#f5a524] ml-1 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Verified Protocol Seal Badge & Replay Actions */}
        <div className="mt-8 pt-5 border-t border-[#ffffff1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-[#ffffff1a] bg-[#1a1f2e] rounded-xl flex items-center justify-center text-[#f5a524] shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-sans font-bold text-[#f5f5f7]">
                CERTIFIED BEST FRIEND DOCKET
              </div>
              <div className="text-xs font-mono text-[#9ca3af]">
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
              className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#222838] text-[#f5f5f7] border border-[#ffffff1a] text-xs font-mono rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f5a524]" />
              <span>REPLAY CAKE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPowerUp();
                onNavigate(ScreenIndex.BOOT);
              }}
              className="px-4 py-2 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#f5a524]/20 transition-all hover:scale-[1.01]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REBOOT OS [REPLAY ALL]</span>
            </button>
          </div>
        </div>

      </motion.div>

      {/* Friendship Stats Recap Bar */}
      <motion.div variants={cardVariants} className="mt-5 p-4 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl shadow-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {friendshipStats.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className="flex flex-col bg-[#1a1f2e] p-3 rounded-lg border border-[#ffffff1a]">
            <span className="text-[10px] font-medium text-[#9ca3af] truncate uppercase">{stat.label}</span>
            <span className="text-sm sm:text-base font-semibold text-[#f5a524] mt-0.5">{stat.displayValue}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Screen Navigation Bar */}
      <motion.div variants={cardVariants} className="mt-5 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          ◀ PREV: BIRTHDAY CAKE
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#9ca3af] hover:text-[#f5f5f7] text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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
          className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl shadow-lg shadow-[#f5a524]/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>REBOOT NEKO.EXE</span>
        </button>
      </motion.div>

    </motion.div>
  );
};
