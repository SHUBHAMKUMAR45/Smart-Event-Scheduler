import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  category: z.string().optional(),
  color: z.string().default('#3B82F6'),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    isOptional: z.boolean().default(false),
  })).default([]),
  isPrivate: z.boolean().default(false),
  weatherDependent: z.boolean().default(false),
  reminders: z.array(z.object({
    type: z.enum(['email', 'push', 'popup']),
    minutesBefore: z.number().min(0),
  })).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await connectDB();
    
    // If no database connection, return mock data
    if (!dbConnection) {
      const mockEvents = [
        {
          _id: '1',
          title: 'Team Meeting',
          description: 'Weekly team sync',
          start: new Date(),
          end: new Date(Date.now() + 60 * 60 * 1000),
          allDay: false,
          color: '#3B82F6',
          createdBy: session.user.id,
          attendees: [],
          isPrivate: false,
          weatherDependent: false,
          reminders: [],
          status: 'confirmed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      return NextResponse.json(mockEvents);
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let query: any = {
      $or: [
        { createdBy: session.user.id },
        { 'attendees.userId': session.user.id },
      ],
    };

    if (start && end) {
      query.start = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email image')
      .populate('category')
      .sort({ start: 1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const eventData = eventSchema.parse(body);

    const dbConnection = await connectDB();
    
    // If no database connection, return mock response
    if (!dbConnection) {
      const mockEvent = {
        _id: Date.now().toString(),
        ...eventData,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return NextResponse.json(mockEvent, { status: 201 });
    }

    const event = await Event.create({
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
      createdBy: session.user.id,
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email image')
      .populate('category');

    return NextResponse.json(populatedEvent, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}