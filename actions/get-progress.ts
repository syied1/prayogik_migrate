import { db } from "@/lib/db";

export const getProgress = async (
  userId: string | null,
  courseId: string
): Promise<number> => {
  try {
    // Fetch all published lessons for the given course
    const publishedLessons = await db.lesson.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

    // Count the number of completed lessons by the user
    const validCompletedLessons = await db.userProgress.count({
      where: {
        userId: userId || "",
        lessonId: {
          in: publishedLessonIds,
        },
        isCompleted: true,
      },
    });

    // Calculate the progress percentage
    const progressPercentage =
      publishedLessonIds.length > 0
        ? (validCompletedLessons / publishedLessonIds.length) * 100
        : 0;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
