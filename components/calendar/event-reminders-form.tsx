'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, X, Mail, Smartphone, Monitor } from 'lucide-react';
import { Reminder } from '@/types';
import { Label } from '@radix-ui/react-label';

interface EventRemindersFormProps {
  reminders: Reminder[];
  onChange: (reminders: Reminder[]) => void;
}

const reminderTypes = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'push', label: 'Push Notification', icon: Smartphone },
  { value: 'popup', label: 'Browser Popup', icon: Monitor },
];

const reminderTimes = [
  { value: 0, label: 'At event time' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' },
  { value: 10080, label: '1 week before' },
];

export function EventRemindersForm({ reminders, onChange }: EventRemindersFormProps) {
  const [newReminderType, setNewReminderType] = useState<'email' | 'push' | 'popup'>('email');
  const [newReminderTime, setNewReminderTime] = useState(15);

  const addReminder = () => {
    const existingReminder = reminders.find(
      r => r.type === newReminderType && r.minutesBefore === newReminderTime
    );

    if (existingReminder) {
      return;
    }

    const newReminder: Reminder = {
      type: newReminderType,
      minutesBefore: newReminderTime,
      sent: false,
    };

    onChange([...reminders, newReminder]);
  };

  const removeReminder = (index: number) => {
    onChange(reminders.filter((_, i) => i !== index));
  };

  const formatReminderTime = (minutes: number) => {
    if (minutes === 0) return 'At event time';
    if (minutes < 60) return `${minutes} min before`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h before`;
    return `${Math.floor(minutes / 1440)}d before`;
  };

  const getReminderIcon = (type: string) => {
    const reminderType = reminderTypes.find(t => t.value === type);
    return reminderType?.icon || Bell;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Event Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Reminder */}
        <div className="flex gap-2">
          <Select value={newReminderType} onValueChange={(value) => setNewReminderType(value as 'email' | 'push' | 'popup')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-3 h-3" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newReminderTime.toString()} onValueChange={(value) => setNewReminderTime(parseInt(value))}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTimes.map((time) => (
                <SelectItem key={time.value} value={time.value.toString()}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={addReminder} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Reminders */}
        {reminders.length > 0 && (
          <div className="space-y-2">
            <Label>Active Reminders</Label>
            <div className="space-y-2">
              {reminders.map((reminder, index) => {
                const ReminderIcon = getReminderIcon(reminder.type);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <ReminderIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {formatReminderTime(reminder.minutesBefore)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {reminder.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReminder(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {reminders.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No reminders set</p>
            <p className="text-xs">Add reminders to get notified before your events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}