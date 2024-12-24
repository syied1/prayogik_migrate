// @ts-nocheck

import { NextResponse } from "next/server";

async function updateCourseTotalDuration(courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { duration: true },
  });

  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + (lesson.duration || 0),
    0
  );

  await prisma.course.update({
    where: { id: courseId },
    data: { totalDuration },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  const { courseId, lessonId } = params;

  try {
    const { videoUrl, duration } = await request.json(); // Capture duration from request body

    // Update the lesson in the database
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl,
        duration,
      },
    });

    // Update the total duration for the course
    await updateCourseTotalDuration(courseId);

    return NextResponse.json(
      { message: "Lesson updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson." },
      { status: 500 }
    );
  }
}


// api to upload text lesson by teacher 

export async function PUT(req: Request) {
  const { id, textContent, videoUrl } = await req.json();

  // Validate input
  if (!id) {
    return NextResponse.json({ message: "ID is required." }, { status: 400 });
  }



  try {
    // Update the lesson in the database
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        textContent: textContent || null,
        updatedAt: new Date(),
      },
    });
    console.log("Updated lesson:", updatedLesson);
    return NextResponse.json(updatedLesson, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { message: "Error updating lesson." },
      { status: 500 }
    );
  }
}
