import { Event, AISchedulingSuggestion } from '@/types';
import { addMinutes, isWithinInterval, startOfDay, endOfDay, format } from 'date-fns';

export class AIScheduler {
  static async findOptimalMeetingTime(
    participants: string[],
    duration: number,
    preferredDate: Date,
    timeRange?: { start: string; end: string }
  ): Promise<AISchedulingSuggestion[]> {
    // Mock AI implementation - in production, this would use ML models
    const suggestions: AISchedulingSuggestion[] = [];
    
    // Simulate analysis of participant availability
    const startHour = timeRange?.start ? parseInt(timeRange.start.split(':')[0]) : 9;
    const endHour = timeRange?.end ? parseInt(timeRange.end.split(':')[0]) : 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const suggestedTime = new Date(preferredDate);
      suggestedTime.setHours(hour, 0, 0, 0);
      
      const conflicts = await this.checkConflicts(participants, suggestedTime, duration);
      const confidence = this.calculateConfidence(hour, conflicts.length);
      
      if (confidence > 0.5) {
        suggestions.push({
          suggestedTime,
          confidence,
          reason: this.generateReason(hour, conflicts.length),
          alternatives: await this.generateAlternatives(suggestedTime, duration),
          conflicts,
        });
      }
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  static async checkConflicts(
    participants: string[],
    startTime: Date,
    duration: number
  ): Promise<Event[]> {
    // Mock conflict detection - in production, query actual events
    const conflicts: Event[] = [];
    
    // Simulate some conflicts for demo
    if (startTime.getHours() === 12) {
      conflicts.push({
        _id: 'lunch-conflict',
        title: 'Lunch Break',
        start: new Date(startTime.getTime()),
        end: addMinutes(startTime, 60),
      } as Event);
    }
    
    return conflicts;
  }

  static calculateConfidence(hour: number, conflictCount: number): number {
    let confidence = 1.0;
    
    // Reduce confidence for conflicts
    confidence -= conflictCount * 0.3;
    
    // Prefer certain hours
    if (hour >= 10 && hour <= 11) confidence += 0.2; // Morning preferred
    if (hour >= 14 && hour <= 15) confidence += 0.1; // Early afternoon
    if (hour === 12) confidence -= 0.4; // Lunch time
    if (hour < 9 || hour > 17) confidence -= 0.5; // Outside work hours
    
    return Math.max(0, Math.min(1, confidence));
  }

  static generateReason(hour: number, conflictCount: number): string {
    if (conflictCount > 0) {
      return `${conflictCount} potential conflict${conflictCount > 1 ? 's' : ''} detected`;
    }
    
    if (hour >= 10 && hour <= 11) {
      return 'Optimal morning slot - high productivity period';
    }
    
    if (hour >= 14 && hour <= 15) {
      return 'Good afternoon slot - post-lunch energy';
    }
    
    return 'Available time slot';
  }

  static async generateAlternatives(
    originalTime: Date,
    duration: number
  ): Promise<Date[]> {
    const alternatives: Date[] = [];
    
    // Generate alternatives at 30-minute intervals
    for (let i = 1; i <= 3; i++) {
      const alt1 = addMinutes(originalTime, i * 30);
      const alt2 = addMinutes(originalTime, -(i * 30));
      
      if (alt1.getHours() >= 9 && alt1.getHours() <= 17) {
        alternatives.push(alt1);
      }
      
      if (alt2.getHours() >= 9 && alt2.getHours() <= 17) {
        alternatives.push(alt2);
      }
    }
    
    return alternatives;
  }

  static async analyzeSchedulingPatterns(userId: string): Promise<{
    busyHours: number[];
    preferredDays: number[];
    averageMeetingDuration: number;
    productivityInsights: string[];
  }> {
    // Mock analytics - in production, analyze real user data
    return {
      busyHours: [9, 10, 14, 15],
      preferredDays: [1, 2, 3, 4], // Monday to Thursday
      averageMeetingDuration: 45,
      productivityInsights: [
        'You schedule most meetings between 9-11 AM',
        'Tuesday is your most productive day',
        'You prefer 45-minute meetings over 60-minute ones',
        'Back-to-back meetings reduce your availability by 15%'
      ],
    };
  }
}