import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center px-4">
      <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-3 md:p-4 mb-4">
        <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-300" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">發生錯誤</h3>
      <p className="text-white/80 mb-4 max-w-md text-sm md:text-base">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl transition-colors duration-200 border border-white/30 text-sm md:text-base"
        >
          重新嘗試
        </button>
      )}
    </div>
  );
};