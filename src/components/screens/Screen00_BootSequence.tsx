import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audio';
import { birthdayConfig } from '../../birthdayData';
import { PixelCat } from '../common/PixelCat';

interface BootSequenceProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

const BOOT_LOGS = [
  'KERNEL_INIT: OK',
  'VITE_ASSETS_LOAD: 100%',
  'REACT_RECONCILER: MOUNTED',
  'CRT_SHADERS: ENABLED',
  'PIXEL_GRID_LAYER: ACTIVE',
  'GLOBAL_CSS_VARS: INJECTED',
  'AUDIO_PSG_CHIP: 8-BIT INITIALIZED',
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
    }, 240);

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
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2">
      
      {/* Top BIOS Terminal Header */}
      <div className="border-b border-[#4ade80]/30 pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-[#4ade80]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-[#4ade80] text-black font-bold text-[10px]">
              BIOS
            </span>
            <span className="font-bold tracking-widest text-[#4ade80]">
              VIRTUAL_TERMINAL_V1.0.4 // BOOT_LOADER
            </span>
            <span className="opacity-50 hidden sm:inline">// (C) 2026 CYBERNEKO CORP.</span>
          </div>
          <div className="text-[#fbbf24] font-bold text-[11px] tracking-widest">
            PHASE_01 // FOUNDATION
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-4">
        
        {/* Left Column: Boot Sequence Log Panel */}
        <section className="lg:col-span-7 flex flex-col gap-4 bg-[#080a08]/90 border border-[#4ade80]/30 p-5 rounded-none shadow-[0_0_20px_rgba(74,222,128,0.1)]">
          <div className="flex items-center justify-between border-b border-[#4ade80]/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#4ade80] uppercase underline decoration-[#4ade80]/50">
                BOOT_SEQUENCE_LOG
              </h3>
            </div>
            {!isBootFinished ? (
              <button
                type="button"
                onClick={handleSkip}
                className="text-[10px] text-[#fbbf24] hover:underline cursor-pointer tracking-wider"
              >
                [FAST_FORWARD]
              </button>
            ) : (
              <span className="text-[10px] text-[#4ade80] font-bold">
                [STATUS: READY]
              </span>
            )}
          </div>

          {/* Console Log Lines */}
          <div className="text-xs space-y-1.5 font-mono overflow-y-auto max-h-[300px] leading-relaxed pr-2">
            {lines.map((line, idx) => {
              const safeText = String(line ?? '');
              if (!safeText) return null;
              const isTargetLine = safeText.includes('TARGET');
              const isWarningLine = safeText.includes('WARMING');
              const isOkLine = safeText.includes('OK') || safeText.includes('SUCCESSFUL') || safeText.includes('100%');
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#4ade80] opacity-50 select-none">&gt;</span>
                  <span
                    className={`${
                      isTargetLine
                        ? 'text-[#fbbf24] font-bold glow-amber'
                        : isWarningLine
                        ? 'text-[#fbbf24]'
                        : isOkLine
                        ? 'text-[#4ade80]'
                        : 'text-[#4ade80]/90'
                    }`}
                  >
                    {safeText}
                  </span>
                </div>
              );
            })}

            {!isBootFinished && (
              <div className="flex items-center gap-2 text-[#4ade80]">
                <span className="opacity-50">&gt;</span>
                <span className="w-2.5 h-4 bg-[#4ade80] inline-block animate-cursor" />
              </div>
            )}
          </div>

          {/* Memory Bar & Progress */}
          <div className="mt-auto pt-4 border-t border-[#4ade80]/20 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
              <span className="opacity-60 uppercase">MEMORY_ALLOCATION</span>
              <span className="text-[#4ade80] font-bold">{progress}% / 128MB</span>
            </div>
            <div className="h-1.5 w-full bg-[#1a1a1a]">
              <div
                className="h-full bg-[#4ade80] shadow-[0_0_10px_#4ade80] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Right Column: Hero Mascot Preview & Launch Action */}
        <section className="lg:col-span-5 flex flex-col justify-between bg-[#4ade80]/5 border border-[#4ade80]/30 p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.3em] opacity-60 uppercase">
                CO-PILOT_DIAGNOSTICS
              </span>
              <span className="px-2 py-0.5 border border-[#4ade80] text-[9px] font-bold text-[#4ade80]">
                AI_ONLINE
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <PixelCat size="md" partyHat={true} showSpeech={false} />
            </div>

            <div className="mt-4 p-3 bg-[#080a08] border border-[#4ade80]/20 text-[11px] font-mono leading-relaxed">
              <div className="text-[#4ade80] font-bold mb-1">
                SYSTEM PROMPT:
              </div>
              <p className="opacity-70">
                {isBootFinished
                  ? `Recipient verified: ${birthdayConfig.recipientName}. All birthday protocols decrypted and ready for dispatch.`
                  : 'Initializing subsystems, loading audio synthesizer, and mounting birthday archives...'}
              </p>
            </div>
          </div>

          {/* Big Start Button */}
          <div className="mt-6">
            <button
              id="btn-initialize-system"
              type="button"
              onClick={handleStart}
              disabled={!isBootFinished}
              className={`w-full py-4 text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer ${
                isBootFinished
                  ? 'bg-[#4ade80] text-black shadow-[0_0_20px_rgba(74,222,128,0.7)] hover:bg-white hover:shadow-[0_0_30px_#4ade80] active:scale-95'
                  : 'bg-[#141a14] text-[#4ade80]/30 border border-[#4ade80]/20 cursor-not-allowed'
              }`}
            >
              <span>[ INITIALIZE NEKO.EXE // START ]</span>
              <span className="text-base">▶</span>
            </button>
          </div>
        </section>

      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-[10px] font-mono opacity-50 tracking-wider">
        <div>STATUS: {isBootFinished ? 'SYSTEM_STABLE' : 'KERNEL_BOOTING'}</div>
        <div>ENCRYPTION: QUANTUM_256 // PROTOCOL ACTIVE</div>
      </div>

    </div>
  );
};


