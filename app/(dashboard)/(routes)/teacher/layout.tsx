//@ts-nocheck

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { isTeacher } from "@/lib/teacher";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!isTeacher(userId)) {
    redirect("/dashboard");
    return null; // Return `null` to prevent further rendering
  }

  return <>{children}</>;
};

export default TeacherLayout;
