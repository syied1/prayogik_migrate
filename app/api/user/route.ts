// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "@/actions/get-progress";
import { isTeacher } from "@/lib/teacher";

// ------ post -----------
export async function POST(req: Request) {
  try {
    const { userId } = await getServerUserSession(req);

    // Parse the incoming request to get the title
    const { title } = await req.json();

    // Ensure the user is logged in and is a teacher
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the course using the teacherId
    const course = await db.course.create({
      data: {
        teacherId: userId, // Use teacherId field according to your schema
        title,
      },
    });

    // Return the created course as a JSON response
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ------ get -----------
export async function GET(req: Request) {
  try {
    // Get user session if logged in
    const { userId } = await getServerUserSession(req);

    // Define the base query for published courses with categories and chapters
    const baseQuery = {
      where: { isPublished: true },
      include: {
        category: true,
        chapters: { where: { isPublished: true } },
      },
      orderBy: { createdAt: "desc" },
    };

    // If userId is found, include purchases and students for progress tracking
    const queryWithUserData = userId
      ? {
          ...baseQuery,
          include: {
            ...baseQuery.include,
            purchases: { where: { userId } },
            students: {
              where: { id: userId },
              select: {
                userProgress: { include: { chapter: true } },
              },
            },
          },
        }
      : baseQuery;

    // Query to get all relevant courses
    const courses = await db.course.findMany(queryWithUserData);

    // Calculate progress for each course if userId is available
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage = null;

        if (userId && course.purchases.length > 0) {
          // Get user progress for this course
          progressPercentage = await getProgress(userId, course.id);
        }

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error("[GET_PUBLISHED_COURSES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
