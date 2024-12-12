// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function POST(req: Request) {
  try {
    // const { userId } = await getServerUserSession(req);
    // console.log("userId:", userId);

    const { courseSlug, userId } = await req.json();

    if (!courseSlug || !userId) {
      return NextResponse.json(
        { access: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the purchase of the course by the user
    const coursePurchase = await db.purchase.findFirst({
      where: {
        userId,
        course: {
          slug: courseSlug,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        course: true,
      },
    });

    // If no purchase found, deny access
    if (!coursePurchase) {
      return NextResponse.json(
        { access: false, error: "No purchase found" },
        { status: 404 }
      );
    }

    // Check if the purchase includes access expiration and verify
    const isAccExpired = isAccessExpired(coursePurchase.expiresAt);
    if (isAccExpired) {
      return NextResponse.json(
        { access: false, error: "Access expired" },
        { status: 403 }
      );
    }

    // If access is valid, return success
    return NextResponse.json({ access: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking course access", error);
    return NextResponse.json(
      { access: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// isAccessExpired function
const isAccessExpired = (expiresAt: Date | null) => {
  if (!expiresAt) return false; // If there's no expiration, access is valid
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime(); // Compare current time with expiration
};

//  ----------------------

// export async function POST(request: Request) {
//   // TODO: sessions isn't getting
//   const session = await getServerSession(authOptions);
//   console.log("session:", session);

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { courseSlug } = await request.json();
//   const userId = session.user.id;

//   try {
//     // Find the purchase of the course by the user
//     const coursePurchase = await db.purchase.findFirst({
//       where: {
//         userId,
//         course: {
//           slug: courseSlug,
//         },
//       },
//       orderBy: {
//         createdAt: "desc", // Sort by createdAt in descending order
//       },
//     });

//     // If no purchase exists, access is false
//     if (!coursePurchase) {
//       return NextResponse.json({ access: false }, { status: 403 });
//     }

//     //TODO
//     // Check if access has expired
//     const isAccExpired = isAccessExpired(coursePurchase.expiresAt);

//     if (isAccExpired) {
//       return NextResponse.json({ access: false }, { status: 403 });
//     }

//     // If all checks pass, access is true
//     return NextResponse.json({ access: true });
//   } catch (error) {
//     console.error("Error checking course access", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// const isAccessExpired = (expiresAt) => {
//   const currentDate = new Date(); // Current date and time in local time (but treated as UTC)
//   // Check if the access has expired by directly comparing the Date objects
//   return currentDate.getTime() > expiresAt.getTime();
// };
