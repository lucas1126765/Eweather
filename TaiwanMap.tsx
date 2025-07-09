import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wind, Eye, RefreshCw, Satellite, Maximize2, Minimize2 } from 'lucide-react';
import { typhoonService, TyphoonData } from '../services/typhoonService';

export const TaiwanMap: React.FC = () => {
  const [typhoons, setTyphoons] = useState<TyphoonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTyphoonData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const typhoonData = await typhoonService.checkForTyphoons();
      setTyphoons(typhoonData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching typhoon data:', err);
      setError('無法獲取颱風資訊，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMap) {
      fetchTyphoonData();
      
      // 每30分鐘自動更新一次
      const interval = setInterval(fetchTyphoonData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [showMap]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'watch':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'active':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'warning':
        return '颱風警報';
      case 'watch':
        return '颱風監視';
      case 'active':
        return '活躍中';
      default:
        return '未知';
    }
  };

  const getIntensityColor = (intensity: string) => {
    if (intensity.includes('超強')) return 'text-purple-400';
    if (intensity.includes('強烈')) return 'text-red-400';
    if (intensity.includes('中度')) return 'text-orange-400';
    if (intensity.includes('輕度')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  // 台灣各縣市的相對位置（簡化版）
  const taiwanRegions = [
    // 北部
    { name: '基隆', x: 52, y: 15, color: '#10B981' },
    { name: '台北', x: 50, y: 20, color: '#3B82F6' },
    { name: '新北', x: 48, y: 18, color: '#6366F1' },
    { name: '桃園', x: 45, y: 25, color: '#8B5CF6' },
    { name: '新竹', x: 42, y: 32, color: '#A855F7' },
    
    // 中部
    { name: '苗栗', x: 40, y: 38, color: '#EC4899' },
    { name: '台中', x: 38, y: 45, color: '#EF4444' },
    { name: '彰化', x: 35, y: 52, color: '#F97316' },
    { name: '南投', x: 42, y: 50, color: '#F59E0B' },
    { name: '雲林', x: 32, y: 58, color: '#EAB308' },
    
    // 南部
    { name: '嘉義', x: 30, y: 65, color: '#84CC16' },
    { name: '台南', x: 28, y: 72, color: '#22C55E' },
    { name: '高雄', x: 25, y: 80, color: '#10B981' },
    { name: '屏東', x: 22, y: 88, color: '#14B8A6' },
    
    // 東部
    { name: '宜蘭', x: 55, y: 25, color: '#06B6D4' },
    { name: '花蓮', x: 58, y: 50, color: '#0EA5E9' },
    { name: '台東', x: 55, y: 75, color: '#3B82F6' },
    
    // 離島
    { name: '澎湖', x: 15, y: 65, color: '#6366F1' },
    { name: '金門', x: 8, y: 45, color: '#8B5CF6' },
    { name: '馬祖', x: 45, y: 8, color: '#A855F7' },
  ];

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-3xl shadow-xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 p-6' : 'p-4 md:p-6'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">颱風監測</h3>
          {lastUpdate && (
            <span className="text-xs text-white/60 ml-2 hidden sm:inline">
              {typhoonService.formatLastUpdate(lastUpdate)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showMap && (
            <>
              <button
                onClick={fetchTyphoonData}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-xl transition-colors duration-200 border border-white/30 disabled:opacity-50"
                title="重新整理"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-xl transition-colors duration-200 border border-white/30 hidden md:block"
                title={isFullscreen ? '縮小' : '全螢幕'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </>
          )}
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 md:px-4 rounded-xl transition-colors duration-200 border border-white/30 text-sm md:text-base"
          >
            {showMap ? '隱藏' : '顯示'}
          </button>
        </div>
      </div>

      {showMap && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="ml-3 text-white/80 text-sm md:text-base">正在檢查颱風動態...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm md:text-base">{error}</p>
              <button
                onClick={fetchTyphoonData}
                className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-colors duration-200 border border-white/30"
              >
                重新嘗試
              </button>
            </div>
          ) : (
            <>
              {/* 台灣地圖 */}
              <div className={`relative bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-sm rounded-2xl overflow-hidden ${
                isFullscreen ? 'h-96 md:h-[500px]' : 'h-64 md:h-80'
              }`}>
                {/* 台灣島嶼輪廓 */}
                <div className="absolute inset-0">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* 台灣本島 */}
                    <path
                      d="M45 10 C50 8, 55 12, 58 18 C62 25, 65 35, 63 45 C62 55, 60 65, 58 75 C55 85, 50 92, 45 95 C40 92, 35 85, 32 75 C30 65, 28 55, 27 45 C26 35, 28 25, 32 18 C35 12, 40 8, 45 10 Z"
                      fill="rgba(34, 197, 94, 0.6)"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth="0.5"
                    />
                    
                    {/* 澎湖群島 */}
                    <circle cx="15" cy="65" r="2" fill="rgba(34, 197, 94, 0.6)" />
                    <circle cx="12" cy="67" r="1" fill="rgba(34, 197, 94, 0.6)" />
                    <circle cx="18" cy="63" r="1" fill="rgba(34, 197, 94, 0.6)" />
                    
                    {/* 金門 */}
                    <circle cx="8" cy="45" r="1.5" fill="rgba(34, 197, 94, 0.6)" />
                    
                    {/* 馬祖 */}
                    <circle cx="45" cy="8" r="1" fill="rgba(34, 197, 94, 0.6)" />
                    
                    {/* 蘭嶼、綠島 */}
                    <circle cx="65" cy="78" r="1" fill="rgba(34, 197, 94, 0.6)" />
                    <circle cx="62" cy="65" r="0.8" fill="rgba(34, 197, 94, 0.6)" />
                  </svg>
                  
                  {/* 縣市標記 */}
                  {taiwanRegions.map((region) => (
                    <div
                      key={region.name}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${region.x}%`,
                        top: `${region.y}%`,
                      }}
                    >
                      <div 
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: region.color }}
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap hidden md:block">
                        {region.name}
                      </div>
                    </div>
                  ))}
                  
                  {/* 颱風位置標記 */}
                  {typhoons.map((typhoon) => {
                    // 將經緯度轉換為台灣地圖上的相對位置
                    const x = ((typhoon.lon - 118) / 8) * 100; // 118-126度經度範圍
                    const y = ((25.5 - typhoon.lat) / 5) * 100;  // 20.5-25.5度緯度範圍
                    
                    return (
                      <div
                        key={typhoon.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${Math.max(5, Math.min(95, x))}%`,
                          top: `${Math.max(5, Math.min(95, y))}%`,
                        }}
                      >
                        <div className="relative">
                          <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                            <Wind className="w-2 h-2 md:w-3 md:h-3 text-white" />
                          </div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {typhoon.name}
                          </div>
                          {/* 影響範圍圓圈 */}
                          <div className="absolute inset-0 w-8 h-8 md:w-12 md:h-12 border-2 border-red-400/50 rounded-full animate-ping transform -translate-x-1/4 -translate-y-1/4"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 圖例 */}
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>台灣</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>颱風</span>
                  </div>
                </div>
                
                {/* 資料來源 */}
                <div className="absolute bottom-2 right-2 text-xs text-white/60">
                  OpenWeatherMap
                </div>
              </div>

              {/* 颱風詳細資訊 */}
              <div className="space-y-3">
                {typhoons.length === 0 ? (
                  <div className="text-center py-6">
                    <Eye className="w-8 h-8 md:w-12 md:h-12 text-green-400 mx-auto mb-3" />
                    <h4 className="text-base md:text-lg font-semibold text-white mb-2">目前無活躍颱風</h4>
                    <p className="text-white/70 text-sm">西太平洋地區暫無達到颱風強度的熱帶氣旋</p>
                    <div className="mt-4 text-xs text-white/50">
                      系統每30分鐘自動檢查一次
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h4 className="text-base md:text-lg font-semibold text-white">
                        發現 {typhoons.length} 個活躍熱帶氣旋
                      </h4>
                    </div>
                    {typhoons.map((typhoon) => (
                      <div
                        key={typhoon.id}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/10"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className={`px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(typhoon.status)}`}>
                              {getStatusText(typhoon.status)}
                            </div>
                            <h4 className="text-base md:text-lg font-bold text-white">颱風 {typhoon.name}</h4>
                          </div>
                          <div className={`text-xs md:text-sm font-medium ${getIntensityColor(typhoon.intensity)}`}>
                            {typhoon.intensity}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                          <div className="text-center">
                            <div className="text-xs text-white/70 mb-1">最大風速</div>
                            <div className="text-sm md:text-lg font-semibold text-white">{typhoon.windSpeed} km/h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-white/70 mb-1">中心氣壓</div>
                            <div className="text-sm md:text-lg font-semibold text-white">{typhoon.pressure} hPa</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-white/70 mb-1">緯度</div>
                            <div className="text-xs md:text-sm font-semibold text-white">{typhoon.lat.toFixed(1)}°N</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-white/70 mb-1">經度</div>
                            <div className="text-xs md:text-sm font-semibold text-white">{typhoon.lon.toFixed(1)}°E</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white/60 gap-1">
                            <span>距離台灣約 {Math.round(typhoonService.calculateDistanceToTaiwan(typhoon.lat, typhoon.lon))} 公里</span>
                            <span>{typhoonService.formatLastUpdate(typhoon.lastUpdate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
