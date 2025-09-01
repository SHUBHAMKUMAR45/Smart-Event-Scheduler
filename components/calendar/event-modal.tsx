'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Cloud, Video, Trash2 } from 'lucide-react';
import { Event } from '@/types';
import { WeatherWidget } from './weather-widget';
import { AISchedulingAssistant } from './ai-scheduling-assistant';
import { RecurringEventForm } from './recurring-event-form';
import { EventInvitationForm } from './event-invitation-form';
import { TravelTimeCalculator } from './travel-time-calculator';
import { EventRemindersForm } from './event-reminders-form';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  color: z.string().default('#3B82F6'),
  isPrivate: z.boolean().default(false),
  weatherDependent: z.boolean().default(false),
  recurrence: z.any().optional(),
  reminders: z.array(z.any()).default([]),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    isOptional: z.boolean().default(false),
  })).default([]),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventModalProps {
  event?: Event | null;
  initialDate?: { start: Date; end: Date; allDay: boolean } | null;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  onDelete?: () => void;
}

export function EventModal({ event, initialDate, onClose, onSave, onDelete }: EventModalProps) {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      start: event?.start 
        ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")
        : initialDate?.start 
        ? format(initialDate.start, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: event?.end 
        ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")
        : initialDate?.end 
        ? format(initialDate.end, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      allDay: event?.allDay || initialDate?.allDay || false,
      location: event?.location || '',
      color: event?.color || '#3B82F6',
      isPrivate: event?.isPrivate || false,
      weatherDependent: event?.weatherDependent || false,
      recurrence: event?.recurrence,
      reminders: event?.reminders || [],
      attendees: event?.attendees || [],
    },
  });

  const { watch, setValue, getValues } = form;
  const watchLocation = watch('location');
  const watchWeatherDependent = watch('weatherDependent');
  const watchAttendees = watch('attendees');
  const watchRecurrence = watch('recurrence');
  const watchReminders = watch('reminders');

  const onSubmit = (data: EventFormData) => {
    onSave({
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
    });
  };

  const generateMeetingLink = () => {
    // Mock video meeting link generation
    const meetingId = Math.random().toString(36).substr(2, 9);
    const link = `https://meet.example.com/room/${meetingId}`;
    toast.success('Meeting link generated!');
    // In a real implementation, this would integrate with Zoom/Teams/Google Meet APIs
    return link;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {event ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {[
            { id: 'details', label: 'Event Details' },
            { id: 'attendees', label: 'Attendees' },
            { id: 'recurring', label: 'Recurring' },
            { id: 'reminders', label: 'Reminders' },
            { id: 'travel', label: 'Travel' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                {...form.register('title')}
                placeholder="Enter event title..."
                className="mt-1"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                {...form.register('start')}
                type="datetime-local"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                {...form.register('end')}
                type="datetime-local"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...form.register('description')}
                placeholder="Add event description..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                {...form.register('location')}
                placeholder="Add location..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="color">Event Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  {...form.register('color')}
                  type="color"
                  className="w-16 h-10"
                />
                <Select
                  value={watch('color')}
                  onValueChange={(value) => setValue('color', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#3B82F6">Blue</SelectItem>
                    <SelectItem value="#10B981">Green</SelectItem>
                    <SelectItem value="#F59E0B">Amber</SelectItem>
                    <SelectItem value="#EF4444">Red</SelectItem>
                    <SelectItem value="#8B5CF6">Purple</SelectItem>
                    <SelectItem value="#06B6D4">Cyan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

              {/* Options */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch {...form.register('allDay')} />
              <Label>All Day Event</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...form.register('isPrivate')} />
              <Label>Private Event</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...form.register('weatherDependent')} />
              <Label className="flex items-center gap-1">
                <Cloud className="w-4 h-4" />
                Weather Dependent
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateMeetingLink}
                className="flex items-center gap-1"
              >
                <Video className="w-4 h-4" />
                Add Meeting Link
              </Button>
            </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendees' && (
            <EventInvitationForm
              attendees={watchAttendees}
              onChange={(attendees) => setValue('attendees', attendees)}
              eventTitle={watch('title')}
            />
          )}

          {activeTab === 'recurring' && (
            <RecurringEventForm
              recurrence={watchRecurrence}
              onChange={(recurrence) => setValue('recurrence', recurrence)}
            />
          )}

          {activeTab === 'reminders' && (
            <EventRemindersForm
              reminders={watchReminders}
              onChange={(reminders) => setValue('reminders', reminders)}
            />
          )}

          {activeTab === 'travel' && (
            <TravelTimeCalculator
              toLocation={watchLocation}
              eventStart={new Date(watch('start'))}
              onTravelTimeCalculated={(travelTime, departureTime) => {
                // Handle travel time calculation results
                console.log('Travel time calculated:', { travelTime, departureTime });
              }}
            />
          )}

          {/* Weather Widget */}
          {watchWeatherDependent && watchLocation && (
            <WeatherWidget location={watchLocation} />
          )}

          {/* AI Assistant Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium">AI Scheduling Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get intelligent suggestions for optimal meeting times
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              {showAIAssistant ? 'Hide' : 'Show'} AI Assistant
            </Button>
          </div>

          {showAIAssistant && (
            <AISchedulingAssistant
              attendees={watchAttendees.map(a => a.email)}
              currentStart={new Date(watch('start'))}
              duration={60} // Default duration
              onSuggestionSelect={(suggestion) => {
                setValue('start', format(suggestion.suggestedTime, "yyyy-MM-dd'T'HH:mm"));
                setValue('end', format(
                  new Date(suggestion.suggestedTime.getTime() + 60 * 60 * 1000),
                  "yyyy-MM-dd'T'HH:mm"
                ));
              }}
            />
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}