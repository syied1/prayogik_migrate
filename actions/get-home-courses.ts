// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "./get-progress";

export async function getHomeCourses() {
  const { userId } = await getServerUserSession();

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
          purchases = course.purchases || []; // Fetch the purchases array for the user

          // Load progress if the user has purchased the course
          if (purchases.length > 0) {
            progressPercentage = await getProgress(userId, course.id);
          }
        }

        return {
          ...course,
          progress: progressPercentage, // Will be null if no progress or userId
          purchases, // Empty if no purchases or userId
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    // throw new Error("Failed to fetch courses.");
  }
}
