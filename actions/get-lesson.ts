// @ts-nocheck
import { db } from "@/lib/db";
import { Attachment, Lesson } from "@prisma/client";

interface GetLessonProps {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
}

export const getLesson = async ({
  userId,
  courseSlug,
  lessonSlug,
}: GetLessonProps) => {
  try {
    // First, fetch the course using the courseSlug
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
        isPublished: true, // Only fetch if the course is published
      },
      select: {
        id: true, // We need the course ID for further queries
        prices: true,
      },
    });

    // If the course is not found or is not published
    if (!course) {
      throw new Error("Course not found or not published");
    }

    // Fetch the user's purchase information for the course
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id, // Use the fetched course ID
        },
      },
    });

    // Fetch lesson details if it's published
    const lesson = await db.lesson.findUnique({
      where: {
        slug: lessonSlug,
        isPublished: true, // Only fetch if the lesson is published
      },
    });

    // Check if the lesson exists
    if (!lesson) {
      throw new Error("Lesson not found or not published");
    }

    // Initialize attachments and nextLesson
    let attachments: Attachment[] = [];
    let nextLesson: Lesson | null = null;

    // If the user has purchased the course, fetch attachments
    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id, // Use the course ID to fetch attachments
        },
      });
    }

    // If the lesson is free or the user has purchased the course, find the next lesson
    if (lesson.isFree || purchase) {
      nextLesson = await db.lesson.findFirst({
        where: {
          courseId: course.id, // Use course ID to find the next lesson
          isPublished: true,
          position: {
            gt: lesson.position, // Get the next lesson based on position
          },
        },
        orderBy: {
          position: "asc", // Order by position to get the immediate next lesson
        },
      });
    }

    // Fetch user progress for the current lesson
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id, // Use the lesson ID
        },
      },
    });

    // Return the relevant data
    return {
      lesson,
      course,
      attachments,
      nextLesson,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_LESSON_ERROR]", error);
    return {
      lesson: null,
      course: null,
      attachments: [],
      nextLesson: null,
      userProgress: null,
      purchase: null,
    };
  }
};
