export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'user';
  preferences: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
      days: number[];
    };
    defaultEventDuration: number;
    reminderDefaults: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  category: EventCategory;
  color?: string;
  createdBy: string;
  attendees: Attendee[];
  recurrence?: RecurrencePattern;
  reminders: Reminder[];
  isPrivate: boolean;
  weatherDependent: boolean;
  travelTime?: number;
  videoMeetingLink?: string;
  notes: Note[];
  status: 'tentative' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCategory {
  _id: string;
  name: string;
  color: string;
  description?: string;
  icon?: string;
  createdBy: string;
}

export interface Attendee {
  userId?: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  isOptional: boolean;
  responseAt?: Date;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  endType: 'never' | 'date' | 'count';
  endDate?: Date;
  endCount?: number;
  byWeekDay?: number[];
  byMonthDay?: number[];
  byMonth?: number[];
  exceptions?: Date[];
}

export interface Reminder {
  type: 'email' | 'push' | 'popup';
  minutesBefore: number;
  sent?: boolean;
}

export interface Note {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarShare {
  _id: string;
  calendarId: string;
  sharedWith: string;
  permissions: 'read' | 'write' | 'admin';
  createdAt: Date;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface AISchedulingSuggestion {
  suggestedTime: Date;
  confidence: number;
  reason: string;
  alternatives: Date[];
  conflicts: Event[];
}
