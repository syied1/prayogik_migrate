import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
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

    // Upsert user progress based on the userId and chapterId
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    // Return the updated or created user progress
    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
