import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import EventCategory from "@/models/EventCategory";
import { authOptions } from "@/lib/auth";
// Removed invalid RouteContext import

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbConnection = await connectDB();

    // If no database connection, return mock response
    if (!dbConnection) {
      return NextResponse.json({ message: "Category updated (mock)" });
    }

    const body = await req.json();
    const category = await EventCategory.findOneAndUpdate(
      { _id: context.params.id, createdBy: session.user.id },
      body,
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbConnection = await connectDB();

    // If no database connection, return mock response
    if (!dbConnection) {
      return NextResponse.json({ message: "Category deleted (mock)" });
    }

    const category = await EventCategory.findOneAndDelete({
      _id: context.params.id,
      createdBy: session.user.id,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
