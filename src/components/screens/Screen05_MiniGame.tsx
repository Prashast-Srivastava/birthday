import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Award, Heart, Sparkles, ChevronLeft, ChevronRight, Zap, Trophy, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { screenContainerVariants, cardVariants } from '../../utils/animations';

interface Screen05MiniGameProps {
  onNavigate: (index: ScreenIndex) => void;
}

type ItemType = 'cake' | 'star' | 'heart' | 'fish' | 'bomb';

interface FallingItem {
  id: number;
  lane: number;
  x: number;
  y: number;
  speed: number;
  type: ItemType;
  points: number;
  rotation: number;
  scale: number;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  text?: string;
}

const TOTAL_LANES = 5;
const TARGET_SCORE = 100;
const INITIAL_LIVES = 3;

export const Screen05_MiniGame: React.FC<Screen05MiniGameProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'WON' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(INITIAL_LIVES);
  const [combo, setCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [catLane, setCatLane] = useState<number>(2);

  // Internal mutable refs for 60fps canvas loop
  const stateRef = useRef({
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'PAUSED' | 'WON' | 'GAMEOVER',
    catLane: 2,
    catX: 0,
    catTargetX: 0,
    catY: 0,
    score: 0,
    lives: INITIAL_LIVES,
    combo: 0,
    items: [] as FallingItem[],
    particles: [] as ParticleEffect[],
    screenShake: 0,
    lastSpawnTime: 0,
    spawnInterval: 650,
    invulnerableTime: 0,
    animationFrameId: 0,
    itemNextId: 1,
    catAnimFrame: 0,
    lastTimestamp: 0,
  });

  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.catLane = catLane;
  }, [catLane]);

  const moveCat = useCallback((direction: 'left' | 'right') => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    let newLane = stateRef.current.catLane;
    if (direction === 'left' && newLane > 0) {
      newLane -= 1;
    } else if (direction === 'right' && newLane < TOTAL_LANES - 1) {
      newLane += 1;
    }

    if (newLane !== stateRef.current.catLane) {
      stateRef.current.catLane = newLane;
      setCatLane(newLane);
      soundEngine.playTone(480 + newLane * 60, 0.03, 'sine', 0.05);
    }
  }, []);

  const jumpToLane = useCallback((laneIndex: number) => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    if (laneIndex >= 0 && laneIndex < TOTAL_LANES) {
      stateRef.current.catLane = laneIndex;
      setCatLane(laneIndex);
      soundEngine.playTone(480 + laneIndex * 60, 0.03, 'sine', 0.05);
    }
  }, []);

  const handleStartGame = () => {
    soundEngine.playPowerUp();
    setScore(0);
    setLives(INITIAL_LIVES);
    setCombo(0);
    setCatLane(2);

    stateRef.current.score = 0;
    stateRef.current.lives = INITIAL_LIVES;
    stateRef.current.combo = 0;
    stateRef.current.catLane = 2;
    stateRef.current.items = [];
    stateRef.current.particles = [];
    stateRef.current.invulnerableTime = 0;
    stateRef.current.lastSpawnTime = Date.now();
    stateRef.current.gameState = 'PLAYING';

    setGameState('PLAYING');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        moveCat('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        moveCat('right');
      } else if (e.code === 'Space' && (gameState === 'IDLE' || gameState === 'GAMEOVER' || gameState === 'WON')) {
        handleStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveCat, gameState]);

  // Main 60FPS Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 640;
      const h = Math.min(420, window.innerHeight * 0.48);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    stateRef.current.lastTimestamp = performance.now();

    const renderLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - stateRef.current.lastTimestamp) / 1000, 0.1);
      stateRef.current.lastTimestamp = timestamp;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, width, height);

      // Screen shake decay
      let shakeX = 0;
      let shakeY = 0;
      if (stateRef.current.screenShake > 0) {
        stateRef.current.screenShake -= dt * 2.5;
        const mag = stateRef.current.screenShake * 8;
        shakeX = (Math.random() - 0.5) * mag;
        shakeY = (Math.random() - 0.5) * mag;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Soft Dreamy Pastel Sky Canvas Background
      const laneWidth = width / TOTAL_LANES;

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#fdf4ff'); // light lavender
      bgGrad.addColorStop(0.5, '#fff1f2'); // blush pink
      bgGrad.addColorStop(1, '#f0fdf4'); // soft mint
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw delicate hairline lane dividers
      for (let i = 0; i <= TOTAL_LANES; i++) {
        const lx = i * laneWidth;
        ctx.strokeStyle = i === 0 || i === TOTAL_LANES ? 'rgba(244, 114, 182, 0.3)' : 'rgba(244, 114, 182, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Highlight active cat lane with soft pastel glow
      const activeLaneX = stateRef.current.catLane * laneWidth;
      ctx.fillStyle = 'rgba(244, 114, 182, 0.08)';
      ctx.fillRect(activeLaneX, 0, laneWidth, height);

      // Draw Danger / Catch Baseline
      const targetY = height - 55;
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, targetY + 20);
      ctx.lineTo(width, targetY + 20);
      ctx.stroke();

      // 2. Logic Updates if PLAYING
      if (stateRef.current.gameState === 'PLAYING') {
        const now = Date.now();

        // Spawn Items
        if (now - stateRef.current.lastSpawnTime > stateRef.current.spawnInterval) {
          stateRef.current.lastSpawnTime = now;
          const randomLane = Math.floor(Math.random() * TOTAL_LANES);

          const rand = Math.random();
          let type: ItemType = 'cake';
          let points = 20;

          if (rand < 0.30) {
            type = 'cake';
            points = 20;
          } else if (rand < 0.55) {
            type = 'star';
            points = 15;
          } else if (rand < 0.75) {
            type = 'heart';
            points = 10;
          } else if (rand < 0.85) {
            type = 'fish';
            points = 25;
          } else {
            type = 'bomb';
            points = -15;
          }

          const baseSpeed = 160 + (stateRef.current.score / TARGET_SCORE) * 60;

          stateRef.current.items.push({
            id: stateRef.current.itemNextId++,
            lane: randomLane,
            x: randomLane * laneWidth + laneWidth / 2,
            y: -25,
            speed: baseSpeed + Math.random() * 40,
            type,
            points,
            rotation: 0,
            scale: 1,
          });
        }

        // Smooth cat horizontal movement interpolation
        const targetCatX = stateRef.current.catLane * laneWidth + laneWidth / 2;
        stateRef.current.catX += (targetCatX - stateRef.current.catX) * 0.35;
        stateRef.current.catY = targetY;

        if (stateRef.current.invulnerableTime > 0) {
          stateRef.current.invulnerableTime -= dt;
        }

        // Collision box
        const catBox = {
          x: stateRef.current.catX - 26,
          y: stateRef.current.catY - 26,
          w: 52,
          h: 52,
        };

        for (let i = stateRef.current.items.length - 1; i >= 0; i--) {
          const item = stateRef.current.items[i];
          item.y += item.speed * dt;
          item.rotation += dt * 1.5;

          const itemBox = {
            x: item.x - 18,
            y: item.y - 18,
            w: 36,
            h: 36,
          };

          const isColliding =
            catBox.x < itemBox.x + itemBox.w &&
            catBox.x + catBox.w > itemBox.x &&
            catBox.y < itemBox.y + itemBox.h &&
            catBox.y + catBox.h > itemBox.y;

          if (isColliding) {
            if (item.type === 'bomb') {
              if (stateRef.current.invulnerableTime <= 0) {
                soundEngine.playGlitch();
                stateRef.current.screenShake = 0.6;
                stateRef.current.invulnerableTime = 1.2;
                stateRef.current.combo = 0;
                setCombo(0);

                const newLives = stateRef.current.lives - 1;
                stateRef.current.lives = newLives;
                setLives(newLives);

                for (let p = 0; p < 12; p++) {
                  stateRef.current.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: (Math.random() - 0.5) * 200,
                    vy: (Math.random() - 0.5) * 200,
                    color: '#f43f5e',
                    size: 3 + Math.random() * 3,
                    alpha: 1,
                  });
                }

                if (newLives <= 0) {
                  stateRef.current.gameState = 'GAMEOVER';
                  setGameState('GAMEOVER');
                  soundEngine.playTone(180, 0.4, 'sawtooth', 0.15);
                }
              }
            } else {
              // Positive points
              soundEngine.playCoin();

              const currentCombo = stateRef.current.combo + 1;
              stateRef.current.combo = currentCombo;
              setCombo(currentCombo);

              const bonus = currentCombo > 2 ? (currentCombo - 2) * 5 : 0;
              const addedPoints = item.points + bonus;
              const newScore = stateRef.current.score + addedPoints;

              stateRef.current.score = newScore;
              setScore(newScore);

              if (newScore > highScore) {
                setHighScore(newScore);
              }

              const itemColor =
                item.type === 'cake' ? '#f472b6' :
                item.type === 'star' ? '#f59e0b' :
                item.type === 'heart' ? '#ec4899' : '#38bdf8';

              stateRef.current.particles.push({
                x: item.x,
                y: item.y - 10,
                vx: 0,
                vy: -50,
                color: itemColor,
                size: 14,
                alpha: 1,
                text: `+${addedPoints}${bonus > 0 ? ' [COMBO!]' : ''}`,
              });

              for (let p = 0; p < 8; p++) {
                stateRef.current.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 160,
                  vy: -Math.random() * 120,
                  color: itemColor,
                  size: 2 + Math.random() * 3,
                  alpha: 1,
                });
              }

              if (newScore >= TARGET_SCORE) {
                stateRef.current.gameState = 'WON';
                setGameState('WON');
                soundEngine.playFanfare();

                for (let c = 0; c < 50; c++) {
                  const confColor = ['#f472b6', '#c084fc', '#facc15', '#34d399', '#38bdf8'][Math.floor(Math.random() * 5)];
                  stateRef.current.particles.push({
                    x: width / 2,
                    y: height / 2,
                    vx: (Math.random() - 0.5) * 400,
                    vy: -Math.random() * 300 - 50,
                    color: confColor,
                    size: 4 + Math.random() * 4,
                    alpha: 1,
                  });
                }
              }
            }

            stateRef.current.items.splice(i, 1);
            continue;
          }

          if (item.y > height + 30) {
            stateRef.current.items.splice(i, 1);
          }
        }
      }

      // 3. Draw Falling Items (Cute Pastel Sprites)
      stateRef.current.items.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.y);

        if (item.type === 'cake') {
          // 🎂 Pastel Cake Slice
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(-12, -4, 24, 14);
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(-12, 1, 24, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-14, -8, 28, 5);
          // Candle
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(-2, -14, 4, 6);
          // Flame
          ctx.fillStyle = '#fde047';
          ctx.fillRect(-2, -18, 4, 4);
        } else if (item.type === 'star') {
          // ⭐ Pastel Star
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-10, -3, 20, 6);
          ctx.fillRect(-3, -10, 6, 20);
          ctx.fillRect(-7, -7, 14, 14);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-3, -2, 2, 4);
          ctx.fillRect(1, -2, 2, 4);
        } else if (item.type === 'heart') {
          // 💖 Pastel Heart
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(-10, -8, 8, 8);
          ctx.fillRect(2, -8, 8, 8);
          ctx.fillRect(-12, -4, 24, 8);
          ctx.fillRect(-10, 4, 20, 4);
          ctx.fillRect(-6, 8, 12, 4);
          ctx.fillRect(-2, 12, 4, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-8, -6, 2, 2);
        } else if (item.type === 'fish') {
          // 🐟 Pastel Fish
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-10, -6, 16, 12);
          ctx.fillRect(6, -8, 6, 16);
          ctx.fillRect(12, -10, 4, 20);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-6, -3, 2, 2);
        } else if (item.type === 'bomb') {
          // 💣 Pastel Storm Cloud / Obstacle
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(-10, -6, 20, 16);
          ctx.fillRect(-6, -10, 12, 20);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(-4, -2, 8, 4);
        }

        ctx.restore();
      });

      // 4. Draw Cute Pastel Birthday Cat
      const catX = stateRef.current.catX || (activeLaneX + laneWidth / 2);
      const catY = targetY;

      ctx.save();
      ctx.translate(catX, catY);

      if (stateRef.current.invulnerableTime > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Party Hat
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-4, -36, 8, 4);
      ctx.fillRect(-3, -42, 6, 6);
      ctx.fillRect(-2, -46, 4, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-1, -48, 2, 2);

      // Cat Ears
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -26, 8, 8);
      ctx.fillRect(8, -26, 8, 8);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-14, -24, 4, 4);
      ctx.fillRect(10, -24, 4, 4);

      // Head Base (Creamy White)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-18, -18, 36, 22);
      ctx.strokeStyle = '#fce7f3';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-18, -18, 36, 22);

      // Cute Eyes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -12, 6, 6);
      ctx.fillRect(6, -12, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-10, -12, 2, 2);
      ctx.fillRect(8, -12, 2, 2);

      // Pink Cheeks
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(-16, -4, 4, 3);
      ctx.fillRect(12, -4, 4, 3);

      // Nose & Mouth
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-2, -6, 4, 2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-4, -3, 3, 2);
      ctx.fillRect(1, -3, 3, 2);

      // Whiskers
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-24, -8, 6, 1.5);
      ctx.fillRect(-24, -4, 6, 1.5);
      ctx.fillRect(18, -8, 6, 1.5);
      ctx.fillRect(18, -4, 6, 1.5);

      // Catch Basket (Pastel Lavender)
      ctx.fillStyle = '#f3e8ff';
      ctx.fillRect(-22, 6, 44, 10);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-22, 6, 44, 2);
      ctx.strokeStyle = '#e9d5ff';
      ctx.strokeRect(-22, 6, 44, 10);

      ctx.restore();

      // 5. Draw Particles
      for (let p = stateRef.current.particles.length - 1; p >= 0; p--) {
        const particle = stateRef.current.particles[p];
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.alpha -= dt * 1.3;

        if (particle.alpha <= 0) {
          stateRef.current.particles.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = particle.alpha;

        if (particle.text) {
          ctx.font = 'bold 12px Nunito, sans-serif';
          ctx.fillStyle = particle.color;
          ctx.fillText(particle.text, particle.x - 15, particle.y);
        } else {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.restore();

      stateRef.current.animationFrameId = requestAnimationFrame(renderLoop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(stateRef.current.animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [highScore]);

  const progressPercent = Math.min(100, Math.round((score / TARGET_SCORE) * 100));

  return (
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Top HUD & Score Bar */}
      <motion.div variants={cardVariants} className="bg-white/55 backdrop-blur-xl border border-white/80 p-5 sm:p-6 mb-5 rounded-3xl shadow-xl shadow-pink-100/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/60 pb-3">
          <div>
            <div className="dev-eyebrow-pill mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>ARCADE QUEST • STAGE 05</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 tracking-tight">
              Catch the Birthday Treats // <span className="text-pink-600">Cake Rush</span> 🍰
            </h2>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-white/70 px-3.5 py-1.5 border border-pink-200 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="text-slate-500 font-bold">TARGET:</span>
              <span className="text-slate-800 font-bold">{TARGET_SCORE} PTS</span>
            </div>
            <div className="bg-pink-100/80 px-3.5 py-1.5 border border-pink-200 rounded-full flex items-center gap-1.5 shadow-xs">
              <Trophy className="w-3 h-3 text-pink-600" />
              <span className="text-pink-700 font-bold">{highScore} PTS</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Lives */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>QUEST PROGRESS</span>
              <span className="text-pink-600">{progressPercent}% [{score} / {TARGET_SCORE} PTS]</span>
            </div>
            <div className="w-full h-3 bg-pink-100/50 rounded-full border border-white/80 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-full transition-all duration-300 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lives & Combo Indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/70 px-3.5 py-1.5 border border-pink-200 rounded-full shadow-xs">
              <span className="text-xs text-slate-500 font-bold mr-1">LIVES:</span>
              {[...Array(INITIAL_LIVES)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 transition-transform ${
                    i < lives ? 'fill-pink-500 text-pink-500 scale-100' : 'text-slate-300 scale-90 opacity-40'
                  }`}
                />
              ))}
            </div>

            {combo > 1 && (
              <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-pink-400 text-white rounded-full text-xs font-bold shadow-sm animate-bounce">
                x{combo} STREAK!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Interactive Canvas Area with Frosted Frame */}
      <motion.div variants={cardVariants} className="relative w-full border border-white/90 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-100/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          id="birthday-cat-game-canvas"
          className="w-full block cursor-pointer"
        />

        {/* 5 Lane Click Zones */}
        <div className="absolute inset-0 grid grid-cols-5 pointer-events-auto">
          {[0, 1, 2, 3, 4].map(laneIndex => (
            <button
              key={laneIndex}
              type="button"
              onClick={() => jumpToLane(laneIndex)}
              className="w-full h-full opacity-0 hover:opacity-15 bg-pink-300 active:bg-pink-400 transition-opacity cursor-pointer flex flex-col justify-end pb-3 items-center text-[11px] font-bold text-pink-800"
              title={`Move cat to Lane ${laneIndex + 1}`}
            >
              <span className="opacity-80">LANE {laneIndex + 1}</span>
            </button>
          ))}
        </div>

        {/* IDLE / START OVERLAY */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20">
            <div className="p-6 bg-white/90 border border-white rounded-3xl max-w-md w-full shadow-2xl shadow-pink-200/50 text-slate-800">
              <div className="dev-eyebrow-pill mb-2 mx-auto inline-flex">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>MISSION BRIEFING</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">
                Catch the Birthday Treats!
              </h3>
              
              <div className="text-xs text-slate-600 text-left space-y-2 bg-pink-50/60 p-4 rounded-2xl border border-pink-100 mb-5 font-medium">
                <p>🎂 <b className="text-slate-800">Cakes (+20 pts)</b> & 🐟 <b className="text-slate-800">Fish (+25 pts)</b> fall down.</p>
                <p>⭐ <b className="text-slate-800">Stars (+15 pts)</b> & 💖 <b className="text-slate-800">Hearts (+10 pts)</b> build combos.</p>
                <p><b className="text-rose-600">Avoid stormy clouds!</b> They cost 1 heart.</p>
                <p>🏆 Reach <b className="text-pink-600">100 PTS</b> to unlock the Cake & Candles Ceremony!</p>
              </div>

              <div className="text-xs text-slate-500 mb-5 font-medium">
                Arrows [◀ / ▶] or [A / D] • Tap screen lanes or buttons
              </div>

              <button
                type="button"
                id="start-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START CELEBRATION QUEST</span>
              </button>
            </div>
          </div>
        )}

        {/* MISSION COMPLETE / LEVEL UNLOCKED CELEBRATION OVERLAY */}
        {gameState === 'WON' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30">
            <div className="p-6 sm:p-7 bg-white/90 border border-white rounded-3xl max-w-lg w-full shadow-2xl shadow-pink-200/50 text-slate-800">
              <div className="inline-block px-3 py-1 bg-pink-100 text-pink-600 border border-pink-200 rounded-full text-xs font-bold mb-3">
                ★ VICTORY CONFIRMED ★
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-800 mb-1">
                Mission Complete! 🎉
              </h3>
              <p className="text-sm text-emerald-600 font-bold mb-4">
                Level 22 Cake Ceremony Unlocked!
              </p>

              <div className="p-4 bg-pink-50/60 border border-pink-100 rounded-2xl text-xs space-y-2 mb-6 font-medium">
                <div className="flex justify-between items-center py-1 border-b border-pink-100">
                  <span className="text-slate-500">RECIPIENT:</span>
                  <span className="font-bold text-slate-800">{birthdayConfig.recipientName} // LEVEL 22</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-pink-100">
                  <span className="text-slate-500">FINAL SCORE:</span>
                  <span className="font-bold text-pink-600">{score} PTS [VICTORY!]</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">NEXT STAGE:</span>
                  <span className="font-bold text-purple-600">CAKE & CANDLES CEREMONY</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="px-5 py-2.5 bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
                  <span>PLAY AGAIN</span>
                </button>

                <button
                  type="button"
                  id="proceed-to-cake-btn"
                  onClick={() => {
                    soundEngine.playFanfare();
                    onNavigate(ScreenIndex.CAKE);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>PROCEED TO CAKE CEREMONY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30">
            <div className="p-6 bg-white/90 border border-white rounded-3xl max-w-md w-full shadow-2xl shadow-pink-200/50 text-slate-800">
              <div className="dev-eyebrow-pill mb-2 mx-auto inline-flex border-rose-200 text-rose-600 bg-rose-50">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>PAUSE & TRY AGAIN</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">
                Almost There!
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                The birthday cat bumped into stormy clouds. Good news: friendship has unlimited tries!
              </p>

              <div className="p-3 bg-pink-50/60 border border-pink-100 rounded-2xl text-xs mb-5 flex justify-between font-bold">
                <span className="text-slate-500">POINTS SCORED:</span>
                <span className="text-pink-600">{score} / {TARGET_SCORE} PTS</span>
              </div>

              <button
                type="button"
                id="retry-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-full shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY QUEST // CONTINUE</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tactile D-Pad Controls */}
      <motion.div variants={cardVariants} className="mt-4 p-4 bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md shadow-pink-100/30">
        <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span className="font-bold text-slate-800">CONTROLS:</span>
          <span className="hidden sm:inline">Use Left/Right arrow keys, A/D, or tap the buttons below.</span>
          <span className="sm:hidden">Tap Left / Right buttons or screen lanes.</span>
        </div>

        {/* On-Screen D-Pad Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            id="dpad-left-btn"
            onClick={() => moveCat('left')}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white/80 hover:bg-white border border-pink-200 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
            aria-label="Move cat left"
          >
            <ChevronLeft className="w-4 h-4 text-pink-500" />
            <span>LEFT</span>
          </button>

          <button
            type="button"
            id="dpad-right-btn"
            onClick={() => moveCat('right')}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white/80 hover:bg-white border border-pink-200 text-slate-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
            aria-label="Move cat right"
          >
            <span>RIGHT</span>
            <ChevronRight className="w-4 h-4 text-pink-500" />
          </button>
        </div>
      </motion.div>

      {/* Bottom Screen Navigation Bar */}
      <motion.div variants={cardVariants} className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-5 py-2.5 bg-white/70 hover:bg-white border border-white/80 hover:border-pink-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PREV: MEMORIES</span>
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
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-md shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-2"
        >
          <span>PROCEED TO CAKE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

    </motion.div>
  );
};
