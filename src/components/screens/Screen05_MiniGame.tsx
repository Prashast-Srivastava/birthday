import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Award, Heart, Sparkles, ChevronLeft, ChevronRight, Zap, Trophy, ShieldAlert, ArrowRight } from 'lucide-react';
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

      // 1. Draw Dev-Tool Grid Background
      const laneWidth = width / TOTAL_LANES;

      ctx.fillStyle = '#0a0e17'; // near-black navy
      ctx.fillRect(0, 0, width, height);

      // Draw subtle hairline lane dividers
      for (let i = 0; i <= TOTAL_LANES; i++) {
        const lx = i * laneWidth;
        ctx.strokeStyle = i === 0 || i === TOTAL_LANES ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Highlight active cat lane with subtle amber sheen
      const activeLaneX = stateRef.current.catLane * laneWidth;
      ctx.fillStyle = 'rgba(245, 165, 36, 0.06)';
      ctx.fillRect(activeLaneX, 0, laneWidth, height);

      // Draw Danger Baseline
      const targetY = height - 55;
      ctx.strokeStyle = 'rgba(245, 165, 36, 0.3)';
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
    <motion.div
      variants={screenContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-4 select-none"
    >
      
      {/* Screen Top Header & Quest HUD */}
      <motion.div variants={cardVariants} className="dev-card bg-[#121723]/90 border border-[#ffffff1a] p-4 sm:p-5 mb-5 rounded-xl shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ffffff1a] pb-3">
          <div>
            <div className="dev-eyebrow-pill mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
              <span>MINI-GAME SECTOR 05 // INTERACTIVE MODULE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-[#f5f5f7] tracking-tight">
              Save The Birthday Cat // <span className="text-[#f5a524]">Cake Rush</span>
            </h2>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-[#1a1f2e] px-3 py-1 border border-[#ffffff1a] rounded-lg flex items-center gap-1.5">
              <span className="text-[#9ca3af]">TARGET:</span>
              <span className="text-[#f5f5f7] font-semibold">{TARGET_SCORE} PTS</span>
            </div>
            <div className="bg-[#1a1f2e] px-3 py-1 border border-[#f5a524]/30 rounded-lg flex items-center gap-1.5">
              <span className="text-[#9ca3af]">HIGH:</span>
              <span className="text-[#f5a524] font-semibold">{highScore} PTS</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Sync Bar */}
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <div className="flex justify-between text-xs font-mono text-[#9ca3af] mb-1.5">
              <span>AWAKENING PROGRESS:</span>
              <span className="text-[#f5f5f7] font-medium">{progressPercent}% [{score} / {TARGET_SCORE} PTS]</span>
            </div>
            <div className="w-full h-2.5 bg-[#0a0e17] rounded-full border border-[#ffffff1a] overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#f5a524] to-[#fbbf24] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lives & Combo Indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 bg-[#1a1f2e] px-3 py-1 border border-[#ffffff1a] rounded-lg">
              <span className="text-xs text-[#9ca3af] mr-1">LIVES:</span>
              {[...Array(INITIAL_LIVES)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm transition-transform ${
                    i < lives ? 'text-[#f43f5e] scale-100' : 'text-[#4b5563] scale-90 opacity-40'
                  }`}
                >
                  ♥
                </span>
              ))}
            </div>

            {combo > 1 && (
              <div className="px-2.5 py-1 bg-[#f5a524]/15 text-[#f5a524] border border-[#f5a524]/30 rounded-lg text-xs font-mono font-semibold">
                x{combo} STREAK!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Interactive Canvas Area with Modern Frame */}
      <motion.div variants={cardVariants} className="relative w-full border border-[#ffffff1a] bg-[#0a0e17] rounded-2xl shadow-2xl overflow-hidden">
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
              className="w-full h-full opacity-0 hover:opacity-10 bg-[#f5a524] active:bg-[#f5a524]/20 transition-opacity cursor-pointer flex flex-col justify-end pb-3 items-center text-[10px] font-mono text-[#f5f5f7]"
              title={`Move cat to Lane ${laneIndex + 1}`}
            >
              <span className="opacity-70">LANE {laneIndex + 1}</span>
            </button>
          ))}
        </div>

        {/* IDLE / START OVERLAY */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-[#0a0e17]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20">
            <div className="dev-card p-6 bg-[#121723] border border-[#ffffff1a] rounded-2xl max-w-md w-full shadow-2xl text-[#f5f5f7]">
              <div className="dev-eyebrow-pill mb-2 mx-auto inline-flex">
                <Sparkles className="w-3.5 h-3.5 text-[#f5a524]" />
                <span>MISSION BRIEFING</span>
              </div>
              <h3 className="text-xl font-sans font-bold text-[#f5f5f7] mb-3">
                Save The Birthday Cat
              </h3>
              
              <div className="text-xs font-mono text-[#9ca3af] text-left space-y-2 bg-[#1a1f2e] p-3.5 rounded-xl border border-[#ffffff1a] mb-5">
                <p>🎂 <b className="text-[#f5f5f7]">Cakes (+20 pts)</b> & 🐟 <b className="text-[#f5f5f7]">Fish Snacks (+25 pts)</b> fall down.</p>
                <p>⭐ <b className="text-[#f5f5f7]">Stars (+15 pts)</b> & 💖 <b className="text-[#f5f5f7]">Hearts (+10 pts)</b> build combos.</p>
                <p><b className="text-[#f43f5e]">💣 Avoid Glitch Bombs!</b> They cost 1 life.</p>
                <p>🏆 Score <b className="text-[#f5a524]">100 PTS</b> to unlock the Birthday Cake Ceremony!</p>
              </div>

              <div className="text-xs font-mono text-[#9ca3af] mb-5">
                Keyboard: [◀ / ▶] Arrows or [A / D] • Tap: Touch lanes or buttons
              </div>

              <button
                type="button"
                id="start-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-3 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] font-semibold text-xs rounded-xl shadow-lg shadow-[#f5a524]/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH MISSION [START]</span>
              </button>
            </div>
          </div>
        )}

        {/* MISSION COMPLETE / LEVEL UNLOCKED CELEBRATION OVERLAY */}
        {gameState === 'WON' && (
          <div className="absolute inset-0 bg-[#0a0e17]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 animate-fadeIn">
            <div className="dev-card p-6 sm:p-7 bg-[#121723] border border-[#ffffff1a] rounded-2xl max-w-lg w-full shadow-2xl text-[#f5f5f7]">
              <div className="inline-block px-3 py-1 bg-[#f5a524]/15 text-[#f5a524] border border-[#f5a524]/30 rounded-full text-xs font-mono font-medium mb-3">
                ★ HIGH SCORE CONFIRMED ★
              </div>
              <h3 className="text-2xl font-sans font-bold text-[#f5f5f7] mb-1">
                Mission Complete!
              </h3>
              <p className="text-sm font-mono text-[#4ade80] font-medium mb-4">
                🎉 Birthday Level 22 Unlocked! 🎉
              </p>

              <div className="p-4 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl text-xs font-mono space-y-2 mb-6">
                <div className="flex justify-between items-center py-1 border-b border-[#ffffff0f]">
                  <span className="text-[#9ca3af]">RECIPIENT:</span>
                  <span className="font-semibold text-[#f5f5f7]">{birthdayConfig.recipientName} // LEVEL 22</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#ffffff0f]">
                  <span className="text-[#9ca3af]">FINAL SCORE:</span>
                  <span className="font-semibold text-[#f5a524]">{score} PTS [VICTORY!]</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#9ca3af]">NEXT PHASE:</span>
                  <span className="font-medium text-[#4ade80]">CAKE & CANDLES CEREMONY</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] text-[#f5f5f7] font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
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
                  className="flex-1 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] font-semibold text-xs rounded-xl shadow-lg shadow-[#f5a524]/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
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
          <div className="absolute inset-0 bg-[#0a0e17]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30">
            <div className="dev-card p-6 bg-[#121723] border border-[#ffffff1a] rounded-2xl max-w-md w-full shadow-2xl text-[#f5f5f7]">
              <div className="dev-eyebrow-pill mb-2 mx-auto inline-flex border-[#f43f5e]/30 text-[#f43f5e]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>MISSION INTERRUPTED</span>
              </div>
              <h3 className="text-xl font-sans font-bold text-[#f5f5f7] mb-2">
                Glitch Overload!
              </h3>
              <p className="text-xs font-mono text-[#9ca3af] mb-4 leading-relaxed">
                The birthday cat bumped into glitch bombs. Friendship has unlimited continues!
              </p>

              <div className="p-3 bg-[#1a1f2e] border border-[#ffffff1a] rounded-xl text-xs font-mono mb-5 flex justify-between">
                <span className="text-[#9ca3af]">POINTS SCORED:</span>
                <span className="text-[#f5f5f7] font-semibold">{score} / {TARGET_SCORE} PTS</span>
              </div>

              <button
                type="button"
                id="retry-cat-game-btn"
                onClick={handleStartGame}
                className="w-full py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] font-semibold text-xs rounded-xl shadow-lg shadow-[#f5a524]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY QUEST // CONTINUE</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tactile D-Pad Controls */}
      <motion.div variants={cardVariants} className="mt-4 p-4 dev-card bg-[#121723]/90 border border-[#ffffff1a] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="text-xs font-mono text-[#9ca3af] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f5a524]" />
          <span className="font-medium text-[#f5f5f7]">CONTROLS:</span>
          <span className="hidden sm:inline">Use Left/Right arrow keys, A/D, or click the control buttons.</span>
          <span className="sm:hidden">Tap Left / Right buttons or screen lanes.</span>
        </div>

        {/* On-Screen D-Pad Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            id="dpad-left-btn"
            onClick={() => moveCat('left')}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#1a1f2e] hover:bg-[#222838] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] font-mono text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
            aria-label="Move cat left"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>◀ LEFT</span>
          </button>

          <button
            type="button"
            id="dpad-right-btn"
            onClick={() => moveCat('right')}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#1a1f2e] hover:bg-[#222838] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] font-mono text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
            aria-label="Move cat right"
          >
            <span>RIGHT ▶</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Bottom Screen Navigation Bar */}
      <motion.div variants={cardVariants} className="mt-5 flex items-center justify-between gap-4 font-mono">
        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.MEMORIES);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          ◀ PREV: MEMORIES
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.HERO);
          }}
          className="px-4 py-2.5 bg-[#121723] hover:bg-[#1a1f2e] border border-[#ffffff1a] hover:border-white/20 text-[#9ca3af] hover:text-[#f5f5f7] text-xs font-mono rounded-xl transition-all cursor-pointer"
        >
          [ HERO HUB ]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSelect();
            onNavigate(ScreenIndex.CAKE);
          }}
          className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] text-xs font-semibold rounded-xl shadow-lg shadow-[#f5a524]/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          SKIP TO CAKE ▶
        </button>
      </motion.div>

    </motion.div>
  );
};
