import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Ensure user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Corrected to use teacherId for ownership
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the lesson and check if it exists
    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    // Ensure required fields are present before publishing
    if (!lesson.title) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    // Publish the lesson
    const publishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
      },
      data: {
        isPublished: true,
        updatedAt: new Date(), // Optionally update the timestamp
      },
    });

    return NextResponse.json(publishedLesson);
  } catch (error) {
    console.error("[LESSON_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}