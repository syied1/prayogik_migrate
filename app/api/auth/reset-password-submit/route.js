import jwt from "jsonwebtoken";
import { db } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return new Response(
      JSON.stringify({ error: "Token and password are required." }),
      {
        status: 400,
      }
    );
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if the user exists in the database
    const user = await db.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user || user.resetToken !== token) {
      return new Response(JSON.stringify({ error: "Invalid token." }), {
        status: 400,
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update the user's password (hash it before storing if necessary)
    await db.user.update({
      where: { email: decoded.email },
      data: {
        password: passwordHash, // Hash the password before storing
        resetToken: null, // Clear the reset token
      },
    });

    return new Response(
      JSON.stringify({ message: "Password has been reset successfully." }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(
      JSON.stringify({ error: "Failed to reset password." }),
      {
        status: 400,
      }
    );
  }
}
