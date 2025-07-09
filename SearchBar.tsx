import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { taiwanCities } from '../data/taiwanCities';
import { TaiwanCity } from '../types/weather';

interface SearchBarProps {
  onCitySelect: (city: TaiwanCity) => void;
  selectedCity: TaiwanCity | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect, selectedCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<TaiwanCity[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = taiwanCities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.englishName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: TaiwanCity) => {
    onCitySelect(city);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="搜尋台灣縣市..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 md:py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-base md:text-lg"
        />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl z-50 max-h-64 md:max-h-80 overflow-y-auto">
          {filteredCities.map((city) => (
            <button
              key={city.englishName}
              onClick={() => handleCitySelect(city)}
              className="w-full px-4 py-3 md:py-4 text-left hover:bg-white/20 transition-colors duration-150 flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-800 text-base md:text-lg">{city.name}</div>
                <div className="text-sm md:text-base text-gray-600">{city.englishName}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedCity && (
        <div className="mt-3 flex items-center justify-center gap-2 text-white/80">
          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base font-medium">{selectedCity.name}</span>
        </div>
      )}
    </div>
  );
};