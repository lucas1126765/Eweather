import { WeatherData } from '../types/weather';

const API_KEY = 'dded9dd7373550679a609ac4b9e39b7a';
const WEATHER_MAP_BASE_URL = 'http://maps.openweathermap.org/maps/2.0/weather';

export interface TyphoonData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  intensity: string;
  windSpeed: number;
  pressure: number;
  status: 'active' | 'warning' | 'watch';
  lastUpdate: Date;
}

export const typhoonService = {
  // 獲取颱風圖層資料
  async getTyphoonMapUrl(zoom: number = 6, x: number = 54, y: number = 25): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    return `${WEATHER_MAP_BASE_URL}/TA2/${zoom}/${x}/${y}?date=${timestamp}&opacity=0.9&fill_bound=true&appid=${API_KEY}`;
  },

  // 檢查西太平洋區域的強風系統
  async checkForTyphoons(): Promise<TyphoonData[]> {
    const typhoons: TyphoonData[] = [];
    
    // 定義西太平洋颱風常見區域的檢查點
    const checkPoints = [
      { lat: 15, lon: 140, name: '菲律賓東方海面' },
      { lat: 20, lon: 135, name: '關島附近' },
      { lat: 25, lon: 130, name: '沖繩南方' },
      { lat: 18, lon: 125, name: '呂宋島東方' },
      { lat: 22, lon: 120, name: '台灣東方海面' },
    ];

    try {
      // 並行檢查多個區域的天氣狀況
      const weatherPromises = checkPoints.map(point =>
        this.getWeatherAtLocation(point.lat, point.lon)
      );

      const weatherResults = await Promise.allSettled(weatherPromises);

      weatherResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const weather = result.value;
          const point = checkPoints[index];
          
          // 檢查是否為颱風條件：風速 > 17.2 m/s (約62 km/h) 且氣壓較低
          if (weather.wind.speed > 17.2 && weather.main.pressure < 1000) {
            const typhoon: TyphoonData = {
              id: `typhoon_${weather.id}_${Date.now()}`,
              name: this.generateTyphoonName(weather.coord.lat, weather.coord.lon),
              lat: weather.coord.lat,
              lon: weather.coord.lon,
              intensity: this.classifyIntensity(weather.wind.speed),
              windSpeed: Math.round(weather.wind.speed * 3.6), // 轉換為 km/h
              pressure: weather.main.pressure,
              status: this.determineStatus(weather.wind.speed, weather.coord.lat, weather.coord.lon),
              lastUpdate: new Date()
            };
            typhoons.push(typhoon);
          }
        }
      });

      return typhoons;
    } catch (error) {
      console.error('Error checking for typhoons:', error);
      return [];
    }
  },

  // 獲取特定位置的天氣資料
  async getWeatherAtLocation(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${lat}, ${lon}`);
    }
    
    return response.json();
  },

  // 根據風速分類颱風強度
  classifyIntensity(windSpeedMs: number): string {
    const windSpeedKmh = windSpeedMs * 3.6;
    
    if (windSpeedKmh >= 220) return '超強颱風';
    if (windSpeedKmh >= 185) return '強烈颱風';
    if (windSpeedKmh >= 150) return '中度颱風';
    if (windSpeedKmh >= 118) return '輕度颱風';
    if (windSpeedKmh >= 62) return '熱帶風暴';
    return '熱帶低壓';
  },

  // 根據位置和強度決定警報狀態
  determineStatus(windSpeedMs: number, lat: number, lon: number): 'active' | 'warning' | 'watch' {
    const windSpeedKmh = windSpeedMs * 3.6;
    const distanceToTaiwan = this.calculateDistanceToTaiwan(lat, lon);
    
    // 距離台灣500公里內且風速超過118 km/h
    if (distanceToTaiwan < 500 && windSpeedKmh >= 118) {
      return 'warning';
    }
    
    // 距離台灣800公里內且風速超過62 km/h
    if (distanceToTaiwan < 800 && windSpeedKmh >= 62) {
      return 'watch';
    }
    
    return 'active';
  },

  // 計算到台灣的距離（簡化計算）
  calculateDistanceToTaiwan(lat: number, lon: number): number {
    const taiwanLat = 23.8;
    const taiwanLon = 121.0;
    
    const R = 6371; // 地球半徑（公里）
    const dLat = (lat - taiwanLat) * Math.PI / 180;
    const dLon = (lon - taiwanLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(taiwanLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // 生成颱風名稱（簡化版）
  generateTyphoonName(lat: number, lon: number): string {
    const names = [
      '瑪娃', '古超', '泰利', '杜蘇芮', '卡努', '蘭恩', '蘇拉', '海葵', '小犬', '布拉萬',
      '珊瑚', '瑪瑙', '托卡基', '哈格比', '巴威', '美莎克', '海神', '紅霞', '白海豚', '鯨魚'
    ];
    
    // 根據經緯度生成一個相對穩定的索引
    const index = Math.floor((lat + lon) * 10) % names.length;
    return names[index];
  },

  // 格式化最後更新時間
  formatLastUpdate(date: Date): string {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '剛剛更新';
    if (diffMinutes < 60) return `${diffMinutes}分鐘前更新`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}小時前更新`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}天前更新`;
  }
};