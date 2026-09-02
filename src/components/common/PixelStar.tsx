import React from 'react';

export interface PixelStarProps {
  /**
   * Rendered pixel dimensions (fixed width and height in px). Defaults to 16.
   */
  size?: number;
  /**
   * Primary star fill color. Defaults to brutalist yellow '#ffd000'.
   */
  color?: string;
  /**
   * Outer pixel outline color. Defaults to ink black '#16192e'.
   */
  borderColor?: string;
  /**
   * Glint highlight pixel color. Defaults to cream white '#fffdf0'.
   */
  highlightColor?: string;
  /**
   * Whether to include the subtle twinkle / opacity-pulse animation. Defaults to true.
   */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 16x16 Retro Pixel-Art Star Icon Component
 * Classic 8-bit RPG 5-point star with crisp pixel-grid SVG rendering,
 * neo-brutalist ink outline, and optional CSS twinkle animation.
 */
export const PixelStar: React.FC<PixelStarProps> = ({
  size = 16,
  color = '#ffd000',
  borderColor = '#16192e',
  highlightColor = '#fffdf0',
  animate = true,
  className = '',
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`inline-block select-none ${animate ? 'animate-star-twinkle' : ''} ${className}`}
      style={{
        shapeRendering: 'crispEdges',
        imageRendering: 'pixelated',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Outer 16x16 Pixel Outline */}
      {/* Top Point */}
      <rect x="7" y="1" width="2" height="1" fill={borderColor} />
      <rect x="6" y="2" width="1" height="2" fill={borderColor} />
      <rect x="9" y="2" width="1" height="2" fill={borderColor} />
      <rect x="5" y="4" width="1" height="1" fill={borderColor} />
      <rect x="10" y="4" width="1" height="1" fill={borderColor} />

      {/* Horizontal Arms (Top Edge) */}
      <rect x="1" y="5" width="4" height="1" fill={borderColor} />
      <rect x="11" y="5" width="4" height="1" fill={borderColor} />

      {/* Arm Tips */}
      <rect x="0" y="6" width="1" height="2" fill={borderColor} />
      <rect x="15" y="6" width="1" height="2" fill={borderColor} />

      {/* Horizontal Arms (Bottom Edge inward diagonal) */}
      <rect x="1" y="8" width="3" height="1" fill={borderColor} />
      <rect x="12" y="8" width="3" height="1" fill={borderColor} />
      <rect x="4" y="9" width="1" height="1" fill={borderColor} />
      <rect x="11" y="9" width="1" height="1" fill={borderColor} />

      {/* Waist Inward Points */}
      <rect x="4" y="10" width="1" height="1" fill={borderColor} />
      <rect x="11" y="10" width="1" height="1" fill={borderColor} />
      <rect x="3" y="11" width="1" height="1" fill={borderColor} />
      <rect x="12" y="11" width="1" height="1" fill={borderColor} />

      {/* Legs Outward Diagonal */}
      <rect x="2" y="12" width="1" height="2" fill={borderColor} />
      <rect x="13" y="12" width="1" height="2" fill={borderColor} />

      {/* Leg Tips */}
      <rect x="3" y="14" width="2" height="1" fill={borderColor} />
      <rect x="11" y="14" width="2" height="1" fill={borderColor} />

      {/* Crotch Inward Notch */}
      <rect x="5" y="13" width="1" height="1" fill={borderColor} />
      <rect x="10" y="13" width="1" height="1" fill={borderColor} />
      <rect x="6" y="12" width="1" height="1" fill={borderColor} />
      <rect x="9" y="12" width="1" height="1" fill={borderColor} />
      <rect x="7" y="11" width="2" height="1" fill={borderColor} />

      {/* Interior Fill (Yellow #ffd000) */}
      {/* Top Point Fill */}
      <rect x="7" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="4" width="4" height="1" fill={color} />

      {/* Arm Spans */}
      <rect x="1" y="6" width="14" height="2" fill={color} />
      <rect x="4" y="8" width="8" height="1" fill={color} />
      <rect x="5" y="9" width="6" height="1" fill={color} />
      <rect x="5" y="10" width="6" height="1" fill={color} />

      {/* Bottom Legs Fill */}
      <rect x="3" y="12" width="3" height="2" fill={color} />
      <rect x="10" y="12" width="3" height="2" fill={color} />
      <rect x="5" y="11" width="2" height="1" fill={color} />
      <rect x="9" y="11" width="2" height="1" fill={color} />

      {/* Retro 8-bit Specular Highlights (Cream White #fffdf0) */}
      <rect x="7" y="3" width="1" height="1" fill={highlightColor} />
      <rect x="2" y="6" width="2" height="1" fill={highlightColor} />
      <rect x="4" y="12" width="1" height="1" fill={highlightColor} />
    </svg>
  );
};
