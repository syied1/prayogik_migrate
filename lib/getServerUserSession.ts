// @ts-nocheck

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

type UserSession = {
  userId: string | null;
  role: string | null;
};

export async function getServerUserSession(
  req?: Request
): Promise<UserSession> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { userId: null, role: null };
  }

  const { id: userId, role } = session.user;
  return { userId, role };
}
