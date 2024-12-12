// @ts-nocheck
import { sendResetEmail } from "@/actions/auth/send-reset-email";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email } = await req.json();

  // Validate the email field
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  try {
    // Check if the user exists in the database
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Generate a reset token using JWT
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Update the user's resetToken
    await db.user.update({
      where: { email },
      data: {
        resetToken,
      },
    });

    // Send the reset password email using the helper function
    const result = await sendResetEmail(email, resetToken);

    if (result.error) {
      return new Response(
        JSON.stringify({ error: "Failed to send reset email." }),
        {
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Password reset email sent. Please check your inbox.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
