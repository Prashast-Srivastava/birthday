import React from 'react';

export interface PixelPawProps {
  /**
   * Rendered pixel dimensions (fixed width and height in px). Defaults to 16.
   */
  size?: number;
  /**
   * Toe and main pad bean color. Defaults to brutalist hot pink '#ff5e97'.
   */
  padColor?: string;
  /**
   * Outer pixel outline color. Defaults to ink black '#16192e'.
   */
  borderColor?: string;
  /**
   * Paw fur/backing color. Defaults to cream white '#fffdf0'.
   */
  furColor?: string;
  /**
   * Specular highlight pixel color. Defaults to white '#ffffff'.
   */
  highlightColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 16x16 Retro Pixel-Art Cat Paw Component
 * Matches the Neko companion sprite style used in the Hero Hub.
 * Features 4 distinct toe beans and a curved main palm pad with crisp neo-brutalist ink outline.
 */
export const PixelPaw: React.FC<PixelPawProps> = ({
  size = 16,
  padColor = '#ff5e97',
  borderColor = '#16192e',
  furColor = '#fffdf0',
  highlightColor = '#ffffff',
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
      {/* 
        16x16 Grid:
        Toe 1 (Far Left): x=1..3, y=5..7
        Toe 2 (Inner Left): x=4..6, y=2..4
        Toe 3 (Inner Right): x=9..11, y=2..4
        Toe 4 (Far Right): x=12..14, y=5..7
        Main Pad (Center Palm): x=4..11, y=8..13
      */}

      {/* --- TOE 1 (Far Left) --- */}
      <rect x="2" y="4" width="2" height="1" fill={borderColor} />
      <rect x="1" y="5" width="1" height="2" fill={borderColor} />
      <rect x="4" y="5" width="1" height="2" fill={borderColor} />
      <rect x="2" y="7" width="2" height="1" fill={borderColor} />
      <rect x="2" y="5" width="2" height="2" fill={padColor} />
      <rect x="2" y="5" width="1" height="1" fill={highlightColor} />

      {/* --- TOE 2 (Mid-Left) --- */}
      <rect x="5" y="1" width="2" height="1" fill={borderColor} />
      <rect x="4" y="2" width="1" height="2" fill={borderColor} />
      <rect x="7" y="2" width="1" height="2" fill={borderColor} />
      <rect x="5" y="4" width="2" height="1" fill={borderColor} />
      <rect x="5" y="2" width="2" height="2" fill={padColor} />
      <rect x="5" y="2" width="1" height="1" fill={highlightColor} />

      {/* --- TOE 3 (Mid-Right) --- */}
      <rect x="9" y="1" width="2" height="1" fill={borderColor} />
      <rect x="8" y="2" width="1" height="2" fill={borderColor} />
      <rect x="11" y="2" width="1" height="2" fill={borderColor} />
      <rect x="9" y="4" width="2" height="1" fill={borderColor} />
      <rect x="9" y="2" width="2" height="2" fill={padColor} />
      <rect x="9" y="2" width="1" height="1" fill={highlightColor} />

      {/* --- TOE 4 (Far Right) --- */}
      <rect x="12" y="4" width="2" height="1" fill={borderColor} />
      <rect x="11" y="5" width="1" height="2" fill={borderColor} />
      <rect x="14" y="5" width="1" height="2" fill={borderColor} />
      <rect x="12" y="7" width="2" height="1" fill={borderColor} />
      <rect x="12" y="5" width="2" height="2" fill={padColor} />
      <rect x="12" y="5" width="1" height="1" fill={highlightColor} />

      {/* --- MAIN PALM PAD (Outline) --- */}
      <rect x="5" y="7" width="6" height="1" fill={borderColor} />
      <rect x="4" y="8" width="1" height="1" fill={borderColor} />
      <rect x="11" y="8" width="1" height="1" fill={borderColor} />
      <rect x="3" y="9" width="1" height="3" fill={borderColor} />
      <rect x="12" y="9" width="1" height="3" fill={borderColor} />
      <rect x="4" y="12" width="1" height="2" fill={borderColor} />
      <rect x="11" y="12" width="1" height="2" fill={borderColor} />
      <rect x="5" y="14" width="2" height="1" fill={borderColor} />
      <rect x="9" y="14" width="2" height="1" fill={borderColor} />
      <rect x="7" y="13" width="2" height="1" fill={borderColor} />

      {/* --- MAIN PALM PAD (Fill) --- */}
      <rect x="5" y="8" width="6" height="1" fill={padColor} />
      <rect x="4" y="9" width="8" height="3" fill={padColor} />
      <rect x="5" y="12" width="6" height="1" fill={padColor} />
      <rect x="5" y="13" width="2" height="1" fill={padColor} />
      <rect x="9" y="13" width="2" height="1" fill={padColor} />

      {/* --- PALM GLINT HIGHLIGHTS --- */}
      <rect x="5" y="9" width="2" height="1" fill={highlightColor} />
      <rect x="5" y="10" width="1" height="1" fill={highlightColor} />
    </svg>
  );
};
