import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Heart, Clock } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { soundEngine } from '../../utils/audio';

interface HeaderStatusBarProps {
  currentScreen: ScreenIndex;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme?: string;
  onToggleTheme?: () => void;
  onNavigateScreen?: (index: ScreenIndex) => void;
  onTriggerEmergencyAccess?: () => void;
}

const SCREEN_TITLES: Record<ScreenIndex, string> = {
  [ScreenIndex.BOOT]: 'Welcome & Prep',
  [ScreenIndex.HERO]: 'Birthday Hero',
  [ScreenIndex.STATS]: 'Friendship Synergy',
  [ScreenIndex.ANIME]: 'Anime Archive',
  [ScreenIndex.MEMORIES]: 'Memory Album',
  [ScreenIndex.MINIGAME]: 'Arcade Quest',
  [ScreenIndex.CAKE]: 'Cake & Wishes',
  [ScreenIndex.FINAL_MESSAGE]: 'Sweet Letter'
};

const SCREEN_LABELS: Record<ScreenIndex, string> = {
  [ScreenIndex.BOOT]: 'WELCOME',
  [ScreenIndex.HERO]: 'HERO',
  [ScreenIndex.STATS]: 'SYNERGY',
  [ScreenIndex.ANIME]: 'ANIME',
  [ScreenIndex.MEMORIES]: 'MEMORIES',
  [ScreenIndex.MINIGAME]: 'QUEST',
  [ScreenIndex.CAKE]: 'CAKE',
  [ScreenIndex.FINAL_MESSAGE]: 'WISHES'
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
  const [showHeartSurprise, setShowHeartSurprise] = useState<boolean>(false);
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
    setShowHeartSurprise(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (nextCount >= 5) {
      setLogoClickCount(0);
      setShowHeartSurprise(false);
      soundEngine.playFanfare();
      if (onTriggerEmergencyAccess) {
        onTriggerEmergencyAccess();
      }
    } else {
      soundEngine.playTone(600 + nextCount * 140, 0.05, 'sine', 0.08);
      resetTimerRef.current = setTimeout(() => {
        setLogoClickCount(0);
        setShowHeartSurprise(false);
      }, 3500);
    }
  };

  return (
    <header className="w-full bg-white/60 backdrop-blur-xl border-b border-white/70 z-30 sticky top-0 px-3 sm:px-6 py-2.5 shadow-sm shadow-pink-100/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Cute Brand Badge */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-left group cursor-pointer select-none bg-white/70 hover:bg-white/90 border border-white/80 hover:border-pink-300 rounded-full px-4 py-1.5 transition-all shadow-sm hover:shadow-md hover:shadow-pink-200/40"
          title="Anushka's 22nd Birthday Celebration ✨ (Tap for surprise!)"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                Anushka's 22nd
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-600 font-bold rounded-full border border-pink-200">
                LEVEL 22 ✨
              </span>
              {showHeartSurprise && (
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-600 font-bold rounded-full animate-bounce">
                  ♥ {logoClickCount}/5
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Birthday Celebration Hub
            </span>
          </div>
        </button>

        {/* Center: Module Switcher (Soft Pastel Pill Buttons) */}
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
                className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md shadow-pink-300/40 scale-105'
                    : isCompleted
                    ? 'bg-white/60 hover:bg-white text-slate-700 hover:text-pink-600 border border-white/80 shadow-xs'
                    : 'bg-white/40 hover:bg-white/80 text-slate-500 hover:text-slate-800 border border-white/60'
                }`}
                title={`Screen ${idx + 1}: ${SCREEN_TITLES[idx as ScreenIndex]}`}
              >
                {SCREEN_LABELS[idx as ScreenIndex]}
              </button>
            );
          })}
        </div>

        {/* Right: Audio Control & Gentle Status */}
        <div className="flex gap-2 sm:gap-3 items-center text-xs self-end md:self-auto flex-wrap">
          {/* Audio Toggle Pill */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all select-none cursor-pointer shadow-sm ${
              soundEnabled
                ? 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 shadow-pink-200/30'
                : 'bg-white/60 border-white/80 text-slate-400 hover:bg-white/80'
            }`}
            title={soundEnabled ? 'Music & Sound: ON (Click to mute)' : 'Music & Sound: MUTED (Click to play)'}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-pink-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-[11px] font-bold">
              {soundEnabled ? 'SOUND ON' : 'MUTED'}
            </span>
          </button>

          {/* Current Screen Title Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white/80 rounded-full text-slate-600 shadow-xs">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span className="font-bold text-[11px] text-slate-700 truncate max-w-[130px]">
              {SCREEN_TITLES[currentScreen]}
            </span>
          </div>

          {/* Gentle Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-white/40 border border-white/60 rounded-full text-slate-500 text-[11px] font-medium">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>{timeString}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
