import React, { useState, useEffect } from 'react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen02StatsProps {
  onNavigate: (index: ScreenIndex) => void;
}

export const Screen02_Stats: React.FC<Screen02StatsProps> = ({ onNavigate }) => {
  const [animated, setAnimated] = useState<boolean>(false);
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => {
      setAnimated(true);
      soundEngine.playPowerUp();
    }, 100);
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
    }, 350);
  };

  const handleStatClick = (idx: number) => {
    setSelectedStat(idx === selectedStat ? null : idx);
    soundEngine.playKeyClick();
  };

  // Chunky pixel-meter segment color maps
  const getStatTheme = (color?: string) => {
    switch (color) {
      case 'amber':
        return {
          fill: 'bg-[#ffd000]',
          border: 'border-[#16192e]',
          text: 'text-[#16192e]',
          badge: 'bg-[#ffd000] text-[#16192e]'
        };
      case 'pink':
        return {
          fill: 'bg-[#ff5e97]',
          border: 'border-[#16192e]',
          text: 'text-[#16192e]',
          badge: 'bg-[#ff5e97] text-white'
        };
      case 'green':
      default:
        return {
          fill: 'bg-[#22c55e]',
          border: 'border-[#16192e]',
          text: 'text-[#16192e]',
          badge: 'bg-[#22c55e] text-[#16192e]'
        };
    }
  };

  // Render chunky 20-segment pixel meter
  const renderPixelMeter = (percentage: number, fillColor: string, isAnimated: boolean, delayMs: number) => {
    const totalSegments = 20;
    const filledCount = isAnimated ? Math.round((percentage / 100) * totalSegments) : 0;

    return (
      <div className="flex gap-1 w-full bg-[#16192e] p-1.5 border-3 border-[#16192e] brutal-shadow-sm">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isFilled = i < filledCount;
          return (
            <div
              key={i}
              className={`h-4 flex-1 transition-all duration-150 ${
                isFilled ? fillColor : 'bg-[#232742]'
              }`}
              style={{
                transitionDelay: `${delayMs + i * 25}ms`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Screen Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 bg-[#ffd000] border-3 border-[#16192e] px-4 py-2.5 brutal-shadow">
        <div>
          <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase flex items-center gap-2 mb-0.5">
            <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
            <span>SECTOR 02 // CO-OP TELEMETRY MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-pixel font-black text-[#16192e] uppercase">
            FRIENDSHIP STATS & SYNERGY
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="px-3 py-1.5 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] text-[10px] font-pixel font-bold uppercase brutal-btn-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>{isRecalibrating ? '⟳' : '⚙'}</span>
            <span>{isRecalibrating ? 'CALIBRATING...' : 'RE-CALIBRATE'}</span>
          </button>
          <div className="px-2.5 py-1 bg-[#22c55e] border-2 border-[#16192e] text-[10px] font-pixel font-bold text-[#16192e]">
            SYNC: {birthdayConfig.friendshipLevel}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Chunky Pixel-Segmented Stat Meters */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#fffdf0] border-4 border-[#16192e] p-5 brutal-shadow-lg">
            <div className="flex items-center justify-between border-b-3 border-[#16192e] pb-3 mb-4">
              <span className="text-xs font-pixel font-bold text-[#16192e] uppercase flex items-center gap-2">
                <span className="w-3 h-3 bg-[#00f0ff] border border-[#16192e]" />
                QUANTIFIED COMPATIBILITY METRICS
              </span>
              <span className="text-[10px] font-pixel font-bold text-[#16192e] bg-[#ffd000] px-2 py-0.5 border border-[#16192e]">
                TARGET: {birthdayConfig.recipientName}
              </span>
            </div>

            <div className="space-y-4">
              {friendshipStats.map((stat, idx) => {
                const theme = getStatTheme(stat.color);
                const isSelected = selectedStat === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleStatClick(idx)}
                    className={`p-3.5 border-3 border-[#16192e] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffe169] brutal-shadow-sm'
                        : 'bg-[#fffdf0] hover:bg-[#fff9d9]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                      <span className="text-xs font-pixel font-bold text-[#16192e]">
                        {stat.label}
                      </span>
                      <span className={`text-[10px] font-pixel font-black px-2 py-0.5 border-2 border-[#16192e] ${theme.badge}`}>
                        {stat.displayValue}
                      </span>
                    </div>

                    {/* Chunky Pixel Segmented Meter */}
                    {renderPixelMeter(stat.value, theme.fill, animated, idx * 80)}

                    <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono font-bold text-[#16192e]">
                      <span>{stat.description}</span>
                      <span className="opacity-60 text-[9px] font-pixel">STABILITY: 99.9%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Target Profile Card & Unlocked Badges */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Target Profile Card */}
          <div className="bg-[#fffdf0] border-4 border-[#16192e] p-5 brutal-shadow-lg">
            <div className="border-b-3 border-[#16192e] pb-2.5 mb-3 flex items-center justify-between">
              <span className="text-xs font-pixel font-bold text-[#16192e] uppercase">
                CO-OP PROFILE
              </span>
              <span className="text-[9px] font-pixel bg-[#22c55e] text-[#16192e] font-bold px-2 py-0.5 border border-[#16192e]">
                VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-[#16192e]">
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">PLAYER:</span>
                <span className="font-pixel text-[11px] font-bold">{birthdayConfig.recipientName}</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">CURRENT LEVEL:</span>
                <span className="font-bold">LEVEL 22 // TURNING 22</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#16192e]/20 pb-1.5">
                <span className="font-bold opacity-60">CO-OP SINCE:</span>
                <span className="font-bold">{birthdayConfig.friendSinceYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold opacity-60">SYNC LATENCY:</span>
                <span className="font-bold text-[#22c55e]">0.4ms (PERFECT)</span>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="bg-[#fffdf0] border-4 border-[#16192e] p-5 brutal-shadow-lg">
            <div className="border-b-3 border-[#16192e] pb-2.5 mb-3 text-xs font-pixel font-bold text-[#16192e] uppercase">
              UNLOCKED ACHIEVEMENTS
            </div>

            <div className="space-y-2.5 text-xs font-mono text-[#16192e]">
              <div className="p-2.5 bg-[#ffd000] border-2 border-[#16192e] brutal-shadow-sm flex items-center gap-2.5">
                <span className="text-[#16192e] text-base font-pixel">★</span>
                <div>
                  <div className="font-pixel text-[10px] font-bold text-[#16192e]">DUO RAID CHAMPION</div>
                  <div className="text-[10px] font-mono text-[#16192e]/80">Overcame endless late-night boss fights together</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#00f0ff] border-2 border-[#16192e] brutal-shadow-sm flex items-center gap-2.5">
                <span className="text-[#16192e] text-base font-pixel">✦</span>
                <div>
                  <div className="font-pixel text-[10px] font-bold text-[#16192e]">SOUL RESONANCE</div>
                  <div className="text-[10px] font-mono text-[#16192e]/80">Finished each other's sentences across all servers</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#ff5e97] border-2 border-[#16192e] brutal-shadow-sm flex items-center gap-2.5">
                <span className="text-white text-base font-pixel">♥</span>
                <div>
                  <div className="font-pixel text-[10px] font-bold text-white">UNCONDITIONAL BACKUP</div>
                  <div className="text-[10px] font-mono text-white/90">100% instant support in any life emergency</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Footer Controls */}
      <div className="mt-5 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#fffdf0] border-3 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          ◀ PREV: HERO HUB
        </button>

        <div className="hidden sm:block text-xs font-pixel font-bold text-[#16192e] bg-[#ffd000] px-3 py-1 border-2 border-[#16192e]">
          STAGE 02/07 COMPLETED
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-5 py-2.5 bg-[#22c55e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn cursor-pointer"
        >
          NEXT: ANIME ARCHIVE ▶
        </button>
      </div>

    </div>
  );
};
