'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Bell, Globe, Palette, Shield } from 'lucide-react';
import { userPreferencesValidation, UserPreferencesData } from '@/lib/validations';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const workingDays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferencesData | null>(null);

  const form = useForm<UserPreferencesData>({
    resolver: zodResolver(userPreferencesValidation),
    defaultValues: {
      timezone: 'UTC',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: [1, 2, 3, 4, 5],
      },
      defaultEventDuration: 60,
      reminderDefaults: [15, 60],
    },
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        form.reset(data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const onSubmit = async (data: UserPreferencesData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Preferences updated successfully');
        setPreferences(data);
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkingDay = (day: number) => {
    const currentDays = form.getValues('workingHours.days');
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    
    form.setValue('workingHours.days', newDays);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your scheduling preferences and account settings
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Time Zone</Label>
              <Select
                value={form.watch('timezone')}
                onValueChange={(value) => form.setValue('timezone', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultEventDuration">Default Event Duration (minutes)</Label>
              <Select
                value={form.watch('defaultEventDuration').toString()}
                onValueChange={(value) => form.setValue('defaultEventDuration', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workingStart">Start Time</Label>
                <Input
                  {...form.register('workingHours.start')}
                  type="time"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="workingEnd">End Time</Label>
                <Input
                  {...form.register('workingHours.end')}
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {workingDays.map((day) => (
                  <Badge
                    key={day.value}
                    variant={form.watch('workingHours.days').includes(day.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleWorkingDay(day.value)}
                  >
                    {day.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Reminders</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[5, 15, 30, 60, 120, 1440].map((minutes) => {
                  const isSelected = form.watch('reminderDefaults').includes(minutes);
                  const label = minutes < 60 
                    ? `${minutes}m` 
                    : minutes === 1440 
                    ? '1 day' 
                    : `${minutes / 60}h`;
                  
                  return (
                    <Badge
                      key={minutes}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const current = form.getValues('reminderDefaults');
                        const updated = isSelected
                          ? current.filter(m => m !== minutes)
                          : [...current, minutes].sort((a, b) => a - b);
                        form.setValue('reminderDefaults', updated);
                      }}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={session?.user?.name || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={session?.user?.email || ''} disabled className="mt-1" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account information is managed through your OAuth provider
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}