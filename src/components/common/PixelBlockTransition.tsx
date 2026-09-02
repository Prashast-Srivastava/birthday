import React, { useMemo } from 'react';

export type PixelBlockTransitionPhase = 'idle' | 'covering' | 'revealing';

export interface PixelBlockTransitionProps {
  /**
   * Current phase of the pixel-block transition:
   * - 'idle': overlay is unmounted / inert
   * - 'covering': pixel blocks rapidly expand across the screen with staggered delays to clear the old view
   * - 'revealing': pixel blocks contract away to reveal the new screen
   */
  phase: PixelBlockTransitionPhase;
  className?: string;
}

interface BlockTile {
  id: number;
  col: number;
  row: number;
  delayMs: number;
  bgClass: string;
}

const COLS = 16;
const ROWS = 10;

/**
 * Pre-generate the 16x10 (160 tiles) retro pixel-block layout.
 * We calculate a staggered diagonal wave with 8-bit stepped jitter
 * to give that classic NES / GameBoy RPG screen wipe aesthetic.
 */
function generateBlockTiles(): BlockTile[] {
  const tiles: BlockTile[] = [];
  const maxDelayMs = 110;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c;

      // Normalized diagonal progress from top-left (0,0) to bottom-right (15,9)
      const diagProgress = (c + r) / ((COLS - 1) + (ROWS - 1));

      // 8-bit stepped jitter creates chunky, pixelated clusters instead of a flat straight line
      const jitter = ((c * 7 + r * 13) % 5) / 5;
      const combinedStagger = Math.min(1, Math.max(0, diagProgress * 0.72 + jitter * 0.28));
      const delayMs = Math.round(combinedStagger * maxDelayMs);

      // Neo-brutalist retro color styling:
      // Mostly solid midnight ink (#16192e), peppered with subtle cyberpunk accent tiles
      let bgClass = 'bg-[#16192e] border-[#222744]';
      if ((c * 5 + r * 3) % 19 === 0) {
        bgClass = 'bg-[#ffd000] border-[#16192e]'; // Brutalist yellow accent
      } else if ((c * 7 + r * 11) % 23 === 0) {
        bgClass = 'bg-[#00f0ff] border-[#16192e]'; // Cyan pixel flare
      } else if ((c * 3 + r * 7) % 29 === 0) {
        bgClass = 'bg-[#c92e68] border-[#16192e]'; // Hot pink accent
      }

      tiles.push({ id, col: c, row: r, delayMs, bgClass });
    }
  }

  return tiles;
}

const STATIC_TILES = generateBlockTiles();

/**
 * Hard-Cut Pixel-Block Screen Navigation Transition Overlay
 * When currentScreen changes, renders a snappy grid of expanding and contracting
 * pixel blocks that obscure and clear the previous view with an authentic 8-bit hard cut.
 */
export const PixelBlockTransition: React.FC<PixelBlockTransitionProps> = ({
  phase,
  className = '',
}) => {
  const tiles = useMemo(() => STATIC_TILES, []);

  // When transition is idle, remove from DOM entirely so it consumes zero resources
  if (phase === 'idle') {
    return null;
  }

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`fixed inset-0 z-40 pointer-events-auto select-none overflow-hidden ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        shapeRendering: 'crispEdges',
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="relative w-full h-full overflow-visible"
        >
          <div
            key={`${tile.id}-${phase}`}
            className={`w-full h-full border ${tile.bgClass} origin-center ${
              phase === 'covering'
                ? 'animate-pixel-block-expand'
                : 'animate-pixel-block-contract'
            }`}
            style={{
              animationDelay: `${tile.delayMs}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
