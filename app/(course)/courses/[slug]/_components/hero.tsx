// @ts-nocheck

import { BreadCrumb } from "@/components/common/breadCrumb";
// import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { BadgeCheckIcon, Star } from "lucide-react";
import AverageRating from "./AverageRating";

export default async function Hero({ course }) {
  const date = new Date(course.updatedAt);
  const formattedDate =
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date.getFullYear();
  return (
    <div className=" bg-[#115E57]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="max-w-2xl py-4">
          {/* breadcrumb */}
          <div className="mb-6">
            <BreadCrumb
              name={course?.category?.name}
              title={course?.title}
              url={"/courses/category"}
            />
          </div>

          {/* title */}
          <h1 className="text-3xl font-bold mb-6 text-white">
            {course?.title}
          </h1>
          {/* description */}
          <p
            className="text-lg mb-6 text-white"
            dangerouslySetInnerHTML={{
              __html: course?.description
                ? course?.description?.slice(0, 140) +
                  (course?.description?.length > 140 ? "..." : "")
                : "No Description Found",
            }}
          />
          {/* ratings */}
          <div className="flex items-center mb-3">
            <AverageRating courseId={course?.id} />
          </div>

          {/* created by */}
          <p className="mb-3 text-white text-sm">
            Created by -
            <a href="#" className="text-yellow-400 underline ml-2">
              {course?.teacher?.name}
            </a>
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-100">
            <BadgeCheckIcon className="w-4 h-4" />{" "}
            <span>
              Last updated
              <span className="ml-1 text-white">{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
