import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import EventCategory from '@/models/EventCategory';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await connectDB();
    
    // If no database connection, return mock categories
    if (!dbConnection) {
      const mockCategories = [
        {
          _id: '1',
          name: 'Work Meetings',
          color: '#3B82F6',
          description: 'Professional meetings and work-related events',
          createdBy: session.user.id,
        },
        {
          _id: '2',
          name: 'Personal',
          color: '#10B981',
          description: 'Personal appointments and activities',
          createdBy: session.user.id,
        },
      ];
      return NextResponse.json(mockCategories);
    }

    const categories = await EventCategory.find({
      createdBy: session.user.id,
    }).sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
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
    const categoryData = categorySchema.parse(body);

    const dbConnection = await connectDB();
    
    // If no database connection, return mock response
    if (!dbConnection) {
      const mockCategory = {
        _id: Date.now().toString(),
        ...categoryData,
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return NextResponse.json(mockCategory, { status: 201 });
    }

    const category = await EventCategory.create({
      ...categoryData,
      createdBy: session.user.id,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    
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