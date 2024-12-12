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

    // Parse the incoming request body to get the values (including videoUrl)
    const { videoUrl, ...values } = await req.json();

    // Ensure videoUrl is valid if provided
    if (videoUrl && typeof videoUrl !== "string") {
      return new NextResponse("Invalid video URL", { status: 400 });
    }

    // Check if the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Check if the course is owned by the user
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the chapter with the new values
    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId, // Ensure the chapter belongs to the correct course
      },
      data: {
        ...values,
        videoUrl: videoUrl ?? undefined, // Use undefined if videoUrl is not provided
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req); // Ensure user session is retrieved

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Check against teacherId
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the specific chapter data
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId, // Ensure the chapter belongs to the correct course
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user owns the course
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Corrected to use teacherId for ownership
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the chapter to delete
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    const videoId = chapter.videoUrl; // Get the video ID from the chapter
    if (!videoId) {
      return new NextResponse("Video ID is required", { status: 400 });
    }

    // Construct the URL for deleting the video
    const apiSecret = process.env.VDOCIPHER_API_SECRET;
    if (!apiSecret) {
      throw new Error("API Secret is not defined.");
    }

    const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

    // Attempt to delete the video from VdoCipher
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${apiSecret}`,
        },
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Response from VdoCipher: ${errorText}`);
        throw new Error(
          `Failed to delete video ${videoId}: ${response.status} - ${errorText}`
        );
      }

      // Get the response data
      const data = await response.json();
      console.log("Video deleted successfully:", data);
    } catch (videoError) {
      const videoErrorMessage =
        videoError instanceof Error ? videoError.message : "Unknown error";
      console.error(
        `Failed to delete video ${videoId} from VdoCipher`,
        videoErrorMessage
      );
      return new NextResponse(
        `Failed to delete video from VdoCipher: ${videoErrorMessage}`,
        { status: 500 }
      );
    }

    // Delete any user progress associated with the chapter
    await db.userProgress.deleteMany({
      where: {
        chapterId: chapter.id,
      },
    });

    // Delete the chapter
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // Check if there are any other published chapters in the course
    const remainingPublishedChapters = await db.chapter.count({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If no published chapters remain, mark the course as unpublished
    if (remainingPublishedChapters === 0) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
