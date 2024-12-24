// @ts-nocheck

import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import axios from "axios";
import { getServerUserSession } from "@/lib/getServerUserSession";

// check discount expired or not
const isDiscountExpired = (expiresAt) => {
  const currentDate = new Date();
  return currentDate.getTime() > expiresAt.getTime(); // return true of false
};

// post
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const { priceId } = await req.json();

  try {
    // Get the user session
    const { userId } = await getServerUserSession();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course details, ensure it's published
    const coursePromise = db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const pricePromise = db.price.findUnique({
      where: {
        id: priceId,
        courseId: params.courseId,
      },
    });

    const [course, price] = await Promise.all([coursePromise, pricePromise]);

    if (!course || !price) {
      return new NextResponse("Invalid request", {
        status: 404,
      });
    }

    // Check if the user has already purchased the course
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        },
      },
    });

    if (existingPurchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    // Retrieve the user's information
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Prepare form data for the payment gateway
    const formData = {
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: "Not available",
      amount: isDiscountExpired(price.discountExpiresOn)
        ? price.regularAmount
        : price.discountedAmount,
      tran_id: uuid(),
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      store_id: process.env.AAMARPAY_STORE_ID,
      currency: "BDT", // Or USD, depending on your need
      desc: `Course: ${course.title}`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&success=1`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback?courseId=${course.id}&failed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?canceled=1`,
      type: "json", // Required for JSON requests
      opt_a: userId, // sent userId here
      opt_b: price.id, // sent priceId here
    };

    console.log("formData", formData);
    

    const paymentUrl = process.env.AAMARPAY_URL;

    if (!paymentUrl) {
      return new NextResponse("Payment URL is missing", { status: 404 });
    }

    // Make the payment request
    const { data } = await axios.post(paymentUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle errors from the payment gateway
    if (data.result !== "true") {
      let errorMessage = "";
      for (let key in data) {
        errorMessage += data[key] + ". ";
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    // Return the payment URL for redirection
    return NextResponse.json({ url: data.payment_url });
  } catch (error) {
    console.error("[COURSE_ID_CHECKOUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
