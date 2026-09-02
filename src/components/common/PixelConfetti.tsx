import React from 'react';

export type ConfettiColor = 'pink' | 'yellow' | 'cyan' | 'green' | 'cycle';
export type ConfettiShape = 'square' | 'triangle' | 'ribbon';

export interface PixelConfettiProps {
  /**
   * Rendered pixel dimensions (fixed width and height in px). Defaults to 16.
   */
  size?: number;
  /**
   * Confetti color variant matching neo-brutalist palette:
   * pink (#ff5e97), yellow (#ffd000), cyan (#00f0ff), green (#22c55e), or 'cycle' (CSS color cycling).
   */
  variant?: ConfettiColor;
  /**
   * Confetti geometric shape sprite: 'square' (tilted diamond), 'triangle', or 'ribbon'.
   */
  shape?: ConfettiShape;
  /**
   * Outer pixel outline color. Defaults to ink black '#16192e'.
   */
  borderColor?: string;
  /**
   * Whether to include the slow falling/drifting CSS animation. Defaults to true.
   */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP: Record<Exclude<ConfettiColor, 'cycle'>, string> = {
  pink: '#ff5e97',
  yellow: '#ffd000',
  cyan: '#00f0ff',
  green: '#22c55e',
};

/**
 * 16x16 Retro Pixel-Art Confetti Component
 * Features tilted square (diamond), triangle, or ribbon shapes with solid ink borders,
 * neo-brutalist color variants, and a slow falling/drifting CSS animation.
 */
export const PixelConfetti: React.FC<PixelConfettiProps> = ({
  size = 16,
  variant = 'cycle',
  shape = 'square',
  borderColor = '#16192e',
  animate = true,
  className = '',
  style,
}) => {
  const isCycle = variant === 'cycle';
  const fillColor = !isCycle ? COLOR_MAP[variant] : '#ffd000';
  const fillClass = isCycle ? 'animate-confetti-cycle' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`inline-block select-none ${animate ? 'animate-confetti-drift' : ''} ${className}`}
      style={{
        shapeRendering: 'crispEdges',
        imageRendering: 'pixelated',
        ...style,
      }}
      aria-hidden="true"
    >
      {shape === 'square' && (
        /* Tilted 45-degree pixel diamond/square with 1px ink border */
        <g>
          {/* Outline */}
          <rect x="7" y="2" width="2" height="1" fill={borderColor} />
          <rect x="5" y="3" width="2" height="1" fill={borderColor} />
          <rect x="9" y="3" width="2" height="1" fill={borderColor} />
          <rect x="3" y="4" width="2" height="1" fill={borderColor} />
          <rect x="11" y="4" width="2" height="1" fill={borderColor} />
          <rect x="2" y="5" width="1" height="2" fill={borderColor} />
          <rect x="13" y="5" width="1" height="2" fill={borderColor} />
          <rect x="1" y="7" width="1" height="2" fill={borderColor} />
          <rect x="14" y="7" width="1" height="2" fill={borderColor} />
          <rect x="2" y="9" width="1" height="2" fill={borderColor} />
          <rect x="13" y="9" width="1" height="2" fill={borderColor} />
          <rect x="3" y="11" width="2" height="1" fill={borderColor} />
          <rect x="11" y="11" width="2" height="1" fill={borderColor} />
          <rect x="5" y="12" width="2" height="1" fill={borderColor} />
          <rect x="9" y="12" width="2" height="1" fill={borderColor} />
          <rect x="7" y="13" width="2" height="1" fill={borderColor} />

          {/* Color Fill */}
          <rect x="7" y="3" width="2" height="1" fill={fillColor} className={fillClass} />
          <rect x="5" y="4" width="6" height="1" fill={fillColor} className={fillClass} />
          <rect x="3" y="5" width="10" height="2" fill={fillColor} className={fillClass} />
          <rect x="2" y="7" width="12" height="2" fill={fillColor} className={fillClass} />
          <rect x="3" y="9" width="10" height="2" fill={fillColor} className={fillClass} />
          <rect x="5" y="11" width="6" height="1" fill={fillColor} className={fillClass} />
          <rect x="7" y="12" width="2" height="1" fill={fillColor} className={fillClass} />

          {/* Top highlight pip */}
          <rect x="7" y="4" width="2" height="1" fill="#fffdf0" />
          <rect x="5" y="5" width="2" height="1" fill="#fffdf0" />
        </g>
      )}

      {shape === 'triangle' && (
        /* Retro 8-bit confetti triangle */
        <g>
          {/* Outline */}
          <rect x="7" y="3" width="2" height="1" fill={borderColor} />
          <rect x="5" y="4" width="2" height="1" fill={borderColor} />
          <rect x="9" y="4" width="2" height="1" fill={borderColor} />
          <rect x="3" y="5" width="2" height="2" fill={borderColor} />
          <rect x="11" y="5" width="2" height="2" fill={borderColor} />
          <rect x="2" y="7" width="1" height="4" fill={borderColor} />
          <rect x="13" y="7" width="1" height="4" fill={borderColor} />
          <rect x="2" y="11" width="12" height="2" fill={borderColor} />

          {/* Interior Fill */}
          <rect x="7" y="4" width="2" height="1" fill={fillColor} className={fillClass} />
          <rect x="5" y="5" width="6" height="2" fill={fillColor} className={fillClass} />
          <rect x="3" y="7" width="10" height="4" fill={fillColor} className={fillClass} />

          {/* Highlight */}
          <rect x="6" y="5" width="2" height="1" fill="#fffdf0" />
          <rect x="4" y="7" width="2" height="1" fill="#fffdf0" />
        </g>
      )}

      {shape === 'ribbon' && (
        /* Curving festive streamer / ribbon strip */
        <g>
          {/* Outline */}
          <rect x="3" y="2" width="6" height="1" fill={borderColor} />
          <rect x="2" y="3" width="1" height="3" fill={borderColor} />
          <rect x="9" y="3" width="1" height="3" fill={borderColor} />
          <rect x="3" y="6" width="3" height="1" fill={borderColor} />
          <rect x="10" y="6" width="3" height="1" fill={borderColor} />
          <rect x="6" y="7" width="1" height="3" fill={borderColor} />
          <rect x="13" y="7" width="1" height="3" fill={borderColor} />
          <rect x="7" y="10" width="6" height="1" fill={borderColor} />
          <rect x="7" y="11" width="1" height="3" fill={borderColor} />
          <rect x="13" y="11" width="1" height="3" fill={borderColor} />
          <rect x="8" y="14" width="5" height="1" fill={borderColor} />

          {/* Interior */}
          <rect x="3" y="3" width="6" height="3" fill={fillColor} className={fillClass} />
          <rect x="7" y="7" width="6" height="3" fill={fillColor} className={fillClass} />
          <rect x="8" y="11" width="5" height="3" fill={fillColor} className={fillClass} />
        </g>
      )}
    </svg>
  );
};
