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
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Top Retro Banner Tag */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 bg-[#ffd000] border-3 border-[#16192e] px-4 py-2 brutal-shadow">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#16192e] text-[#ffd000] font-pixel text-[10px] uppercase font-bold">
            BIOS // V4.2
          </span>
          <span className="font-pixel text-xs sm:text-sm font-bold text-[#16192e] tracking-wider">
            NEKO.EXE // RETRO BOOT LOADER
          </span>
        </div>
        <div className="text-[#16192e] font-pixel text-[10px] font-bold tracking-wider">
          SECTOR 00 // FOUNDATION
        </div>
      </div>

      {/* Main Grid Content: Brutalist Console Monitor Chassis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Boot Sequence Log Window */}
        <section className="lg:col-span-7 flex flex-col bg-[#16192e] border-4 border-[#16192e] brutal-shadow-lg p-0">
          {/* Window Chrome Title Bar */}
          <div className="flex items-center justify-between bg-[#00f0ff] border-b-4 border-[#16192e] px-3 py-2 text-xs font-pixel font-bold text-[#16192e]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#f43f5e] border-2 border-[#16192e] inline-block" />
              <span className="w-3 h-3 bg-[#ffd000] border-2 border-[#16192e] inline-block" />
              <span className="w-3 h-3 bg-[#22c55e] border-2 border-[#16192e] inline-block" />
              <span className="ml-2 uppercase tracking-wider text-[11px]">CONSOLE.LOG</span>
            </div>
            {!isBootFinished ? (
              <button
                type="button"
                onClick={handleSkip}
                className="px-2 py-0.5 bg-[#ffd000] hover:bg-white text-[#16192e] border-2 border-[#16192e] font-pixel text-[9px] uppercase brutal-btn-sm cursor-pointer"
              >
                [ FAST FORWARD ]
              </button>
            ) : (
              <span className="px-2 py-0.5 bg-[#22c55e] text-[#16192e] border-2 border-[#16192e] text-[9px] font-bold">
                READY
              </span>
            )}
          </div>

          {/* Console Log Lines */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="text-xs space-y-2 font-mono overflow-y-auto max-h-[290px] leading-relaxed pr-1 text-[#fffdf0]">
              {lines.map((line, idx) => {
                const safeText = String(line ?? '');
                if (!safeText) return null;
                const isTargetLine = safeText.includes('TARGET');
                const isWarnLine = safeText.includes('WARMING') || safeText.includes('HOT_PINK');
                const isOkLine = safeText.includes('OK') || safeText.includes('SUCCESSFUL') || safeText.includes('100%');
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#00f0ff] select-none font-pixel text-[10px]">&gt;</span>
                    <span
                      className={`font-mono text-xs ${
                        isTargetLine
                          ? 'text-[#ffd000] font-bold bg-[#16192e] underline decoration-[#ffd000]'
                          : isWarnLine
                          ? 'text-[#ff5e97] font-semibold'
                          : isOkLine
                          ? 'text-[#22c55e] font-bold'
                          : 'text-[#fffdf0]'
                      }`}
                    >
                      {safeText}
                    </span>
                  </div>
                );
              })}

              {!isBootFinished && (
                <div className="flex items-center gap-2 text-[#00f0ff]">
                  <span className="font-pixel text-[10px]">&gt;</span>
                  <span className="w-3 h-4 bg-[#00f0ff] inline-block animate-cursor" />
                </div>
              )}
            </div>

            {/* Stepped Pixel Progress Meter */}
            <div className="mt-4 pt-3 border-t-2 border-[#fffdf0]/20 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-pixel text-[#fffdf0]">
                <span className="opacity-80 uppercase">MEMORY ALLOCATION</span>
                <span className="text-[#ffd000] font-bold">{progress}% / 128MB</span>
              </div>
              <div className="h-4 w-full bg-[#111111] border-2 border-[#fffdf0] p-0.5">
                <div
                  className="h-full bg-[#22c55e] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Hero Mascot Preview & Launch Action */}
        <section className="lg:col-span-5 flex flex-col justify-between bg-[#fffdf0] border-4 border-[#16192e] brutal-shadow-lg p-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-3 border-[#16192e]">
              <span className="text-[10px] font-pixel font-bold text-[#16192e] uppercase tracking-wider">
                COMPANION // ONLINE
              </span>
              <span className="px-2 py-0.5 bg-[#22c55e] border-2 border-[#16192e] text-[9px] font-pixel font-bold text-[#16192e]">
                SYSTEM OK
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <PixelCat size="md" partyHat={true} showSpeech={false} />
            </div>

            <div className="mt-2 p-3 bg-[#ffd000] border-3 border-[#16192e] brutal-shadow-sm text-xs font-mono leading-relaxed text-[#16192e]">
              <div className="font-pixel font-bold text-[10px] mb-1">
                SYSTEM PROMPT:
              </div>
              <p className="font-semibold text-xs">
                {isBootFinished
                  ? `Recipient verified: ${birthdayConfig.recipientName} (LVL 22). All birthday quest sectors decrypted and ready!`
                  : 'Booting retro kernel, loading 8-bit synthesizer, and mounting birthday cartridge...'}
              </p>
            </div>
          </div>

          {/* Big Start Button with Compressing Brutalist Shadow */}
          <div className="mt-5">
            <button
              id="btn-initialize-system"
              type="button"
              onClick={handleStart}
              disabled={!isBootFinished}
              className={`w-full py-3.5 px-4 font-pixel text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer ${
                isBootFinished
                  ? 'bg-[#22c55e] text-[#16192e] brutal-btn'
                  : 'bg-[#e2dfd2] text-[#16192e]/40 border-3 border-[#16192e]/40 cursor-not-allowed'
              }`}
            >
              <span>[ INITIALIZE NEKO.EXE // START ]</span>
              <span className="text-sm">▶</span>
            </button>
          </div>
        </section>

      </div>

      {/* Footer Meta */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-pixel text-[#16192e] px-1">
        <div>STATUS: {isBootFinished ? 'SYSTEM READY' : 'BOOTING KERNEL...'}</div>
        <div>PRESS [SPACE] OR [ENTER] TO LAUNCH</div>
      </div>

    </div>
  );
};
