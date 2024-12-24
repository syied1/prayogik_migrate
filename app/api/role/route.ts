// @ts-nocheck

import { NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await getServerUserSession();

  try {
    const { role } = await req.json(); 

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate the role value (optionally)
    const validRoles = ["STUDENT", "TEACHER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Update the user's role
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ role }); // Respond with the new role
  } catch (error) {
    return NextResponse.json(
      { message: "Error switching role." },
      { status: 500 }
    );
  }
}
