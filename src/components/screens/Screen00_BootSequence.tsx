import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../utils/audio';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';
import { screenContainerVariants, cardVariants } from '../../utils/animations';

interface BootSequenceProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

const BOOT_LOGS = [
  'KERNEL_INIT: OK',
  'ASSETS_LOAD: 100% [PIXEL_SPRITES: READY]',
  'REACT_RECONCILER: MOUNTED',
  'NEO_BRUTALISM: TOKENS_ACTIVE',
  '8_BIT_PALETTE: SATURATED [HOT_PINK/NAVY/CREAM]',
  'GLOBAL_CSS_VARS: INJECTED',
  'AUDIO_PSG_CHIP: 8-BIT SYNTH INITIALIZED',
  `SCANNING RECIPIENT DATABASE: TARGET [${birthdayConfig.recipientName}] // TURNING 22 LOCATED`,
  'LEVEL_22_CALIBRATION: PROTOCOL ACTIVE',
  `FRIENDSHIP_SYNC: ${birthdayConfig.friendshipLevel}`,
  'CACHE_WARMING: COMPLETE',
  'ALL SYSTEMS NOMINAL. KERNEL BOOT SUCCESSFUL.'
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
      if (currentLine < BOOT_LOGS.length) {
        const nextLog = BOOT_LOGS[currentLine];
        if (typeof nextLog === 'string') {
          setLines((prev) => [...prev, nextLog]);
        }
        setProgress(Math.round(((currentLine + 1) / BOOT_LOGS.length) * 100));
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
    }, 220);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Keyboard shortcut: Press Enter or Space to launch when boot complete
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
    setLines([...BOOT_LOGS]);
    setProgress(100);
    setIsBootFinished(true);
    soundEngine.playKeyClick();
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
          <span>BIOS // V4.2 · RETRO BOOT LOADER</span>
        </div>
        <div className="text-[#9ca3af] font-mono text-xs tracking-wider">
          SECTOR 00 // FOUNDATION
        </div>
      </motion.div>

      {/* Main Grid Content: Dev-Tool Terminal & Companion Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Boot Sequence Log Window (Dark Code-Editor Panel) */}
        <motion.section variants={cardVariants} className="lg:col-span-7 flex flex-col dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl overflow-hidden shadow-2xl">
          {/* Code Window Chrome Title Bar */}
          <div className="flex items-center justify-between bg-[#1a1f2e] border-b border-[#ffffff1a] px-4 py-2.5 text-xs text-[#f5f5f7]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]/90 inline-block" />
              <span className="ml-3 font-mono text-xs text-[#9ca3af] flex items-center gap-1.5">
                <span className="text-[#f5a524]">●</span> console.log
              </span>
            </div>
            {!isBootFinished ? (
              <button
                type="button"
                onClick={handleSkip}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#f5a524] border border-[#f5a524]/30 rounded-md font-mono text-[11px] uppercase transition-all cursor-pointer"
              >
                Fast Forward ▶
              </button>
            ) : (
              <span className="px-2 py-0.5 bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 rounded-full text-[10px] font-mono font-medium">
                READY
              </span>
            )}
          </div>

          {/* Console Log Lines (Syntax Highlighted) */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#0a0e17]/80">
            <div className="text-xs space-y-2 font-mono overflow-y-auto max-h-[300px] leading-relaxed pr-1 text-[#f5f5f7]">
              {lines.map((line, idx) => {
                const safeText = String(line ?? '');
                if (!safeText) return null;
                const isTargetLine = safeText.includes('TARGET');
                const isWarnLine = safeText.includes('WARMING') || safeText.includes('HOT_PINK');
                const isOkLine = safeText.includes('OK') || safeText.includes('SUCCESSFUL') || safeText.includes('100%');
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#9ca3af] select-none text-[11px]">&gt;</span>
                    <span
                      className={`text-xs ${
                        isTargetLine
                          ? 'text-[#f5a524] font-semibold bg-[#f5a524]/10 px-1 py-0.5 rounded'
                          : isWarnLine
                          ? 'text-[#f43f5e] font-medium'
                          : isOkLine
                          ? 'text-[#4ade80] font-medium'
                          : 'text-[#9ca3af]'
                      }`}
                    >
                      {safeText}
                    </span>
                  </div>
                );
              })}

              {!isBootFinished && (
                <div className="flex items-center gap-2 text-[#f5a524]">
                  <span className="text-[#9ca3af] text-[11px]">&gt;</span>
                  <span className="w-2 h-4 bg-[#f5a524] inline-block animate-pulse" />
                </div>
              )}
            </div>

            {/* Slim Rounded Memory Progress Meter */}
            <div className="mt-5 pt-3 border-t border-[#ffffff1a] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono text-[#9ca3af]">
                <span className="uppercase tracking-wider text-[10px]">Memory Allocation</span>
                <span className="text-[#f5a524] font-medium">{progress}% / 128MB</span>
              </div>
              <div className="h-2 w-full bg-[#1a1f2e] rounded-full overflow-hidden border border-[#ffffff1a]">
                <div
                  className="h-full bg-gradient-to-r from-[#f5a524] to-[#fbbf24] transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Right Column: Hero Mascot Preview & Launch Action */}
        <motion.section variants={cardVariants} className="lg:col-span-5 flex flex-col justify-between dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 sm:p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#ffffff1a]">
              <span className="text-xs font-mono font-medium text-[#9ca3af] uppercase tracking-wider">
                COMPANION // ONLINE
              </span>
              <span className="dev-status-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                SYSTEM OK
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-5">
              <PixelCat size="md" partyHat={true} showSpeech={false} />
            </div>

            <div className="mt-2 p-3.5 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg text-xs font-mono leading-relaxed text-[#f5f5f7]">
              <div className="text-[10px] text-[#f5a524] font-semibold mb-1 uppercase tracking-wider">
                System Prompt:
              </div>
              <p className="text-xs text-[#9ca3af]">
                {isBootFinished
                  ? `Recipient verified: ${birthdayConfig.recipientName} (LVL 22). All birthday quest sectors decrypted and ready!`
                  : 'Booting retro kernel, loading 8-bit synthesizer, and mounting birthday cartridge...'}
              </p>
            </div>
          </div>

          {/* Clean Primary CTA Button */}
          <div className="mt-6">
            <button
              id="btn-initialize-system"
              type="button"
              onClick={handleStart}
              disabled={!isBootFinished}
              className={`w-full py-3 px-5 text-sm font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isBootFinished
                  ? 'bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] shadow-lg shadow-[#f5a524]/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-[#1a1f2e] text-[#9ca3af]/40 border border-[#ffffff1a] cursor-not-allowed'
              }`}
            >
              <span>Initialize Neko.exe // Start</span>
              <span className="text-xs">▶</span>
            </button>
          </div>
        </motion.section>

      </div>

      {/* Footer Meta */}
      <motion.div variants={cardVariants} className="mt-4 flex items-center justify-between text-xs font-mono text-[#9ca3af] px-1">
        <div>STATUS: <span className="text-[#f5f5f7]">{isBootFinished ? 'SYSTEM READY' : 'BOOTING KERNEL...'}</span></div>
        <div className="hidden sm:block">PRESS <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] border border-[#ffffff1a] rounded text-[10px] text-[#f5a524]">[SPACE]</kbd> OR <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] border border-[#ffffff1a] rounded text-[10px] text-[#f5a524]">[ENTER]</kbd> TO LAUNCH</div>
      </motion.div>

    </motion.div>
  );
};
