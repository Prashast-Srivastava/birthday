import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audio';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import mascotImageUrl from '../../assets/images/pixel_cat_mascot_1788680282571.jpg';

export interface PixelCatPalette {
  earsAndPaws?: string;
  innerEar?: string;
  bodyFur?: string;
  bodyOutline?: string;
  hatBand1?: string;
  hatBand2?: string;
  hatBand3?: string;
  pomPom?: string;
  eyes?: string;
  collar?: string;
  bell?: string;
  cheeks?: string;
}

const DARK_PALETTE: Required<PixelCatPalette> = {
  earsAndPaws: '#121723', // dark charcoal navy
  innerEar: '#f5a524',    // warm amber
  bodyFur: '#f5f5f7',     // cream off-white
  bodyOutline: '#0a0e17', // near-black outline
  hatBand1: '#f5a524',    // amber orange
  hatBand2: '#38bdf8',    // cyan
  hatBand3: '#f43f5e',    // rose
  pomPom: '#f5a524',      // amber
  eyes: '#38bdf8',        // bright cyan
  collar: '#f43f5e',      // rose red
  bell: '#f5a524',        // golden amber
  cheeks: '#f43f5e',      // rosy blush
};

const LIGHT_PALETTE: Required<PixelCatPalette> = {
  earsAndPaws: '#090d16', // stark high-contrast black
  innerEar: '#d97706',    // deep amber
  bodyFur: '#ffffff',     // pure white fur
  bodyOutline: '#090d16', // sharp crisp outline
  hatBand1: '#d97706',    // deep amber orange
  hatBand2: '#0284c7',    // deep sky cyan
  hatBand3: '#e11d48',    // deep ruby red
  pomPom: '#d97706',      // deep amber
  eyes: '#0284c7',        // deep accessible cyan
  collar: '#e11d48',      // deep ruby red
  bell: '#d97706',        // deep amber
  cheeks: '#e11d48',      // rosy blush
};

const HACKER_PALETTE: Required<PixelCatPalette> = {
  earsAndPaws: '#020502', // deep terminal black
  innerEar: '#22c55e',    // phosphor green
  bodyFur: '#050f05',     // matrix dark green
  bodyOutline: '#00ff66', // vivid matrix neon green
  hatBand1: '#00ff66',    // neon green
  hatBand2: '#16a34a',    // medium green
  hatBand3: '#4ade80',    // light green
  pomPom: '#00ff66',      // neon green
  eyes: '#00ff66',        // glowing matrix eyes
  collar: '#15803d',      // emerald collar
  bell: '#00ff66',        // glowing bell
  cheeks: '#22c55e',      // phosphor blush
};

