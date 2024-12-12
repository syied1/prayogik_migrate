// @ts-nocheck

import { Category, Chapter, Course, Purchase } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null; // category can be null
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Retrieve purchases for the user with related course and category data
    const purchases = await db.purchase.findMany({
      where: {
        userId: userId,
        // purchaseType: "SINGLE_COURSE",
      },
      include: {
        course: {
          include: {
            category: true, // Include the category relationship
            prices: true,
            lessons: {
              where: {
                isPublished: true, // Only include published lessons
              },
            },
          },
        },
      },
    });

    // Extract courses and add progress to each course
    const courses = await Promise.all(
      purchases.map(async (purchase) => {
        const course = purchase.course as CourseWithProgressWithCategory;
        course.progress = await getProgress(userId, course.id);
        return course;
      })
    );

    // Separate completed and in-progress courses
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
