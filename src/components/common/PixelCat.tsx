import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audio';

interface PixelCatProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSpeech?: boolean;
  speechText?: string;
  partyHat?: boolean;
  idleBob?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PixelCat: React.FC<PixelCatProps> = ({
  size = 'lg',
  showSpeech = false,
  speechText = 'MEOW! SYSTEM OPERATIONAL!',
  partyHat = true,
  idleBob = true,
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
      {/* Dialogue Speech Bubble (Neo-Brutalist Digital Paper) */}
      {showSpeech && (
        <div className="mb-4 px-4 py-2.5 bg-[#fffdf0] border-3 border-[#16192e] text-[#16192e] font-pixel text-xs tracking-wide relative brutal-shadow text-center max-w-sm sm:max-w-md">
          {speechText}
          {/* Pixelated downward speech pointer */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-[#fffdf0] border-b-3 border-r-3 border-l-3 border-[#16192e]" />
        </div>
      )}

      {/* Retro 8-bit Pixel Cat Graphic with Stepped Idle Bob */}
      <div 
        onClick={handleCatClick}
        onMouseEnter={handleCatHover}
        className={`cursor-pointer select-none ${idleBob ? 'animate-pixel-cat-bob' : ''} ${sizeClasses[size]} ${isPurring ? 'scale-110' : 'hover:scale-105 active:scale-95'} pixelated`}
        style={{
          imageRendering: 'pixelated',
        }}
        title="Hover or click for purrs!"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full pixel-art drop-shadow-[5px_5px_0_#16192e]"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
        >
          {/* Birthday Party Hat (Striped Hot Pink, Yellow & Cyan) */}
          {partyHat && (
            <g>
              {/* Pom-pom */}
              <rect x="15" y="0" width="2" height="1" fill="#FFD000" stroke="#16192e" strokeWidth="0.5" />
              {/* Cone layers */}
              <rect x="15" y="1" width="2" height="2" fill="#FF5E97" />
              <rect x="14" y="3" width="4" height="2" fill="#00F0FF" />
              <rect x="13" y="5" width="6" height="2" fill="#FFD000" />
              <rect x="12" y="7" width="8" height="2" fill="#FF5E97" />
            </g>
          )}

          {/* Cat Ears */}
          <rect x="6" y="8" width="4" height="2" fill="#16192E" />
          <rect x="7" y="10" width="4" height="2" fill="#16192E" />
          <rect x="7" y="9" width="2" height="2" fill="#FF5E97" /> {/* Inner ear left */}

          <rect x="22" y="8" width="4" height="2" fill="#16192E" />
          <rect x="21" y="10" width="4" height="2" fill="#16192E" />
          <rect x="23" y="9" width="2" height="2" fill="#FF5E97" /> {/* Inner ear right */}

          {/* Cat Head Base */}
          <rect x="6" y="11" width="20" height="10" fill="#16192E" />
          <rect x="7" y="12" width="18" height="8" fill="#FFFDF0" />

          {/* Cute Rosy Cheeks */}
          <rect x="7" y="17" width="3" height="2" fill="#FF5E97" />
          <rect x="22" y="17" width="3" height="2" fill="#FF5E97" />

          {/* Eyes (Animated Blink) */}
          {isBlinking ? (
            <>
              <rect x="10" y="16" width="3" height="1" fill="#16192E" />
              <rect x="19" y="16" width="3" height="1" fill="#16192E" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <rect x="10" y="14" width="3" height="3" fill="#16192E" />
              <rect x="10" y="14" width="1" height="1" fill="#00F0FF" />
              <rect x="11" y="14" width="1" height="1" fill="#FFFFFF" />
              {/* Right Eye */}
              <rect x="19" y="14" width="3" height="3" fill="#16192E" />
              <rect x="19" y="14" width="1" height="1" fill="#00F0FF" />
              <rect x="20" y="14" width="1" height="1" fill="#FFFFFF" />
            </>
          )}

          {/* Nose & Mouth */}
          <rect x="15" y="17" width="2" height="1" fill="#FF5E97" />
          <rect x="14" y="18" width="1" height="1" fill="#16192E" />
          <rect x="17" y="18" width="1" height="1" fill="#16192E" />
          <rect x="15" y="19" width="2" height="1" fill="#16192E" />

          {/* Whiskers */}
          <rect x="3" y="15" width="3" height="1" fill="#16192E" />
          <rect x="3" y="17" width="3" height="1" fill="#16192E" />
          <rect x="26" y="15" width="3" height="1" fill="#16192E" />
          <rect x="26" y="17" width="3" height="1" fill="#16192E" />

          {/* Body & Paws */}
          <rect x="9" y="21" width="14" height="7" fill="#16192E" />
          <rect x="10" y="22" width="12" height="5" fill="#FFFDF0" />
          
          {/* Paws */}
          <rect x="10" y="27" width="3" height="2" fill="#FFFDF0" stroke="#16192E" strokeWidth="0.5" />
          <rect x="19" y="27" width="3" height="2" fill="#FFFDF0" stroke="#16192E" strokeWidth="0.5" />
          
          {/* Collar with yellow bell/gem */}
          <rect x="10" y="21" width="12" height="1" fill="#FF5E97" />
          <rect x="14" y="21" width="4" height="2" fill="#FFD000" stroke="#16192E" strokeWidth="0.4" />

          {/* Tail */}
          <rect x="23" y="23" width="4" height="2" fill="#16192E" />
          <rect x="25" y="21" width="2" height="3" fill="#16192E" />
          <rect x="25" y="20" width="3" height="2" fill="#FFFDF0" stroke="#16192E" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Mascot Status Underneath */}
      <div className="mt-3 px-3 py-1 bg-[#fffdf0] border-2 border-[#16192e] brutal-shadow-sm text-[9px] font-pixel text-[#16192e] uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-[#22c55e] border border-[#16192e] inline-block" />
        <span className="font-bold">NEKO_COMPANION // READY</span>
      </div>
    </div>
  );
};
