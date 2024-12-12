// @ts-nocheck

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

// Courses with or without progress for home page
export async function POST(req: Request) {
  //   const { userId } = await getServerUserSession();
  //   console.log("UserID:", userId);

  const { userId } = await req.json();

  try {
    // Base query to fetch published courses
    const baseQuery = {
      where: { isPublished: true },
      include: {
        category: true,
        lessons: { where: { isPublished: true } },
        teacher: { select: { name: true, email: true } },
        prices: true,
        Rating: true,
        Review: true,
        purchases: userId ? { where: { userId } } : false, // Fetch purchases if userId exists
      },
      orderBy: { createdAt: "desc" },
    };

    // Fetching all published courses along with their related data
    const courses = await db.course.findMany(baseQuery);

    // Calculate courses with progress and purchases
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        let progressPercentage = null;
        let purchases = [];

        // Load progress and purchases if userId is present
        if (userId) {
          purchases = course.purchases || [];

          // Load progress if the user has purchased the course
          if (purchases.length > 0) {
            progressPercentage = await getProgress(userId, course.id);
          }
        }

        return {
          ...course,
          progress: progressPercentage,
          purchases,
        };
      })
    );

    return NextResponse.json(coursesWithProgress, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
