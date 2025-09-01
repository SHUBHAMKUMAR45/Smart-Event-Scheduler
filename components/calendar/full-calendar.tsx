"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Event } from "@/types";
import { useSocket } from "@/components/providers/socket-provider";
import { EventModal } from "./event-modal";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface CalendarProps {
  events: Event[];
  onEventCreate?: (event: Partial<Event>) => void;
  onEventUpdate?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

export function Calendar({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
}: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const { socket } = useSocket();
  const { data: session } = useSession();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventSlot, setNewEventSlot] = useState<{
    start: Date;
    end: Date;
    allDay: boolean;
  } | null>(null);

  /** 🎨 Vibrant fallback palette */
  const vibrantColors = [
    "#f87171",
    "#fb923c",
    "#facc15",
    "#4ade80",
    "#38bdf8",
    "#a78bfa",
    "#ec4899",
  ];

  /** ✅ Socket.IO event listeners */
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    socket.emit("join", session.user.id);

    const handleEventUpdated = (data: { event: Event }) => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      const existingEvent = calendarApi.getEventById(data.event._id);
      if (existingEvent) {
        existingEvent.setProp("title", data.event.title);
        existingEvent.setStart(data.event.start);
        existingEvent.setEnd(data.event.end);
        existingEvent.setProp("backgroundColor", data.event.color);
      }
      toast.success("Event updated by collaborator");
    };

    const handleEventCreated = (data: { event: Event }) => {
      calendarRef.current?.getApi()?.addEvent({
        id: data.event._id,
        title: data.event.title,
        start: data.event.start,
        end: data.event.end,
        backgroundColor: data.event.color,
        borderColor: data.event.color,
      });
      toast.success("New event added by collaborator");
    };

    const handleEventDeleted = (data: { eventId: string }) => {
      calendarRef.current?.getApi()?.getEventById(data.eventId)?.remove();
      toast.info("Event removed by collaborator");
    };

    socket.on("event-updated", handleEventUpdated);
    socket.on("event-created", handleEventCreated);
    socket.on("event-deleted", handleEventDeleted);

    return () => {
      socket.off("event-updated", handleEventUpdated);
      socket.off("event-created", handleEventCreated);
      socket.off("event-deleted", handleEventDeleted);
    };
  }, [socket, session?.user?.id]);

  /** ✅ Handlers */
  const handleDateSelect = useCallback((selectInfo: any) => {
    setNewEventSlot({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (clickInfo: any) => {
      const event = events.find((e) => e._id === clickInfo.event.id);
      if (event) {
        setSelectedEvent(event);
        setNewEventSlot(null);
        setIsModalOpen(true);
      }
    },
    [events]
  );

  const handleEventDrop = useCallback(
    async (dropInfo: any) => {
      const event = events.find((e) => e._id === dropInfo.event.id);
      if (!event || !onEventUpdate) return;

      const updatedEvent = {
        ...event,
        start: dropInfo.event.start,
        end: dropInfo.event.end,
      };

      try {
        await onEventUpdate(updatedEvent);
        socket?.emit("event-updated", {
          event: updatedEvent,
          calendarId: session?.user?.id,
        });
        toast.success("Event moved successfully");
      } catch (error) {
        console.error("Failed to update event:", error);
        dropInfo.revert();
        toast.error("Failed to move event");
      }
    },
    [events, onEventUpdate, socket, session?.user?.id]
  );

  const handleEventResize = useCallback(
    async (resizeInfo: any) => {
      const event = events.find((e) => e._id === resizeInfo.event.id);
      if (!event || !onEventUpdate) return;

      const updatedEvent = {
        ...event,
        start: resizeInfo.event.start,
        end: resizeInfo.event.end,
      };

      try {
        await onEventUpdate(updatedEvent);
        socket?.emit("event-updated", {
          event: updatedEvent,
          calendarId: session?.user?.id,
        });
        toast.success("Event resized successfully");
      } catch (error) {
        console.error("Failed to resize event:", error);
        resizeInfo.revert();
        toast.error("Failed to resize event");
      }
    },
    [events, onEventUpdate, socket, session?.user?.id]
  );

  /** ✅ Memoized Events with vibrant fallback */
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        backgroundColor:
          event.color ||
          vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
        borderColor: "transparent",
        textColor: "#fff",
        extendedProps: {
          description: event.description,
          location: event.location,
          attendees: event.attendees,
        },
      })),
    [events]
  );

  /** ✅ Responsive initial view */
  const getInitialView = () => {
    if (typeof window === "undefined") return "dayGridMonth";
    if (window.innerWidth < 640) return "listWeek"; // Mobile
    if (window.innerWidth < 1024) return "timeGridWeek"; // Tablet
    return "dayGridMonth"; // Desktop
  };

  return (
    <div className="h-full w-full">
      <div className="p-2 sm:p-4 text-xs sm:text-sm md:text-base dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-md">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
            multiMonthPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right:
              "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView={getInitialView()}
          editable
          selectable
          selectMirror
          dayMaxEvents
          weekends
          events={calendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          nowIndicator
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot
          dragScroll
          eventResizableFromStart
          eventDurationEditable
          snapDuration="00:15:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "17:00",
          }}
        />
      </div>

      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          initialDate={newEventSlot}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setNewEventSlot(null);
          }}
          onSave={async (eventData) => {
            if (selectedEvent && onEventUpdate) {
              await onEventUpdate({ ...selectedEvent, ...eventData });
            } else if (onEventCreate) {
              await onEventCreate(eventData);
            }
            setIsModalOpen(false);
            setSelectedEvent(null);
            setNewEventSlot(null);
          }}
          onDelete={
            selectedEvent && onEventDelete
              ? () => {
                  onEventDelete(selectedEvent._id);
                  setIsModalOpen(false);
                  setSelectedEvent(null);
                }
              : undefined
          }
        />
      )}

      {/* 🌙 Dark Mode Vibrant Styles */}
      <style jsx global>{`
        .fc {
          transition: all 0.3s ease;
        }
        .dark .fc-toolbar {
          background-color: #1f2937; /* slate-800 */
          color: #f9fafb;
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        .dark .fc-button {
          background: #374151;
          color: #f3f4f6;
          border: none;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        .dark .fc-button:hover {
          background: #4b5563;
        }
        .dark .fc-button.fc-button-active {
          background: #2563eb;
          color: white;
        }
        .dark .fc-daygrid-day {
          background-color: #111827;
          border-color: #1f2937;
        }
        .dark .fc-day-today {
          background-color: #1e3a8a !important;
          color: #fff !important;
          font-weight: bold;
          box-shadow: inset 0 0 8px #3b82f6;
        }
        .dark .fc-event {
          border-radius: 6px;
          padding: 2px 4px;
          font-weight: 500;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .dark .fc-event:hover {
          transform: scale(1.03);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}
