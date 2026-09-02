import React from 'react';

interface MissingAssetPlaceholderProps {
  label?: string;
  className?: string;
  subLabel?: string;
}

export const MissingAssetPlaceholder: React.FC<MissingAssetPlaceholderProps> = ({
  label = '[ ASSET MISSING ]',
  className = '',
  subLabel
}) => {
  return (
    <div
      className={`w-full h-full min-h-[140px] bg-[#111111] border-4 border-dashed border-[#ffd000] flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-[#ff5e97] font-pixel relative select-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 8-bit Broken Cartridge Graphic Accent */}
      <div className="mb-2 w-10 h-8 bg-[#16192e] border-2 border-[#ffd000] relative flex items-center justify-center brutal-shadow-sm">
        <div className="w-5 h-2 bg-[#ffd000]/30 border-b border-[#ffd000]" />
        <span className="absolute text-[8px] text-[#f43f5e] font-bold">✕</span>
      </div>

      <div className="text-[#ffd000] text-[10px] sm:text-xs font-pixel font-bold tracking-wider uppercase">
        {label}
      </div>
      {subLabel && (
        <div className="text-[#fffdf0] text-[9px] mt-1 font-mono tracking-wider opacity-80 uppercase">
          {subLabel}
        </div>
      )}
      <div className="mt-2.5 flex items-center space-x-1.5 opacity-70">
        <div className="w-2 h-2 bg-[#ffd000] border border-black"></div>
        <div className="w-2 h-2 bg-[#ff5e97] border border-black"></div>
        <div className="w-2 h-2 bg-[#00f0ff] border border-black"></div>
      </div>
    </div>
  );
};
