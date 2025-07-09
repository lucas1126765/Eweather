import { WeatherData, ForecastData } from '../types/weather';

const API_KEY = 'dded9dd7373550679a609ac4b9e39b7a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=zh_tw`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return response.json();
  },

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=zh_tw`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    return response.json();
  },

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },

  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  },

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    });
  }
};