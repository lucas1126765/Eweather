import React from 'react';

interface WeatherBackgroundProps {
  weatherMain: string;
  isDay: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherMain, isDay }) => {
  const getBackgroundClass = () => {
    const weather = weatherMain.toLowerCase();
    
    if (weather === 'clear') {
      return isDay 
        ? 'from-blue-400 via-blue-500 to-blue-600' 
        : 'from-indigo-900 via-purple-900 to-blue-900';
    }
    
    if (weather === 'clouds') {
      return isDay 
        ? 'from-gray-400 via-gray-500 to-gray-600' 
        : 'from-gray-700 via-gray-800 to-gray-900';
    }
    
    if (weather === 'rain' || weather === 'drizzle') {
      return isDay 
        ? 'from-blue-600 via-blue-700 to-blue-800' 
        : 'from-blue-900 via-indigo-900 to-purple-900';
    }
    
    if (weather === 'thunderstorm') {
      return 'from-purple-800 via-purple-900 to-gray-900';
    }
    
    if (weather === 'snow') {
      return isDay 
        ? 'from-blue-200 via-blue-300 to-blue-400' 
        : 'from-blue-800 via-blue-900 to-indigo-900';
    }
    
    if (weather === 'mist' || weather === 'fog') {
      return isDay 
        ? 'from-gray-300 via-gray-400 to-gray-500' 
        : 'from-gray-600 via-gray-700 to-gray-800';
    }
    
    // Default
    return isDay 
      ? 'from-blue-400 via-blue-500 to-blue-600' 
      : 'from-indigo-900 via-purple-900 to-blue-900';
  };

  const getWeatherAnimation = () => {
    const weather = weatherMain.toLowerCase();
    
    if (weather === 'rain' || weather === 'drizzle') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-white/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
                transform: `translateY(-100vh)`,
                animation: `rain ${1 + Math.random()}s linear infinite`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes rain {
              to {
                transform: translateY(100vh);
              }
            }
          `}</style>
        </div>
      );
    }
    
    if (weather === 'snow') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animation: `snow ${3 + Math.random() * 2}s linear infinite`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes snow {
              to {
                transform: translateY(100vh) rotate(360deg);
              }
            }
          `}</style>
        </div>
      );
    }
    
    if (weather === 'thunderstorm') {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white/10 animate-pulse" 
               style={{ animationDuration: '0.1s', animationIterationCount: 'infinite' }} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000`}>
      {getWeatherAnimation()}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
    </div>
  );
};