export class TravelTimeService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  static async calculateTravelTime(
    origin: string,
    destination: string,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): Promise<number> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      // Return mock travel time based on simple heuristics
      return this.getMockTravelTime(origin, destination, mode);
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(origin)}&` +
        `destinations=${encodeURIComponent(destination)}&` +
        `mode=${mode}&` +
        `key=${this.GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      
      if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
        return Math.ceil(data.rows[0].elements[0].duration.value / 60); // Convert to minutes
      }
      
      return this.getMockTravelTime(origin, destination, mode);
    } catch (error) {
      console.error('Travel time API error:', error);
      return this.getMockTravelTime(origin, destination, mode);
    }
  }

  private static getMockTravelTime(
    origin: string,
    destination: string,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling'
  ): number {
    // Simple heuristic based on mode
    const baseTime = origin.toLowerCase() === destination.toLowerCase() ? 0 : 15;
    
    switch (mode) {
      case 'walking':
        return baseTime * 3;
      case 'bicycling':
        return baseTime * 2;
      case 'transit':
        return baseTime * 2.5;
      case 'driving':
      default:
        return baseTime;
    }
  }

  static calculateBufferTime(travelTime: number): number {
    // Add 20% buffer, minimum 5 minutes, maximum 30 minutes
    return Math.min(30, Math.max(5, Math.ceil(travelTime * 0.2)));
  }

  static async suggestDepartureTime(
    eventStart: Date,
    origin: string,
    destination: string,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): Promise<Date> {
    const travelTime = await this.calculateTravelTime(origin, destination, mode);
    const bufferTime = this.calculateBufferTime(travelTime);
    const totalTime = travelTime + bufferTime;
    
    const departureTime = new Date(eventStart.getTime() - (totalTime * 60 * 1000));
    return departureTime;
  }
}