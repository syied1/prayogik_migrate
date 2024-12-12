// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course belonging to the user, including chapters
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Ensure the user (teacher) owns the course
      },
      include: {
        chapters: true, // Include chapters
      },
    });

    // If the course is not found, return 404
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Check for required fields (assuming title and categoryId are required)
    const hasRequiredFields = course.title && course.categoryId;

    // Check if the course has at least one published chapter
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    // Check for course validity
    if (!hasRequiredFields || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update and publish the course
    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        teacherId: userId, // Ensure the user (teacher) owns the course
      },
      data: {
        isPublished: true, // Publish the course
        // Optionally include other fields to update if required by your schema
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
