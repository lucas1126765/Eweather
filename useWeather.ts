import { useState, useEffect } from 'react';
import { WeatherData, ForecastData, TaiwanCity } from '../types/weather';
import { weatherService } from '../services/weatherService';

export const useWeather = (city: TaiwanCity | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (selectedCity: TaiwanCity) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(selectedCity.lat, selectedCity.lon),
        weatherService.getForecast(selectedCity.lat, selectedCity.lon)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('無法取得天氣資料，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]);

  const refetch = () => {
    if (city) {
      fetchWeatherData(city);
    }
  };

  return {
    weather,
    forecast,
    loading,
    error,
    refetch
  };
};