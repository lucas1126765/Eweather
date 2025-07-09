import React, { useState } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import { taiwanCities } from '../data/taiwanCities';
import { TaiwanCity } from '../types/weather';

interface CitySelectorProps {
  onCitySelect: (city: TaiwanCity) => void;
  selectedCity: TaiwanCity | null;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect, selectedCity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 按地區分類縣市
  const cityGroups = {
    '北部地區': [
      '基隆市', '台北市', '新北市', '桃園市', '新竹市', '新竹縣'
    ],
    '中部地區': [
      '苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣'
    ],
    '南部地區': [
      '嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣'
    ],
    '東部地區': [
      '宜蘭縣', '花蓮縣', '台東縣'
    ],
    '離島地區': [
      '澎湖縣', '金門縣', '連江縣'
    ]
  };

  const filteredCities = taiwanCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupedCities = () => {
    if (searchTerm) {
      return { '搜尋結果': filteredCities.map(city => city.name) };
    }
    return cityGroups;
  };

  const handleCitySelect = (cityName: string) => {
    const city = taiwanCities.find(c => c.name === cityName);
    if (city) {
      onCitySelect(city);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* 選擇按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-white/80" />
          <div className="text-left">
            <div className="text-base md:text-lg font-medium">
              {selectedCity ? selectedCity.name : '選擇縣市'}
            </div>
            {selectedCity && (
              <div className="text-sm text-white/70">{selectedCity.englishName}</div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl z-50 max-h-96 overflow-hidden">
            {/* 搜尋框 */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜尋縣市..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* 縣市列表 */}
            <div className="overflow-y-auto max-h-80">
              {Object.entries(getGroupedCities()).map(([region, cities]) => (
                <div key={region}>
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium sticky top-0">
                    {region}
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {cities.map((cityName) => {
                      const city = taiwanCities.find(c => c.name === cityName);
                      if (!city) return null;
                      
                      const isSelected = selectedCity?.name === cityName;
                      
                      return (
                        <button
                          key={cityName}
                          onClick={() => handleCitySelect(cityName)}
                          className={`p-2 text-left rounded-xl transition-colors duration-150 text-sm ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium">{city.name}</div>
                          <div className="text-xs text-gray-500">{city.englishName}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 快速選擇熱門城市 */}
            {!searchTerm && (
              <div className="border-t border-gray-200 p-3">
                <div className="text-sm text-gray-600 mb-2">熱門城市</div>
                <div className="flex flex-wrap gap-2">
                  {['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'].map((cityName) => {
                    const city = taiwanCities.find(c => c.name === cityName);
                    if (!city) return null;
                    
                    return (
                      <button
                        key={cityName}
                        onClick={() => handleCitySelect(cityName)}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs font-medium transition-colors duration-150"
                      >
                        {city.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};