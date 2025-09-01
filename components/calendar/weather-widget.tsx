'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { WeatherData } from '@/types';

interface WeatherWidgetProps {
  location: string;
}

export function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        if (response.ok) {
          const data = await response.json();
          setWeather(data.weather);
          setRecommendation(data.recommendation);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Weather Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const isWarning = recommendation.toLowerCase().includes('not ideal') || 
                   recommendation.toLowerCase().includes('consider moving');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          Weather for {weather.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold flex items-center gap-1">
              <Thermometer className="w-5 h-5" />
              {weather.temperature}°C
            </div>
            <div className="capitalize text-gray-600 dark:text-gray-400">
              {weather.condition}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4 text-gray-500" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1">
            <Cloud className="w-4 h-4 text-gray-500" />
            <span>{weather.precipitation}%</span>
          </div>
        </div>

        {recommendation && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
            <p className="text-sm">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}