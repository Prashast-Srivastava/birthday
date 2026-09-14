import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenIndex } from '../../types';
import { birthdayConfig, friendshipStats } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants, itemVariants } from '../../utils/animations';
import { Heart, Sparkles, Trophy, Star, ShieldCheck, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

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
    soundEngine.playCoin();
    setIsRecalibrating(true);
    setAnimated(false);
    setTimeout(() => {
      setAnimated(true);
      setIsRecalibrating(false);
      soundEngine.playPowerUp();
    }, 350);
  };

  const handleStatClick = (idx: number) => {
    setSelectedStat(idx === selectedStat ? null : idx);
    soundEngine.playKeyClick();
  };

  const getBarGradient = (idx: number) => {
    switch (idx % 4) {
      case 0:
        return 'from-pink-400 to-rose-400';
      case 1:
        return 'from-purple-400 to-pink-300';
      case 2:
        return 'from-amber-400 to-yellow-300';
      case 3:
      default:
        return 'from-emerald-400 to-teal-300';
    }
  };

  const getPillColor = (idx: number) => {
    switch (idx % 4) {
      case 0:
        return 'bg-pink-100/90 text-pink-700 border-pink-200';
      case 1:
        return 'bg-purple-100/90 text-purple-700 border-purple-200';
      case 2:
        return 'bg-amber-100/90 text-amber-700 border-amber-200';
      case 3:
      default:
        return 'bg-emerald-100/90 text-emerald-700 border-emerald-200';
    }
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
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>FRIENDSHIP SYNERGY • LEVEL 22 MILESTONES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 tracking-tight">
            Friendship Stats & <span className="text-pink-600">Synergy</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="px-4 py-2 bg-white/70 hover:bg-white text-pink-600 border border-pink-200 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:shadow-sm"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin' : ''}`} />
            <span>{isRecalibrating ? 'Syncing...' : 'Re-Calibrate'}</span>
          </button>
          <span className="dev-status-pill">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            SYNC: {birthdayConfig.friendshipLevel}
          </span>
        </div>
      </motion.div>

      {/* Modern Stat Callouts Row (Frosted Glass Cards) */}
      <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-2xl shadow-md shadow-pink-100/30 text-center">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-pink-600">9999+</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Friendship Sync</div>
        </div>
        <div className="p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-2xl shadow-md shadow-purple-100/30 text-center">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-purple-600">1,420+</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Co-Op Hours</div>
        </div>
        <div className="p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-2xl shadow-md shadow-amber-100/30 text-center">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-600">LVL 22</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Target Level</div>
        </div>
        <div className="p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-2xl shadow-md shadow-emerald-100/30 text-center">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-600">100%</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Endless Support</div>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        
        {/* Left Column: Quantified Compatibility Metrics */}
        <motion.div variants={cardVariants} className="lg:col-span-8 space-y-4">
          <div className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-5 sm:p-7 shadow-xl shadow-pink-100/40">
            <div className="flex items-center justify-between border-b border-pink-100/60 pb-3 mb-5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                Friendship Compatibility Metrics
              </span>
              <span className="text-xs font-bold text-pink-600 bg-pink-100/80 border border-pink-200 px-3 py-0.5 rounded-full">
                FOR: {birthdayConfig.recipientName}
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-50/90 border-pink-300 shadow-md shadow-pink-100/50'
                        : 'bg-white/50 hover:bg-white/80 border-white/80 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        {stat.label}
                      </span>
                      <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getPillColor(idx)}`}>
                        {stat.displayValue}
                      </span>
                    </div>

                    {/* Smooth Rounded Gradient Bar */}
                    <div className="h-3 w-full bg-pink-100/40 rounded-full overflow-hidden border border-white/60 my-2.5 p-0.5">
                      <div
                        className={`h-full bg-gradient-to-r ${getBarGradient(idx)} transition-all duration-600 rounded-full shadow-xs`}
                        style={{
                          width: animated ? `${stat.value}%` : '0%',
                          transitionDelay: `${idx * 70}ms`
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                      <span>{stat.description}</span>
                      <span className="text-[11px] font-bold text-emerald-600">UNBREAKABLE: 100%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Best Friend Profile Card & Unlocked Achievements */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Target Profile Card */}
          <motion.div variants={cardVariants} className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-pink-100/40">
            <div className="border-b border-pink-100/60 pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                BEST FRIEND PROFILE
              </span>
              <span className="dev-status-pill">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Player Name:</span>
                <span className="font-bold text-slate-800">{birthdayConfig.recipientName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Milestone:</span>
                <span className="font-bold text-purple-700">Level 22 // Turning 22</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-pink-100/40">
                <span className="text-slate-500 font-medium">Best Friends Since:</span>
                <span className="font-semibold text-slate-800">{birthdayConfig.friendSinceYear}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-medium">Sync Latency:</span>
                <span className="font-bold text-emerald-600">0.0ms (Telepathic!)</span>
              </div>
            </div>
          </motion.div>

          {/* Unlocked Achievements */}
          <motion.div variants={cardVariants} className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-pink-100/40">
            <div className="border-b border-pink-100/60 pb-3 mb-4 text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              UNLOCKED ACHIEVEMENTS
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/60 border border-white/80 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">DUO RAID CHAMPION</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Overcame endless late-night game missions together</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/60 border border-white/80 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">SOUL RESONANCE</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Finishing each other's sentences across every call</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/60 border border-white/80 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">UNCONDITIONAL BACKUP</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">100% instant support and comfort whenever needed</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Navigation Footer Controls */}
      <motion.div variants={cardVariants} className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: HERO HUB</span>
        </button>

        <div className="hidden sm:block text-xs font-bold text-pink-600 bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
          STAGE 02 / 07 COMPLETED ✨
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.ANIME);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-2"
        >
          <span>NEXT: ANIME ARCHIVE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
};
