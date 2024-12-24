// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req); // Fetch the user ID from session
    const { title } = await req.json();

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure that the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Using teacherId to match the course owner's ID
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the last chapter to determine the position for the new chapter
    const lastChapter = await db.lesson.findFirst({
      where: {
        id: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create a new chapter
    const chapter = await db.lesson.create({
      data: {
        title,
        id: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
