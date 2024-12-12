// @ts-nocheck

import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId?: string | null;
  title?: string;
  categoryId?: string;
  page?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
  page,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    // Fetch published courses based on userId presence
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        lessons: {
          where: {
            isPublished: true,
          },
        },
        purchases: userId
          ? {
              where: {
                userId,
              },
            }
          : undefined, // Use undefined when no userId is provided
      },
      orderBy: {
        createdAt: "desc", // Order by course creation date
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          let progressPercentage = null;

          // Load progress if userId is present and user has purchased the course
          if (userId && course.purchases.length > 0) {
            progressPercentage = await getProgress(userId, course.id);
          }

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return [];
  }
};
