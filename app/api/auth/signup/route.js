import { db } from "../../../../lib/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Generate a JWT with user info (without storing the user in the DB yet)
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send verification email to the user
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message: "Verification email sent. Please check your inbox.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
