import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Retrieve the user session from the request
    const { userId } = await getServerUserSession(req);

    // Return 401 if no user is found in the session
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course exists and is owned by the current user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Ensures ownership
      },
    });

    // Return 404 if the course is not found
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Update the course to unpublish it
    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        teacherId: userId, // Ensure course ownership
      },
      data: {
        isPublished: false, // Set the course as unpublished
      },
    });

    // Return the updated course data
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error("[COURSE_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
