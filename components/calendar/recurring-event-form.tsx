'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Repeat, Calendar, X } from 'lucide-react';
import { RecurrencePattern } from '@/types';
import { format, addDays } from 'date-fns';

interface RecurringEventFormProps {
  recurrence?: RecurrencePattern;
  onChange: (recurrence: RecurrencePattern | undefined) => void;
}

const weekDays = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export function RecurringEventForm({ recurrence, onChange }: RecurringEventFormProps) {
  const [isRecurring, setIsRecurring] = useState(!!recurrence);

  const updateRecurrence = (updates: Partial<RecurrencePattern>) => {
    if (!isRecurring) return;
    
    const newRecurrence: RecurrencePattern = {
      frequency: 'weekly',
      interval: 1,
      endType: 'never',
      ...recurrence,
      ...updates,
    };
    
    onChange(newRecurrence);
  };

  const toggleRecurring = (enabled: boolean) => {
    setIsRecurring(enabled);
    if (enabled) {
      onChange({
        frequency: 'weekly',
        interval: 1,
        endType: 'never',
      });
    } else {
      onChange(undefined);
    }
  };

  const toggleWeekDay = (day: number) => {
    if (!recurrence) return;
    
    const currentDays = recurrence.byWeekDay || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    
    updateRecurrence({ byWeekDay: newDays });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="w-4 h-4" />
          Recurring Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isRecurring}
            onCheckedChange={toggleRecurring}
          />
          <Label>Make this a recurring event</Label>
        </div>

        {isRecurring && recurrence && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={recurrence.frequency}
                  onValueChange={(value: any) => updateRecurrence({ frequency: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Repeat every</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={recurrence.interval}
                    onChange={(e) => updateRecurrence({ interval: parseInt(e.target.value) || 1 })}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    {recurrence.frequency === 'daily' && 'day(s)'}
                    {recurrence.frequency === 'weekly' && 'week(s)'}
                    {recurrence.frequency === 'monthly' && 'month(s)'}
                    {recurrence.frequency === 'yearly' && 'year(s)'}
                  </span>
                </div>
              </div>
            </div>

            {recurrence.frequency === 'weekly' && (
              <div>
                <Label>Repeat on</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {weekDays.map((day) => (
                    <Badge
                      key={day.value}
                      variant={(recurrence.byWeekDay || []).includes(day.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleWeekDay(day.value)}
                    >
                      {day.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>End</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="never"
                    name="endType"
                    checked={recurrence.endType === 'never'}
                    onChange={() => updateRecurrence({ endType: 'never' })}
                  />
                  <Label htmlFor="never">Never</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="date"
                    name="endType"
                    checked={recurrence.endType === 'date'}
                    onChange={() => updateRecurrence({ endType: 'date' })}
                  />
                  <Label htmlFor="date">On date</Label>
                  {recurrence.endType === 'date' && (
                    <Input
                      type="date"
                      value={recurrence.endDate ? format(recurrence.endDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => updateRecurrence({ endDate: new Date(e.target.value) })}
                      className="w-40"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="count"
                    name="endType"
                    checked={recurrence.endType === 'count'}
                    onChange={() => updateRecurrence({ endType: 'count' })}
                  />
                  <Label htmlFor="count">After</Label>
                  {recurrence.endType === 'count' && (
                    <>
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        value={recurrence.endCount || 1}
                        onChange={(e) => updateRecurrence({ endCount: parseInt(e.target.value) || 1 })}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">occurrences</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}