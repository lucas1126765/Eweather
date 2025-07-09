import React from 'react';
import { AlertTriangle, Zap, CloudRain, Snowflake } from 'lucide-react';

interface WeatherAlert {
  id: string;
  type: 'typhoon' | 'thunderstorm' | 'heavy_rain' | 'snow';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  area: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'typhoon':
        return <AlertTriangle className="w-5 h-5" />;
      case 'thunderstorm':
        return <Zap className="w-5 h-5" />;
      case 'heavy_rain':
        return <CloudRain className="w-5 h-5" />;
      case 'snow':
        return <Snowflake className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'medium':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'low':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return '嚴重';
      case 'medium':
        return '中等';
      case 'low':
        return '輕微';
      default:
        return '未知';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
        氣象警報
      </h3>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-2xl p-3 md:p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 md:mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm md:text-base">{alert.title}</h4>
                  <span className="text-xs px-2 py-0.5 md:py-1 bg-white/20 rounded-full">
                    {getSeverityText(alert.severity)}
                  </span>
                </div>
                <p className="text-sm md:text-base opacity-90 mb-2">{alert.description}</p>
                <div className="text-xs opacity-70">影響區域: {alert.area}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};