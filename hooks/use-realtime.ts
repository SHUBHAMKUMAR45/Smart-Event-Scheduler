'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/components/providers/socket-provider';
import { toast } from 'sonner';

interface RealtimeEventHandlers {
  onEventUpdated?: (event: any) => void;
  onEventCreated?: (event: any) => void;
  onEventDeleted?: (eventId: string) => void;
  onTypingStart?: (data: { userId: string; userName: string }) => void;
  onTypingStop?: (data: { userId: string }) => void;
}

export function useRealtime({
  onEventUpdated,
  onEventCreated,
  onEventDeleted,
  onTypingStart,
  onTypingStop,
}: RealtimeEventHandlers = {}) {
  const { socket, isConnected } = useSocket();
  const { data: session } = useSession();

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Join user room for personal notifications
    socket.emit('join', session.user.id);

    // Event handlers
    const handleEventUpdated = (data: { event: any; userId: string }) => {
      if (data.userId !== session.user.id) {
        onEventUpdated?.(data.event);
        toast.info(`Event "${data.event.title}" updated by collaborator`);
      }
    };

    const handleEventCreated = (data: { event: any; userId: string }) => {
      if (data.userId !== session.user.id) {
        onEventCreated?.(data.event);
        toast.success(`New event "${data.event.title}" created by collaborator`);
      }
    };

    const handleEventDeleted = (data: { eventId: string; eventTitle: string; userId: string }) => {
      if (data.userId !== session.user.id) {
        onEventDeleted?.(data.eventId);
        toast.info(`Event "${data.eventTitle}" deleted by collaborator`);
      }
    };

    const handleTypingStart = (data: { userId: string; userName: string }) => {
      if (data.userId !== session.user.id) {
        onTypingStart?.(data);
      }
    };

    const handleTypingStop = (data: { userId: string }) => {
      if (data.userId !== session.user.id) {
        onTypingStop?.(data);
      }
    };

    // Register event listeners
    socket.on('event-updated', handleEventUpdated);
    socket.on('event-created', handleEventCreated);
    socket.on('event-deleted', handleEventDeleted);
    socket.on('typing-start', handleTypingStart);
    socket.on('typing-stop', handleTypingStop);

    return () => {
      socket.off('event-updated', handleEventUpdated);
      socket.off('event-created', handleEventCreated);
      socket.off('event-deleted', handleEventDeleted);
      socket.off('typing-start', handleTypingStart);
      socket.off('typing-stop', handleTypingStop);
    };
  }, [socket, session?.user?.id, onEventUpdated, onEventCreated, onEventDeleted, onTypingStart, onTypingStop]);

  const emitEventUpdate = (event: any, calendarId: string) => {
    if (socket && session?.user?.id) {
      socket.emit('event-updated', {
        event,
        calendarId,
        userId: session.user.id,
      });
    }
  };

  const emitEventCreate = (event: any, calendarId: string) => {
    if (socket && session?.user?.id) {
      socket.emit('event-created', {
        event,
        calendarId,
        userId: session.user.id,
      });
    }
  };

  const emitEventDelete = (eventId: string, eventTitle: string, calendarId: string) => {
    if (socket && session?.user?.id) {
      socket.emit('event-deleted', {
        eventId,
        eventTitle,
        calendarId,
        userId: session.user.id,
      });
    }
  };

  const emitTypingStart = (calendarId: string) => {
    if (socket && session?.user?.id) {
      socket.emit('typing-start', {
        calendarId,
        userId: session.user.id,
        userName: session.user.name,
      });
    }
  };

  const emitTypingStop = (calendarId: string) => {
    if (socket && session?.user?.id) {
      socket.emit('typing-stop', {
        calendarId,
        userId: session.user.id,
      });
    }
  };

  return {
    isConnected,
    emitEventUpdate,
    emitEventCreate,
    emitEventDelete,
    emitTypingStart,
    emitTypingStop,
  };
}