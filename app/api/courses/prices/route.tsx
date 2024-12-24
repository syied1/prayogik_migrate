// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests to create or update prices
export async function POST(request: Request) {
  const pricesData = await request.json();
  console.log("PricesData:", pricesData);

  const missingData = pricesData.some(
    (price) => !price.regularAmount || !price.courseId
  );

  if (missingData) {
    return NextResponse.json(
      { message: "Missing required data!" },
      { status: 400 }
    );
  }

  try {
    const existingPrices = await Promise.all(
      pricesData.map(async (priceData) => {
        if (priceData.id) {
          return db.price.findUnique({
            where: { id: priceData.id },
          });
        }
        return null;
      })
    );

    // Upsert prices
    const upsertPromises = pricesData.map((priceData, index) => {
      const existingPrice = existingPrices[index];

      if (existingPrice) {
        // If the price exists, update it
        return db.price.update({
          where: { id: priceData.id },
          data: {
            isFree: false,
            regularAmount: priceData.regularAmount,
            discountedAmount: priceData.discountedAmount,
            discountExpiresOn: priceData.discountExpiresOn,
            isLifeTime: priceData.frequency === "LIFETIME",
            duration:
              priceData.duration === "NA" ? 0 : parseInt(priceData.duration),
            frequency: priceData.frequency,
          },
        });
      } else {
        // If the price does not exist, create it
        return db.price.create({
          data: {
            isFree: false,
            regularAmount: priceData.regularAmount,
            discountedAmount: priceData.discountedAmount,
            discountExpiresOn: priceData.discountExpiresOn,
            isLifeTime: priceData.frequency === "LIFETIME",
            duration:
              priceData.duration === "NA" ? 0 : parseInt(priceData.duration),
            frequency: priceData.frequency,
            course: {
              connect: {
                id: priceData.courseId,
              },
            },
          },
        });
      }
    });

    // Execute all promises in parallel
    const prices = await Promise.all(upsertPromises);

    return NextResponse.json(prices, { status: 201 });
  } catch (error) {
    console.error("Failed to upsert prices", error);
    return NextResponse.json(
      { message: "Failed to upsert prices" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    // Log the courseId being processed
    console.log("Attempting to delete prices for course ID:", courseId);

    // Delete all prices associated with the course ID
    const deletedPrices = await db.price.deleteMany({
      where: { courseId },
    });

    if (deletedPrices.count === 0) {
      return NextResponse.json(
        { message: "No prices found for this course" },
        { status: 404 }
      );
    }

    // Create a default price entry with price set to 0 if no prices exist
    await db.price.create({
      data: {
        isFree: true,
        regularAmount: 0,
        discountedAmount: null, // or another appropriate value
        discountExpiresOn: null, // or set an expiry if needed
        isLifeTime: false,
        duration: null, // or specify a duration as needed
        frequency: "LIFETIME", // Or set a default frequency value
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "All prices deleted successfully, course marked as free, and a default price created.",
      },
      { status: 204 }
    );
  } catch (error) {
    // console.error("Failed to delete prices:", error);

    // // Check if the error is related to the database (Prisma specific)
    // if (error instanceof Error) {
    //   return NextResponse.json(
    //     { message: "Failed to delete prices", error: error.message },
    //     { status: 500 }
    //   );
    // }

    // return NextResponse.json(
    //   { message: "Failed to delete prices" },
    //   { status: 500 }
    // );
  }
}
