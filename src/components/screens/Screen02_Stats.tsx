import React, { useState, useEffect } from 'react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen02StatsProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen02_Stats: React.FC<Screen02StatsProps> = ({ onNavigate }) => {
  // Animate stat bars in when the STATS tab becomes active, not on initial page load
  const [animated, setAnimated] = useState<boolean>(false);
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);

  useEffect(() => {
    // Reset and trigger smooth animation upon mounting when STATS screen becomes active
    setAnimated(false);
    const timer = setTimeout(() => {
      setAnimated(true);
      soundEngine.playPowerUp();
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  const handleRecalibrate = () => {
    soundEngine.playTerminalChirp();
    setIsRecalibrating(true);
    setAnimated(false);
    setTimeout(() => {
      setAnimated(true);
      setIsRecalibrating(false);
      soundEngine.playCoin();
    }, 400);
  };

  const handleStatClick = (idx: number) => {
    setSelectedStat(idx === selectedStat ? null : idx);
    soundEngine.playKeyClick();
  };

  const getStatColorClasses = (color?: string) => {
    switch (color) {
      case 'amber':
        return {
          bar: 'bg-[#fbbf24] shadow-[0_0_12px_rgba(251,191,36,0.6)]',
          text: 'text-[#fbbf24]',
          border: 'border-[#fbbf24]/40',
          bg: 'bg-[#fbbf24]/10'
        };
      case 'pink':
        return {
          bar: 'bg-[#ff5c8a] shadow-[0_0_12px_rgba(255,92,138,0.6)]',
          text: 'text-[#ff5c8a]',
          border: 'border-[#ff5c8a]/40',
          bg: 'bg-[#ff5c8a]/10'
        };
      case 'green':
      default:
        return {
          bar: 'bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.6)]',
          text: 'text-[#4ade80]',
          border: 'border-[#4ade80]/40',
          bg: 'bg-[#4ade80]/10'
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-4">
      {/* Screen Header */}
      <div className="border-b border-[#4ade80]/30 pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[10px] text-[#fbbf24] font-mono tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              <span>SCREEN 02 // CO-OP TELEMETRY MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-[#4ade80] glow-phosphor uppercase">
              FRIENDSHIP STATS & SYNERGY
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRecalibrate}
              disabled={isRecalibrating}
              className="px-3 py-1.5 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-[10px] font-bold uppercase tracking-wider hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className={isRecalibrating ? 'animate-spin' : ''}>⚙</span>
              <span>{isRecalibrating ? 'CALIBRATING...' : 'RE-CALIBRATE MATRIX'}</span>
            </button>
            <div className="text-xs font-mono opacity-70 text-[#4ade80]">
              SYNC: <span className="text-[#fbbf24] font-bold">{birthdayConfig.friendshipLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Animated Friendship Progress Bars */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#080a08]/90 border border-[#4ade80]/30 p-5 shadow-[0_0_20px_rgba(74,222,128,0.05)]">
            <div className="flex items-center justify-between border-b border-[#4ade80]/20 pb-3 mb-4">
              <span className="text-xs font-bold font-mono tracking-widest text-[#4ade80] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4ade80]" />
                QUANTIFIED COMPATIBILITY METRICS
              </span>
              <span className="text-[10px] font-mono text-[#fbbf24]">
                TARGET: {birthdayConfig.recipientName}
              </span>
            </div>

            <div className="space-y-5">
              {friendshipStats.map((stat, idx) => {
                const color = getStatColorClasses(stat.color);
                const isSelected = selectedStat === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleStatClick(idx)}
                    className={`p-3.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#4ade80] bg-[#4ade80]/10'
                        : 'border-[#4ade80]/20 bg-[#121412]/70 hover:border-[#4ade80]/50 hover:bg-[#121412]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
                      <span className={`text-xs font-bold font-mono tracking-wider ${color.text}`}>
                        {stat.label}
                      </span>
                      <span className="text-xs font-mono font-black text-white bg-black px-2 py-0.5 border border-white/20">
                        {stat.displayValue}
                      </span>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="relative h-4 w-full bg-[#050605] border border-[#4ade80]/30 p-0.5 overflow-hidden">
                      {/* Grid Ticks inside bar */}
                      <div 
                        className={`h-full ${color.bar} transition-all duration-1000 ease-out`}
                        style={{
                          width: animated ? `${stat.value}%` : '0%',
                          transitionDelay: `${idx * 150}ms`
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-2 text-[10px] font-mono opacity-80 text-[#4ade80]">
                      <span>{stat.description}</span>
                      <span className="opacity-50">STABILITY 99.9%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Synergy Radar & Special Achievements */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Profile Card */}
          <div className="bg-[#080a08]/90 border border-[#4ade80]/30 p-5 shadow-[0_0_20px_rgba(74,222,128,0.05)]">
            <div className="border-b border-[#4ade80]/20 pb-2.5 mb-3 flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#fbbf24] uppercase tracking-wider">
                CO-OP PROFILE
              </span>
              <span className="text-[9px] bg-[#fbbf24] text-black font-bold px-1.5 py-0.5">
                VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">PLAYER:</span>
                <span className="text-white font-bold">{birthdayConfig.recipientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">CURRENT LEVEL:</span>
                <span className="text-[#4ade80] font-bold">LEVEL 22 // TURNING 22</span>
              </div>
              <div className="flex justify-between border-b border-[#1a1a1a] pb-1.5">
                <span className="opacity-50">CO-OP SINCE:</span>
                <span className="text-[#fbbf24] font-bold">{birthdayConfig.friendSinceYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">SYNC LATENCY:</span>
                <span className="text-[#4ade80] font-bold">0.4ms (PERFECT)</span>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="bg-[#080a08]/90 border border-[#4ade80]/30 p-5">
            <div className="border-b border-[#4ade80]/20 pb-2.5 mb-3 text-xs font-bold font-mono text-[#4ade80] uppercase tracking-wider">
              UNLOCKED ACHIEVEMENTS
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 bg-[#121412] border border-[#4ade80]/30 flex items-center gap-2">
                <span className="text-[#fbbf24] text-sm">★</span>
                <div>
                  <div className="font-bold text-[#fbbf24]">DUO RAID CHAMPION</div>
                  <div className="text-[9px] opacity-60">Overcame endless late-night boss fights together</div>
                </div>
              </div>

              <div className="p-2 bg-[#121412] border border-[#4ade80]/30 flex items-center gap-2">
                <span className="text-[#4ade80] text-sm">✦</span>
                <div>
                  <div className="font-bold text-[#4ade80]">SOUL RESONANCE</div>
                  <div className="text-[9px] opacity-60">Finished each other's sentences across all servers</div>
                </div>
              </div>

              <div className="p-2 bg-[#121412] border border-[#ff5c8a]/40 flex items-center gap-2">
                <span className="text-[#ff5c8a] text-sm">♥</span>
                <div>
                  <div className="font-bold text-[#ff5c8a]">UNCONDITIONAL BACKUP</div>
                  <div className="text-[9px] opacity-60">100% instant support in any life emergency</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Footer Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV // HERO HUB
        </button>

        <div className="hidden sm:block text-[11px] font-mono text-[#fbbf24]">
          [ STAGE 02/07 COMPLETED ]
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-5 py-2 bg-[#4ade80] text-black text-xs font-bold uppercase hover:bg-white active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.5)]"
        >
          NEXT: ANIME ARCHIVE ▶
        </button>
      </div>
    </div>
  );
};
