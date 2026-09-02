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
    <header className="w-full bg-[#fffdf0] border-b-4 border-[#16192e] shadow-[0_4px_0_#16192e] z-30 sticky top-0 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Terminal Identification (Interactive 5-Click Emergency Trigger) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex flex-col text-left group cursor-pointer select-none bg-[#ffd000] border-2 border-[#16192e] header-title-container px-[12px] py-2 sm:py-2.5 h-auto min-h-fit brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-transform"
          title="Terminal Identity // [Emergency Access: 5-Click Sequence]"
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-[0.15em] font-pixel font-bold uppercase text-[#16192e] leading-none">
              NEKO.EXE // V4.2
            </span>
            {showOverrideHint && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#f43f5e] text-[#16192e] font-pixel font-bold tracking-widest uppercase border border-[#16192e] shrink-0">
                EMERGENCY: {logoClickCount}/5
              </span>
            )}
          </div>
          <div className="flex items-center mt-1.5">
            <span className={`w-2.5 h-2.5 shrink-0 inline-block border border-[#16192e] mr-2.5 ${
              logoClickCount > 0 ? 'bg-[#f43f5e] scale-125' : 'bg-[#22c55e]'
            }`} />
            <span className={`font-pixel font-black tracking-wider leading-none whitespace-nowrap header-title-text ${
              logoClickCount > 0 ? 'text-[#f43f5e]' : 'text-[#16192e]'
            }`}>
              Happī Bāsudē
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
                className={`px-2.5 py-1 text-[10px] font-pixel font-bold tracking-wider transition-all uppercase cursor-pointer border-2 border-[#16192e] ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#16192e] translate-x-[-1px] translate-y-[-1px] shadow-[3px_3px_0px_#16192e]'
                    : isCompleted
                    ? 'bg-[#ffd000] text-[#16192e] hover:bg-[#ffe169] shadow-[2px_2px_0px_#16192e]'
                    : 'bg-[#fffdf0] text-[#16192e] hover:bg-[#ff5e97]/20 hover:text-[#16192e]'
                }`}
                title={`Screen 0${idx}: ${SCREEN_TITLES[idx as ScreenIndex]}`}
              >
                {SCREEN_LABELS[idx as ScreenIndex]}
              </button>
            );
          })}
        </div>

        {/* Right: Audio Engine & System State */}
        <div className="flex gap-3 sm:gap-4 items-center uppercase text-[10px] font-pixel self-end md:self-auto">
          {/* Audio Toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-2.5 py-1.5 border-2 border-[#16192e] brutal-btn-sm select-none cursor-pointer ${
              soundEnabled
                ? 'bg-[#22c55e] text-[#16192e]'
                : 'bg-[#f43f5e] text-[#16192e]'
            }`}
            title={soundEnabled ? 'Web Audio Synthesizer: ACTIVE (Click to mute)' : 'Web Audio Synthesizer: MUTED (Click to enable)'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#16192e]" />
            ) : (
              <VolumeX className="w-4 h-4 text-white" />
            )}
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-[8px] tracking-wider opacity-80">AUDIO</span>
              <span className="text-[9px] font-black">
                {soundEnabled ? 'ONLINE' : 'MUTED'}
              </span>
            </div>
          </button>

          {/* System State & Clock */}
          <div className="hidden lg:flex flex-col items-end border-l-2 border-[#16192e] pl-3">
            <span className="opacity-60 text-[8px] font-mono">SYSTEM_STATE</span>
            <span className="font-bold text-[#16192e] text-[9px] truncate max-w-[140px]">
              {SCREEN_TITLES[currentScreen]}
            </span>
          </div>

          <div className="hidden xl:flex flex-col items-end border-l-2 border-[#16192e] pl-3 text-[#16192e]">
            <span className="opacity-60 text-[8px] font-mono">TIME</span>
            <span className="font-mono font-bold text-[10px]">{timeString}</span>
          </div>
        </div>

      </div>
    </header>
  );
};


