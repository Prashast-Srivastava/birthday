import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Award, Heart, Sparkles, ChevronLeft, ChevronRight, Zap, Trophy, ShieldAlert, ArrowRight } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';

interface Screen05MiniGameProps {
  onNavigate: (index: ScreenIndex) => void;
}

type ItemType = 'cake' | 'star' | 'heart' | 'fish' | 'bomb';

interface FallingItem {
  id: number;
  lane: number; // 0 to 4 (5 lanes)
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
  const [catLane, setCatLane] = useState<number>(2); // Start at middle lane (0,1,2,3,4)

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
    spawnInterval: 650, // ms between drops
    invulnerableTime: 0,
    animationFrameId: 0,
    itemNextId: 1,
    catAnimFrame: 0,
    lastTimestamp: 0,
  });

  // Keep stateRef in sync with React state when needed
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.catLane = catLane;
  }, [catLane]);

  // Move cat left / right with boundary checks and retro click sound
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
      soundEngine.playTone(480 + newLane * 60, 0.03, 'square', 0.05);
    }
  }, []);

  // Jump directly to specific lane (for mouse/touch clicks on lanes)
  const jumpToLane = useCallback((laneIndex: number) => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    if (laneIndex >= 0 && laneIndex < TOTAL_LANES) {
      stateRef.current.catLane = laneIndex;
      setCatLane(laneIndex);
      soundEngine.playTone(480 + laneIndex * 60, 0.03, 'square', 0.05);
    }
  }, []);

  // Start game handler
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
    stateRef.current.screenShake = 0;
    stateRef.current.invulnerableTime = 0;
    stateRef.current.lastSpawnTime = Date.now();
    stateRef.current.gameState = 'PLAYING';
    setGameState('PLAYING');
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveCat('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveCat('right');
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (stateRef.current.gameState === 'IDLE' || stateRef.current.gameState === 'GAMEOVER') {
          e.preventDefault();
          handleStartGame();
        } else if (stateRef.current.gameState === 'WON') {
          e.preventDefault();
          soundEngine.playFanfare();
          onNavigate(ScreenIndex.CAKE);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveCat, onNavigate]);

  // Main Canvas Rendering and Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = Math.min(540, Math.max(380, window.innerHeight * 0.52));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Main animation frame loop
    let running = true;

    const gameLoop = (timestamp: number) => {
      if (!running) return;

      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : 600;
      const height = Math.min(540, Math.max(380, window.innerHeight * 0.52));

      const dt = stateRef.current.lastTimestamp ? Math.min((timestamp - stateRef.current.lastTimestamp) / 1000, 0.1) : 0.016;
      stateRef.current.lastTimestamp = timestamp;

      // Clear Canvas
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Handle Screen Shake
      if (stateRef.current.screenShake > 0) {
        stateRef.current.screenShake -= dt * 15;
        if (stateRef.current.screenShake < 0) stateRef.current.screenShake = 0;
        const shakeMag = stateRef.current.screenShake * 8;
        const shakeX = (Math.random() - 0.5) * shakeMag;
        const shakeY = (Math.random() - 0.5) * shakeMag;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Retro Arcade Grid Background
      const laneWidth = width / TOTAL_LANES;

      ctx.fillStyle = '#060806';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle phosphor lane dividers
      for (let i = 0; i <= TOTAL_LANES; i++) {
        const lx = i * laneWidth;
        ctx.strokeStyle = i === 0 || i === TOTAL_LANES ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Highlight active cat lane
      const activeLaneX = stateRef.current.catLane * laneWidth;
      ctx.fillStyle = 'rgba(74, 222, 128, 0.04)';
      ctx.fillRect(activeLaneX, 0, laneWidth, height);

      // Draw Danger Baseline
      const targetY = height - 55;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
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

          // Weighted item distribution:
          // 30% Cake, 25% Star, 20% Heart, 10% Fish, 15% Glitch Bomb
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

        // Decrease invulnerability timer
        if (stateRef.current.invulnerableTime > 0) {
          stateRef.current.invulnerableTime -= dt;
        }

        // Update & check falling items
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

          // Collision detection with Cat
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
            // Collision event!
            if (item.type === 'bomb') {
              if (stateRef.current.invulnerableTime <= 0) {
                soundEngine.playGlitch();
                stateRef.current.screenShake = 0.8;
                stateRef.current.invulnerableTime = 1.2;
                stateRef.current.combo = 0;
                setCombo(0);

                const newLives = stateRef.current.lives - 1;
                stateRef.current.lives = newLives;
                setLives(newLives);

                // Spawn red damage glitch particles
                for (let p = 0; p < 12; p++) {
                  stateRef.current.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: (Math.random() - 0.5) * 200,
                    vy: (Math.random() - 0.5) * 200,
                    color: '#ef4444',
                    size: 3 + Math.random() * 3,
                    alpha: 1,
                  });
                }

                // Check Game Over
                if (newLives <= 0) {
                  stateRef.current.gameState = 'GAMEOVER';
                  setGameState('GAMEOVER');
                  soundEngine.playTone(180, 0.4, 'sawtooth', 0.15);
                }
              }
            } else {
              // Positive item collected!
              soundEngine.playCoin();
              const newCombo = stateRef.current.combo + 1;
              stateRef.current.combo = newCombo;
              setCombo(newCombo);

              const bonus = newCombo > 3 ? 5 : 0;
              const addedPoints = item.points + bonus;
              const newScore = Math.min(TARGET_SCORE, stateRef.current.score + addedPoints);

              stateRef.current.score = newScore;
              setScore(newScore);

              setHighScore(prev => Math.max(prev, newScore));

              // Spawn positive particle pops & floating "+20" text
              const itemColor =
                item.type === 'cake' ? '#fbbf24' :
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

              // Check WIN condition (Target 100 PTS)
              if (newScore >= TARGET_SCORE) {
                stateRef.current.gameState = 'WON';
                setGameState('WON');
                soundEngine.playFanfare();

                // Huge victory confetti burst particles
                for (let c = 0; c < 50; c++) {
                  const confColor = ['#4ade80', '#fbbf24', '#ec4899', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 5)];
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

            // Remove item from falling array
            stateRef.current.items.splice(i, 1);
            continue;
          }

          // Off-screen removal
          if (item.y > height + 30) {
            stateRef.current.items.splice(i, 1);
          }
        }
      }

      // 3. Draw Falling Items (Procedural 8-bit Pixel Sprites)
      stateRef.current.items.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.y);

        if (item.type === 'cake') {
          // 🎂 8-bit Birthday Cake Slice
          ctx.fillStyle = '#fbbf24'; // Cake sponge
          ctx.fillRect(-12, -4, 24, 14);
          ctx.fillStyle = '#f43f5e'; // Strawberry cream
          ctx.fillRect(-12, 1, 24, 3);
          ctx.fillStyle = '#ffffff'; // White frosting top
          ctx.fillRect(-14, -8, 28, 5);
          // Candle
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-2, -14, 4, 6);
          // Flame
          ctx.fillStyle = '#ffedd5';
          ctx.fillRect(-2, -18, 4, 4);
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(-1, -17, 2, 2);
        } else if (item.type === 'star') {
          // ⭐ 8-bit Super Star
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(-10, -3, 20, 6);
          ctx.fillRect(-3, -10, 6, 20);
          ctx.fillRect(-7, -7, 14, 14);
          ctx.fillStyle = '#000000'; // Eyes
          ctx.fillRect(-3, -2, 2, 4);
          ctx.fillRect(1, -2, 2, 4);
        } else if (item.type === 'heart') {
          // 💖 8-bit Love Heart
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(-10, -8, 8, 8);
          ctx.fillRect(2, -8, 8, 8);
          ctx.fillRect(-12, -4, 24, 8);
          ctx.fillRect(-10, 4, 20, 4);
          ctx.fillRect(-6, 8, 12, 4);
          ctx.fillRect(-2, 12, 4, 4);
          ctx.fillStyle = '#ffffff'; // Shine
          ctx.fillRect(-8, -6, 2, 2);
        } else if (item.type === 'fish') {
          // 🐟 8-bit Cat Fish Snack
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-10, -6, 16, 12);
          ctx.fillRect(6, -8, 6, 16);
          ctx.fillRect(12, -10, 4, 20);
          ctx.fillStyle = '#000000'; // Eye
          ctx.fillRect(-6, -3, 2, 2);
        } else if (item.type === 'bomb') {
          // 💣 8-bit Glitch Bomb / Bug
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-10, -6, 20, 16);
          ctx.fillRect(-6, -10, 12, 20);
          // Glitch fuse spark
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(-2, -14, 4, 4);
          // Danger X icon
          ctx.fillStyle = '#000000';
          ctx.fillRect(-6, -3, 4, 4);
          ctx.fillRect(2, -3, 4, 4);
          ctx.fillRect(-2, 1, 4, 4);
          ctx.fillRect(-6, 5, 4, 4);
          ctx.fillRect(2, 5, 4, 4);
        }

        ctx.restore();
      });

      // 4. Draw The Birthday Cat Character at bottom
      const catX = stateRef.current.catX || (activeLaneX + laneWidth / 2);
      const catY = targetY;

      ctx.save();
      ctx.translate(catX, catY);

      // Invulnerability flashing effect
      if (stateRef.current.invulnerableTime > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.35;
      }

      // Draw Retro Pixel Cat Sprite on Canvas
      // Ears
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-16, -26, 8, 8);
      ctx.fillRect(8, -26, 8, 8);
      ctx.fillStyle = '#ec4899'; // Inner pink ears
      ctx.fillRect(-14, -24, 4, 4);
      ctx.fillRect(10, -24, 4, 4);

      // Birthday Party Hat
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-4, -36, 8, 4);
      ctx.fillRect(-3, -42, 6, 6);
      ctx.fillRect(-2, -46, 4, 4);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-1, -48, 2, 2);

      // Head Base
      ctx.fillStyle = '#0a100a';
      ctx.fillRect(-18, -18, 36, 22);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-18, -18, 36, 2);
      ctx.fillRect(-18, 2, 36, 2);
      ctx.fillRect(-18, -18, 2, 22);
      ctx.fillRect(16, -18, 2, 22);

      // Cute Big Green Eyes
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-12, -12, 6, 6);
      ctx.fillRect(6, -12, 6, 6);
      ctx.fillStyle = '#ffffff'; // Eye shine
      ctx.fillRect(-10, -12, 2, 2);
      ctx.fillRect(8, -12, 2, 2);

      // Pink Cheeks
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-16, -4, 4, 3);
      ctx.fillRect(12, -4, 4, 3);

      // Nose & Mouth
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-2, -6, 4, 2);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-4, -3, 3, 2);
      ctx.fillRect(1, -3, 3, 2);

      // Whiskers
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-24, -8, 6, 1.5);
      ctx.fillRect(-24, -4, 6, 1.5);
      ctx.fillRect(18, -8, 6, 1.5);
      ctx.fillRect(18, -4, 6, 1.5);

      // Catch Basket / Paws (Ready to catch falling cakes)
      ctx.fillStyle = '#121a12';
      ctx.fillRect(-22, 6, 44, 10);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-22, 6, 44, 2);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-14, 10, 6, 4);
      ctx.fillRect(8, 10, 6, 4);

      ctx.restore();

      // 5. Update & Draw Particles (Pops, Sparks, Score Texts)
      for (let p = stateRef.current.particles.length - 1; p >= 0; p--) {
        const pt = stateRef.current.particles[p];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= dt * 1.5;

        if (pt.alpha <= 0) {
          stateRef.current.particles.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);

        if (pt.text) {
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = pt.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 6;
          ctx.fillText(pt.text, pt.x, pt.y);
        } else {
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 4;
          ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        }
        ctx.restore();
      }

      ctx.restore(); // Restore root translation

      stateRef.current.animationFrameId = requestAnimationFrame(gameLoop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(stateRef.current.animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const progressPercent = Math.min(100, Math.round((score / TARGET_SCORE) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none">
      
      {/* Screen Top Header & Quest HUD */}
      <div className="border border-[#4ade80]/40 bg-[#080a08]/95 p-4 sm:p-5 mb-4 box-glow-green relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4ade80]/20 pb-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#fbbf24] inline-block animate-pulse" />
              MINI-GAME SECTOR 05 // ARCADE KERNEL
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white glow-phosphor mt-0.5">
              SAVE THE BIRTHDAY CAT // CAKE RUSH
            </h2>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-[#121412] px-3 py-1.5 border border-[#4ade80]/40 flex items-center gap-2">
              <span className="opacity-60 text-[#4ade80]">TARGET:</span>
              <span className="text-[#fbbf24] font-bold">{TARGET_SCORE} PTS</span>
            </div>
            <div className="bg-[#121412] px-3 py-1.5 border border-[#4ade80]/40 flex items-center gap-2">
              <span className="opacity-60 text-[#4ade80]">HIGH SCORE:</span>
              <span className="text-[#4ade80] font-bold">{highScore} PTS</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Level 22 Sync Bar */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <div className="flex justify-between text-[11px] font-mono text-[#4ade80] mb-1">
              <span>LEVEL 22 AWAKENING SYNC:</span>
              <span className="font-bold text-[#fbbf24]">{progressPercent}% [{score} / {TARGET_SCORE} PTS]</span>
            </div>
            <div className="w-full h-3 bg-[#121612] border border-[#4ade80]/40 overflow-hidden relative p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#4ade80] via-[#fbbf24] to-[#ec4899] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lives & Combo Indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-4 font-mono text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#4ade80] opacity-60 mr-1">LIVES:</span>
              {[...Array(INITIAL_LIVES)].map((_, i) => (
                <span
                  key={i}
                  className={`text-base transition-transform ${
                    i < lives ? 'text-[#ef4444] scale-100 animate-pulse' : 'text-gray-600 scale-90 opacity-40'
                  }`}
                >
                  💖
                </span>
              ))}
            </div>

            {combo > 1 && (
              <div className="px-2 py-0.5 bg-[#fbbf24]/20 border border-[#fbbf24] text-[#fbbf24] text-[10px] font-bold animate-bounce">
                x{combo} STREAK!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full border-2 border-[#4ade80] bg-[#060806] shadow-[0_0_24px_rgba(74,222,128,0.25)] overflow-hidden">
        <canvas
          ref={canvasRef}
          id="birthday-cat-game-canvas"
          className="w-full block cursor-pointer"
        />

        {/* 5 Lane Click Zones (Desktop & Mobile Tap Support) */}
        <div className="absolute inset-0 grid grid-cols-5 pointer-events-auto">
          {[0, 1, 2, 3, 4].map(laneIndex => (
            <button
              key={laneIndex}
              type="button"
              onClick={() => jumpToLane(laneIndex)}
              className="w-full h-full opacity-0 hover:opacity-10 bg-[#4ade80]/5 active:bg-[#4ade80]/20 transition-opacity cursor-pointer flex flex-col justify-end pb-3 items-center text-[10px] font-mono text-[#4ade80]"
              title={`Move cat to Lane ${laneIndex + 1}`}
            >
              <span className="opacity-40">LANE {laneIndex + 1}</span>
            </button>
          ))}
        </div>

        {/* IDLE / START OVERLAY */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="p-3 bg-[#121612] border border-[#4ade80] max-w-md w-full shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              <div className="text-xs font-mono text-[#fbbf24] tracking-widest uppercase mb-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>MISSION BRIEFING</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white glow-phosphor mb-3">
                SAVE THE BIRTHDAY CAT
              </h3>
              
              <div className="text-xs font-mono text-[#4ade80]/90 text-left space-y-1.5 bg-[#080a08] p-3 border border-[#4ade80]/30 mb-4">
                <p>🎂 <b>Cakes (+20 pts)</b> & 🐟 <b>Fish Snacks (+25 pts)</b> fall from the sky.</p>
                <p>⭐ <b>Stars (+15 pts)</b> & 💖 <b>Hearts (+10 pts)</b> build combo multipliers.</p>
                <p className="text-[#ef4444]">💣 <b>Avoid Glitch Bombs!</b> They damage your 3 lives.</p>
                <p className="text-[#fbbf24]">🏆 Collect <b>100 PTS</b> to unlock the Birthday Cake level!</p>
              </div>

              <div className="text-[11px] font-mono text-white/70 mb-4">
                DESKTOP: [◀ / ▶] ARROWS OR [A / D] • MOBILE: TAP LANES OR D-PAD
              </div>

              <button
                type="button"
                id="start-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-3 bg-[#4ade80] hover:bg-white text-black font-mono font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_#4ade80] active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH MISSION [START]</span>
              </button>
            </div>
          </div>
        )}

        {/* MISSION COMPLETE / LEVEL UNLOCKED CELEBRATION OVERLAY */}
        {gameState === 'WON' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-[#0d140d] border-2 border-[#4ade80] max-w-lg w-full shadow-[0_0_35px_rgba(74,222,128,0.6)]">
              <div className="inline-block px-3 py-1 bg-[#fbbf24]/20 border border-[#fbbf24] text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-2 animate-bounce">
                ★ HIGH SCORE SYNC CONFIRMED ★
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white glow-phosphor mb-2">
                MISSION COMPLETE!
              </h3>
              <p className="text-base sm:text-lg font-mono text-[#4ade80] font-bold mb-4">
                🎉 BIRTHDAY LEVEL 22 UNLOCKED! 🎉
              </p>

              <div className="p-3 bg-[#121612] border border-[#4ade80]/40 text-xs font-mono text-[#4ade80] space-y-1 mb-5">
                <div className="flex justify-between">
                  <span className="opacity-70">RECIPIENT STATUS:</span>
                  <span className="text-white font-bold">{birthdayConfig.recipientName} // LEVEL 22</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">FINAL SCORE:</span>
                  <span className="text-[#fbbf24] font-bold">{score} PTS [PERFECT OVERLOAD]</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">NEXT PROTOCOL:</span>
                  <span className="text-[#4ade80] font-bold">PIXEL CAKE & CANDLE CEREMONY</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="px-4 py-2.5 bg-[#1a201a] border border-[#4ade80]/50 text-[#4ade80] hover:bg-[#4ade80]/20 font-mono text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>

                <button
                  type="button"
                  id="proceed-to-cake-btn"
                  onClick={() => {
                    soundEngine.playFanfare();
                    onNavigate(ScreenIndex.CAKE);
                  }}
                  className="flex-1 py-3 bg-[#4ade80] hover:bg-white text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_#4ade80] active:scale-95 flex items-center justify-center gap-2"
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
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-5 bg-[#180a0a] border-2 border-[#ef4444] max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <div className="text-xs font-mono text-[#ef4444] tracking-widest uppercase mb-1 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
                <span>SYSTEM INTEGRITY COMPROMISED</span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-2">
                GLITCH OVERLOAD!
              </h3>
              <p className="text-xs font-mono text-[#ef4444] mb-4">
                The birthday cat got caught in the drama matrix. Don't worry, friendship has unlimited continues!
              </p>

              <div className="p-2.5 bg-[#0d0404] border border-[#ef4444]/30 text-xs font-mono text-white/80 mb-4 flex justify-between">
                <span>POINTS SCORED:</span>
                <span className="text-[#fbbf24] font-bold">{score} / {TARGET_SCORE} PTS</span>
              </div>

              <button
                type="button"
                id="retry-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-2.5 bg-[#ef4444] hover:bg-white hover:text-black text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_#ef4444] active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY QUEST // INSERT COIN</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile & Desktop Tactile Arcade D-Pad Controls */}
      <div className="mt-4 p-3 bg-[#0d120d] border border-[#4ade80]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-[#4ade80]/80 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4ade80]" />
          <span>CONTROLS:</span>
          <span className="text-white/60 hidden sm:inline">Use Left/Right arrow keys, A/D, or tap the arcade buttons below.</span>
          <span className="text-white/60 sm:hidden">Tap Left / Right buttons or tap screen lanes.</span>
        </div>

        {/* On-Screen D-Pad Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="dpad-left-btn"
            onClick={() => moveCat('left')}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#141c14] border-2 border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black active:scale-90 font-mono font-bold text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
            aria-label="Move cat left"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>◀ LEFT</span>
          </button>

          <button
            type="button"
            id="dpad-right-btn"
            onClick={() => moveCat('right')}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#141c14] border-2 border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black active:scale-90 font-mono font-bold text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
            aria-label="Move cat right"
          >
            <span>RIGHT ▶</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Screen Navigation Bar */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#4ade80]/20 pt-3 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-3.5 py-1.5 bg-[#121412] border border-[#4ade80]/40 text-[#4ade80] text-xs uppercase hover:bg-[#4ade80]/20 active:scale-95 transition-all cursor-pointer"
        >
          ◀ PREV: MEMORY DATABASE
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
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-4 py-1.5 bg-[#4ade80]/20 border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black text-xs font-bold uppercase active:scale-95 transition-all cursor-pointer"
        >
          SKIP TO CAKE ▶
        </button>
      </div>

    </div>
  );
};
