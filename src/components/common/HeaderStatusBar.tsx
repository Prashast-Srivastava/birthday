import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { soundEngine } from '../../utils/audio';

interface HeaderStatusBarProps {
  currentScreen: ScreenIndex;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateScreen?: (index: ScreenIndex) => void;
  onTriggerEmergencyAccess?: () => void;
}

const SCREEN_TITLES: Record<ScreenIndex, string> = {
  [ScreenIndex.BOOT]: 'SCREEN_00 / BOOT_LOG',
  [ScreenIndex.HERO]: 'SCREEN_01 / HERO',
  [ScreenIndex.STATS]: 'SCREEN_02 / STATS',
  [ScreenIndex.ANIME]: 'SCREEN_03 / ARCHIVE',
  [ScreenIndex.MEMORIES]: 'SCREEN_04 / MEMORIES',
  [ScreenIndex.MINIGAME]: 'SCREEN_05 / MINIGAME',
  [ScreenIndex.CAKE]: 'SCREEN_06 / CEREMONY',
  [ScreenIndex.FINAL_MESSAGE]: 'SCREEN_07 / TRANSMISSION'
};

const SCREEN_LABELS: Record<ScreenIndex, string> = {
  [ScreenIndex.BOOT]: 'BOOT',
  [ScreenIndex.HERO]: 'HERO',
  [ScreenIndex.STATS]: 'STATS',
  [ScreenIndex.ANIME]: 'ARCHIVE',
  [ScreenIndex.MEMORIES]: 'DATABASE',
  [ScreenIndex.MINIGAME]: 'QUEST',
  [ScreenIndex.CAKE]: 'CAKE',
  [ScreenIndex.FINAL_MESSAGE]: 'LETTER'
};

export const HeaderStatusBar: React.FC<HeaderStatusBarProps> = ({
  currentScreen,
  soundEnabled,
  onToggleSound,
  onNavigateScreen,
  onTriggerEmergencyAccess
}) => {
  const [timeString, setTimeString] = useState('');
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const [showOverrideHint, setShowOverrideHint] = useState<boolean>(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeString(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);
    setShowOverrideHint(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (nextCount >= 5) {
      // 5-click sequence complete -> Trigger Emergency Mode!
      setLogoClickCount(0);
      setShowOverrideHint(false);
      soundEngine.playEmergencyAccess();
      if (onTriggerEmergencyAccess) {
        onTriggerEmergencyAccess();
      }
    } else {
      // Ramping pitch feedback on each click
      soundEngine.playTone(600 + nextCount * 140, 0.05, 'square', 0.08);
      // Reset after 3.5s of inactivity
      resetTimerRef.current = setTimeout(() => {
        setLogoClickCount(0);
        setShowOverrideHint(false);
      }, 3500);
    }
  };

  return (
    <header className="w-full bg-[#080a08]/95 border-b border-[#4ade80]/30 backdrop-blur-md z-30 sticky top-0 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Terminal Identification (Interactive 5-Click Emergency Trigger) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex flex-col text-left group cursor-pointer select-none rounded p-1 -m-1 transition-all hover:bg-[#4ade80]/10 focus:outline-hidden"
          title="Terminal Identity // [Emergency Access: 5-Click Sequence]"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] opacity-60 font-mono uppercase text-[#4ade80] group-hover:opacity-90 transition-opacity">
              CYBER_OS // V1.0.4 // NEKO.EXE
            </span>
            {showOverrideHint && (
              <span className="text-[9px] px-1.5 py-0.2 bg-[#ef4444] text-white font-bold tracking-widest uppercase animate-pulse shadow-[0_0_8px_#ef4444]">
                EMERGENCY: {logoClickCount}/5
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`w-2 h-2 inline-block transition-all shadow-[0_0_8px_#4ade80] ${
              logoClickCount > 0 ? 'bg-[#ef4444] shadow-[0_0_12px_#ef4444] scale-125' : 'bg-[#4ade80] animate-pulse'
            }`} />
            <span className={`text-base sm:text-lg font-bold tracking-widest font-mono transition-colors glow-phosphor ${
              logoClickCount > 0 ? 'text-[#ef4444]' : 'text-[#4ade80] group-hover:text-white'
            }`}>
              THE BIRTHDAY PORTAL
            </span>
          </div>
        </button>

        {/* Center: Module Switcher (Interactive Pills) */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-1 max-w-full">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isActive = currentScreen === idx;
            const isCompleted = currentScreen > idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onNavigateScreen) {
                    soundEngine.playSelect();
                    onNavigateScreen(idx as ScreenIndex);
                  }
                }}
                className={`px-2.5 sm:px-3 py-1 text-[10px] font-bold font-mono tracking-wider transition-all uppercase cursor-pointer ${
                  isActive
                    ? 'bg-[#4ade80] text-black shadow-[0_0_10px_rgba(74,222,128,0.7)] border border-[#4ade80]'
                    : isCompleted
                    ? 'border border-[#4ade80] text-[#4ade80] shadow-[0_0_5px_rgba(74,222,128,0.4)] hover:bg-[#4ade80]/15'
                    : 'border border-[#4ade80]/30 text-[#4ade80]/50 hover:border-[#4ade80]/60 hover:text-[#4ade80] hover:bg-[#4ade80]/5'
                }`}
                title={`Screen 0${idx}: ${SCREEN_TITLES[idx as ScreenIndex]}`}
              >
                {SCREEN_LABELS[idx as ScreenIndex]}
              </button>
            );
          })}
        </div>

        {/* Right: Audio Engine & System State */}
        <div className="flex gap-4 sm:gap-6 items-center uppercase text-[10px] tracking-[0.2em] font-mono self-end md:self-auto">
          {/* Audio Toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-2.5 py-1 border transition-all cursor-pointer select-none ${
              soundEnabled
                ? 'bg-[#4ade80]/15 border-[#4ade80] text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.4)]'
                : 'bg-[#121412] border-[#4ade80]/30 text-[#4ade80]/60 hover:border-[#4ade80]/60 hover:text-[#4ade80]'
            }`}
            title={soundEnabled ? 'Web Audio Synthesizer: ACTIVE (Click to mute)' : 'Web Audio Synthesizer: MUTED (Click to enable)'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#4ade80] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#ef4444]" />
            )}
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="opacity-50 text-[8px] tracking-widest text-[#4ade80]">♫ AUDIO_SFX</span>
              <span className={`text-[10px] font-bold tracking-wider ${soundEnabled ? 'text-[#4ade80] glow-phosphor' : 'text-[#ef4444]'}`}>
                {soundEnabled ? 'ONLINE' : 'MUTED'}
              </span>
            </div>
          </button>

          {/* System State & Clock */}
          <div className="flex flex-col items-end border-l border-[#4ade80]/30 pl-4 sm:pl-6">
            <span className="opacity-50 text-[9px] text-[#4ade80]">SYSTEM_STATE</span>
            <span className="font-bold text-[#4ade80] tracking-wider">
              {SCREEN_TITLES[currentScreen]}
            </span>
          </div>

          <div className="hidden xl:flex flex-col items-end border-l border-[#4ade80]/30 pl-4 text-[#4ade80]/70">
            <span className="opacity-50 text-[9px]">TIME</span>
            <span>{timeString}</span>
          </div>
        </div>

      </div>
    </header>
  );
};


