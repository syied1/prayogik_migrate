// @ts-nocheck
import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  try {
    const apiSecret = process.env.VDOCIPHER_API_SECRET;

    const response = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${apiSecret}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch video length" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("videoLength from backend", data.length);
    return NextResponse.json({ length: data.length });
  } catch (error) {
    console.error("Error fetching video length:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
