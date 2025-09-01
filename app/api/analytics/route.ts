import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await connectDB();
    
    // If no database connection, return mock analytics data
    if (!dbConnection) {
      const mockAnalytics = {
        weeklyStats: {
          totalEvents: 23,
          totalHours: 18.5,
          collaborativeEvents: 15,
          privateEvents: 8,
        },
        busyHours: [9, 10, 14, 15],
        preferredDays: [1, 2, 3, 4],
        averageMeetingDuration: 45,
        productivityInsights: [
          'You schedule most meetings between 9-11 AM',
          'Tuesday is your most productive day',
          'You prefer 45-minute meetings over 60-minute ones',
          'Back-to-back meetings reduce your availability by 15%'
        ],
      };
      return NextResponse.json(mockAnalytics);
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'week';

    let startDate: Date;
    let endDate: Date;

    if (period === 'week') {
      startDate = startOfWeek(new Date());
      endDate = endOfWeek(new Date());
    } else {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }

    // Fetch user's events for the period
    const events = await Event.find({
      $or: [
        { createdBy: session.user.id },
        { 'attendees.userId': session.user.id },
      ],
      start: { $gte: startDate, $lte: endDate },
    });

    // Calculate analytics
    const totalEvents = events.length;
    const collaborativeEvents = events.filter(e => e.attendees.length > 0).length;
    const privateEvents = events.filter(e => e.isPrivate).length;
    
    const totalHours = events.reduce((acc, event) => {
      const duration = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);

    // Analyze busy hours
    const hourCounts: { [key: number]: number } = {};
    events.forEach(event => {
      const hour = new Date(event.start).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const busyHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([hour]) => parseInt(hour));

    // Analyze preferred days
    const dayCounts: { [key: number]: number } = {};
    events.forEach(event => {
      const day = new Date(event.start).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const preferredDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([day]) => parseInt(day));

    // Calculate average meeting duration
    const durations = events.map(event => 
      (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60)
    );
    const averageMeetingDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 60;

    // Generate insights
    const productivityInsights = [
      `You scheduled ${totalEvents} events this ${period}`,
      busyHours.length > 0 ? `Your busiest hour is ${busyHours[0]}:00` : 'No clear busy hours pattern',
      `${Math.round((collaborativeEvents / totalEvents) * 100)}% of your events involve others`,
      `Average meeting duration: ${averageMeetingDuration} minutes`,
    ];

    const analytics = {
      weeklyStats: {
        totalEvents,
        totalHours: Math.round(totalHours * 10) / 10,
        collaborativeEvents,
        privateEvents,
      },
      busyHours,
      preferredDays,
      averageMeetingDuration,
      productivityInsights,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}