// pages/api/ratings/[id]/route.ts

import { db } from "@/lib/db"; // Adjust this import based on your setup
import { NextResponse } from "next/server";

// Get Rating by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const rating = await db.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      return NextResponse.json(
        { message: "Rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rating);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 }
    );
  }
}
