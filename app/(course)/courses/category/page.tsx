// @ts-nocheck
import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CategoryPagination } from "./_components/CategoryPagination";
import Sidebar from "./_components/Sidebar";
import { getServerUserSession } from "@/lib/getServerUserSession";

interface SearchParams {
  page?: string;
  categoryId?: string;
}

interface CategoryPageProps {
  searchParams: SearchParams;
}

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const { userId } = await getServerUserSession();

  const categories = await db?.category?.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!categories) {
    redirect("/");
  }

  const courses = await getCourses({
    ...searchParams,
    userId,
  });

  return (
    <div className="max-w-7xl mx-auto p-6 lg:px-8">
      <div>
        <div className="p-4">
          <div className="flex flex-col gap-8 md:gap-12 md:flex-row">
            {/* Sidebar */}
            <Sidebar
              courses={courses}
              items={categories}
              searchParams={searchParams}
            />
            <div className="w-full md:w-5/6">
              <div className="flex md:flex-row flex-col gap-3 justify-between mb-4">
                <h1 className="text-2xl font-bold">আমাদের কোর্সসমূহ</h1>
              </div>
              <CategoryPagination
                items={courses}
                searchParams={searchParams}
                url="/courses/category"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
