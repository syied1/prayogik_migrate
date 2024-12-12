import { NextResponse } from "next/server";
import { authEmailVerifier } from "../../../../lib/authEmailVerifier";

export async function POST(req) {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.get("authorization");

    // Check if the Authorization header exists and if it starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is missing or invalid",
        },
        { status: 403 }
      );
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Optional: You can still handle the secret if needed (based on your original logic)
    const body = await req.json();
    const { secret } = body;

    // Verify the secret if it's part of the process
    if (secret && secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(
        { success: false, message: "Invalid secret" },
        { status: 403 }
      );
    }

    // Call the authEmailVerifier to verify the token and create the user
    const result = await authEmailVerifier(token);

    // If successful, return a 200 response with the result
    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors (e.g., token invalid, user already exists, etc.)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 400 }
    );
  }
}
