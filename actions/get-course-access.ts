// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function checkCourseAccess(courseSlug: string) {
  try {
    const { userId } = await getServerUserSession();

    if (!courseSlug || !userId) {
      return { access: false, error: "Unauthorized" };
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
      return { access: false, error: "No purchase found" };
    }

    // Check if the purchase includes access expiration and verify
    const isAccExpired = isAccessExpired(coursePurchase.expiresAt);
    if (isAccExpired) {
      return { access: false, error: "Access expired" };
    }

    // If access is valid, return success
    return { access: true };
  } catch (error) {
    console.error("Error checking course access", error);
    return { access: false, error: "Internal Server Error" };
  }
}

// isAccessExpired function
const isAccessExpired = (expiresAt: Date | null) => {
  if (!expiresAt) return false; // If there's no expiration, access is valid
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime(); // Compare current time with expiration
};
