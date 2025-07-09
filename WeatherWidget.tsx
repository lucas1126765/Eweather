import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherService';

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

interface WidgetConfig {
  size: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
  showDetails: boolean;
  showForecast: boolean;
  borderRadius: number;
  backgroundColor: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<WidgetConfig>({
    size: 'medium',
    theme: 'auto',
    showDetails: true,
    showForecast: false,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  });

  const generateWidgetCode = () => {
    const widgetUrl = `${window.location.origin}/widget`;
    const params = new URLSearchParams({
      city: weather?.name || 'Taipei',
      lat: weather?.coord.lat.toString() || '25.0330',
      lon: weather?.coord.lon.toString() || '121.5654',
      size: config.size,
      theme: config.theme,
      details: config.showDetails.toString(),
      forecast: config.showForecast.toString(),
      radius: config.borderRadius.toString(),
      bg: encodeURIComponent(config.backgroundColor)
    });

    return `<iframe 
  src="${widgetUrl}?${params.toString()}" 
  width="${getSizeWidth()}" 
  height="${getSizeHeight()}" 
  frameborder="0" 
  scrolling="no"
  style="border-radius: ${config.borderRadius}px; overflow: hidden;">
</iframe>`;
  };

  const getSizeWidth = () => {
    switch (config.size) {
      case 'small': return '280';
      case 'medium': return '350';
      case 'large': return '450';
      default: return '350';
    }
  };

  const getSizeHeight = () => {
    switch (config.size) {
      case 'small': return config.showDetails ? '200' : '120';
      case 'medium': return config.showDetails ? '280' : '180';
      case 'large': return config.showDetails ? '350' : '220';
      default: return '280';
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateWidgetCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const WidgetPreview = () => (
    <div 
      className={`
        ${config.size === 'small' ? 'w-70 h-32' : config.size === 'medium' ? 'w-80 h-40' : 'w-96 h-48'}
        ${config.theme === 'dark' ? 'bg-gray-800 text-white' : config.theme === 'light' ? 'bg-white text-gray-800' : 'bg-white/10 backdrop-blur-md text-white'}
        border border-white/20 shadow-lg overflow-hidden mx-auto
      `}
      style={{ 
        borderRadius: `${config.borderRadius}px`,
        backgroundColor: config.theme === 'auto' ? config.backgroundColor : undefined
      }}
    >
      {weather && (
        <div className="p-3 md:p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm md:text-base">{weather.name}</h3>
              <p className="text-xs opacity-80 capitalize">{weather.weather[0].description}</p>
            </div>
            <img
              src={weatherService.getWeatherIconUrl(weather.weather[0].icon)}
              alt={weather.weather[0].description}
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl md:text-2xl font-bold">
              {weatherService.formatTemperature(weather.main.temp)}
            </span>
            <span className="text-sm opacity-70">
              體感 {weatherService.formatTemperature(weather.main.feels_like)}
            </span>
          </div>

          {config.showDetails && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>濕度: {weather.main.humidity}%</div>
              <div>風速: {weather.wind.speed} m/s</div>
              <div>氣壓: {weather.main.pressure} hPa</div>
              <div>能見度: {(weather.visibility / 1000).toFixed(1)} km</div>
            </div>
          )}

          <div className="mt-auto pt-2 text-xs opacity-60 text-center border-t border-current/20">
            Powered by EG Weather
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-2xl transition-colors duration-200 border border-white/30 flex items-center gap-2"
        title="嵌入小工具"
      >
        <Code className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline text-sm md:text-base">嵌入</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white/95 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Code className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">天氣小工具</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        自訂設定
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Size */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
                          <select
                            value={config.size}
                            onChange={(e) => setConfig({...config, size: e.target.value as any})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="small">小 (280x200)</option>
                            <option value="medium">中 (350x280)</option>
                            <option value="large">大 (450x350)</option>
                          </select>
                        </div>

                        {/* Theme */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">主題</label>
                          <select
                            value={config.theme}
                            onChange={(e) => setConfig({...config, theme: e.target.value as any})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="auto">自動</option>
                            <option value="light">淺色</option>
                            <option value="dark">深色</option>
                          </select>
                        </div>

                        {/* Border Radius */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            圓角 ({config.borderRadius}px)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="32"
                            value={config.borderRadius}
                            onChange={(e) => setConfig({...config, borderRadius: parseInt(e.target.value)})}
                            className="w-full"
                          />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={config.showDetails}
                              onChange={(e) => setConfig({...config, showDetails: e.target.checked})}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">顯示詳細資訊</span>
                          </label>
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={config.showForecast}
                              onChange={(e) => setConfig({...config, showForecast: e.target.checked})}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">顯示預報 (即將推出)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Code */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">嵌入代碼</h3>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              已複製
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              複製
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        value={generateWidgetCode()}
                        readOnly
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        將此代碼複製並貼到您的網站 HTML 中即可顯示天氣小工具
                      </p>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      預覽
                    </h3>
                    
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl">
                      <WidgetPreview />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">使用說明</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 複製上方的嵌入代碼</li>
                        <li>• 貼到您網站的 HTML 中</li>
                        <li>• 小工具會自動顯示當前城市的天氣</li>
                        <li>• 支援響應式設計，適配各種螢幕</li>
                        <li>• 資料每30分鐘自動更新</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};