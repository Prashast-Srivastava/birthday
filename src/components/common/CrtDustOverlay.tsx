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
  colorType: 'pink' | 'lavender' | 'mint' | 'gold' | 'sky';
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
    const particleCount = 38; // Delicate, airy density

    const colors = {
      pink: '244, 114, 182',     // pastel blush pink
      lavender: '192, 132, 252', // pastel lavender
      mint: '110, 231, 183',     // pastel mint
      gold: '251, 191, 36',      // soft pastel gold
      sky: '125, 211, 252',      // pastel sky blue
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
      const colorTypes: ('pink' | 'lavender' | 'mint' | 'gold' | 'sky')[] = [
        'pink', 'pink', 'lavender', 'gold', 'mint', 'sky'
      ];

      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = 0.25 + Math.random() * 0.45;
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.2 - Math.random() * 0.35,
          size: 1.5 + Math.random() * 3.2,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          twinklePhase: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.01 + Math.random() * 0.03,
          wobbleAmplitude: 0.3 + Math.random() * 0.5,
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

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.twinklePhase) * p.wobbleAmplitude;
        p.y += p.vy;

        p.twinklePhase += p.twinkleSpeed;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));

        if (p.x < -15) p.x = currentWidth + 15;
        if (p.x > currentWidth + 15) p.x = -15;
        if (p.y < -15) {
          p.y = currentHeight + 15;
          p.x = Math.random() * currentWidth;
        }
        if (p.y > currentHeight + 15) p.y = -15;

        const rgb = colors[p.colorType];

        ctx.save();
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${rgb}, ${(p.alpha * 0.7).toFixed(3)})`;
        ctx.shadowBlur = p.size * 3;

        // Draw soft glowing circular pastel fairy-sparkle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
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
      id="pastel-sparkles-overlay-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 w-full h-full opacity-80"
    />
  );
};
