// @ts-nocheck

import Loading from "@/app/(dashboard)/loading";
import SingleCourse from "@/components/SingleCourse";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Courses({ courses }) {
  if (!courses || !Array.isArray(courses)) {
    return null; 
  }

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

            {/* Courses List */}
            {courses.length === 0 ? (
              <div className="text-center mt-8">
                <p className="text-red-400 border border-red-200 p-2 rounded-md">
                  কোন কোর্স পাওয়া যায়নি!
                </p>
              </div>
            ) : (
              <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {courses.slice(0, 8).map((course) => (
                  <SingleCourse course={course} key={course.id} /> 
                ))}
              </div>
            )}

            {/* Show "Load More" button if more than 8 courses */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
