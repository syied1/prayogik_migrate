// @ts-nocheck
// pages/api/courses/prices/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const pricesData = await request.json();
  console.log("PriceData is:", pricesData);

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

    // upsertPromises
    const upsertPromises = pricesData.map((priceData, index) => {
      const existingPrice = existingPrices[index];

      if (existingPrice) {
        // If the price exists, update it
        return db.price.update({
          where: { id: priceData.id },
          data: {
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

// ------using upsert----------
// export async function POST(request: Request) {
//   const pricesData = await request.json();

//   // checked required fields
//   const missingData = pricesData.some(
//     (price) => !price.regularAmount || !price.courseId
//   );
//   if (missingData) {
//     return NextResponse.json(
//       { message: "Missing required data!" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Upsert prices using Promise.all
//     const upsertPromises = pricesData.map((priceData) => {
//       return db.price.upsert({
//         where: { id: priceData.id || "" },
//         update: {
//           regularAmount: priceData.regularAmount,
//           discountedAmount: priceData.discountedAmount,
//           discountExpiresOn: priceData.discountExpiresOn,
//           isLifeTime: priceData.frequency === "LIFETIME",
//           duration:
//             priceData.duration === "NA" ? 0 : parseInt(priceData.duration),
//           frequency: priceData.frequency,
//         },
//         create: {
//           regularAmount: priceData.regularAmount,
//           discountedAmount: priceData.discountedAmount,
//           discountExpiresOn: priceData.discountExpiresOn,
//           isLifeTime: priceData.frequency === "LIFETIME",
//           duration:
//             priceData.duration === "NA" ? 0 : parseInt(priceData.duration),
//           frequency: priceData.frequency,
//           course: {
//             connect: {
//               id: priceData.courseId,
//             },
//           },
//         },
//       });
//     });

//     // Execute all upsert promises in parallel
//     const prices = await Promise.all(upsertPromises);

//     return NextResponse.json(prices, { status: 201 });
//   } catch (error) {
//     console.error("Failed to upsert prices", error);
//     return NextResponse.json(
//       { message: "Failed to upsert prices" },
//       { status: 500 }
//     );
//   }
// }
