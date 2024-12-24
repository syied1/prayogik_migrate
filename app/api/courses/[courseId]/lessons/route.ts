// @ts-nocheck

/**
API Endpoints with Lesson:
POST /api/course/:courseId/lesson – Create a new lesson.
GET /api/course/:courseId/lesson – Read all lessons for a course.
PATCH /api/course/:courseId/lesson/:lessonId – Update a lesson's title and slug.
DELETE /api/course/:courseId/lesson/:lessonId – Delete a lesson.

 */
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
// import { compositeSlugify } from "@/lib/slugify";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

// CREATE a new lesson
export async function POST(req, { params }) {
  try {
    const { userId } = await getServerUserSession(req); // Fetch the user ID from session

    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    // Ensure that the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Using teacherId to match the course owner's ID
      },
    });

    if (!courseOwner) {
      throw new Error("Unauthorized Access");
    }

    // Fetch the last lesson to determine the position for the new lesson
    const lastLesson = await db.lesson.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    const { title, slug } = await req.json();
    // console.log(slug)

    // const slug = await compositeSlugify(
    //   title,
    //   db.lesson,
    //   "slug",
    //   "courseId",
    //   params.courseId
    // );

    // Create a new lesson
    const lesson = await db.lesson.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
        slug,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// READ all lessons for a course
export async function GET(req, { params }) {
  try {
    const lessons = await db.lesson.findMany({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE a lesson
export async function PATCH(req, { params }) {
  try {
    const { userId } = await getServerUserSession(req); // Fetch the user ID from session
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    // Ensure that the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId,
      },
    });

    if (!courseOwner) {
      throw new Error("Unauthorized Access");
    }

    const { title , slug} = await req.json();
    // const slug = await compositeSlugify(
    //   title,
    //   db.lesson,
    //   "slug",
    //   "courseId",
    //   params.courseId
    // );

    // Update the lesson
    const updatedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
      },
      data: {
        title,
        slug,
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE a lesson
export async function DELETE(req, { params }) {
  try {
    const { userId } = await getServerUserSession(req); // Fetch the user ID from session
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorized Access");
    }

    // Ensure that the user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId,
      },
    });

    if (!courseOwner) {
      throw new Error("Unauthorized Access");
    }

    // Delete the lesson
    await db.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[LESSONS]", error);
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
