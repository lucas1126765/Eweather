import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherService';

export const WidgetPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const lat = parseFloat(params.get('lat') || '25.0330');
        const lon = parseFloat(params.get('lon') || '121.5654');
        const theme = params.get('theme') || 'auto';

        const weatherData = await weatherService.getCurrentWeather(lat, lon);
        setWeather(weatherData);

        // Apply widget styles to body
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        // Apply theme
        if (theme === 'dark') {
          document.body.style.backgroundColor = '#1f2937';
          document.body.style.color = '#ffffff';
        } else if (theme === 'light') {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.color = '#1f2937';
        } else {
          document.body.style.background = 'linear-gradient(135deg, #3b82f6, #1e40af)';
          document.body.style.color = '#ffffff';
        }

      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('無法載入天氣資料');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-screen text-center p-4">
        <div>
          <p className="text-sm opacity-80 mb-2">載入失敗</p>
          <p className="text-xs opacity-60">請檢查網路連線</p>
        </div>
      </div>
    );
  }

  const params = new URLSearchParams(window.location.search);
  const showDetails = params.get('details') === 'true';
  const borderRadius = parseInt(params.get('radius') || '16');

  return (
    <div 
      className="h-screen p-2"
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div className="h-full bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 flex flex-col border border-white/20">
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

        {showDetails && (
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>濕度: {weather.main.humidity}%</div>
            <div>風速: {weather.wind.speed} m/s</div>
            <div>氣壓: {weather.main.pressure} hPa</div>
            <div>能見度: {(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
        )}

        <div className="mt-auto pt-2 text-xs opacity-60 text-center border-t border-current/20">
          <a 
            href={window.location.origin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Powered by EG Weather
          </a>
        </div>
      </div>
    </div>
  );
};
