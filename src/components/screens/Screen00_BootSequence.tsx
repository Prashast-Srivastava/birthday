import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../utils/audio';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';
import { screenContainerVariants, cardVariants } from '../../utils/animations';
import { Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

const PREPARATION_STEPS = [
  '🌸 Initializing birthday celebration space...',
  '🎈 Inflating pastel pink & lavender balloons...',
  '🍰 Frosting the strawberry birthday cake with 22 candles...',
  '🎵 Tuning cozy 8-bit synthesizer and birthday melodies...',
  `✨ Locating VIP recipient: ${birthdayConfig.recipientName} (Turning 22!)...`,
  '📸 Polishing 8 cherished memory photo cartridges...',
  '🎮 Syncing co-op gaming stats and anime archives...',
  `💖 Calibrating friendship synergy to: ${birthdayConfig.friendshipLevel}...`,
  '🎀 Packing personalized sweet birthday letter docket...',
  '🎉 Everything is ready! Let the 22nd birthday celebration begin!'
];

export const Screen00_BootSequence: React.FC<BootSequenceProps> = ({
  onComplete,
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isBootFinished, setIsBootFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let currentLine = 0;
    timerRef.current = setInterval(() => {
      if (currentLine < PREPARATION_STEPS.length) {
        const nextStep = PREPARATION_STEPS[currentLine];
        if (typeof nextStep === 'string') {
          setLines((prev) => [...prev, nextStep]);
        }
        setProgress(Math.round(((currentLine + 1) / PREPARATION_STEPS.length) * 100));
        soundEngine.playKeyClick();
        currentLine++;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsBootFinished(true);
        soundEngine.playCoin();
      }
    }, 240);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && isBootFinished) {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBootFinished]);

  const handleStart = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    soundEngine.playBootChime();
    onComplete();
  };

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setLines([...PREPARATION_STEPS]);
    setProgress(100);
    setIsBootFinished(true);
    soundEngine.playCoin();
  };

  return (
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      {/* Top Eyebrow Tag Row */}
      <motion.div variants={cardVariants} className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="dev-eyebrow-pill">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>CELEBRATION PREPARATION • PARTY COUNTDOWN</span>
        </div>
        <div className="text-slate-500 text-xs font-bold tracking-wide">
          WELCOME TO ANUSHKA'S SPECIAL DAY ✨
        </div>
      </motion.div>

      {/* Main Grid Content: Frosted Glass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Party Checklist & Loading Card */}
        <motion.section
          variants={cardVariants}
          className="lg:col-span-7 flex flex-col bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-5 sm:p-7 shadow-xl shadow-pink-100/40"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 border-b border-pink-100/60 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-xs">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-800">
                  Party Checklist
                </h3>
                <span className="text-xs text-slate-500">
                  Getting everything perfect for Anushka
                </span>
              </div>
            </div>

            {!isBootFinished ? (
              <button
                type="button"
                onClick={handleSkip}
                className="px-3.5 py-1.5 bg-white/70 hover:bg-white text-pink-600 border border-pink-200 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                Skip Ahead ⏩
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-100/80 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                READY!
              </span>
            )}
          </div>

          {/* Checklist Step Items */}
          <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1 flex-1 py-1">
            {lines.map((line, idx) => {
              const isLast = idx === lines.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 p-2 rounded-2xl transition-all ${
                    isLast ? 'bg-pink-50/80 border border-pink-100' : 'bg-white/40'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-pink-200/80 text-pink-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className={`text-xs sm:text-sm font-medium ${isLast ? 'text-pink-900 font-bold' : 'text-slate-700'}`}>
                    {line}
                  </span>
                </div>
              );
            })}

            {!isBootFinished && (
              <div className="flex items-center gap-2 px-2 py-1 text-pink-500 text-xs font-semibold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preparing more sweet surprises...</span>
              </div>
            )}
          </div>

          {/* Smooth Pastel Progress Bar */}
          <div className="mt-5 pt-4 border-t border-pink-100/60 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="uppercase tracking-wider">Party Readiness</span>
              <span className="text-pink-600">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-pink-100/50 rounded-full overflow-hidden border border-white/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 transition-all duration-200 rounded-full shadow-xs"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.section>

        {/* Right Column: Party Cat Host & Enter Button */}
        <motion.section
          variants={cardVariants}
          className="lg:col-span-5 flex flex-col justify-between bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-pink-100/40"
        >
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-pink-100/60">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                PARTY HOST • NEKO
              </span>
              <span className="dev-status-pill">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                CELEBRATING
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <PixelCat size="md" partyHat={true} showSpeech={false} />
            </div>

            <div className="p-4 bg-white/60 border border-white/80 rounded-2xl text-xs leading-relaxed text-slate-600 shadow-xs">
              <div className="text-[11px] text-pink-600 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Party Host Message:
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {isBootFinished
                  ? `Everything is ready for ${birthdayConfig.recipientName}! Click below to unwrap the birthday experience!`
                  : 'Getting the balloons, music, memories, and birthday cake all set up for you...'}
              </p>
            </div>
          </div>

          {/* Rounded Pill-Shaped Gradient Button */}
          <div className="mt-6">
            <button
              id="btn-initialize-system"
              type="button"
              onClick={handleStart}
              disabled={!isBootFinished}
              className={`w-full py-3.5 px-6 text-sm font-bold tracking-wide rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                isBootFinished
                  ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-300/50 hover:shadow-lg hover:shadow-pink-300/60 hover:scale-[1.02] active:scale-95'
                  : 'bg-white/40 text-slate-400 border border-white/60 cursor-not-allowed'
              }`}
            >
              <span>Enter Celebration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.section>

      </div>

      {/* Footer Meta */}
      <motion.div variants={cardVariants} className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 px-2">
        <div>STATUS: <span className="text-pink-600">{isBootFinished ? 'ALL CELEBRATIONS READY' : 'PREPARING CELEBRATION...'}</span></div>
        <div className="hidden sm:block">PRESS <kbd className="px-2 py-0.5 bg-white/70 border border-pink-200 rounded-full text-[11px] text-pink-600 font-bold">[SPACE]</kbd> OR <kbd className="px-2 py-0.5 bg-white/70 border border-pink-200 rounded-full text-[11px] text-pink-600 font-bold">[ENTER]</kbd> TO ENTER</div>
      </motion.div>
    </motion.div>
  );
};
