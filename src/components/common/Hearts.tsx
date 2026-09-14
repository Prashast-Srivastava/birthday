import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface FloatingHeartParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  heartX: number;
  heartSway: number;
  heartRot: number;
  duration: number;
}

export interface AmbientHeartConfig {
  id: number;
  leftPercent: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  rot: number;
  opacity: number;
  color: string;
}

// Pastel color palette matching the cute pastel glassmorphism aesthetic
const PASTEL_HEART_COLORS = [
  '#f472b6', // Pastel blush pink
  '#fb7185', // Soft rose
  '#f43f5e', // Gentle strawberry
  '#c084fc', // Pastel lavender
  '#e879f9', // Pastel fuchsia
  '#fda4af', // Peach blossom
  '#fbcfe8', // Cotton candy pink
  '#fed7aa', // Pastel apricot
  '#a7f3d0', // Pastel mint
];

// Helper to spawn hearts programmatically from anywhere in the app
export const triggerFloatingHearts = (x: number, y: number, count = 5) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('spawn-floating-hearts', {
        detail: { x, y, count },
      })
    );
  }
};

/**
 * SVG Heart with cute rounded lobes and soft glint
 */
const PastelHeartSvg: React.FC<{ size: number; color: string; className?: string }> = ({
  size,
  color,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <filter id={`glow-${size}-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color} floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Heart Base */}
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
      filter={`url(#glow-${size}-${color.replace('#', '')})`}
    />
    {/* Soft Glint on top-left lobe */}
    <ellipse
      cx="7.5"
      cy="6.5"
      rx="2"
      ry="1"
      transform="rotate(-30 7.5 6.5)"
      fill="white"
      fillOpacity="0.45"
    />
  </svg>
);

interface HeartsProps {
  ambientCount?: number;
  className?: string;
}

export const Hearts: React.FC<HeartsProps> = ({ ambientCount = 16, className = '' }) => {
  const [particles, setParticles] = useState<FloatingHeartParticle[]>([]);
  const [ambientHearts, setAmbientHearts] = useState<AmbientHeartConfig[]>([]);
  const lastHoverTimeRef = useRef<number>(0);

  // Initialize ambient floaty hearts across the screen
  useEffect(() => {
    // Generate evenly spaced but randomized ambient hearts
    const hearts: AmbientHeartConfig[] = [];
    for (let i = 0; i < ambientCount; i++) {
      hearts.push({
        id: i,
        leftPercent: 3 + (i / ambientCount) * 94 + (Math.random() * 6 - 3),
        size: Math.floor(14 + Math.random() * 18), // 14px to 32px
        duration: 11 + Math.random() * 8, // 11s to 19s
        delay: -(Math.random() * 18), // Negative delay to start immediately spread across height
        sway: Math.floor(14 + Math.random() * 24),
        rot: Math.floor(Math.random() * 26 - 13),
        opacity: 0.22 + Math.random() * 0.28, // Soft 0.22 - 0.50 opacity
        color: PASTEL_HEART_COLORS[Math.floor(Math.random() * PASTEL_HEART_COLORS.length)],
      });
    }
    setAmbientHearts(hearts);
  }, [ambientCount]);

  // Function to spawn a burst of hearts
  const spawnHearts = useCallback((originX: number, originY: number, count = 5) => {
    const newParticles: FloatingHeartParticle[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < count; i++) {
      const spreadAngle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 15 + Math.random() * 35;
      const initialOffsetX = Math.cos(spreadAngle) * speed;
      const initialOffsetY = Math.sin(spreadAngle) * 8; // bias upward

      newParticles.push({
        id: `heart-${timestamp}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        x: originX + initialOffsetX,
        y: originY + initialOffsetY,
        size: Math.floor(18 + Math.random() * 18), // 18px to 36px
        color: PASTEL_HEART_COLORS[Math.floor(Math.random() * PASTEL_HEART_COLORS.length)],
        heartX: Math.floor(Math.random() * 60 - 30), // -30px to +30px horizontal drift
        heartSway: Math.floor(Math.random() * 30 + 10) * (Math.random() > 0.5 ? 1 : -1),
        heartRot: Math.floor(Math.random() * 36 - 18),
        duration: 1.4 + Math.random() * 0.7, // 1.4s to 2.1s
      });
    }

    setParticles((prev) => [...prev.slice(-35), ...newParticles]);

    // Clean up particles after expiration
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 2200);
  }, []);

  // Card interaction listener: triggers floating hearts whenever user clicks or hovers on any card
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if interaction occurred on or within a card element
      const card = target.closest(
        '[data-card="true"], .dev-card, .glass-card, .brutal-card, [id*="card"], [class*="rounded-3xl"], [class*="rounded-2xl"], section, article, button'
      );

      if (card) {
        // Burst 4-7 cute floaty hearts
        const count = 4 + Math.floor(Math.random() * 3);
        spawnHearts(clientX, clientY, count);
      }
    };

    // Subtle floaty heart on hovering cards (throttled to avoid over-cluttering)
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const now = Date.now();
      if (now - lastHoverTimeRef.current < 280) return; // Throttle to every ~280ms

      const card = target.closest(
        '[data-card="true"], .dev-card, .glass-card, [id*="card"], [class*="rounded-3xl"], [class*="rounded-2xl"], section, article'
      );

      if (card) {
        lastHoverTimeRef.current = now;
        // Spawn 1-2 delicate floating hearts
        spawnHearts(e.clientX, e.clientY, 1 + Math.round(Math.random()));
      }
    };

    // Custom event listener so any component can invoke heart bursts
    const handleCustomSpawn = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; count?: number }>;
      if (customEvent.detail) {
        const { x, y, count = 5 } = customEvent.detail;
        spawnHearts(x, y, count);
      }
    };

    window.addEventListener('click', handlePointerDown, { passive: true });
    window.addEventListener('mouseover', handlePointerOver, { passive: true });
    window.addEventListener('spawn-floating-hearts', handleCustomSpawn as EventListener);

    return () => {
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('mouseover', handlePointerOver);
      window.removeEventListener('spawn-floating-hearts', handleCustomSpawn as EventListener);
    };
  }, [spawnHearts]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Continuous Floating Hearts Across the Screen */}
      {ambientHearts.map((ah) => (
        <div
          key={ah.id}
          className="absolute bottom-0 animate-ambient-heart"
          style={
            {
              left: `${ah.leftPercent}%`,
              animationDuration: `${ah.duration}s`,
              animationDelay: `${ah.delay}s`,
              '--ambient-opacity': ah.opacity,
              '--ambient-sway': `${ah.sway}px`,
              '--ambient-rot': `${ah.rot}deg`,
            } as React.CSSProperties
          }
        >
          <PastelHeartSvg size={ah.size} color={ah.color} />
        </div>
      ))}

      {/* Interactive Floating Hearts (Triggered on Card Interaction) */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-floating-heart pastel-heart-glow"
          style={
            {
              left: `${particle.x - particle.size / 2}px`,
              top: `${particle.y - particle.size / 2}px`,
              '--heart-x': `${particle.heartX}px`,
              '--heart-sway': `${particle.heartSway}px`,
              '--heart-rot': `${particle.heartRot}deg`,
              '--heart-duration': `${particle.duration}s`,
            } as React.CSSProperties
          }
        >
          <PastelHeartSvg size={particle.size} color={particle.color} />
        </div>
      ))}
    </div>
  );
};
