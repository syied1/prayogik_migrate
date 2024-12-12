import { db } from "@/lib/db"; // Adjust this import based on your setup
import { NextResponse } from "next/server";

// Create Rating
// Create or Update Rating
export async function POST(request: Request) {
  const { value, courseId, userId } = await request.json();

  if (
    typeof value !== "number" ||
    value < 1 ||
    value > 5 ||
    !courseId ||
    !userId
  ) {
    return NextResponse.json(
      { message: "Missing or invalid data" },
      { status: 400 }
    );
  }

  try {
    // Check if a rating already exists for this user and course
    const existingRating = await db.rating.findUnique({
      where: { courseId_userId: { courseId, userId } },
    });

    if (existingRating) {
      // Update the existing rating
      const updatedRating = await db.rating.update({
        where: { id: existingRating.id },
        data: { value },
      });
      return NextResponse.json(updatedRating, { status: 200 });
    } else {
      // Create a new rating
      const rating = await db.rating.create({
        data: {
          value,
          courseId,
          userId,
        },
      });
      return NextResponse.json(rating, { status: 201 });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Failed to create or update rating" },
      { status: 500 }
    );
  }
}

// Get Rating for a specific user and course
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const userId = searchParams.get("userId");

  if (!courseId || !userId) {
    return NextResponse.json(
      { message: "Missing courseId or userId" },
      { status: 400 }
    );
  }

  try {
    const rating = await db.rating.findUnique({
      where: {
        courseId_userId: { courseId, userId }, 
      },
    });

    if (!rating) {
      return NextResponse.json(null); 
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get rating" },
      { status: 500 }
    );
  }
}


// Get all Ratings (optionally by course)
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const courseId = searchParams.get("courseId");

//   try {
//     const ratings = courseId
//       ? await db.rating.findMany({ where: { courseId } })
//       : await db.rating.findMany();

//     return NextResponse.json(ratings);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return NextResponse.json(
//       { message: "Failed to get ratings" },
//       { status: 500 }
//     );
//   }
// }

// Update Rating
// export async function PUT(request: Request) {
//   const { id, value } = await request.json();

//   if (!id || typeof value !== "number" || value < 1 || value > 5) {
//     return NextResponse.json(
//       { message: "Missing or invalid data" },
//       { status: 400 }
//     );
//   }

//   try {
//     const updatedRating = await db.rating.update({
//       where: { id },
//       data: { value },
//     });
//     return NextResponse.json(updatedRating);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return NextResponse.json(
//       { message: "Failed to update rating" },
//       { status: 500 }
//     );
//   }
// }

// Delete Rating
// export async function DELETE(request: Request) {
//   const { id } = await request.json();

//   if (!id) {
//     return NextResponse.json({ message: "Missing ID" }, { status: 400 });
//   }

//   try {
//     await db.rating.delete({ where: { id } });
//     return NextResponse.json({ message: "Rating deleted successfully" });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return NextResponse.json(
//       { message: "Failed to delete rating" },
//       { status: 500 }
//     );
//   }
// }
