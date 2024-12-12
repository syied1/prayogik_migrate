//@ts-nocheck

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const CoursesPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      teacherId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
