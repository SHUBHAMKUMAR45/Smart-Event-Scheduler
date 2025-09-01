import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await connectDB();
    
    // If no database connection, return mock response
    if (!dbConnection) {
      return NextResponse.json({ message: 'Event updated (mock)' });
    }

    const body = await req.json();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = event.createdBy.toString() === session.user.id;
    const isAttendee = event.attendees.some(
      (attendee: any) => attendee.userId?.toString() === session.user.id
    );

    if (!isOwner && !isAttendee) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      {
        ...body,
        start: body.start ? new Date(body.start) : event.start,
        end: body.end ? new Date(body.end) : event.end,
      },
      { new: true }
    )
      .populate('createdBy', 'name email image')
      .populate('category');

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await connectDB();
    
    // If no database connection, return mock response
    if (!dbConnection) {
      return NextResponse.json({ message: 'Event deleted (mock)' });
    }

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (event.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}