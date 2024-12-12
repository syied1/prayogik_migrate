// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// get lesson with slug
export async function POST(req: Request) {
  try {
    // Extract the lessonSlug from the request body
    const { lessonSlug, userId } = await req.json();

    // Fetch lesson details along with its course if it's published
    const lesson = await db.lesson.findUnique({
      where: {
        slug: lessonSlug,
        isPublished: true,
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Ensure the lesson exists
    if (!lesson) {
      return NextResponse.json(
        {
          error: "Lesson not found or not published",
        },
        { status: 404 }
      );
    }

    const { course } = lesson;

    // Ensure the course exists and is published
    if (!course || !course.isPublished) {
      return NextResponse.json(
        {
          error: "Course not found or not published",
        },
        { status: 404 }
      );
    }

    // Fetch the user's purchase information for the course relationally
    const purchase = await db.purchase.findFirst({
      where: {
        userId: userId,
        courseId: course.id,
      },
    });

    // Initialize attachments and next lesson
    let attachments = [];
    let nextLesson = null;

    // If the user has purchased the course, fetch attachments
    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: course.id,
        },
      });
    }

    // Find the next lesson in the course
    if (lesson.isFree || purchase) {
      nextLesson = await db.lesson.findFirst({
        where: {
          courseId: course.id,
          isPublished: true,
          position: {
            gt: lesson.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    // Fetch user progress for the lesson relationally
    const userProgress = await db.userProgress.findFirst({
      where: {
        userId: userId,
        lessonId: lesson.id,
      },
    });

    // Return the relevant data
    return NextResponse.json({
      lesson,
      course,
      attachments,
      nextLesson,
      userProgress,
      purchase,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
