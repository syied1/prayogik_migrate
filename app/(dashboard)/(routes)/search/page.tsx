// @ts-nocheck
import { getCourses } from "@/actions/get-courses";
import { CategoryPagination } from "@/app/(course)/courses/category/_components/CategoryPagination";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SearchInput } from "@/components/search-input";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    page?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const categories = await db?.category?.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!categories) {
    redirect("/dashboard");
  }

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CategoryPagination
          items={courses}
          searchParams={searchParams}
          url="/search"
        />
      </div>
    </>
  );
};

export default SearchPage;
