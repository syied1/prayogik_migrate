// @ts-nocheck

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

const testCourse = {
  id: "course1234567890abcdef",
  title: "JavaScript Mastery",
  slug: "javascript-mastery",
  description:
    "Learn JavaScript from basics to advanced concepts with real-world projects.",
  imageUrl: "https://example.com/javascript-course.jpg",
  isPublished: true,
  teacherId: "teacher1234567890abcdef",
  teacher: {
    id: "teacher1234567890abcdef",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "teacher",
  },
  teacherRevShare: 0.4,
  ownership: "TEACHER",
  studentIds: ["student1", "student2", "student3"],
  students: [
    {
      id: "student1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    {
      id: "student2",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    },
    {
      id: "student3",
      name: "Bob Brown",
      email: "bob.brown@example.com",
    },
  ],
  categoryId: "category123",
  category: {
    id: "category123",
    name: "Web Development",
  },
  chapters: [
    {
      id: "chapter1",
      title: "Introduction to JavaScript",
      description: "Basic JavaScript concepts",
      order: 1,
    },
    {
      id: "chapter2",
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript",
      order: 2,
    },
  ],
  attachments: [
    {
      id: "attachment1",
      fileName: "javascript-cheatsheet.pdf",
      fileUrl: "https://example.com/javascript-cheatsheet.pdf",
    },
  ],
  purchases: [
    {
      id: "purchase123",
      userId: "student1",
      amount: 49.99,
      purchaseDate: "2024-10-01",
    },
  ],
  membershipPlanIds: ["membership1"],
  membershipPlans: [
    {
      id: "membership1",
      name: "JavaScript Pro Plan",
      price: {
        id: "price1",
        regularAmount: 99.99,
        discountedAmount: 79.99,
        isLifeTime: false,
        duration: 12,
        frequency: "YEARLY",
      },
    },
  ],
  bundleIds: ["bundle123"],
  bundles: [
    {
      id: "bundle123",
      name: "Full Web Developer Bundle",
      courses: ["html-basics", "javascript-mastery"],
    },
  ],
  createdAt: "2024-09-15T12:00:00.000Z",
  updatedAt: "2024-10-03T08:00:00.000Z",
};

export async function GET(req, { params }) {
  // return NextResponse.json(testCourse);

  try {
    const { courseId } = params;

    if (!courseId) {
      throw new Error("Failed to fetch the course. Missing courseId.");
    }
    const { userId } = await getServerUserSession();

    // Fetch course details with related data
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        purchases: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false, // Only include purchases if user is logged in
        chapters: {
          where: {
            isPublished: true,
          },
          include: userId
            ? {
                userProgress: {
                  where: {
                    userId: userId,
                  },
                },
              }
            : false, // Only fetch user progress if user is logged in
          orderBy: {
            position: "asc",
          },
        },
        attachments: true,
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);

    // Check if userId is available
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course associated with the user (teacher)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: userId, // Ensure that the user (teacher) owns the course
      },
      include: {
        attachments: true, // Include attachments to delete them
        lessons: true, // Include lessons to delete them
      },
    });

    // If course not found, return 404
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete associated attachments
    if (course.attachments.length > 0) {
      await db.attachment.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    // Delete associated lessons and their videos
    if (course.lessons.length > 0) {
      for (const lesson of course.lessons) {
        const videoId = lesson.videoUrl; // Get the video URL from the lesson
        if (videoId) {
          // Construct the URL for deleting the video from VdoCipher
          const apiSecret = process.env.VDOCIPHER_API_SECRET;
          if (!apiSecret) {
            throw new Error("API Secret is not defined.");
          }

          const url = `https://dev.vdocipher.com/api/videos?videos=${videoId}`;

          // Attempt to delete the video from VdoCipher
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
        }
      }

      // Delete the lessons after videos are deleted
      await db.lesson.deleteMany({
        where: {
          courseId: params.courseId,
        },
      });
    }

    // Delete the course
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    // Return the deleted course data in response
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error); // Use console.error for error logging
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await getServerUserSession(req);
    const { courseId } = params;

    // Parse the request body
    const values = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure at least one field is present to update
    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    // Find the existing course to ensure it belongs to the user
    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
        teacherId: userId, // Ensure the user (teacher) owns the course
      },
    });

    // If the course is not found, return a 404 response
    if (!existingCourse) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course with the provided fields
    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values, // Only apply the fields being updated
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = await request.json(); // Extract userId from request body
  const { courseId } = params; // Extract courseId from route parameters

  try {
    // Fetch the progress using the getProgress function
    const progressPercentage = await getProgress(userId, courseId);

    // Return the progress percentage as a JSON response
    return NextResponse.json({ progress: progressPercentage });
  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json(
      { error: "Error fetching progress" },
      { status: 500 }
    );
  }
}
