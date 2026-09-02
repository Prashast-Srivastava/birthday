import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
  colorType: 'yellow' | 'cyan' | 'white' | 'purple';
}

export const CrtDustOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 45; // Subtle, atmospheric density

    const colors = {
      yellow: '255, 208, 0',
      cyan: '0, 240, 255',
      white: '255, 253, 240',
      purple: '168, 85, 247',
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const createParticles = (w: number, h: number) => {
      const list: Particle[] = [];
      const colorTypes: ('yellow' | 'cyan' | 'white' | 'purple')[] = [
        'yellow', 'yellow', 'white', 'cyan', 'purple'
      ];

      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = 0.15 + Math.random() * 0.35;
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          // Gentle drifting velocity: mostly slow upwards/horizontal drift
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.15 - Math.random() * 0.3,
          size: 1 + Math.random() * 1.8,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          twinklePhase: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.01 + Math.random() * 0.03,
          wobbleAmplitude: 0.2 + Math.random() * 0.4,
          colorType: colorTypes[Math.floor(Math.random() * colorTypes.length)],
        });
      }
      return list;
    };

    resizeCanvas();
    const initialWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const initialHeight = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    particles = createParticles(initialWidth, initialHeight);

    let time = 0;

    const render = () => {
      const currentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const currentHeight = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      ctx.clearRect(0, 0, currentWidth, currentHeight);

      time += 0.02;

      // Draw each drifting CRT dust speckle
      particles.forEach((p) => {
        // Apply sinusoidal drift wobble
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.twinklePhase) * p.wobbleAmplitude;
        p.y += p.vy;

        // Twinkle alpha calculation
        p.twinklePhase += p.twinkleSpeed;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));

        // Screen boundary wrap around
        if (p.x < -10) p.x = currentWidth + 10;
        if (p.x > currentWidth + 10) p.x = -10;
        if (p.y < -10) {
          p.y = currentHeight + 10;
          p.x = Math.random() * currentWidth;
        }
        if (p.y > currentHeight + 10) p.y = -10;

        const rgb = colors[p.colorType];

        // Draw soft glowing square pixel mote / micro-particle
        ctx.save();
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${rgb}, ${(p.alpha * 0.8).toFixed(3)})`;
        ctx.shadowBlur = p.size * 2.5;

        // Pixel-aesthetic square dust speck
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="crt-dust-overlay-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-20 w-full h-full opacity-75"
    />
  );
};
