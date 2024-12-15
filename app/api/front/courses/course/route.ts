// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Get single course by slug (both for logged in and logged out users)
export async function POST(req: Request) {
  try {
    // Parse the request body to get the courseSlug and userId
    const { courseSlug, userId } = await req.json();

    // Validate the presence of courseSlug
    if (!courseSlug) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    // Fetch course details along with related data
    const course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        purchases: userId ? { where: { userId } } : false,
        lessons: {
          where: { isPublished: true },
          include: userId ? { userProgress: { where: { userId } } } : false,
          orderBy: { position: "asc" },
        },
        prices: true,
        attachments: true,
        teacher: {
          select: { name: true },
        },
        category: true,
      },
    });

    // Handle case where course is not found
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Return course data with 200 OK status if everything is successful
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
