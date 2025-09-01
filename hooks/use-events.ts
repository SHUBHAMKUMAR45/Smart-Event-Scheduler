'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import { toast } from 'sonner';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (start?: Date, end?: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/events';
      if (start && end) {
        const params = new URLSearchParams({
          start: start.toISOString(),
          end: end.toISOString(),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Partial<Event>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }

      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (event: Event) => {
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event');
      }

      const updatedEvent = await response.json();
      setEvents(prev => 
        prev.map(e => e._id === updatedEvent._id ? updatedEvent : e)
      );
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update event');
      throw error;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete event');
      }

      setEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete event');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}