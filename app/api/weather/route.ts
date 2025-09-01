import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WeatherService } from '@/lib/weather';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const type = searchParams.get('type') || 'current';

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    if (type === 'forecast') {
      const days = parseInt(searchParams.get('days') || '5');
      const forecast = await WeatherService.getForecast(location, days);
      return NextResponse.json({ forecast });
    } else {
      const weather = await WeatherService.getCurrentWeather(location);
      if (!weather) {
        return NextResponse.json(
          { error: 'Weather data not available' },
          { status: 404 }
        );
      }

      const recommendation = WeatherService.getWeatherRecommendation(weather);
      return NextResponse.json({ weather, recommendation });
    }
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
</action>