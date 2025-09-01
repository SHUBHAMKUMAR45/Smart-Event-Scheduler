'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Clock, List, Grid } from 'lucide-react';

interface CalendarViewSwitcherProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function CalendarViewSwitcher({ currentView, onViewChange }: CalendarViewSwitcherProps) {
  const views = [
    { id: 'dayGridMonth', label: 'Month', icon: Grid },
    { id: 'timeGridWeek', label: 'Week', icon: Calendar },
    { id: 'timeGridDay', label: 'Day', icon: Clock },
    { id: 'listWeek', label: 'Agenda', icon: List },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {views.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(id)}
          className="flex items-center gap-1"
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}