// @ts-nocheck 
import axios from "axios";

export async function POST(request) {
  try {
    // Parse incoming JSON body
    const body = await request.json();
    const { title, folderId } = body;

    // Use environment variable for the API key
    const vdocipherApiKey = process.env.VDOCIPHER_API_SECRET;

    // Define the API request options
    const options = {
      method: "PUT",
      url: `https://dev.vdocipher.com/api/videos?title=${encodeURIComponent(
        title || "Untitled Video"
      )}&folderId=${folderId || "root"}`,
      headers: {
        Authorization: `Apisecret ${vdocipherApiKey}`,
      },
      timeout: 5000, // Set a timeout for the request
    };

    // Make the request to VdoCipher
    const response = await axios(options);

    // Return success response with data
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return error response with message and status code
    return new Response(
      JSON.stringify({
        error: true,
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


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
    return NextResponse.json({ length: data.length }); // Return only the required data
  } catch (error) {
    console.error("Error fetching video length:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

