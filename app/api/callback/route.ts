// @ts-nocheck

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";
import { URL } from "url";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    // Parse the URL to extract query parameters
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    const success = url.searchParams.get("success");
    const failed = url.searchParams.get("failed");

    // Validate course ID
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing" },
        { status: 400 }
      );
    }
    // data = await req.json(); TODO
    // Parse URL-encoded body
    const rawBody = await req.text(); // Get raw body as text
    const data = querystring.parse(rawBody); // Parse URL-encoded data

    const {
      pg_txnid,
      payment_type,
      amount,
      currency,
      amount_bdt,
      amount_currency,
      rec_amount,
      processing_ratio,
      processing_charge,
      date_processed,
      pay_status,
      opt_a,
      opt_b,
    } = data;

    //received userId, priceId as opt_a, opt_b form payment api
    const userId = opt_a;
    const priceId = opt_b;

    // Check if userId is available
    if (!userId) {
      console.error("User ID is not available. User may not be logged in.");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if the payment was successful
    if (success === "1" && pay_status === "Successful") {
      // Retrieve user from the database using userId
      const userPromise = db.user.findUnique({
        where: { id: userId },
      });

      // Retrieve the course from the database
      const coursePromise = db.course.findUnique({
        where: {
          id: courseId,
          isPublished: true,
        },
        include: {
          lessons: true,
        },
      });

      // get it from the database using price id
      const pricePromise = await db.price.findUnique({
        where: { id: priceId },
      });

      const [user, course, price] = await Promise.all([
        userPromise,
        coursePromise,
        pricePromise,
      ]);

      // Check if the course exists
      if (!course || !user || !price) {
        console.log("Invalid purchase request");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`, 404);
      }

      const { frequency, duration } = price;

      //get expiresAt:
      const expiresAt = getExpiryDate(frequency, duration);

      // get teacher revenue based on a percentage
      const teacherRevenuePercentage =
        process.env.TEACHER_REVENUE_PERCENTAGE || 20; // Example percentage (20%)
      const teacherRevenue = calculateTeacherRevenue(
        teacherRevenuePercentage,
        amount
      );

      // Create a new purchase record
      await db.purchase.create({
        data: {
          userId: user.id,
          courseId: courseId,
          purchaseType: "SINGLE_COURSE", // TODO: dynamic change: SINGLE_COURSE or MEMBERSHIP
          aamarPayData: {
            create: {
              pg_txnid,
              payment_type: payment_type || "",
              amount,
              currency,
              amount_bdt: amount_bdt ? String(amount_bdt) : "0",
              amount_currency,
              rec_amount: rec_amount ? String(rec_amount) : "",
              processing_ratio: processing_ratio
                ? String(processing_ratio)
                : "",
              processing_charge: processing_charge
                ? String(processing_charge)
                : "",
              date_processed: date_processed
                ? new Date(date_processed).toISOString()
                : new Date().toISOString(),
            },
          },
          TeacherRevenue: {
            create: {
              userId: user.id,
              amountEarned: teacherRevenue,
            },
          },
        },
      });

      // Create payment history
      await db.paymentHistory.create({
        data: {
          userId: user.id,
          transactionId: pg_txnid || null,
          amount: parseFloat(amount),
          unpaidBalance: parseFloat(0),
        },
      });

      console.log("Successful payment and record created!");

      // Return success response
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/${course.lessons[0]?.slug}?success=1`,
        302
      );
    }

    // Return for failed or cancelled payments
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?cancelled=1`,
      302
    );
  } catch (error) {
    console.error("[CALLBACK_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
}

// calculate expire date
const getExpiryDate = (frequency, duration) => {
  // Get the current date in UTC
  const currentDate = new Date();

  let expiresAt;

  // Add duration based on unit (years or months)
  if (frequency.toLowerCase() === "yearly") {
    expiresAt = new Date(
      Date.UTC(
        currentDate.getUTCFullYear() + duration,
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    );
  } else if (frequency.toLowerCase() === "monthly") {
    expiresAt = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth() + duration, // Add months
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    );
  } else if (frequency.toLowerCase() === "lifetime") {
    expiresAt = null;
  } else {
    throw new Error('Invalid unit provided. Use "years" or "months".');
  }

  return expiresAt;
};

// calculate teacher revenue
const calculateTeacherRevenue = (percentage, amount) => {
  const revenue = (percentage / 100) * amount;
  return parseFloat(revenue.toFixed(2)); // Return rounded revenue
};
