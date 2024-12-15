// @ts-nocheck

"use client";
import { Button } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import Image from "next/image";
import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { Preview } from "./preview";
import { useSession } from "next-auth/react";
import CheckoutButton from "./checkoutButton/checkoutButton";

export default function SingleCourse({ course }) {
  const { data: session, status } = useSession();

  const {
    id,
    slug,
    imageUrl,
    title,
    price,
    description,
    category,
    progress,
    purchases,
    lessons,
  } = course;

  const offer = 35; // This will come from db.

  // Check if the course is purchased and user is authenticated
  const isPurchased = purchases && purchases.length > 0;
  const isAuthenticated = !!session;

  console.log(session);
  console.log(status);
  console.log(isPurchased);
  console.log(isAuthenticated);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative border">
        <Image
          alt={title}
          className="object-cover"
          height={400}
          width={600}
          src={imageUrl}
          priority
        />

        {/* Video play icon */}
        <Link
          href={`/courses/${slug}`} // Allow unauthenticated users to view the course details
          className="absolute inset-0 flex items-center justify-center mt-4"
        >
          <Image
            alt=""
            src="/images/courses/video-icon.svg"
            height={100}
            width={100}
            priority
          />
        </Link>
      </div>

      <div className="mt-4 p-4">
        <div className="flex items-center gap-x-4 text-xs">
          <Link
            href={`/courses/category?categoryId=${course?.categoryId}`} // No authentication check for category link
            className="relative bg-blue-100 text-blue-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-2 py-2"
          >
            {category.name}
          </Link>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-2 py-2">
            {convertNumberToBangla(lessons.length) || 0} টি ক্লাস
          </span>
        </div>

        {/* Course Title */}
        <div className="mb-2 mt-4">
          <Link
            href={`/courses/${slug}`} // Allow unauthenticated users to view the course details
            className="text-xl font-bold"
          >
            {title}
          </Link>
        </div>

        {/* Card Description */}
        <div className="text-sm text-gray-700 mb-4 mt-2">
          <Preview
            value={
              description.length > 200 ? description.slice(0, 200) : description
            }
          />
        </div>
      </div>

      <div className="p-4 mt-auto">
        {/* Show course progress and continue button only if authenticated and purchased */}
        {status === "authenticated" &&
        session?.user?.id &&
        progress !== null ? (
          <>
            <div className="mb-4">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
            <Link
              href={`/courses/${slug}/${lessons[0]?.slug}`}
              className="mt-4"
            >
              <Button className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80">
                চালিয়ে যান
              </Button>
            </Link>
          </>
        ) : (
          <div>
            <div className="flex items-center text-gray-500 mt-2 mb-4"></div>
            <Link href={`/courses/${slug}`}>
              <Button className="w-full h-12 bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80">
                <span className=" ml-2 text-lg">বিস্তারিত দেখুন</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
