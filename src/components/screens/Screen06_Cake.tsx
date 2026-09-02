import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wind, RotateCcw, ArrowRight, Heart, Flame, Gift, Check, Send } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { PixelConfetti, ConfettiColor, ConfettiShape } from '../common/PixelConfetti';

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
  const [burstConfetti, setBurstConfetti] = useState<BurstConfettiItem[]>([]);
  const burstCleanupTimerRef = useRef<number | null>(null);

  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const confettiStartRef = useRef<number>(0);

  const allCandlesOut = candles.every(c => !c.lit);

  // Check prefers-reduced-motion
  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Trigger burst of PixelConfetti components radiating outward from center of screen
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
      // 360-degree radial explosion
      const baseAngle = (i / count) * (Math.PI * 2);
      const angle = baseAngle + (Math.random() - 0.5) * 0.35;

      // Burst outward distance from center (80px to 420px)
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

    // Clean up burst items after animation completes
    burstCleanupTimerRef.current = window.setTimeout(() => {
      setBurstConfetti([]);
    }, 3500);
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

  // 'Blow Candles' event handler: extinguishes candles, plays fanfare,
  // locks wish, and triggers a burst of PixelConfetti components radiating outward from screen center
  const handleBlowCandles = () => {
    soundEngine.playFanfare();
    setCandles(prev => prev.map(c => ({ ...c, lit: false })));
    setIsBlown(true);
    setWishLocked(true);
    triggerConfetti();
    triggerPixelConfettiBurst();

    // Generate cute smoke puffs
    const puffs = CANDLE_DEFS.map((c, idx) => ({
      id: Date.now() + idx,
      x: idx * 60 + 20,
      y: -10,
    }));
    setSmokePuffs(puffs);
  };

  // Backward compatible alias
  const handleBlowAllCandles = handleBlowCandles;

  // Handle Blow Single Candle
  const handleToggleCandle = (id: number) => {
    setCandles(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, lit: !c.lit } : c));
      const allOut = updated.every(c => !c.lit);
      if (allOut && !isBlown) {
        setTimeout(() => handleBlowCandles(), 0);
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
    <div className="relative w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Hand-rolled Confetti Canvas Layer */}
      <canvas
        ref={canvasRef}
        id="birthday-confetti-canvas"
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      />

      {/* Center-Screen Burst of PixelConfetti Components (Triggered on Blow Candles) */}
      {burstConfetti.length > 0 && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
        >
          {/* Exact Center Anchor of Screen */}
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
                  className="drop-shadow-[2px_2px_0_#16192e]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen Top Header */}
      <div className="bg-[#ffd000] border-3 border-[#16192e] p-3 sm:p-4 mb-4 brutal-shadow relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#16192e]/20 pb-2.5">
          <div>
            <div className="text-[10px] font-pixel font-bold text-[#16192e] uppercase flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#f43f5e] border border-[#16192e] inline-block" />
              SECTOR 06 // BIRTHDAY CAKE & CANDLE CEREMONY
            </div>
            <h2 className="text-base sm:text-xl font-pixel font-black uppercase tracking-wide text-[#16192e] mt-0.5">
              LEVEL 22 // WISH PROTOCOL ENGAGED
            </h2>
          </div>

          <div className="flex items-center gap-2 font-pixel text-[10px]">
            <div className="bg-[#fffdf0] px-2.5 py-1 border-2 border-[#16192e] flex items-center gap-1.5">
              <span className="opacity-70 text-[#16192e]">RECIPIENT:</span>
              <span className="text-[#16192e] font-bold">{birthdayConfig.recipientName} (LVL 22)</span>
            </div>
            <div className={`px-2.5 py-1 border-2 border-[#16192e] font-bold flex items-center gap-1.5 transition-colors ${
              allCandlesOut 
                ? 'bg-[#22c55e] text-[#16192e]' 
                : 'bg-[#ff5e97] text-[#16192e]'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{candles.filter(c => c.lit).length} / {candles.length} LIT</span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs font-mono text-[#16192e]/80">
          Make a wish, input your custom birthday intention into the matrix, and blow out the pixel candles to trigger the celebration protocol.
        </p>
      </div>

      {/* Main Cake Stage Container: Styled as a Brutalist Birthday Gift Card Box */}
      <div className="relative border-4 border-[#16192e] bg-[#fffdf0] p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] brutal-shadow-lg overflow-hidden">
        
        {/* Gift Box Ribbon Accent Bars */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#f43f5e]/15 border-x-2 border-[#16192e]/20 pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-[#f43f5e]/15 border-y-2 border-[#16192e]/20 pointer-events-none" />

        {/* 1. CANDLE ROW (ABOVE CAKE) */}
        <div className="relative z-20 flex items-end justify-center gap-3 sm:gap-6 mb-2">
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
                  {/* Outer Flame */}
                  <div className="w-4 h-6 bg-[#ffd000] border-2 border-[#16192e] shadow-sm transform group-hover:scale-110 transition-transform" />
                  {/* Inner Core */}
                  <div className="absolute bottom-1 w-2 h-3 bg-[#f43f5e]" />
                </div>
              ) : (
                <div className="flex flex-col items-center mb-1 h-6 justify-end">
                  {/* Smoke Trail */}
                  <div className="w-1.5 h-3 bg-[#16192e]/40 animate-ping mb-1" />
                  <div className="w-1 h-2 bg-[#16192e]" />
                </div>
              )}

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-[#16192e]" />

              {/* Candle Body (Pixel Stripes) */}
              <div
                className="w-4 sm:w-5 h-14 sm:h-16 border-2 border-[#16192e] flex flex-col justify-between p-0.5"
                style={{ backgroundColor: candle.color }}
              >
                <div className="w-full h-1.5 bg-white" />
                <div className="w-full h-1.5 bg-[#16192e]/30" />
                <div className="w-full h-1.5 bg-white" />
                <div className="w-full h-1.5 bg-[#16192e]/30" />
              </div>

              {/* Candle Tag / Meaning */}
              <span className="mt-1.5 text-[8px] font-pixel text-[#16192e] text-center max-w-[65px] line-clamp-1 font-bold">
                {candle.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2. THE MULTI-TIER RETRO PIXEL BIRTHDAY CAKE */}
        <div className="relative z-10 flex flex-col items-center select-none">
          
          {/* Top Tier (Small) */}
          <div className="w-48 sm:w-64 h-12 bg-[#ffd000] border-3 border-[#16192e] relative flex flex-col justify-between brutal-shadow-sm">
            {/* White Cream Drippings */}
            <div className="w-full h-3.5 bg-white flex justify-between items-end px-1 border-b-2 border-[#16192e]">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-2.5 bg-white border-x border-b border-[#16192e] ${i % 2 === 0 ? 'h-3.5' : 'h-2'}`} />
              ))}
            </div>
            {/* Strawberry Jewels */}
            <div className="flex justify-around items-center px-2 py-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#f43f5e] border-2 border-[#16192e]" />
              ))}
            </div>
            {/* Sponge Layer Separator */}
            <div className="w-full h-2 bg-[#ff5e97] border-t-2 border-[#16192e]" />
          </div>

          {/* Middle Tier (Medium) */}
          <div className="w-64 sm:w-80 h-14 bg-[#ffd000] border-3 border-[#16192e] relative flex flex-col justify-between brutal-shadow-sm -mt-0.5">
            {/* Cream Frosting Pattern */}
            <div className="w-full h-3.5 bg-white flex justify-between items-end px-1 border-b-2 border-[#16192e]">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`w-3 bg-white border-x border-b border-[#16192e] ${i % 2 === 0 ? 'h-4' : 'h-2.5'}`} />
              ))}
            </div>
            {/* LEVEL 22 Frosting Text Badge */}
            <div className="text-center text-[10px] font-pixel font-bold text-[#16192e] tracking-wider bg-[#00f0ff] py-0.5 border-y-2 border-[#16192e]">
              ★ LEVEL 22 // HAPPY BIRTHDAY ★
            </div>
            {/* Sponge Layer Separator */}
            <div className="w-full h-2.5 bg-[#f43f5e] border-t-2 border-[#16192e]" />
          </div>

          {/* Bottom Tier (Base) */}
          <div className="w-80 sm:w-96 h-16 bg-[#ffd000] border-3 border-[#16192e] relative flex flex-col justify-between brutal-shadow-sm -mt-0.5">
            {/* Cream Base */}
            <div className="w-full h-3.5 bg-white flex justify-between items-end px-1 border-b-2 border-[#16192e]">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-3 bg-white border-x border-b border-[#16192e] ${i % 2 === 0 ? 'h-4.5' : 'h-2.5'}`} />
              ))}
            </div>
            {/* Decorative Pixel Accents */}
            <div className="flex justify-around items-center px-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-[#22c55e] border-2 border-[#16192e]" />
              ))}
            </div>
            <div className="w-full h-3 bg-[#ff5e97] border-t-2 border-[#16192e]" />
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-96 sm:w-[420px] h-5 bg-[#00f0ff] border-3 border-[#16192e] brutal-shadow-sm flex items-center justify-center -mt-0.5">
            <div className="w-48 h-1 bg-[#16192e]" />
          </div>
        </div>

        {/* 3. INTERACTIVE WISH / BLOW ACTION BAR */}
        <div className="relative z-20 mt-6 max-w-xl w-full flex flex-col items-center gap-3">
          
          {/* Wish Input Box */}
          <div className="w-full bg-[#ffd000] border-3 border-[#16192e] p-3.5 brutal-shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-pixel font-bold text-[#16192e] mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                MAKE A BIRTHDAY WISH:
              </span>
              {wishLocked && (
                <span className="text-[#16192e] bg-[#22c55e] px-1.5 py-0.5 border border-[#16192e] flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> REGISTERED
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
                className="flex-1 bg-[#fffdf0] border-2 border-[#16192e] px-3 py-2 text-xs font-mono text-[#16192e] placeholder-gray-500 focus:outline-none disabled:opacity-75"
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
                  className="px-3.5 py-2 bg-[#22c55e] text-[#16192e] border-2 border-[#16192e] text-[10px] font-pixel font-bold brutal-btn-sm cursor-pointer"
                >
                  SAVE
                </button>
              )}
            </div>

            {/* Quick Preset Wish Pills */}
            {!wishLocked && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {presetWishes.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWishText(preset);
                      setSelectedPresetWish(preset);
                      soundEngine.playTone(520, 0.03, 'square', 0.05);
                    }}
                    className="text-[10px] font-mono font-bold px-2 py-1 bg-[#fffdf0] hover:bg-[#fff9d9] border-2 border-[#16192e] text-[#16192e] brutal-btn-sm transition-all cursor-pointer"
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
                className="flex-1 py-3.5 bg-[#22c55e] text-[#16192e] font-pixel font-bold text-xs sm:text-sm uppercase tracking-wider brutal-btn flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                <span>BLOW OUT CANDLES [CELEBRATE!]</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRelightCandles}
                  className="px-4 py-3 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] font-pixel text-[10px] uppercase brutal-btn-sm flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="flex-1 py-3.5 bg-[#ffd000] text-[#16192e] font-pixel font-bold text-xs sm:text-sm uppercase tracking-wider brutal-btn flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>READ FINAL LETTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Screen Navigation Bar */}
      <div className="mt-4 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MINIGAME);
          }}
          className="px-3.5 py-2 bg-[#fffdf0] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm cursor-pointer"
        >
          ◀ PREV: MINI-GAME
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-3.5 py-2 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.FINAL_MESSAGE);
          }}
          className="px-4 py-2 bg-[#22c55e] border-2 border-[#16192e] text-[#16192e] text-xs font-pixel font-bold uppercase brutal-btn-sm cursor-pointer"
        >
          FINAL LETTER ▶
        </button>
      </div>

    </div>
  );
};
