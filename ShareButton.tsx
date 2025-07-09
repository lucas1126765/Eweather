import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Link, MessageCircle, Copy, Check } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface ShareButtonProps {
  weather: WeatherData;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ weather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `${weather.name}現在天氣：${Math.round(weather.main.temp)}°C，${weather.weather[0].description}。體感溫度${Math.round(weather.main.feels_like)}°C，濕度${weather.main.humidity}%`;
  const shareUrl = window.location.href;

  const handleShare = async (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=EGWeather,台灣天氣`;
        break;
      case 'line':
        shareLink = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n查看更多：${shareUrl}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        } catch (err) {
          console.error('Failed to copy:', err);
          return;
        }
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'EG Weather - 天氣資訊',
              text: shareText,
              url: shareUrl,
            });
            return;
          } catch (err) {
            console.error('Error sharing:', err);
            return;
          }
        }
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-2xl transition-colors duration-200 border border-white/30 flex items-center gap-2"
        title="分享天氣資訊"
      >
        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline text-sm md:text-base">分享</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl z-50 min-w-48">
            <div className="p-2">
              <div className="text-sm font-medium text-gray-800 px-3 py-2 border-b border-gray-200">
                分享天氣資訊
              </div>
              
              {/* Native Share (if supported) */}
              {navigator.share && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full px-3 py-2 text-left hover:bg-white/50 transition-colors duration-150 flex items-center gap-3 rounded-xl"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800">系統分享</span>
                </button>
              )}

              <button
                onClick={() => handleShare('facebook')}
                className="w-full px-3 py-2 text-left hover:bg-white/50 transition-colors duration-150 flex items-center gap-3 rounded-xl"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="text-gray-800">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-3 py-2 text-left hover:bg-white/50 transition-colors duration-150 flex items-center gap-3 rounded-xl"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                <span className="text-gray-800">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('line')}
                className="w-full px-3 py-2 text-left hover:bg-white/50 transition-colors duration-150 flex items-center gap-3 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-800">LINE</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="w-full px-3 py-2 text-left hover:bg-white/50 transition-colors duration-150 flex items-center gap-3 rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-800">複製連結</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};