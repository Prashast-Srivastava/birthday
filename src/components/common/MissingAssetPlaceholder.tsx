import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface MissingAssetPlaceholderProps {
  label?: string;
  className?: string;
  subLabel?: string;
}

export const MissingAssetPlaceholder: React.FC<MissingAssetPlaceholderProps> = ({
  label = 'Cherished Memory Photo',
  className = '',
  subLabel = 'Drop real 4:3 photo in birthday data'
}) => {
  return (
    <div
      className={`w-full h-full min-h-[140px] bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 border-2 border-dashed border-pink-200/80 flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-pink-300 relative select-none rounded-2xl ${className}`}
    >
      <div className="mb-2 w-10 h-10 bg-white/80 border border-pink-200 shadow-xs flex items-center justify-center rounded-full text-pink-400">
        <Camera className="w-5 h-5" />
      </div>

      <div className="text-pink-700 text-xs font-bold tracking-wide flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-pink-400" />
        <span>{label}</span>
      </div>
      {subLabel && (
        <div className="text-slate-500 text-[11px] mt-1 font-medium max-w-[200px] leading-snug">
          {subLabel}
        </div>
      )}
    </div>
  );
};
