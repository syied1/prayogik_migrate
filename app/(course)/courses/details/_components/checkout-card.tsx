// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import Link from "next/link";
import React from "react";
import CheckoutButton from "../../../../../components/checkoutButton/checkoutButton";
import CourseFeatures from "./course-features";

interface Course {
  id: string;
  price: string | null;
  purchases: { id: string }[];
  chapters: { id: string }[];
}

export default function CheckoutCard({
  course,
  userId,
}: {
  course: Course; // Use the defined Course type
  userId: string | null;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 90) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onchange = (e: boolean) => {
    setChecked(e);
  };

  return (
    <div
      className={`sticky w-full sm:w-1/2 md:w-full flex-1 top-10 rounded-lg mt-2 md:mt-0 lg:p-9 bg-white ${
        scrolled && "drop-shadow-lg"
      }`}
    >
      <div className="p-6 flex-1 border rounded-lg border-teal-500">
        {userId && course.purchases?.length > 0 ? (
          <>
            <CourseFeatures course={course} />
            <Link
              href={`/courses/${course.id}/chapters/${course.chapters[0].id}`}
            >
              <Button className="mt-4 w-full h-12 bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center text-xl hover:bg-teal-500 hover:opacity-80">
                চালিয়ে যান
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-900">কোর্সের মূল্য</span>
            </div>
            <div className="mb-4 text-gray-600">
              <div className="text-2xl md:text-3xl leading-none font-bold text-gray-800">
                ৳{convertNumberToBangla(Number(course.price))} টাকা
              </div>
            </div>
            {userId && (
              <div className="flex items-start text-gray-800 space-x-3 mt-4 mb-2">
                <Checkbox
                  id="terms2"
                  className="border-teal-600 mt-1 data-[state=checked]:bg-teal-600"
                  onCheckedChange={(e) => onchange(Boolean(e))}
                />
                <label htmlFor="terms2" className="text-sm font-normal">
                  আমি{" "}
                  <Link href="/terms" className="text-blue-600">
                    শর্তাবলী, রিফান্ড ও ক্যান্সল্যাশন
                  </Link>{" "}
                  এবং{" "}
                  <Link href="/privacy-policy" className="text-blue-600">
                    গোপনীয়তা নীতিমালার
                  </Link>{" "}
                  সাথে সম্মতি প্রকাশ করছি।
                </label>
              </div>
            )}
            <CheckoutButton
              userId={userId}
              courseId={course.id}
              priceId={course.price || null}
              checked={checked}
            />
            <div className="mt-6">
              <CourseFeatures course={course} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
