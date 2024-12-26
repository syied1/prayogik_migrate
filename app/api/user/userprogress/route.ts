import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  if (!userId || !courseId) {
    return NextResponse.json(
      { error: "Missing userId or courseId" },
      { status: 400 }
    );
  }

  try {
    const userProgress = await prisma.userProgress.findMany({
      where: {
        userId: userId,
        lesson: {
          courseId: courseId,
        },
      },
      include: {
        lesson: true, // Include lesson details if needed
      },
    });

    return NextResponse.json(userProgress, { status: 200 });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Error fetching user progress" },
      { status: 500 }
    );
  }
}
