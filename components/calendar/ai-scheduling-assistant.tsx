'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Users, AlertCircle } from 'lucide-react';
import { AISchedulingSuggestion } from '@/types';
import { format } from 'date-fns';

interface AISchedulingAssistantProps {
  attendees: string[];
  currentStart: Date;
  duration: number;
  onSuggestionSelect: (suggestion: AISchedulingSuggestion) => void;
}

export function AISchedulingAssistant({
  attendees,
  currentStart,
  duration,
  onSuggestionSelect,
}: AISchedulingAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISchedulingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: attendees,
          duration,
          preferredDate: currentStart.toISOString(),
          timeRange: {
            start: '09:00',
            end: '17:00',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attendees.length > 0) {
      fetchSuggestions();
    }
  }, [attendees, currentStart, duration]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Scheduling Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Based on {attendees.length} participant{attendees.length > 1 ? 's' : ''}, 
              here are optimal meeting times:
            </p>
            
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {format(suggestion.suggestedTime, 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <Badge className={getConfidenceColor(suggestion.confidence)}>
                    {Math.round(suggestion.confidence * 100)}% match
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {suggestion.reason}
                </p>

                {suggestion.conflicts.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>{suggestion.conflicts.length} potential conflict(s)</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {suggestion.alternatives.slice(0, 2).map((alt, altIndex) => (
                      <Badge key={altIndex} variant="outline" className="text-xs">
                        {format(alt, 'HH:mm')}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onSuggestionSelect(suggestion)}
                  >
                    Use This Time
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            {attendees.length === 0 ? (
              <p>Add attendees to get AI scheduling suggestions</p>
            ) : (
              <p>No optimal times found. Try a different date or time range.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}