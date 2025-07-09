import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherService';

interface CurrentWeatherProps {
  weather: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const getWeatherGradient = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return 'from-blue-400 to-blue-600';
      case 'clouds':
        return 'from-gray-400 to-gray-600';
      case 'rain':
      case 'drizzle':
        return 'from-blue-600 to-blue-800';
      case 'thunderstorm':
        return 'from-purple-600 to-purple-800';
      case 'snow':
        return 'from-blue-200 to-blue-400';
      case 'mist':
      case 'fog':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const gradient = getWeatherGradient(weather.weather[0].main);

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-4 md:p-6 text-white shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">{weather.name}</h2>
          <p className="text-sm md:text-base text-white/80 capitalize">{weather.weather[0].description}</p>
        </div>
        <img
          src={weatherService.getWeatherIconUrl(weather.weather[0].icon)}
          alt={weather.weather[0].description}
          className="w-12 h-12 md:w-16 md:h-16"
        />
      </div>

      <div className="mb-6">
        <div className="text-4xl md:text-5xl font-bold mb-2">
          {weatherService.formatTemperature(weather.main.temp)}
        </div>
        <div className="text-sm md:text-base text-white/80">
          體感溫度 {weatherService.formatTemperature(weather.main.feels_like)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm font-medium">溫度範圍</span>
          </div>
          <div className="text-base md:text-lg font-semibold">
            {weatherService.formatTemperature(weather.main.temp_min)} - {weatherService.formatTemperature(weather.main.temp_max)}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm font-medium">濕度</span>
          </div>
          <div className="text-base md:text-lg font-semibold">{weather.main.humidity}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm font-medium">風速</span>
          </div>
          <div className="text-base md:text-lg font-semibold">{weather.wind.speed} m/s</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm font-medium">能見度</span>
          </div>
          <div className="text-base md:text-lg font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm">日出 {weatherService.formatTime(weather.sys.sunrise)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm">日落 {weatherService.formatTime(weather.sys.sunset)}</span>
        </div>
      </div>
    </div>
  );
};