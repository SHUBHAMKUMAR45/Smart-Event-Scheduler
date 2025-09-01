import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIScheduler } from '@/lib/ai-scheduler';
import { z } from 'zod';

const suggestTimeSchema = z.object({
  participants: z.array(z.string()),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  preferredDate: z.string().datetime(),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { participants, duration, preferredDate, timeRange } = suggestTimeSchema.parse(body);

    const suggestions = await AIScheduler.findOptimalMeetingTime(
      participants,
      duration,
      new Date(preferredDate),
      timeRange
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    
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