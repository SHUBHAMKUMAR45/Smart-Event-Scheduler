import { z } from 'zod';

export const eventValidation = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean().default(false),
  location: z.string().max(200, 'Location too long').optional(),
  category: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#3B82F6'),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string().min(1),
    isOptional: z.boolean().default(false),
  })).default([]),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
    interval: z.number().min(1).max(99),
    endType: z.enum(['never', 'date', 'count']),
    endDate: z.date().optional(),
    endCount: z.number().min(1).max(999).optional(),
    byWeekDay: z.array(z.number().min(0).max(6)).optional(),
    byMonthDay: z.array(z.number().min(1).max(31)).optional(),
    byMonth: z.array(z.number().min(1).max(12)).optional(),
    exceptions: z.array(z.date()).optional(),
  }).optional(),
  reminders: z.array(z.object({
    type: z.enum(['email', 'push', 'popup']),
    minutesBefore: z.number().min(0).max(10080), // Max 1 week
  })).default([]),
  isPrivate: z.boolean().default(false),
  weatherDependent: z.boolean().default(false),
  travelTime: z.number().min(0).max(1440).default(0), // Max 24 hours
}).refine((data) => data.end > data.start, {
  message: 'End time must be after start time',
  path: ['end'],
});

export const userPreferencesValidation = z.object({
  timezone: z.string(),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    days: z.array(z.number().min(0).max(6)).min(1, 'At least one working day required'),
  }),
  defaultEventDuration: z.number().min(15).max(480), // 15 minutes to 8 hours
  reminderDefaults: z.array(z.number().min(0).max(10080)), // Max 1 week
});

export const calendarShareValidation = z.object({
  calendarId: z.string(),
  sharedWith: z.string().email(),
  permissions: z.enum(['read', 'write', 'admin']),
});

export type EventFormData = z.infer<typeof eventValidation>;
export type UserPreferencesData = z.infer<typeof userPreferencesValidation>;
export type CalendarShareData = z.infer<typeof calendarShareValidation>;