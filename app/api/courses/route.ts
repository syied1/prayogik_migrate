// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server";

import { isTeacher } from "@/lib/teacher";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// // ------ post -----------
export async function POST(req: Request) {
  try {
    const { userId } = await getServerUserSession(req);
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorised Access");
    }

    // Parse the incoming request to get the title
    const { title } = await req.json();
    const slug = await slugify(title, db.course, "slug");

    // Ensure the user is logged in and is a teacher

    // Create the course using the teacherId
    const course = await db.course.create({
      data: {
        teacherId: userId, // Use teacherId field according to your schema
        title,
        slug,
      },
    });

    // Return the created course as a JSON response
    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // TODO: not getting session
  // const session = await getServerSession(authOptions);
  // const userId = session.user.id;

  try {
    // Base query to fetch published courses
    const baseQuery = {
      where: { isPublished: true },
      include: {
        category: true,
        lessons: { where: { isPublished: true } },
        teacher: { select: { name: true, email: true } },
        prices: true,
        Rating: true,
        Review: true,
      },
      orderBy: { createdAt: "desc" },
    };

    // Fetching all published courses along with their related data
    const courses = await db.course.findMany(baseQuery);

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
