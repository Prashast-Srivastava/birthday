import React from 'react';

export interface PixelSparkleProps {
  /**
   * Rendered pixel dimensions (fixed width and height in px). Defaults to 16.
   */
  size?: number;
  /**
   * Sparkle ray fill color. Defaults to brutalist cyan '#00f0ff'.
   */
  color?: string;
  /**
   * Outer pixel outline color. Defaults to ink black '#16192e'.
   */
  borderColor?: string;
  /**
   * Central glint highlight pixel color. Defaults to cream white '#fffdf0'.
   */
  highlightColor?: string;
  /**
   * Whether to include the brief scale-pulse CSS animation. Defaults to true.
   */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 16x16 Retro Pixel-Art 4-Point Sparkle / Star-Burst Component
 * Rendered in vibrant cyan with crisp neo-brutalist ink outline,
 * center glint, and an energetic scale-pulse CSS animation.
 */
export const PixelSparkle: React.FC<PixelSparkleProps> = ({
  size = 16,
  color = '#00f0ff',
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
      className={`inline-block select-none ${animate ? 'animate-sparkle-pulse' : ''} ${className}`}
      style={{
        shapeRendering: 'crispEdges',
        imageRendering: 'pixelated',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* 4-Point Star-Burst Outline */}
      {/* Vertical Ray (Top & Bottom tips) */}
      <rect x="7" y="1" width="2" height="1" fill={borderColor} />
      <rect x="6" y="2" width="1" height="3" fill={borderColor} />
      <rect x="9" y="2" width="1" height="3" fill={borderColor} />

      <rect x="6" y="11" width="1" height="3" fill={borderColor} />
      <rect x="9" y="11" width="1" height="3" fill={borderColor} />
      <rect x="7" y="14" width="2" height="1" fill={borderColor} />

      {/* Horizontal Ray (Left & Right tips) */}
      <rect x="1" y="7" width="1" height="2" fill={borderColor} />
      <rect x="2" y="6" width="3" height="1" fill={borderColor} />
      <rect x="2" y="9" width="3" height="1" fill={borderColor} />

      <rect x="11" y="6" width="3" height="1" fill={borderColor} />
      <rect x="11" y="9" width="3" height="1" fill={borderColor} />
      <rect x="14" y="7" width="1" height="2" fill={borderColor} />

      {/* Inner Corner Bridges */}
      <rect x="5" y="5" width="1" height="1" fill={borderColor} />
      <rect x="10" y="5" width="1" height="1" fill={borderColor} />
      <rect x="5" y="10" width="1" height="1" fill={borderColor} />
      <rect x="10" y="10" width="1" height="1" fill={borderColor} />

      {/* 4 Corner Glint Pixels (Floating Sparkle Flares) */}
      <rect x="3" y="3" width="1" height="1" fill={color} stroke={borderColor} strokeWidth="0.5" />
      <rect x="12" y="3" width="1" height="1" fill={color} stroke={borderColor} strokeWidth="0.5" />
      <rect x="3" y="12" width="1" height="1" fill={color} stroke={borderColor} strokeWidth="0.5" />
      <rect x="12" y="12" width="1" height="1" fill={color} stroke={borderColor} strokeWidth="0.5" />

      {/* Main Cyan Fill */}
      {/* Vertical Column */}
      <rect x="7" y="2" width="2" height="12" fill={color} />
      {/* Horizontal Bar */}
      <rect x="2" y="7" width="12" height="2" fill={color} />
      {/* Diamond Core */}
      <rect x="6" y="6" width="4" height="4" fill={color} />

      {/* Brilliant Specular Center Highlights */}
      <rect x="7" y="7" width="2" height="2" fill={highlightColor} />
      <rect x="7" y="5" width="2" height="1" fill={highlightColor} />
      <rect x="5" y="7" width="1" height="2" fill={highlightColor} />
    </svg>
  );
};
