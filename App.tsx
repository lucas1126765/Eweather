import React, { useState, useEffect } from 'react';
import { Cloud, Github, Heart, Share2, Code } from 'lucide-react';
import { CitySelector } from './components/CitySelector';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastCard } from './components/ForecastCard';
import { WeatherBackground } from './components/WeatherBackground';
import { TaiwanMap } from './components/TaiwanMap';
import { WeatherAlerts } from './components/WeatherAlerts';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ShareButton } from './components/ShareButton';
import { WeatherWidget } from './components/WeatherWidget';
import { useWeather } from './hooks/useWeather';
import { TaiwanCity } from './types/weather';
import { taiwanCities } from './data/taiwanCities';

function App() {
  const [selectedCity, setSelectedCity] = useState<TaiwanCity | null>(null);
  const { weather, forecast, loading, error, refetch } = useWeather(selectedCity);
  
  // 模擬氣象警報資料
  const mockAlerts = [
    {
      id: '1',
      type: 'heavy_rain' as const,
      title: '大雨特報',
      description: '受鋒面影響，今日下午至明日上午有局部大雨發生的機率',
      severity: 'medium' as const,
      area: '北部、東北部地區'
    }
  ];

  useEffect(() => {
    // Default to Taipei
    setSelectedCity(taiwanCities.find(city => city.englishName === 'Taipei') || taiwanCities[0]);
  }, []);

  const handleCitySelect = (city: TaiwanCity) => {
    setSelectedCity(city);
  };
  
  const isDay = weather ? 
    (Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset) : 
    true;

  return (
    <div className="min-h-screen relative">
      {weather && (
        <WeatherBackground 
          weatherMain={weather.weather[0].main} 
          isDay={isDay}
        />
      )}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">EG Weather</h1>
            </div>
            <p className="text-white/80 text-lg">台灣即時天氣預報與颱風監測</p>
          </header>

          {/* Search Bar */}
          <div className="mb-8">
            <CitySelector onCitySelect={handleCitySelect} selectedCity={selectedCity} />
          </div>

          {/* Weather Content */}
          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage message={error} onRetry={refetch} />
          )}

          {!loading && !error && weather && forecast && (
            <>
              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mb-6">
                <ShareButton weather={weather} />
                <WeatherWidget weather={weather} />
              </div>
              
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="space-y-6">
                <CurrentWeather weather={weather} />
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <ForecastCard forecast={forecast} />
                
                {/* 颱風監測 */}
                <TaiwanMap />
                
                {/* 氣象警報 */}
                <WeatherAlerts alerts={mockAlerts} />
                
                {/* Additional Info Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4">氣象資訊</h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                      <div className="text-sm text-white/70 mb-1">氣壓</div>
                      <div className="text-base md:text-lg font-semibold text-white">
                        {weather.main.pressure} hPa
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                      <div className="text-sm text-white/70 mb-1">雲量</div>
                      <div className="text-base md:text-lg font-semibold text-white">
                        {weather.clouds.all}%
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                      <div className="text-sm text-white/70 mb-1">紫外線指數</div>
                      <div className="text-base md:text-lg font-semibold text-white">
                        {Math.floor(Math.random() * 11) + 1}
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                      <div className="text-sm text-white/70 mb-1">空氣品質</div>
                      <div className="text-base md:text-lg font-semibold text-white">
                        良好
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}

          {/* Footer */}
          <footer className="mt-12 md:mt-16 text-center text-white/60">
            {/* Creator Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 mb-6 shadow-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-bold text-white">EG Weather</h3>
                    <p className="text-sm md:text-base text-white/80">by CodeZone 團隊</p>
                  </div>
                </div>
                <div className="w-full h-px bg-white/20 my-2"></div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="text-white font-medium">胡家綸 Lucas</span>
                  </div>
                  <span className="hidden sm:inline text-white/40">•</span>
                  <span className="text-white/70">首席開發工程師</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>即時更新</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>精準預報</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>颱風監測</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm md:text-base">EG Weather - 資料來源：OpenWeatherMap</span>
              <span>•</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white/80 transition-colors text-sm md:text-base"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs md:text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>by EG Weather</span>
              <span className="mx-2 text-white/40">by</span>
              <span className="font-medium text-white/80">CodeZone</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;