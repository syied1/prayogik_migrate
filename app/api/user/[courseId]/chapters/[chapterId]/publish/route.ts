import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
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

    // Fetch the chapter and check if it exists
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    // Ensure required fields are present before publishing
    if (!chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields for publishing", {
        status: 400,
      });
    }

    // Publish the chapter
    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        isPublished: true,
        updatedAt: new Date(), // Optionally update the timestamp
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
