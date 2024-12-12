// pages/api/reviews/route.ts

import { db } from "@/lib/db"; // Adjust this import based on your setup
import { NextResponse } from "next/server";

// Create Review
export async function POST(request: Request) {
  const { content, courseId, userId } = await request.json();

  if (!content || !courseId || !userId) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  try {
    const review = await db.review.create({
      data: {
        content,
        courseId,
        userId,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}

// Get all Reviews
export async function GET() {
  try {
    const reviews = await db.review.findMany();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get reviews" },
      { status: 500 }
    );
  }
}

// Update Review
export async function PUT(request: Request) {
  const { id, content } = await request.json();

  if (!id || !content) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  try {
    const updatedReview = await db.review.update({
      where: { id },
      data: { content },
    });
    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update review" },
      { status: 500 }
    );
  }
}

// Delete Review
export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  try {
    await db.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete review" },
      { status: 500 }
    );
  }
}
