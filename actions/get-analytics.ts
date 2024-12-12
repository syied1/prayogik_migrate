// @ts-nocheck

import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    const coursePrice = purchase.course.price ?? 0; // Ensure price is defined, default to 0

    // Initialize the course in the grouped object if it doesn't exist
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += coursePrice; // Accumulate price per course
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    // Fetch purchases with related course and teacher revenue
    const purchases = await db.purchase.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: true, // Include the teacher to calculate the teacher's revenue share
          },
        },
        TeacherRevenue: true, // Include the TeacherRevenue related to this purchase
      },
    });

    // Calculate total revenue for each course
    const courseRevenue: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
      const courseTitle = purchase.course?.title || "Unknown Course";
      const teacherEarnings =
        purchase.TeacherRevenue?.reduce(
          (sum, revenue) => sum + (revenue.amountEarned || 0), // Use amountEarned instead of amount
          0
        ) || 0;

      // Initialize the course in the revenue object if it doesn't exist
      if (!courseRevenue[courseTitle]) {
        courseRevenue[courseTitle] = 0;
      }
      courseRevenue[courseTitle] += teacherEarnings; // Accumulate teacher earnings
    });

    // Map the grouped revenue to an array of course names and total earnings
    const data = Object.entries(courseRevenue).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total || 0, // Ensure total is a valid number
    }));

    // Calculate total revenue
    const totalRevenue = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const totalSales = purchases.length; // Total number of purchases

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
