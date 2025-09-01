'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Car, Bike, Train, Footprints, AlertCircle } from 'lucide-react';
import { TravelTimeService } from '@/lib/travel-time';

interface TravelTimeCalculatorProps {
  fromLocation?: string;
  toLocation?: string;
  eventStart?: Date;
  onTravelTimeCalculated?: (travelTime: number, departureTime: Date) => void;
}

const transportModes = [
  { value: 'driving', label: 'Driving', icon: Car },
  { value: 'walking', label: 'Walking', icon: Footprints },
  { value: 'transit', label: 'Public Transit', icon: Train },
  { value: 'bicycling', label: 'Bicycling', icon: Bike },
];

export function TravelTimeCalculator({
  fromLocation = '',
  toLocation = '',
  eventStart,
  onTravelTimeCalculated,
}: TravelTimeCalculatorProps) {
  const [origin, setOrigin] = useState(fromLocation);
  const [destination, setDestination] = useState(toLocation);
  const [mode, setMode] = useState<'driving' | 'walking' | 'transit' | 'bicycling'>('driving');
  const [travelTime, setTravelTime] = useState<number | null>(null);
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTravelTime = async () => {
    if (!origin || !destination) {
      return;
    }

    setLoading(true);
    try {
      const time = await TravelTimeService.calculateTravelTime(origin, destination, mode);
      setTravelTime(time);

      if (eventStart) {
        const departure = await TravelTimeService.suggestDepartureTime(
          eventStart,
          origin,
          destination,
          mode
        );
        setDepartureTime(departure);
        onTravelTimeCalculated?.(time, departure);
      }
    } catch (error) {
      console.error('Failed to calculate travel time:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (origin && destination && origin !== destination) {
      calculateTravelTime();
    }
  }, [origin, destination, mode]);

  const formatTravelTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Travel Time Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="origin">From</Label>
            <Input
              id="origin"
              placeholder="Starting location..."
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="destination">To</Label>
            <Input
              id="destination"
              placeholder="Event location..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Transportation Mode</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {transportModes.map((transport) => (
              <Button
                key={transport.value}
                variant={mode === transport.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode(transport.value as any)}
                className="flex items-center gap-1"
              >
                <transport.icon className="w-3 h-3" />
                {transport.label}
              </Button>
            ))}
          </div>
        </div>

        {(origin && destination && origin !== destination) && (
          <div className="pt-4 border-t">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 animate-spin" />
                Calculating travel time...
              </div>
            ) : travelTime !== null ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Travel Time:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTravelTime(travelTime)}
                  </Badge>
                </div>

                {departureTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Suggested Departure:</span>
                    <Badge variant="outline">
                      {departureTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Travel time includes a {TravelTimeService.calculateBufferTime(travelTime)}-minute 
                    buffer for unexpected delays.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Unable to calculate travel time for this route
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}