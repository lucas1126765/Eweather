import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] px-4">
      <div className="relative">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-white/80 text-sm md:text-base text-center">載入天氣資料中...</p>
    </div>
  );
};