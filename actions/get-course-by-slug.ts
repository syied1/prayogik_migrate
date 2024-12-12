// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function getCourseBySlug(courseSlug) {
  try {
    // Validate the presence of courseSlug
    if (!courseSlug) {
      throw new Error("Failed to fetch the course. Missing course slug.");
    }

    const { userId } = await getServerUserSession();

    // Fetch course details with related data
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
      },
      include: {
        purchases: userId
          ? {
              where: { userId },
            }
          : false, // Only include purchases if user is logged in
        lessons: {
          where: { isPublished: true },
          include: userId
            ? {
                userProgress: {
                  where: { userId },
                },
              }
            : false, // Only fetch user progress if user is logged in
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
      throw new Error("Course not found.");
    }

    return course;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred.");
  }
}
