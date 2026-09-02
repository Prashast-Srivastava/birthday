import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audio';

interface PixelCatProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSpeech?: boolean;
  speechText?: string;
  partyHat?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PixelCat: React.FC<PixelCatProps> = ({
  size = 'lg',
  showSpeech = false,
  speechText = 'MEOW! SYSTEM OPERATIONAL!',
  partyHat = true,
  onClick,
  className = ''
}) => {
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
      {/* Dialogue Speech Bubble */}
      {showSpeech && (
        <div className="mb-4 px-4 py-2.5 bg-[#080a08]/95 border-2 border-[#4ade80] text-[#4ade80] font-mono font-bold text-xs sm:text-sm tracking-wider relative shadow-[0_0_20px_rgba(74,222,128,0.35)] animate-bounce text-center max-w-sm sm:max-w-md">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#4ade80]" />
        </div>
      )}

      {/* Retro Pixel Cat Graphic: Green Neon Outline */}
      <div 
        onClick={handleCatClick}
        onMouseEnter={handleCatHover}
        className={`cursor-pointer transition-transform duration-150 animate-pixel-idle ${sizeClasses[size]} ${isPurring ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
        title="Hover or click for purrs!"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full drop-shadow-[0_0_18px_rgba(74,222,128,0.5)]"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
        >
          {/* Subtle Ambient Phosphor Glow */}
          <rect x="7" y="7" width="18" height="18" fill="rgba(74, 222, 128, 0.08)" />

          {/* Birthday Party Hat */}
          {partyHat && (
            <g className="animate-pulse">
              {/* Pom-pom */}
              <rect x="15" y="0" width="2" height="1" fill="#F5F5F5" />
              {/* Cone layers */}
              <rect x="15" y="1" width="2" height="2" fill="#FF5C8A" />
              <rect x="14" y="3" width="4" height="2" fill="#4ADE80" />
              <rect x="13" y="5" width="6" height="2" fill="#FF5C8A" />
              <rect x="12" y="7" width="8" height="2" fill="#4ADE80" />
            </g>
          )}

          {/* Cat Ears */}
          <rect x="6" y="8" width="4" height="2" fill="#4ADE80" />
          <rect x="7" y="10" width="4" height="2" fill="#4ADE80" />
          <rect x="7" y="9" width="2" height="2" fill="#FF5C8A" /> {/* Inner ear left */}

          <rect x="22" y="8" width="4" height="2" fill="#4ADE80" />
          <rect x="21" y="10" width="4" height="2" fill="#4ADE80" />
          <rect x="23" y="9" width="2" height="2" fill="#FF5C8A" /> {/* Inner ear right */}

          {/* Cat Head Base */}
          <rect x="7" y="11" width="18" height="11" fill="#080a08" />
          <rect x="6" y="12" width="20" height="9" fill="#4ADE80" />
          <rect x="8" y="13" width="16" height="7" fill="#111811" />

          {/* Cheeks */}
          <rect x="7" y="17" width="2" height="2" fill="#FF5C8A" opacity="0.9" />
          <rect x="23" y="17" width="2" height="2" fill="#FF5C8A" opacity="0.9" />

          {/* Eyes (Animated Blink) */}
          {isBlinking ? (
            <>
              <rect x="10" y="16" width="3" height="1" fill="#4ADE80" />
              <rect x="19" y="16" width="3" height="1" fill="#4ADE80" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <rect x="10" y="14" width="3" height="3" fill="#4ADE80" />
              <rect x="11" y="14" width="1" height="1" fill="#FFFFFF" />
              {/* Right Eye */}
              <rect x="19" y="14" width="3" height="3" fill="#4ADE80" />
              <rect x="20" y="14" width="1" height="1" fill="#FFFFFF" />
            </>
          )}

          {/* Nose & Mouth */}
          <rect x="15" y="17" width="2" height="1" fill="#FF5C8A" />
          <rect x="14" y="18" width="1" height="1" fill="#4ADE80" />
          <rect x="17" y="18" width="1" height="1" fill="#4ADE80" />
          <rect x="15" y="19" width="2" height="1" fill="#4ADE80" />

          {/* Whiskers */}
          <rect x="3" y="15" width="3" height="1" fill="#4ADE80" opacity="0.8" />
          <rect x="3" y="17" width="3" height="1" fill="#4ADE80" opacity="0.8" />
          <rect x="26" y="15" width="3" height="1" fill="#4ADE80" opacity="0.8" />
          <rect x="26" y="17" width="3" height="1" fill="#4ADE80" opacity="0.8" />

          {/* Body & Paws */}
          <rect x="10" y="21" width="12" height="7" fill="#4ADE80" />
          <rect x="12" y="22" width="8" height="5" fill="#111811" />
          {/* Paws */}
          <rect x="10" y="28" width="3" height="2" fill="#F5F5F5" />
          <rect x="19" y="28" width="3" height="2" fill="#F5F5F5" />
          {/* Collar with pink ribbon and yellow gem */}
          <rect x="11" y="21" width="10" height="1" fill="#FF5C8A" />
          <rect x="15" y="21" width="2" height="2" fill="#FFD43B" />

          {/* Tail */}
          <rect x="22" y="24" width="4" height="2" fill="#4ADE80" />
          <rect x="25" y="22" width="2" height="3" fill="#4ADE80" />
          <rect x="26" y="20" width="2" height="3" fill="#FF5C8A" />
        </svg>
      </div>

      {/* Mascot Status Underneath */}
      <div className="mt-3 text-[10px] font-mono text-[#4ade80] uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-[#4ade80] animate-pulse inline-block shadow-[0_0_8px_#4ade80]" />
        <span className="font-bold">NEKO_COMPANION // READY</span>
      </div>
    </div>
  );
};

