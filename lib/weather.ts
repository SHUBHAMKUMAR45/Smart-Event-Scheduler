import { WeatherData } from '@/types';

export class WeatherService {
  private static readonly API_KEY = process.env.OPENWEATHER_API_KEY;
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentWeather(location: string): Promise<WeatherData | null> {
    if (!this.API_KEY) {
      // Return mock data for development
      return {
        location,
        temperature: 22,
        condition: 'Partly Cloudy',
        icon: '02d',
        humidity: 65,
        windSpeed: 8,
        precipitation: 10,
      };
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  static async getForecast(location: string, days: number = 5): Promise<WeatherData[]> {
    if (!this.API_KEY) {
      // Return mock forecast data
      const mockData: WeatherData[] = [];
      for (let i = 0; i < days; i++) {
        mockData.push({
          location,
          temperature: 20 + Math.random() * 10,
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          icon: '01d',
          humidity: 60 + Math.random() * 20,
          windSpeed: 5 + Math.random() * 10,
          precipitation: Math.random() * 20,
        });
      }
      return mockData;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather forecast not available');
      }
      
      const data = await response.json();
      
      return data.list.slice(0, days * 8).map((item: any) => ({
        location: data.city.name,
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind?.speed || 0,
        precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
      }));
    } catch (error) {
      console.error('Weather forecast API error:', error);
      return [];
    }
  }

  static shouldRecommendIndoorAlternative(weather: WeatherData): boolean {
    return (
      weather.precipitation > 50 ||
      weather.temperature < 0 ||
      weather.temperature > 35 ||
      weather.windSpeed > 20
    );
  }

  static getWeatherRecommendation(weather: WeatherData): string {
    if (this.shouldRecommendIndoorAlternative(weather)) {
      return 'Weather conditions may not be ideal for outdoor events. Consider moving indoors or rescheduling.';
    }
    
    if (weather.temperature >= 25) {
      return 'Perfect weather for outdoor events! Consider providing shade and hydration.';
    }
    
    if (weather.precipitation > 20) {
      return 'Light precipitation expected. Consider backup indoor options.';
    }
    
    return 'Weather conditions are suitable for outdoor activities.';
  }
}