import jwt from "jsonwebtoken";
import { db } from "./db";
import bcrypt from "bcrypt";

export async function authEmailVerifier(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { name, email, password } = decoded;

    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists but is not verified, update their verification status
      if (!existingUser.isVerified) {
        await db.user.update({
          where: { email },
          data: { isVerified: true },
        });
        return { message: "User verified successfully" };
      } else {
        throw new Error("User is already verified");
      }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user if not already registered
    await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        emailVerified: true,
        emailVerificationToken: token,
        tokenUsed: true,
      },
    });

    return { message: "User created successfully" };
  } catch (error) {
    // throw new Error("Verification failed: " + error.message);
    throw new Error("Verification failed!");
  }
}
