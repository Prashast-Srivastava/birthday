import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';

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
          badge: 'bg-[#ff5e97] text-[#16192e]'
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
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Screen Header Banner */}
      <motion.div variants={cardVariants} className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="dev-eyebrow-pill mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
            <span>SECTOR 02 // CO-OP TELEMETRY MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#f5f5f7] tracking-tight">
            Friendship Stats & <span className="text-[#f5a524]">Synergy</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="px-3.5 py-1.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span className={isRecalibrating ? 'animate-spin' : ''}>⟳</span>
            <span>{isRecalibrating ? 'CALIBRATING...' : 'RE-CALIBRATE'}</span>
          </button>
          <span className="dev-status-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            SYNC: {birthdayConfig.friendshipLevel}
          </span>
        </div>
      </motion.div>

      {/* Modern Stat Callouts Row (Large numbers stacked above uppercase gray labels) */}
      <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="py-2">
          <div className="text-2xl sm:text-3xl font-bold font-sans text-[#f5f5f7]">9999+</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9ca3af] mt-0.5">Friendship Sync</div>
        </div>
        <div className="py-2">
          <div className="text-2xl sm:text-3xl font-bold font-sans text-[#f5a524]">0.4ms</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9ca3af] mt-0.5">Sync Latency</div>
        </div>
        <div className="py-2">
          <div className="text-2xl sm:text-3xl font-bold font-sans text-[#f5f5f7]">LVL 22</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9ca3af] mt-0.5">Target Level</div>
        </div>
        <div className="py-2">
          <div className="text-2xl sm:text-3xl font-bold font-sans text-[#4ade80]">100%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9ca3af] mt-0.5">Co-Op Backup</div>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Quantified Compatibility Metrics */}
        <motion.div variants={cardVariants} className="lg:col-span-8 space-y-4">
          <div className="dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#ffffff1a] pb-3 mb-5">
              <span className="text-xs font-mono font-medium text-[#f5f5f7] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f5a524]" />
                Quantified Compatibility Metrics
              </span>
              <span className="text-xs font-mono text-[#f5a524] bg-[#f5a524]/10 border border-[#f5a524]/30 px-2.5 py-0.5 rounded-full">
                TARGET: {birthdayConfig.recipientName}
              </span>
            </div>

            <div className="space-y-4">
              {friendshipStats.map((stat, idx) => {
                const isSelected = selectedStat === idx;

                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    onClick={() => handleStatClick(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1f2e] border-[#f5a524]/50 shadow-md'
                        : 'bg-[#1a1f2e]/60 hover:bg-[#1a1f2e] border-[#ffffff1a]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
                      <span className="text-sm font-medium text-[#f5f5f7]">
                        {stat.label}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#f5a524]/15 text-[#f5a524] border border-[#f5a524]/30">
                        {stat.displayValue}
                      </span>
                    </div>

                    {/* Slim Modern Progress Bar */}
                    <div className="h-2 w-full bg-[#0a0e17] rounded-full overflow-hidden border border-[#ffffff1a] my-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#f5a524] to-[#fbbf24] transition-all duration-500 rounded-full"
                        style={{
                          width: animated ? `${stat.value}%` : '0%',
                          transitionDelay: `${idx * 60}ms`
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-2 text-xs font-mono text-[#9ca3af]">
                      <span>{stat.description}</span>
                      <span className="text-[10px] text-[#4ade80]">STABILITY: 99.9%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Target Profile Card & Unlocked Badges */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Target Profile Card */}
          <motion.div variants={cardVariants} className="dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 shadow-xl">
            <div className="border-b border-[#ffffff1a] pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-[#f5f5f7] uppercase tracking-wider">
                CO-OP PROFILE
              </span>
              <span className="dev-status-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">PLAYER:</span>
                <span className="font-semibold text-[#f5f5f7]">{birthdayConfig.recipientName}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">CURRENT LEVEL:</span>
                <span className="font-medium text-[#f5f5f7]">LEVEL 22 // TURNING 22</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#ffffff0f]">
                <span className="text-[#9ca3af]">CO-OP SINCE:</span>
                <span className="font-medium text-[#f5f5f7]">{birthdayConfig.friendSinceYear}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#9ca3af]">SYNC LATENCY:</span>
                <span className="font-medium text-[#4ade80]">0.4ms (PERFECT)</span>
              </div>
            </div>
          </motion.div>

          {/* Unlocked Badges */}
          <motion.div variants={cardVariants} className="dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl p-5 shadow-xl">
            <div className="border-b border-[#ffffff1a] pb-3 mb-4 text-xs font-mono font-medium text-[#f5f5f7] uppercase tracking-wider">
              UNLOCKED ACHIEVEMENTS
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg flex items-center gap-3">
                <span className="text-[#f5a524] text-lg font-bold">★</span>
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f7]">DUO RAID CHAMPION</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">Overcame endless late-night boss fights together</div>
                </div>
              </div>

              <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg flex items-center gap-3">
                <span className="text-[#38bdf8] text-lg font-bold">✦</span>
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f7]">SOUL RESONANCE</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">Finished each other's sentences across all servers</div>
                </div>
              </div>

              <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-lg flex items-center gap-3">
                <span className="text-[#f43f5e] text-lg font-bold">♥</span>
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f7]">UNCONDITIONAL BACKUP</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">100% instant support in any life emergency</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          ◀ PREV: HERO HUB
        </button>

        <div className="hidden sm:block text-xs font-mono text-[#9ca3af]">
          STAGE 02/07 COMPLETED
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl shadow-lg shadow-[#f5a524]/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          NEXT: ANIME ARCHIVE ▶
        </button>
      </motion.div>

    </motion.div>
  );
};
