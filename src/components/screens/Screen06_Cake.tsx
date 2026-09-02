import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wind, RotateCcw, ArrowRight, Heart, Flame, Gift, Check, Send } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen06CakeProps {
  onNavigate: (index: ScreenIndex) => void;
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
  { id: 1, label: 'CHAOS SYNC', color: '#fbbf24' },
  { id: 2, label: 'LATE NIGHT CO-OP', color: '#ec4899' },
  { id: 3, label: 'LEVEL 22', color: '#4ade80' },
  { id: 4, label: 'ANIME DEBATES', color: '#38bdf8' },
  { id: 5, label: 'ENDLESS HAPPINESS', color: '#f43f5e' },
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

  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const confettiStartRef = useRef<number>(0);

  const allCandlesOut = candles.every(c => !c.lit);

  // Check prefers-reduced-motion
  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Trigger Hand-rolled Canvas Confetti Burst
  const triggerConfetti = () => {
    setShowConfetti(true);
    confettiStartRef.current = Date.now();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    const reduced = isReducedMotion();
    const count = reduced ? 20 : 160;
    const duration = reduced ? 1000 : 3500; // 2-4s duration for standard

    // Colors strictly: yellow (#fbbf24), pink (#ec4899), white (#ffffff), red (#f43f5e)
    const colors = ['#fbbf24', '#ec4899', '#ffffff', '#f43f5e'];

    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < count; i++) {
      const originX = width / 2 + (Math.random() - 0.5) * (width * 0.4);
      const originY = height * 0.45;

      const angle = (Math.random() * Math.PI) + Math.PI; // Explode upwards & outward
      const speed = reduced ? (100 + Math.random() * 150) : (220 + Math.random() * 450);

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 80,
        vy: Math.sin(angle) * speed - (reduced ? 80 : 180),
        size: reduced ? 3 : (3 + Math.random() * 5), // Square pixels
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

  // Canvas render loop for hand-rolled confetti
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

          // Physics update
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

          // Draw Square Pixel Confetti Particle
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 3;
          // Exact square pixel shape
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

  // Handle Blow All Candles
  const handleBlowAllCandles = () => {
    soundEngine.playFanfare();
    setCandles(prev => prev.map(c => ({ ...c, lit: false })));
    setIsBlown(true);
    setWishLocked(true);
    triggerConfetti();

    // Generate cute smoke puffs
    const puffs = CANDLE_DEFS.map((c, idx) => ({
      id: Date.now() + idx,
      x: idx * 60 + 20,
      y: -10,
    }));
    setSmokePuffs(puffs);
  };

  // Handle Blow Single Candle
  const handleToggleCandle = (id: number) => {
    setCandles(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, lit: !c.lit } : c));
      const allOut = updated.every(c => !c.lit);
      if (allOut && !isBlown) {
        soundEngine.playFanfare();
        setIsBlown(true);
        setWishLocked(true);
        triggerConfetti();
      } else {
        soundEngine.playTone(340, 0.05, 'triangle', 0.08);
      }
      return updated;
    });
  };

  // Handle Relight Candles
  const handleRelightCandles = () => {
    soundEngine.playSelect();
    setCandles(CANDLE_DEFS.map(c => ({ ...c, lit: true })));
    setIsBlown(false);
    setShowConfetti(false);
    particlesRef.current = [];
  };

  const presetWishes = [
    '✨ Unlimited Anime Marathons & Peak Romcoms',
    '🎮 S-Tier Gacha Luck & Co-op Victories',
    '⚡ Level 22 Chaos & Legendary Energy',
    '🍰 Unlimited Ramen, Boba & Delicious Treats',
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Hand-rolled Confetti Canvas Layer */}
      <canvas
        ref={canvasRef}
        id="birthday-confetti-canvas"
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      />

      {/* Screen Top Header */}
      <div className="border border-[#4ade80]/40 bg-[#080a08]/95 p-4 sm:p-5 mb-4 box-glow-green relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4ade80]/20 pb-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              SECTOR 06 // BIRTHDAY CAKE & CANDLE CEREMONY
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white glow-phosphor mt-0.5">
              LEVEL 22 // WISH PROTOCOL ENGAGED
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-[#121412] px-3 py-1.5 border border-[#4ade80]/40 flex items-center gap-2">
              <span className="opacity-60 text-[#4ade80]">RECIPIENT:</span>
              <span className="text-[#fbbf24] font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
            </div>
            <div className={`px-3 py-1.5 border font-bold flex items-center gap-1.5 transition-colors ${
              allCandlesOut 
                ? 'bg-[#fbbf24]/20 border-[#fbbf24] text-[#fbbf24]' 
                : 'bg-[#121412] border-[#4ade80]/40 text-[#4ade80]'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{candles.filter(c => c.lit).length} / {candles.length} LIT</span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs font-mono text-[#4ade80]/80">
          Make a wish, input your custom birthday intention into the matrix, and blow out the pixel candles to trigger the celebration protocol.
        </p>
      </div>

      {/* Main Cake Stage Container */}
      <div className="relative border-2 border-[#4ade80] bg-[#060806] p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] shadow-[0_0_24px_rgba(74,222,128,0.2)] overflow-hidden">
        
        {/* Ambient CRT Scanline Backing Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 1. CANDLE ROW (ABOVE CAKE) */}
        <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-8 mb-2">
          {candles.map((candle) => (
            <div
              key={candle.id}
              onClick={() => handleToggleCandle(candle.id)}
              className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-110 active:scale-95"
              title={`Click to ${candle.lit ? 'blow out' : 'relight'} candle: ${candle.label}`}
            >
              {/* Animated Flame */}
              {candle.lit ? (
                <div className="relative flex flex-col items-center mb-1 animate-pulse">
                  {/* Outer Flame Glow */}
                  <div className="w-5 h-7 bg-gradient-to-t from-[#ea580c] via-[#fbbf24] to-[#ffffff] rounded-full shadow-[0_0_12px_#fbbf24] transform group-hover:scale-125 transition-transform" />
                  {/* Inner Core */}
                  <div className="absolute bottom-1 w-2.5 h-4 bg-white rounded-full opacity-90" />
                </div>
              ) : (
                <div className="flex flex-col items-center mb-1 h-7 justify-end">
                  {/* Smoke Trail */}
                  <div className="w-1.5 h-3 bg-gray-500/60 rounded-full animate-ping mb-1" />
                  <div className="w-1 h-2 bg-gray-700" />
                </div>
              )}

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-[#121212]" />

              {/* Candle Body (Pixel Stripes) */}
              <div
                className="w-4 sm:w-5 h-14 sm:h-16 border border-black/40 shadow-inner flex flex-col justify-between p-0.5"
                style={{ backgroundColor: candle.color }}
              >
                <div className="w-full h-1.5 bg-white/40" />
                <div className="w-full h-1.5 bg-black/20" />
                <div className="w-full h-1.5 bg-white/40" />
                <div className="w-full h-1.5 bg-black/20" />
              </div>

              {/* Candle Tag / Meaning */}
              <span className="mt-1.5 text-[8px] sm:text-[9px] font-mono text-[#4ade80]/90 tracking-wider text-center max-w-[60px] line-clamp-1">
                {candle.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2. THE MULTI-TIER RETRO PIXEL BIRTHDAY CAKE */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Top Tier (Small) */}
          <div className="w-48 sm:w-64 h-12 bg-[#fbbf24] border-2 border-[#121412] relative flex flex-col justify-between shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            {/* White Cream Drippings */}
            <div className="w-full h-3 bg-white flex justify-between items-end px-1 border-b border-black/20">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-2.5 bg-white ${i % 2 === 0 ? 'h-3.5 rounded-b-md' : 'h-2 rounded-b-sm'}`} />
              ))}
            </div>
            {/* Strawberry Jewels */}
            <div className="flex justify-around items-center px-2 py-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 bg-[#f43f5e] border border-black/30 rounded-sm shadow-sm" />
              ))}
            </div>
            {/* Sponge Layer Separator */}
            <div className="w-full h-2 bg-[#ec4899] border-t border-black/20" />
          </div>

          {/* Middle Tier (Medium) */}
          <div className="w-64 sm:w-80 h-14 bg-[#fbbf24] border-2 border-[#121412] relative flex flex-col justify-between shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            {/* Cream Frosting Pattern */}
            <div className="w-full h-3 bg-white flex justify-between items-end px-1 border-b border-black/20">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`w-3 bg-white ${i % 2 === 0 ? 'h-4 rounded-b-md' : 'h-2.5 rounded-b-sm'}`} />
              ))}
            </div>
            {/* LEVEL 22 Frosting Text Badge */}
            <div className="text-center text-[10px] sm:text-xs font-mono font-bold text-black tracking-widest bg-white/80 py-0.5 border-y border-black/20">
              ★ LEVEL 22 // HAPPY BIRTHDAY ★
            </div>
            {/* Sponge Layer Separator */}
            <div className="w-full h-2.5 bg-[#f43f5e] border-t border-black/20" />
          </div>

          {/* Bottom Tier (Base) */}
          <div className="w-80 sm:w-96 h-16 bg-[#fbbf24] border-2 border-[#121412] relative flex flex-col justify-between shadow-[0_0_25px_rgba(251,191,36,0.25)]">
            {/* Cream Base */}
            <div className="w-full h-3 bg-white flex justify-between items-end px-1 border-b border-black/20">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-3 bg-white ${i % 2 === 0 ? 'h-4.5 rounded-b-md' : 'h-2.5 rounded-b-sm'}`} />
              ))}
            </div>
            {/* Cyber Decorative Pixel Accents */}
            <div className="flex justify-around items-center px-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#4ade80] border border-black/40 rotate-45 shadow-sm" />
              ))}
            </div>
            <div className="w-full h-3 bg-[#ec4899] border-t border-black/20" />
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-96 sm:w-[420px] h-4 bg-[#1e291e] border-2 border-[#4ade80] rounded-b-lg shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-48 h-1 bg-[#4ade80]/40 rounded-full" />
          </div>
        </div>

        {/* 3. INTERACTIVE WISH / BLOW ACTION BAR */}
        <div className="relative z-20 mt-6 max-w-xl w-full flex flex-col items-center gap-3">
          
          {/* Wish Input Box */}
          <div className="w-full bg-[#121612] border border-[#4ade80]/50 p-3 shadow-[0_0_12px_rgba(74,222,128,0.15)]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#fbbf24] mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                MAKE A BIRTHDAY WISH [MATRIX ENCRYPTED]:
              </span>
              {wishLocked && (
                <span className="text-[#4ade80] flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" /> WISH REGISTERED
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
                className="flex-1 bg-[#080a08] border border-[#4ade80]/40 px-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#fbbf24] disabled:opacity-70"
              />
              {!wishLocked && (
                <button
                  type="button"
                  onClick={() => {
                    if (wishText.trim()) {
                      soundEngine.playTone(600, 0.05, 'square', 0.08);
                      setWishLocked(true);
                    }
                  }}
                  className="px-3 py-2 bg-[#1c241c] hover:bg-[#4ade80] hover:text-black border border-[#4ade80] text-[#4ade80] text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  SAVE
                </button>
              )}
            </div>

            {/* Quick Preset Wish Pills */}
            {!wishLocked && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {presetWishes.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWishText(preset);
                      setSelectedPresetWish(preset);
                      soundEngine.playTone(520, 0.03, 'square', 0.05);
                    }}
                    className="text-[10px] font-mono px-2 py-1 bg-[#0a100a] hover:bg-[#4ade80]/20 border border-[#4ade80]/30 text-[#4ade80]/80 rounded transition-all cursor-pointer"
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
                onClick={handleBlowAllCandles}
                className="flex-1 py-3.5 bg-[#4ade80] hover:bg-white text-black font-mono font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_#4ade80] active:scale-95 flex items-center justify-center gap-2"
              >
                <Wind className="w-4 h-4 fill-current" />
                <span>BLOW OUT CANDLES [TRIGGER CELEBRATION]</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRelightCandles}
                  className="px-4 py-3 bg-[#182018] hover:bg-[#4ade80]/20 border border-[#4ade80]/50 text-[#4ade80] font-mono text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RELIGHT CANDLES</span>
                </button>

                <button
                  type="button"
                  id="final-message-nav-btn"
                  onClick={() => {
                    soundEngine.playSelect();
                    onNavigate(ScreenIndex.FINAL_MESSAGE);
                  }}
                  className="flex-1 py-3.5 bg-[#fbbf24] hover:bg-white text-black font-mono font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_#fbbf24] active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>READ FINAL TRANSMISSION LETTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Screen Navigation Bar */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-3 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-3.5 py-1.5 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV: MINI-GAME
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-3.5 py-1.5 bg-[#121412] border border-[#fbbf24]/50 text-[#fbbf24] text-xs uppercase hover:bg-[#fbbf24]/20 active:scale-95 transition-all cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.FINAL_MESSAGE);
          }}
          className="px-4 py-1.5 bg-[#4ade80]/20 border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer"
        >
          FINAL LETTER ▶
        </button>
      </div>

    </div>
  );
};
