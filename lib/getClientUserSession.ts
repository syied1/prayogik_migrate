/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type UserSession = {
  userId: string | null;
  role: string | null;
};

export function getClientUserSession(): UserSession {
  const { data: session } = useSession();
  const [userSession, setUserSession] = useState<UserSession>({
    userId: null,
    role: null,
  });

  useEffect(() => {
    if (session && session.user) {
      setUserSession({
        userId: session.user.id || null,
        role: session.user.role || null,
      });
    }
  }, [session]);

  return userSession;
}
