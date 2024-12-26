import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    // Get the user session
    const { userId } = await getServerUserSession(req);

    // Parse the request body
    const { isCompleted } = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Determine the new completion status
    const newIsCompleted = isCompleted; 

    // Upsert user progress based on the userId and lessonId
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
      update: {
        isCompleted: newIsCompleted, // Update to the new status
      },
      create: {
        userId,
        lessonId: params.lessonId,
        isCompleted: newIsCompleted, // Create with the new status
      },
    });

    // Return the updated or created user progress
    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