interface PixelCatProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSpeech?: boolean;
  speechText?: string;
  partyHat?: boolean;
  idleBob?: boolean;
  palette?: PixelCatPalette;
  theme?: ThemeMode;
  renderMode?: 'svg' | 'mascot';
  allowToggleMode?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PixelCat: React.FC<PixelCatProps> = ({
  size = 'lg',
  showSpeech = false,
  speechText = 'MEOW! SYSTEM OPERATIONAL!',
  partyHat = true,
  idleBob = true,
  palette: customPalette,
  theme: propTheme,
  renderMode = 'mascot',
  allowToggleMode = true,
  onClick,
  className = ''
}) => {
  const [displayMode, setDisplayMode] = useState<'svg' | 'mascot'>(renderMode);

  let contextTheme: ThemeMode = 'dark';
  try {
    const ctx = useTheme();
    contextTheme = ctx.theme;
  } catch {
    // Fallback if rendered outside ThemeProvider
  }

  const activeTheme = propTheme ?? contextTheme;
  const basePalette =
    activeTheme === 'hacker'
      ? HACKER_PALETTE
      : activeTheme === 'light'
      ? LIGHT_PALETTE
      : DARK_PALETTE;
  const pal = { ...basePalette, ...customPalette };

  const [isBlinking, setIsBlinking] = useState(false);
  const [isPurring, setIsPurring] = useState(false);

  const handleCatClick = () => {
    soundEngine.playPurr();
    setIsPurring(true);
    setTimeout(() => setIsPurring(false), 800);
    if (onClick) onClick();
  };

  const handleCatHover = () => {
    soundEngine.playPurr();
  };

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    '2xl': 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96'
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Dialogue Speech Bubble (Clean Dev-Tool Style) */}
      {showSpeech && (
        <div className="mb-4 px-4 py-2 bg-[#121723] text-[#f5f5f7] border border-[#ffffff1a] rounded-xl text-xs font-mono tracking-wide relative shadow-lg text-center max-w-sm sm:max-w-md">
          {speechText}
          {/* Pixelated downward speech pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#121723] border-b border-r border-[#ffffff1a] rotate-45" />
        </div>
      )}

      {/* Retro Pixel Cat Graphic / Mascot Image with Stepped Idle Bob */}
      <div 
        onClick={handleCatClick}
        onMouseEnter={handleCatHover}
        className={`cursor-pointer select-none relative ${idleBob ? 'animate-pixel-cat-bob' : ''} ${sizeClasses[size]} ${isPurring ? 'scale-110' : 'hover:scale-105 active:scale-95'} pixelated transition-transform duration-200`}
        style={{
          imageRendering: 'pixelated',
        }}
        title="Hover or click for purrs!"
      >
        {displayMode === 'mascot' ? (
          <div className="w-full h-full flex items-center justify-center p-1">
            <img
              src={mascotImageUrl}
              alt="Pixel Art Chibi Cat Birthday Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain pixelated drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] rounded-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        ) : (
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full pixel-art drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
            style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
          >
            {/* Birthday Party Hat (Striped 3 bands: hatBand1, hatBand2, hatBand3) */}
            {partyHat && (
              <g>
                {/* Pom-pom */}
                <rect x="15" y="0" width="2" height="1" fill={pal.pomPom} stroke={pal.bodyOutline} strokeWidth="0.5" />
                {/* Cone layers */}
                <rect x="15" y="1" width="2" height="2" fill={pal.hatBand1} />
                <rect x="14" y="3" width="4" height="2" fill={pal.hatBand2} />
                <rect x="13" y="5" width="6" height="2" fill={pal.hatBand3} />
                <rect x="12" y="7" width="8" height="2" fill={pal.hatBand1} />
              </g>
            )}

            {/* Cat Ears */}
            <rect x="6" y="8" width="4" height="2" fill={pal.earsAndPaws} />
            <rect x="7" y="10" width="4" height="2" fill={pal.earsAndPaws} />
            <rect x="7" y="9" width="2" height="2" fill={pal.innerEar} /> {/* Inner ear left */}

            <rect x="22" y="8" width="4" height="2" fill={pal.earsAndPaws} />
            <rect x="21" y="10" width="4" height="2" fill={pal.earsAndPaws} />
            <rect x="23" y="9" width="2" height="2" fill={pal.innerEar} /> {/* Inner ear right */}

            {/* Cat Head Base */}
            <rect x="6" y="11" width="20" height="10" fill={pal.bodyOutline} />
            <rect x="7" y="12" width="18" height="8" fill={pal.bodyFur} />

            {/* Cute Rosy Cheeks */}
            <rect x="7" y="17" width="3" height="2" fill={pal.cheeks} />
            <rect x="22" y="17" width="3" height="2" fill={pal.cheeks} />

            {/* Eyes (Animated Blink) */}
            {isBlinking ? (
              <>
                <rect x="10" y="16" width="3" height="1" fill={pal.bodyOutline} />
                <rect x="19" y="16" width="3" height="1" fill={pal.bodyOutline} />
              </>
            ) : (
              <>
                {/* Left Eye */}
                <rect x="10" y="14" width="3" height="3" fill={pal.bodyOutline} />
                <rect x="10" y="14" width="1" height="1" fill={pal.eyes} />
                <rect x="11" y="14" width="1" height="1" fill="#FFFFFF" />
                {/* Right Eye */}
                <rect x="19" y="14" width="3" height="3" fill={pal.bodyOutline} />
                <rect x="19" y="14" width="1" height="1" fill={pal.eyes} />
                <rect x="20" y="14" width="1" height="1" fill="#FFFFFF" />
              </>
            )}

            {/* Nose & Mouth */}
            <rect x="15" y="17" width="2" height="1" fill={pal.cheeks} />
            <rect x="14" y="18" width="1" height="1" fill={pal.bodyOutline} />
            <rect x="17" y="18" width="1" height="1" fill={pal.bodyOutline} />
            <rect x="15" y="19" width="2" height="1" fill={pal.bodyOutline} />

            {/* Whiskers */}
            <rect x="3" y="15" width="3" height="1" fill={pal.bodyOutline} />
            <rect x="3" y="17" width="3" height="1" fill={pal.bodyOutline} />
            <rect x="26" y="15" width="3" height="1" fill={pal.bodyOutline} />
            <rect x="26" y="17" width="3" height="1" fill={pal.bodyOutline} />

            {/* Body & Paws */}
            <rect x="9" y="21" width="14" height="7" fill={pal.bodyOutline} />
            <rect x="10" y="22" width="12" height="5" fill={pal.bodyFur} />
            
            {/* Paws */}
            <rect x="10" y="27" width="3" height="2" fill={pal.earsAndPaws} stroke={pal.bodyOutline} strokeWidth="0.5" />
            <rect x="19" y="27" width="3" height="2" fill={pal.earsAndPaws} stroke={pal.bodyOutline} strokeWidth="0.5" />
            
            {/* Collar with yellow bell/gem */}
            <rect x="10" y="21" width="12" height="1" fill={pal.collar} />
            <rect x="14" y="21" width="4" height="2" fill={pal.bell} stroke={pal.bodyOutline} strokeWidth="0.4" />

            {/* Tail */}
            <rect x="23" y="23" width="4" height="2" fill={pal.bodyOutline} />
            <rect x="25" y="21" width="2" height="3" fill={pal.bodyOutline} />
            <rect x="25" y="20" width="3" height="2" fill={pal.bodyFur} stroke={pal.bodyOutline} strokeWidth="0.4" />
          </svg>
        )}
      </div>

      {/* Mascot Status & Interactive Render Switch Underneath */}
      <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
        <div className="px-3 py-1 bg-[#121723] border border-[#ffffff1a] rounded-full text-[10px] font-mono text-[#f5f5f7] uppercase tracking-wider flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse inline-block" />
          <span className="font-semibold text-[#f5f5f7]">NEKO_COMPANION // READY</span>
        </div>

        {allowToggleMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playSelect();
              setDisplayMode((prev) => (prev === 'mascot' ? 'svg' : 'mascot'));
            }}
            className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-[#1a1f2e] hover:bg-[#222838] border border-[#ffffff1a] rounded-full text-[#9ca3af] hover:text-[#f5f5f7] transition-all cursor-pointer select-none"
            title="Toggle between pixel art chibi mascot and 8-bit sprite"
          >
            {displayMode === 'mascot' ? 'SPRITE: 8-BIT' : 'MASCOT: CHIBI'}
          </button>
        )}
      </div>
    </div>
  );
};
