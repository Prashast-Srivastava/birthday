import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sun, Moon, Terminal } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { soundEngine } from '../../utils/audio';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface HeaderStatusBarProps {
  currentScreen: ScreenIndex;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
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
  theme: propTheme,
  onToggleTheme: propToggleTheme,
  onNavigateScreen,
  onTriggerEmergencyAccess
}) => {
  let contextTheme: ThemeMode = 'dark';
  let contextToggleTheme: () => void = () => {};
  try {
    const ctx = useTheme();
    contextTheme = ctx.theme;
    contextToggleTheme = ctx.toggleTheme;
  } catch {
    // Fallback if rendered outside ThemeProvider
  }

  const currentTheme = propTheme ?? contextTheme;
  const handleToggleTheme = () => {
    soundEngine.playSelect();
    if (propToggleTheme) {
      propToggleTheme();
    } else {
      contextToggleTheme();
    }
  };

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
    <header className="w-full bg-[#0a0e17]/90 backdrop-blur-md border-b border-[#ffffff1a] z-30 sticky top-0 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Terminal Identification (Interactive 5-Click Emergency Trigger) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex flex-col text-left group cursor-pointer select-none bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-[#f5a524]/40 rounded-lg px-3 py-1.5 transition-all"
          title="Terminal Identity // [Emergency Access: 5-Click Sequence]"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#f5a524]/10 border border-[#f5a524]/30 text-[#f5a524] rounded-full text-[10px] font-mono font-medium tracking-wider uppercase">
              <span className={`w-1.5 h-1.5 rounded-full ${logoClickCount > 0 ? 'bg-[#f43f5e] animate-ping' : 'bg-[#4ade80]'}`} />
              NEKO.EXE // V4.2
            </span>
            {showOverrideHint && (
              <span className="text-[10px] px-2 py-0.5 bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/40 rounded-full font-mono font-semibold uppercase tracking-wider shrink-0">
                EMERGENCY: {logoClickCount}/5
              </span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span className="font-sans font-bold tracking-tight text-sm text-[#f5f5f7]">
              Happī Bāsudē
            </span>
            <span className="ml-2 text-[10px] text-[#9ca3af] font-mono">
              [DEV_CORE]
            </span>
          </div>
        </button>

        {/* Center: Module Switcher (Minimal Ghost Pills / Underlined Tabs) */}
        <div className="flex items-center gap-1 flex-wrap overflow-x-auto py-1 max-w-full">
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
                className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-all rounded-md cursor-pointer ${
                  isActive
                    ? 'bg-[#f5a524]/15 text-[#f5a524] border border-[#f5a524]/40 shadow-sm'
                    : isCompleted
                    ? 'text-[#f5f5f7] hover:text-[#f5a524] hover:bg-white/5 border border-transparent'
                    : 'text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-white/5 border border-transparent'
                }`}
                title={`Screen 0${idx}: ${SCREEN_TITLES[idx as ScreenIndex]}`}
              >
                {SCREEN_LABELS[idx as ScreenIndex]}
              </button>
            );
          })}
        </div>

        {/* Right: Theme Toggle, Audio Engine & System State */}
        <div className="flex gap-2 sm:gap-3 items-center uppercase text-xs self-end md:self-auto flex-wrap">
          {/* Theme Accessibility Toggle (High-Contrast Light Mode / Dark Mode / Hacker Mode) */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={handleToggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all select-none cursor-pointer ${
              currentTheme === 'hacker'
                ? 'bg-[#050f05] text-[#4ade80] border-[#22c55e]/60 hover:bg-[#0a1f0a] shadow-[0_0_12px_rgba(34,197,94,0.35)]'
                : currentTheme === 'light'
                ? 'bg-[#ffffff] text-[#d97706] border-[#cbd5e1] hover:bg-[#f1f5f9] shadow-sm'
                : 'bg-[#121723] text-[#f5a524] border-[#ffffff1a] hover:bg-[#1a1f2e]'
            }`}
            title={
              currentTheme === 'hacker'
                ? 'Hacker Terminal Mode Active (Phosphor Green-on-Black) // Click to revert'
                : currentTheme === 'light'
                ? 'High-Contrast Light Active // Click to switch to Dark Mode'
                : 'Dark Dev-Tool Active // Click to switch to High-Contrast Light Mode (or enter Konami Code for Hacker Mode)'
            }
            aria-label={
              currentTheme === 'hacker'
                ? 'Revert from Hacker Mode'
                : currentTheme === 'light'
                ? 'Switch to Dark Mode'
                : 'Switch to High-Contrast Light Mode'
            }
          >
            {currentTheme === 'hacker' ? (
              <Terminal className="w-3.5 h-3.5 text-[#4ade80] animate-pulse" />
            ) : currentTheme === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-[#d97706]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#f5a524]" />
            )}
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-[9px] tracking-wider text-[#9ca3af] font-mono">THEME</span>
              <span className="text-[10px] font-semibold font-mono">
                {currentTheme === 'hacker' ? 'HACKER_OS' : currentTheme === 'light' ? 'HI-CONTRAST' : 'DARK'}
              </span>
            </div>
          </button>

          {/* Audio Toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#ffffff1a] bg-[#121723] hover:bg-[#1a1f2e] transition-all select-none cursor-pointer ${
              soundEnabled
                ? 'text-[#4ade80] border-[#4ade80]/30'
                : 'text-[#9ca3af] opacity-80'
            }`}
            title={soundEnabled ? 'Web Audio Synthesizer: ACTIVE (Click to mute)' : 'Web Audio Synthesizer: MUTED (Click to enable)'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#4ade80]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#9ca3af]" />
            )}
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-[9px] tracking-wider text-[#9ca3af] font-mono">AUDIO</span>
              <span className="text-[10px] font-semibold">
                {soundEnabled ? 'ONLINE' : 'MUTED'}
              </span>
            </div>
          </button>

          {/* System State & Clock */}
          <div className="hidden lg:flex flex-col items-end border-l border-[#ffffff1a] pl-3">
            <span className="text-[#9ca3af] text-[9px] font-mono">STATUS</span>
            <span className="font-mono text-[11px] text-[#f5f5f7] truncate max-w-[140px]">
              {SCREEN_TITLES[currentScreen].split(' / ')[1] || 'ACTIVE'}
            </span>
          </div>

          <div className="hidden xl:flex flex-col items-end border-l border-[#ffffff1a] pl-3 text-[#f5f5f7]">
            <span className="text-[#9ca3af] text-[9px] font-mono">TIME</span>
            <span className="font-mono font-medium text-[11px] text-[#9ca3af]">{timeString}</span>
          </div>
        </div>

      </div>
    </header>
  );
};


