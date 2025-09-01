import { format, addDays, addWeeks, addMonths, addYears, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { RecurrencePattern } from '@/types';

export class DateHelpers {
  static formatEventTime(start: Date, end: Date, allDay: boolean): string {
    if (allDay) {
      if (isSameDay(start, end)) {
        return format(start, 'MMM d, yyyy');
      }
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }

    if (isSameDay(start, end)) {
      return `${format(start, 'MMM d, yyyy')} • ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    }

    return `${format(start, 'MMM d, HH:mm')} - ${format(end, 'MMM d, HH:mm, yyyy')}`;
  }

  static generateRecurringDates(
    startDate: Date,
    pattern: RecurrencePattern,
    maxOccurrences: number = 100
  ): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    let count = 0;

    while (count < maxOccurrences) {
      // Check if we've reached the end criteria
      if (pattern.endType === 'date' && pattern.endDate && currentDate > pattern.endDate) {
        break;
      }
      if (pattern.endType === 'count' && pattern.endCount && count >= pattern.endCount) {
        break;
      }

      // Check if the current date should be excluded
      const isException = pattern.exceptions?.some(exception => 
        isSameDay(currentDate, exception)
      );

      if (!isException) {
        // Apply day/month filters for weekly/monthly patterns
        let includeDate = true;

        if (pattern.frequency === 'weekly' && pattern.byWeekDay) {
          includeDate = pattern.byWeekDay.includes(currentDate.getDay());
        }

        if (pattern.frequency === 'monthly' && pattern.byMonthDay) {
          includeDate = pattern.byMonthDay.includes(currentDate.getDate());
        }

        if (pattern.frequency === 'yearly' && pattern.byMonth) {
          includeDate = pattern.byMonth.includes(currentDate.getMonth() + 1);
        }

        if (includeDate) {
          dates.push(new Date(currentDate));
        }
      }

      // Move to next occurrence
      switch (pattern.frequency) {
        case 'daily':
          currentDate = addDays(currentDate, pattern.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, pattern.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, pattern.interval);
          break;
        case 'yearly':
          currentDate = addYears(currentDate, pattern.interval);
          break;
        default:
          // Custom pattern - default to daily for now
          currentDate = addDays(currentDate, pattern.interval);
      }

      count++;
    }

    return dates;
  }

  static getTimeZoneOffset(timezone: string): number {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
      return (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);
    } catch (error) {
      console.error('Error getting timezone offset:', error);
      return 0;
    }
  }

  static convertToTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
    try {
      // Create a date string in the source timezone
      const dateString = date.toLocaleString('en-US', { timeZone: fromTimezone });
      const sourceDate = new Date(dateString);
      
      // Convert to target timezone
      const targetString = sourceDate.toLocaleString('en-US', { timeZone: toTimezone });
      return new Date(targetString);
    } catch (error) {
      console.error('Error converting timezone:', error);
      return date;
    }
  }

  static isWorkingHour(
    date: Date,
    workingHours: { start: string; end: string; days: number[] }
  ): boolean {
    const dayOfWeek = date.getDay();
    if (!workingHours.days.includes(dayOfWeek)) {
      return false;
    }

    const time = format(date, 'HH:mm');
    return time >= workingHours.start && time <= workingHours.end;
  }

  static findAvailableSlots(
    date: Date,
    duration: number,
    existingEvents: { start: Date | string; end: Date | string }[],
    workingHours: { start: string; end: string; days: number[] }
  ): Date[] {
    const slots: Date[] = [];
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // If not a working day, return empty
    if (!workingHours.days.includes(date.getDay())) {
      return slots;
    }

    // Create time slots throughout the working day
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);

    let currentSlot = new Date(dayStart);
    currentSlot.setHours(startHour, startMinute, 0, 0);

    const workingDayEnd = new Date(dayStart);
    workingDayEnd.setHours(endHour, endMinute, 0, 0);

    while (currentSlot < workingDayEnd) {
      const slotEnd = new Date(currentSlot.getTime() + duration * 60 * 1000);
      
      if (slotEnd <= workingDayEnd) {
        // Check for conflicts with existing events
        const hasConflict = existingEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          
          return (
            (currentSlot >= eventStart && currentSlot < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (currentSlot <= eventStart && slotEnd >= eventEnd)
          );
        });

        if (!hasConflict) {
          slots.push(new Date(currentSlot));
        }
      }

      // Move to next 15-minute slot
      currentSlot = new Date(currentSlot.getTime() + 15 * 60 * 1000);
    }

    return slots;
  }

  static calculateEventDuration(start: Date, end: Date): string {
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }

  static getRelativeTimeString(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffMinutes) < 60) {
      if (diffMinutes === 0) return 'now';
      return diffMinutes > 0 ? `in ${diffMinutes}m` : `${Math.abs(diffMinutes)}m ago`;
    }

    if (Math.abs(diffHours) < 24) {
      return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
    }

    if (Math.abs(diffDays) < 7) {
      return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
    }

    return format(date, 'MMM d, yyyy');
  }
}