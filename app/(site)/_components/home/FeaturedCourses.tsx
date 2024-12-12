import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import SingleCourse from "@/components/SingleCourse";
import Link from "next/link";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "@/actions/get-progress";

const FeaturedCourses = async () => {
  const { userId } = await getServerUserSession();
  const courses = await db.course.findMany({
    take: 4,
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      prices: true,
      isPublished: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          slug: true,
          description: true,
          videoUrl: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  // If user is logged in, get their purchased courses
  const purchasedCourses = userId
    ? await db.purchase.findMany({
        where: { userId, purchaseType: "SINGLE_COURSE" },
        select: { courseId: true },
      })
    : [];

  const purchasedCourseIds = purchasedCourses.map(
    (purchase) => purchase.courseId
  );

  // Fetch progress for each course if the user is logged in
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = purchasedCourseIds.includes(course.id)
        ? await getProgress(userId, course.id)
        : null;
      return { ...course, progress };
    })
  );

  return (
    <div className="bg-gray-50" id="course">
      <div className="mx-auto max-w-7xl">
        <div className="pt-24 pb-16">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                আমাদের কোর্স সমূহ
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                বর্তমান সময়ের সবচাইতে গুরুত্বপূর্ণ ও ডিমান্ডিং স্কিল নিয়ে চালু
                হচ্ছে এই কোর্স গুলো। নির্দিস্ট তারিখের মধ্যে নিবন্ধন কিংবা
                প্রি-এনরোলমেন্ট করুন। গ্রহণ করুন বিশেষ ছাড়।
              </p>
            </div>

            {/* Conditional Rendering: Check if User is Logged In */}
            {userId ? (
              // If Logged In, Display Courses with Progress
              <section>
                {coursesWithProgress.length === 0 ? (
                  <div className="text-center mt-8">
                    <p className="text-red-400 border border-red-200 p-2 rounded-md">
                      কোন কোর্স পাওয়া যায়নি!
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {coursesWithProgress.slice(0, 8).map((course, i) => (
                      <SingleCourse course={course} key={i} />
                    ))}
                  </div>
                )}
                {/* Show Load More if More Than 8 Courses */}
                {coursesWithProgress.length > 8 && (
                  <div className="text-center mt-12">
                    <Link href={`/courses/category?page=1`}>
                      <Button className="mx-auto flex gap-2 border-teal-600 hover:bg-white bg-white border hover:opacity-70 font-bold text-teal-600">
                        আরও দেখুন
                        <ArrowRight className="w-4 h-4 stroke-teal-600" />
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            ) : (
              // If Not Logged In, Display Courses Without Progress
              <section>
                {courses.length === 0 ? (
                  <div className="text-center mt-8">
                    <p className="text-red-400 border border-red-200 p-2 rounded-md">
                      কোন কোর্স পাওয়া যায়নি!
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {courses.slice(0, 8).map((course, i) => (
                      <SingleCourse course={course} key={i} />
                    ))}
                  </div>
                )}
                {/* Show Load More if More Than 8 Courses */}
                {courses.length > 8 && (
                  <div className="text-center mt-12">
                    <Link href={`/courses/category?page=1`}>
                      <Button className="mx-auto flex gap-2 border-teal-600 hover:bg-white bg-white border hover:opacity-70 font-bold text-teal-600">
                        আরও দেখুন
                        <ArrowRight className="w-4 h-4 stroke-teal-600" />
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
