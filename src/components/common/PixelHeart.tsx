import React from 'react';

export interface PixelHeartProps {
  /**
   * Rendered pixel dimensions (fixed width and height in px). Defaults to 16.
   */
  size?: number;
  /**
   * Primary fill color. Defaults to brutalist hot rose '#f43f5e'.
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
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 16x16 Retro Pixel-Art Heart Component
 * Uses crisp pixel-grid SVG rendering and solid brutalist borders.
 */
export const PixelHeart: React.FC<PixelHeartProps> = ({
  size = 16,
  color = '#f43f5e',
  borderColor = '#16192e',
  highlightColor = '#fffdf0',
  className = '',
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`inline-block select-none ${className}`}
      style={{
        shapeRendering: 'crispEdges',
        imageRendering: 'pixelated',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* 16x16 Pixel Heart Outline */}
      {/* Top Lobes */}
      <rect x="3" y="1" width="4" height="1" fill={borderColor} />
      <rect x="9" y="1" width="4" height="1" fill={borderColor} />

      {/* Row 2 */}
      <rect x="2" y="2" width="1" height="1" fill={borderColor} />
      <rect x="7" y="2" width="2" height="1" fill={borderColor} />
      <rect x="13" y="2" width="1" height="1" fill={borderColor} />

      {/* Row 3 */}
      <rect x="1" y="3" width="1" height="1" fill={borderColor} />
      <rect x="14" y="3" width="1" height="1" fill={borderColor} />

      {/* Rows 4-6 Side walls */}
      <rect x="0" y="4" width="1" height="3" fill={borderColor} />
      <rect x="15" y="4" width="1" height="3" fill={borderColor} />

      {/* Rows 7-8 Diagonal inwards */}
      <rect x="1" y="7" width="1" height="2" fill={borderColor} />
      <rect x="14" y="7" width="1" height="2" fill={borderColor} />

      {/* Row 9 */}
      <rect x="2" y="9" width="1" height="1" fill={borderColor} />
      <rect x="13" y="9" width="1" height="1" fill={borderColor} />

      {/* Row 10 */}
      <rect x="3" y="10" width="1" height="1" fill={borderColor} />
      <rect x="12" y="10" width="1" height="1" fill={borderColor} />

      {/* Row 11 */}
      <rect x="4" y="11" width="1" height="1" fill={borderColor} />
      <rect x="11" y="11" width="1" height="1" fill={borderColor} />

      {/* Row 12 */}
      <rect x="5" y="12" width="1" height="1" fill={borderColor} />
      <rect x="10" y="12" width="1" height="1" fill={borderColor} />

      {/* Row 13 */}
      <rect x="6" y="13" width="1" height="1" fill={borderColor} />
      <rect x="9" y="13" width="1" height="1" fill={borderColor} />

      {/* Row 14 Bottom Point */}
      <rect x="7" y="14" width="2" height="1" fill={borderColor} />

      {/* Main Color Fill */}
      {/* Row 2 interior */}
      <rect x="3" y="2" width="4" height="1" fill={color} />
      <rect x="9" y="2" width="4" height="1" fill={color} />

      {/* Row 3 interior */}
      <rect x="2" y="3" width="12" height="1" fill={color} />

      {/* Rows 4-6 interior */}
      <rect x="1" y="4" width="14" height="3" fill={color} />

      {/* Rows 7-8 interior */}
      <rect x="2" y="7" width="12" height="2" fill={color} />

      {/* Row 9 interior */}
      <rect x="3" y="9" width="10" height="1" fill={color} />

      {/* Row 10 interior */}
      <rect x="4" y="10" width="8" height="1" fill={color} />

      {/* Row 11 interior */}
      <rect x="5" y="11" width="6" height="1" fill={color} />

      {/* Row 12 interior */}
      <rect x="6" y="12" width="4" height="1" fill={color} />

      {/* Row 13 interior */}
      <rect x="7" y="13" width="2" height="1" fill={color} />

      {/* Pixel Specular Highlight Glint */}
      <rect x="3" y="3" width="2" height="1" fill={highlightColor} />
      <rect x="2" y="4" width="2" height="2" fill={highlightColor} />
    </svg>
  );
};
