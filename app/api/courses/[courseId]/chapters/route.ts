// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { compositeSlugify } from "@/lib/slugify";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req); // Fetch the user ID from session
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorised Access");
    }

    // Ensure that the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Using teacherId to match the course owner's ID
      },
    });

    if (!courseOwner) {
      throw new Error("Unauthorised Access");
    }

    // Fetch the last chapter to determine the position for the new chapter
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const { title } = await req.json();
    const slug = await compositeSlugify(
      title,
      db.chapter,
      "slug",
      "courseId",
      courseId
    );

    // Create a new chapter
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
        slug,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
