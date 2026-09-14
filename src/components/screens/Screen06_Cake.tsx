import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wind, RotateCcw, ArrowRight, Heart, Flame, Gift, Check, Send, ArrowLeft } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { PixelConfetti, ConfettiColor, ConfettiShape } from '../common/PixelConfetti';
import { screenContainerVariants, cardVariants } from '../../utils/animations';

interface Screen06CakeProps {
  onNavigate: (index: ScreenIndex) => void;
}

interface BurstConfettiItem {
  id: number;
  variant: ConfettiColor;
  shape: ConfettiShape;
  size: number;
  burstX: number;
  burstY: number;
  rotation: number;
  delayMs: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Candle {
  id: number;
  label: string;
  lit: boolean;
  color: string;
}

const CANDLE_DEFS: Omit<Candle, 'lit'>[] = [
  { id: 1, label: 'CHAOS SYNC', color: '#f472b6' },
  { id: 2, label: 'LATE NIGHT CO-OP', color: '#c084fc' },
  { id: 3, label: 'LEVEL 22', color: '#34d399' },
  { id: 4, label: 'ANIME MARATHONS', color: '#38bdf8' },
  { id: 5, label: 'ENDLESS HAPPINESS', color: '#facc15' },
];

export const Screen06_Cake: React.FC<Screen06CakeProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [candles, setCandles] = useState<Candle[]>(
    CANDLE_DEFS.map(c => ({ ...c, lit: true }))
  );
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [wishText, setWishText] = useState<string>('');
  const [wishLocked, setWishLocked] = useState<boolean>(false);
  const [selectedPresetWish, setSelectedPresetWish] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [smokePuffs, setSmokePuffs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [burstConfetti, setBurstConfetti] = useState<BurstConfettiItem[]>([]);
  const burstCleanupTimerRef = useRef<number | null>(null);

  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const confettiStartRef = useRef<number>(0);

  const allCandlesOut = candles.every(c => !c.lit);

  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const triggerPixelConfettiBurst = () => {
    if (burstCleanupTimerRef.current) {
      clearTimeout(burstCleanupTimerRef.current);
    }

    const count = isReducedMotion() ? 16 : 42;
    const variants: ConfettiColor[] = ['pink', 'yellow', 'cyan', 'green', 'cycle'];
    const shapes: ConfettiShape[] = ['square', 'triangle', 'ribbon'];
    const sizes = [14, 16, 18, 20, 24];

    const items: BurstConfettiItem[] = [];
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * (Math.PI * 2);
      const angle = baseAngle + (Math.random() - 0.5) * 0.35;

      const distance = 90 + Math.random() * 320;
      const burstX = Math.round(Math.cos(angle) * distance);
      const burstY = Math.round(Math.sin(angle) * distance * 0.85 - (Math.random() * 40));

      const rotation = Math.round((Math.random() - 0.5) * 480);
      const delayMs = Math.round(Math.random() * 120);

      items.push({
        id: Date.now() + i,
        variant: variants[i % variants.length],
        shape: shapes[i % shapes.length],
        size: sizes[i % sizes.length],
        burstX,
        burstY,
        rotation,
        delayMs,
      });
    }

    setBurstConfetti(items);

    burstCleanupTimerRef.current = window.setTimeout(() => {
      setBurstConfetti([]);
    }, 3500);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    confettiStartRef.current = Date.now();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    const reduced = isReducedMotion();
    const count = reduced ? 20 : 160;
    const duration = reduced ? 1000 : 3500;

    const colors = ['#f472b6', '#c084fc', '#34d399', '#fde047', '#38bdf8', '#ffffff'];

    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < count; i++) {
      const originX = width / 2 + (Math.random() - 0.5) * (width * 0.4);
      const originY = height * 0.45;

      const angle = (Math.random() * Math.PI) + Math.PI;
      const speed = reduced ? (100 + Math.random() * 150) : (220 + Math.random() * 450);

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 80,
        vy: Math.sin(angle) * speed - (reduced ? 80 : 180),
        size: reduced ? 3 : (3 + Math.random() * 5),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 8,
        alpha: 1,
        life: 0,
        maxLife: duration,
      });
    }

    particlesRef.current = newParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const w = canvas.parentElement ? canvas.parentElement.clientWidth : 800;
      const h = canvas.parentElement ? canvas.parentElement.clientHeight : 600;

      ctx.clearRect(0, 0, w, h);

      if (particlesRef.current.length > 0) {
        const gravity = isReducedMotion() ? 120 : 380;
        const drag = 0.985;

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life += dt * 1000;

          p.vy += gravity * dt;
          p.vx *= drag;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rotation += p.rotationSpeed * dt;

          const progress = p.life / p.maxLife;
          p.alpha = Math.max(0, 1 - Math.pow(progress, 2));

          if (p.life >= p.maxLife || p.y > h + 20) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleBlowCandles = () => {
    soundEngine.playFanfare();
    setCandles(prev => prev.map(c => ({ ...c, lit: false })));
    setIsBlown(true);
    setWishLocked(true);
    triggerConfetti();
    triggerPixelConfettiBurst();

    const puffs = CANDLE_DEFS.map((c, idx) => ({
      id: Date.now() + idx,
      x: idx * 60 + 20,
      y: -10,
    }));
    setSmokePuffs(puffs);
  };

  const handleToggleCandle = (id: number) => {
    setCandles(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, lit: !c.lit } : c));
      const allOut = updated.every(c => !c.lit);
      if (allOut && !isBlown) {
        setTimeout(() => handleBlowCandles(), 0);
      } else {
        soundEngine.playTone(340, 0.05, 'sine', 0.08);
      }
      return updated;
    });
  };

  const handleRelightCandles = () => {
    soundEngine.playSelect();
    setCandles(CANDLE_DEFS.map(c => ({ ...c, lit: true })));
    setIsBlown(false);
    setShowConfetti(false);
    setBurstConfetti([]);
    particlesRef.current = [];
    if (burstCleanupTimerRef.current) {
      clearTimeout(burstCleanupTimerRef.current);
    }
  };

  const presetWishes = [
    '✨ Unlimited Anime Marathons & Peak Romcoms',
    '🎮 S-Tier Gacha Luck & Co-op Victories',
    '⚡ Level 22 Chaos & Legendary Energy',
    '🍰 Unlimited Ramen, Boba & Delicious Treats',
  ];

  return (
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Hand-rolled Confetti Canvas Layer */}
      <canvas
        ref={canvasRef}
        id="birthday-confetti-canvas"
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      />

      {/* Radial Burst of PixelConfetti Components */}
      {burstConfetti.length > 0 && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
        >
          <div className="absolute top-1/2 left-1/2 w-0 h-0">
            {burstConfetti.map((item) => (
              <div
                key={item.id}
                className="absolute top-0 left-0 animate-pixel-confetti-burst pointer-events-none select-none"
                style={{
                  '--burst-x': `${item.burstX}px`,
                  '--burst-y': `${item.burstY}px`,
                  '--burst-rot': `${item.rotation}deg`,
                  animationDelay: `${item.delayMs}ms`,
                } as React.CSSProperties}
              >
                <PixelConfetti
                  size={item.size}
                  variant={item.variant}
                  shape={item.shape}
                  animate={false}
                  className="drop-shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen Top Header */}
      <motion.div variants={cardVariants} className="bg-white/55 backdrop-blur-xl border border-white/80 p-5 sm:p-6 mb-5 rounded-3xl shadow-xl shadow-pink-100/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/60 pb-3">
          <div>
            <div className="dev-eyebrow-pill mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CAKE & CANDLES CEREMONY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 tracking-tight">
              Level 22 // <span className="text-pink-600">Make A Wish</span> 🎂
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-white/70 px-3.5 py-1.5 border border-pink-200 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="text-slate-500 font-bold">RECIPIENT:</span>
              <span className="text-slate-800 font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
            </div>
            <div className={`px-3.5 py-1.5 border rounded-full font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
              allCandlesOut 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                : 'bg-pink-100 text-pink-700 border-pink-200'
            }`}>
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{candles.filter(c => c.lit).length} / {candles.length} LIT</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-600 font-medium">
          Make a sweet wish, type your birthday intention below, and blow out the candles to trigger the celebration!
        </p>
      </motion.div>

      {/* Main Cake Stage Container */}
      <motion.div variants={cardVariants} className="relative border border-white/90 bg-white/40 backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] rounded-3xl shadow-xl shadow-pink-100/30 overflow-hidden">
        
        {/* 1. CANDLE ROW (ABOVE CAKE) */}
        <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-7 mb-2">
          {candles.map((candle) => (
            <div
              key={candle.id}
              onClick={() => handleToggleCandle(candle.id)}
              className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105 active:scale-95 select-none"
              title={`Click to ${candle.lit ? 'blow out' : 'relight'} candle: ${candle.label}`}
            >
              {/* Animated Flame */}
              {candle.lit ? (
                <div className="relative flex flex-col items-center mb-1 animate-pulse">
                  <div className="w-4 h-6 bg-gradient-to-t from-amber-400 via-rose-300 to-amber-200 rounded-full blur-[1px] shadow-[0_0_14px_#fbcfe8] transform group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-1 w-2 h-3 bg-white rounded-full shadow-xs" />
                </div>
              ) : (
                <div className="flex flex-col items-center mb-1 h-6 justify-end">
                  <div className="w-2 h-3 bg-pink-200/50 animate-ping mb-1 rounded-full" />
                  <div className="w-1 h-2 bg-slate-300 rounded-full" />
                </div>
              )}

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-slate-400" />

              {/* Candle Body */}
              <div
                className="w-4 sm:w-5 h-14 sm:h-16 rounded-t-lg border border-white/60 shadow-md flex flex-col justify-between p-0.5"
                style={{ backgroundColor: candle.color }}
              >
                <div className="w-full h-1.5 bg-white/80 rounded-sm" />
                <div className="w-full h-1.5 bg-white/30 rounded-sm" />
                <div className="w-full h-1.5 bg-white/80 rounded-sm" />
                <div className="w-full h-1.5 bg-white/30 rounded-sm" />
              </div>

              {/* Candle Tag / Meaning */}
              <span className="mt-2 text-[10px] text-slate-500 text-center max-w-[75px] line-clamp-1 font-bold">
                {candle.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2. THE MULTI-TIER BIRTHDAY CAKE */}
        <div className="relative z-10 flex flex-col items-center select-none">
          
          {/* Top Tier (Small) */}
          <div className="w-48 sm:w-64 h-13 bg-gradient-to-b from-rose-100 to-pink-200 border border-white/90 rounded-t-2xl relative flex flex-col justify-between shadow-md">
            {/* White Cream Drippings */}
            <div className="w-full h-4 bg-white/95 flex justify-between items-end px-1 rounded-t-2xl border-b border-pink-100 shadow-xs">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-3 bg-white/95 rounded-b-full shadow-xs ${i % 2 === 0 ? 'h-4' : 'h-2.5'}`} />
              ))}
            </div>
            {/* Strawberry Jewels */}
            <div className="flex justify-around items-center px-2 py-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-xs border border-white/40" />
              ))}
            </div>
            <div className="w-full h-2 bg-pink-300/40" />
          </div>

          {/* Middle Tier (Medium) */}
          <div className="w-64 sm:w-80 h-15 bg-gradient-to-b from-pink-100 to-purple-100 border border-white/90 rounded-t-2xl relative flex flex-col justify-between shadow-md -mt-0.5">
            {/* Cream Frosting Pattern */}
            <div className="w-full h-4 bg-white/95 flex justify-between items-end px-1 rounded-t-2xl border-b border-pink-100 shadow-xs">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`w-3 bg-white/95 rounded-b-full shadow-xs ${i % 2 === 0 ? 'h-4.5' : 'h-3'}`} />
              ))}
            </div>
            {/* LEVEL 22 Frosting Text Badge */}
            <div className="text-center text-xs font-heading font-bold text-pink-600 tracking-wider py-0.5 bg-white/80 border-y border-pink-100">
              ✨ LEVEL 22 // HAPPY BIRTHDAY ✨
            </div>
            <div className="w-full h-2.5 bg-purple-200/40" />
          </div>

          {/* Bottom Tier (Base) */}
          <div className="w-80 sm:w-96 h-17 bg-gradient-to-b from-purple-100 to-pink-100 border border-white/90 rounded-t-2xl relative flex flex-col justify-between shadow-md -mt-0.5">
            {/* Cream Base */}
            <div className="w-full h-4 bg-white/95 flex justify-between items-end px-1 rounded-t-2xl border-b border-pink-100 shadow-xs">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-3 bg-white/95 rounded-b-full shadow-xs ${i % 2 === 0 ? 'h-5' : 'h-3'}`} />
              ))}
            </div>
            {/* Decorative Mint Pearls */}
            <div className="flex justify-around items-center px-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-xs border border-white/40" />
              ))}
            </div>
            <div className="w-full h-3 bg-pink-200/40" />
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-96 sm:w-[420px] h-4 bg-white/90 border border-white rounded-full shadow-xl flex items-center justify-center -mt-0.5">
            <div className="w-48 h-1 bg-pink-200 rounded-full" />
          </div>
        </div>

        {/* 3. INTERACTIVE WISH / BLOW ACTION BAR */}
        <div className="relative z-20 mt-7 max-w-xl w-full flex flex-col items-center gap-3">
          
          {/* Wish Input Box */}
          <div className="w-full bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-5 shadow-lg shadow-pink-100/30">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                MAKE A BIRTHDAY WISH:
              </span>
              {wishLocked && (
                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 text-[11px] font-bold">
                  <Check className="w-3 h-3" /> WISH SAVED
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={wishText}
                disabled={wishLocked}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Type your secret birthday wish here..."
                className="flex-1 bg-white border border-pink-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 disabled:opacity-60 transition-colors shadow-xs"
              />
              {!wishLocked && (
                <button
                  type="button"
                  onClick={() => {
                    if (wishText.trim()) {
                      soundEngine.playTone(600, 0.05, 'sine', 0.08);
                      setWishLocked(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-pink-200/40 hover:scale-105"
                >
                  SAVE
                </button>
              )}
            </div>

            {/* Quick Preset Wish Pills */}
            {!wishLocked && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {presetWishes.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWishText(preset);
                      setSelectedPresetWish(preset);
                      soundEngine.playTone(520, 0.03, 'sine', 0.05);
                    }}
                    className="text-xs px-3 py-1 bg-white hover:bg-pink-50 border border-pink-200 text-slate-600 hover:text-slate-900 rounded-full transition-all cursor-pointer font-medium shadow-xs"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {!allCandlesOut ? (
              <button
                type="button"
                id="blow-candles-btn"
                onClick={handleBlowCandles}
                className="flex-1 py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Wind className="w-4 h-4" />
                <span>BLOW OUT CANDLES [CELEBRATE!]</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRelightCandles}
                  className="px-5 py-3 bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
                  <span>RELIGHT CANDLES</span>
                </button>

                <button
                  type="button"
                  id="final-message-nav-btn"
                  onClick={() => {
                    soundEngine.playSelect();
                    onNavigate(ScreenIndex.FINAL_MESSAGE);
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>READ FINAL LETTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

      </motion.div>

      {/* Bottom Screen Navigation Bar */}
      <motion.div variants={cardVariants} className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: MINI-GAME</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="hidden sm:flex px-4 py-2 bg-white/50 hover:bg-white text-slate-600 text-xs font-bold rounded-full border border-white/70"
        >
          HERO HUB
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.FINAL_MESSAGE);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.01] flex items-center gap-2"
        >
          <span>FINAL LETTER</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

    </motion.div>
  );
};
