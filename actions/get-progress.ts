import { db } from "@/lib/db";

// export const getProgress = async (
//   userId: string | null,
//   courseId: string
// ): Promise<number> => {
//   try {
//     const publishedChapters = await db.chapter.findMany({
//       where: {
//         courseId: courseId,
//         isPublished: true,
//       },
//       select: {
//         id: true,
//       },
//     });

//     const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

//     const validCompletedChapters = await db.userProgress.count({
//       where: {
//         userId: userId || "",
//         chapterId: {
//           in: publishedChapterIds,
//         },
//         isCompleted: true,
//       },
//     });

//     const progressPercentage =
//       (validCompletedChapters / publishedChapterIds.length) * 100;

//     return progressPercentage;
//   } catch (error) {
//     console.log("[GET_PROGRESS]", error);
//     return 0;
//   }
// };

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
