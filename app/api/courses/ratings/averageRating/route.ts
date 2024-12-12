// pages/api/courses/averageRating.ts

import { db } from "@/lib/db"; // Adjust this import based on your setup
import { NextResponse } from "next/server";

// Get Average Rating and Enrollment Info for a Course
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ message: "Missing courseId" }, { status: 400 });
  }

  try {
    // Fetch ratings for the specified course
    const ratings = await db.rating.findMany({
      where: { courseId },
    });

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length
        : 0;

    // Fetch the course to get the number of enrolled students
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { studentIds: true }, // Get the enrolled students' IDs
    });

    const enrolledStudents = course ? course.studentIds.length : 0; // Count enrolled students

    return NextResponse.json({
      averageRating,
      ratingsCount: ratings.length,
      enrolledStudents,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get average rating and enrollment info" },
      { status: 500 }
    );
  }
}
