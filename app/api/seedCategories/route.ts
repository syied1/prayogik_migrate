//@ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { slugify } from "@/lib/slugify";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

const categories = [
  "SEO",
  "Web Design & Development",
  "Graphics Design",
  "Digital Marketing",
  "Content Strategy",
  "UI/UX Design",
];

export async function POST(req: Request) {
  try {
    // Get the user session
    const { userId } = await getServerUserSession(req);

    // Ensure the user is logged in and is a teacher
    if (!userId || !isTeacher(userId)) {
      throw new Error("Unauthorised Access!");
    }

    // Create categories
    const createdCategories = await Promise.all(
      categories.map(async (category) => {
        const slug = await slugify(category, db.category, "slug");
        return db.category.create({
          data: {
            name: category,
            slug: slug,
          },
        });
      })
    );

    // Return the created categories as a JSON response
    return NextResponse.json(createdCategories, { status: 201 });
  } catch (error) {
    console.error("[SEED_CATEGORIES_ERROR]", error);
    return new NextResponse(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
