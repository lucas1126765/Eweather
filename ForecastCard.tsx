import React from 'react';
import { ForecastData } from '../types/weather';
import { weatherService } from '../services/weatherService';

interface ForecastCardProps {
  forecast: ForecastData;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  // Group forecast by days and take the first entry for each day
  const dailyForecasts = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {} as Record<string, typeof forecast.list[0]>);

  const forecastDays = Object.values(dailyForecasts).slice(0, 5);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">五日預報</h3>
      
      <div className="space-y-3">
        {forecastDays.map((day, index) => (
          <div
            key={day.dt}
            className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 hover:bg-white/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={weatherService.getWeatherIconUrl(day.weather[0].icon)}
                alt={day.weather[0].description}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div>
                <div className="text-sm md:text-base font-medium text-white">
                  {index === 0 ? '今天' : weatherService.formatDate(day.dt)}
                </div>
                <div className="text-sm text-white/70 capitalize">
                  {day.weather[0].description}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-white text-base md:text-lg">
                {weatherService.formatTemperature(day.main.temp)}
              </div>
              <div className="text-sm text-white/70">
                {weatherService.formatTemperature(day.main.temp_min)} - {weatherService.formatTemperature(day.main.temp_max)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};