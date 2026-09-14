import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Copy, Check, Sparkles, Heart, Home, Award, ArrowLeft, ArrowRight, Mail } from 'lucide-react';
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
    soundEngine.playTone(750, 0.05, 'sine', 0.08);
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
      <motion.div variants={cardVariants} className="bg-white/55 backdrop-blur-xl border border-white/80 p-5 sm:p-6 mb-5 rounded-3xl shadow-xl shadow-pink-100/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/60 pb-3">
          <div>
            <div className="dev-eyebrow-pill mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>FROM THE HEART • SPECIAL TRANSMISSION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 tracking-tight">
              A Birthday Letter <span className="text-pink-600">For You</span> 💌
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-pink-50 px-3.5 py-1.5 border border-pink-200 rounded-full flex items-center gap-1.5 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span className="text-pink-700 font-bold">100% HEARTFELT</span>
            </div>
          </div>
        </div>

        {/* Telemetry Header Meta */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">RECIPIENT</span>
            <span className="text-slate-800 font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
          </div>
          <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">CELEBRATION DATE</span>
            <span className="text-slate-800 font-bold">{birthdayConfig.birthdayDate}</span>
          </div>
          <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">FRIENDSHIP LEVEL</span>
            <span className="text-pink-600 font-bold">{birthdayConfig.friendshipLevel}</span>
          </div>
          <div className="p-3 bg-white/70 border border-pink-100 rounded-2xl shadow-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">STATUS</span>
            <span className="text-emerald-600 font-bold">DELIVERED WITH LOVE</span>
          </div>
        </div>
      </motion.div>

      {/* Main Letter Container */}
      <motion.div variants={cardVariants} className="relative border border-white/90 bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl shadow-2xl shadow-pink-100/40 min-h-[380px] flex flex-col justify-between overflow-hidden">
        
        {/* Decorative Stamps */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 pointer-events-none select-none z-10">
          <div className="border border-pink-200 bg-pink-100/80 text-pink-700 text-xs px-3.5 py-1 rounded-full font-bold shadow-xs">
            💖 BEST FRIEND CERTIFIED
          </div>
          <div className="border border-emerald-200 bg-emerald-100/80 text-emerald-700 text-xs px-3.5 py-1 rounded-full font-bold shadow-xs">
            ✓ DELIVERED
          </div>
        </div>

        {/* Document Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between border-b border-pink-100/80 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-500 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-slate-800 block">
                  BIRTHDAY LETTER // DOCKET_07.MD
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sent with love across all dimensions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTypingComplete && (
                <button
                  type="button"
                  onClick={handleSkipTyping}
                  className="px-3.5 py-1.5 bg-white hover:bg-pink-50 border border-pink-200 rounded-full text-xs font-bold text-slate-600 cursor-pointer transition-all shadow-xs"
                >
                  SHOW ALL
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-1.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-200/40 transition-all hover:scale-105"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY LETTER'}</span>
              </button>
            </div>
          </div>

          {/* Letter Body (Typewriter Text) */}
          <div className="text-sm sm:text-base font-sans text-slate-700 leading-relaxed space-y-4 whitespace-pre-line bg-pink-50/40 p-6 sm:p-8 rounded-2xl border border-pink-100/70 shadow-inner relative font-medium">
            {displayedText}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-pink-400 ml-1 rounded-full animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Verified Friendship Seal Badge & Replay Actions */}
        <div className="mt-8 pt-5 border-t border-pink-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-pink-200 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-heading font-bold text-slate-800">
                CERTIFIED BEST FRIEND AWARD
              </div>
              <div className="text-xs text-slate-500 font-medium">
                SERIAL: NEKO-2026-LVL22-ANUSHKA • PERMANENT MEMORY
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
              className="px-4 py-2.5 bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>REPLAY CAKE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPowerUp();
                onNavigate(ScreenIndex.BOOT);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-200/40 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART CELEBRATION</span>
            </button>
          </div>
        </div>

      </motion.div>

      {/* Friendship Stats Recap Bar */}
      <motion.div variants={cardVariants} className="mt-5 p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl shadow-md shadow-pink-100/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {friendshipStats.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className="flex flex-col bg-white/70 p-3.5 rounded-2xl border border-pink-100 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 truncate uppercase">{stat.label}</span>
            <span className="text-sm sm:text-base font-heading font-bold text-pink-600 mt-0.5">{stat.displayValue}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Screen Navigation Bar */}
      <motion.div variants={cardVariants} className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: BIRTHDAY CAKE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2 bg-white/50 hover:bg-white text-slate-600 text-xs font-bold rounded-full border border-white/70 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESTART CELEBRATION</span>
        </button>
      </motion.div>

    </motion.div>
  );
};
