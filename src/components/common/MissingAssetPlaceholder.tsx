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
      className={`w-full h-full min-h-[140px] bg-[#0c0e0c] border border-dashed border-[#4ade80]/40 flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-[#4ade80] hover:bg-[#4ade80]/5 font-mono ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <div className="text-[#4ade80] text-xs font-bold tracking-widest uppercase select-none">
        {label}
      </div>
      {subLabel && (
        <div className="text-[#fbbf24] text-[10px] mt-1 tracking-wider opacity-80 uppercase">
          {subLabel}
        </div>
      )}
      <div className="mt-3 flex items-center space-x-1.5 opacity-60">
        <div className="w-1.5 h-1.5 bg-[#4ade80]"></div>
        <div className="w-1.5 h-1.5 bg-[#fbbf24]"></div>
        <div className="w-1.5 h-1.5 bg-[#4ade80]"></div>
      </div>
    </div>
  );
};
