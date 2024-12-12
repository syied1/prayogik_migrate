"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SingleCoursePrice from "./single-course-price";
import SubscriptionPrice from "./subscription-price";
import VideoPopUp from "./VideoPopUp";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function VisitorSidebar({ course, access, userId }: any) {
  // Find the first free lesson with a video URL
  const freeLesson = course?.lessons?.find(
    (lesson: any) => lesson.isFree && lesson.videoUrl
  );
  // console.log("user id from visitor siderbar", userId);

  return (
    <div>
      {/* Video Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-full aspect-video cursor-pointer">
            <Image
              fill
              className="w-full h-full object-cover"
              alt="course image"
              src={course.imageUrl}
            />
            <Image
              alt="play icon"
              src="/images/courses/video-icon.svg"
              height={100}
              width={100}
              className="absolute top-20 left-36 flex items-center justify-center mt-4"
            />
          </div>
        </DialogTrigger>
        {freeLesson && (
          <VideoPopUp
            course={{
              id: course.id,
              title: course.title,
              previewVideoUrl: freeLesson.videoUrl,
              lesson: freeLesson, // Pass lesson details too
            }}
          />
        )}
      </Dialog>

      <div className="px-6 py-2">
        <SubscriptionPrice />
        <div className="flex items-center justify-center my-3">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <SingleCoursePrice course={course} access={access} userId={userId} />
        <div className="mb-4">
          <p className="text-gray-500 mt-4 text-sm">Coupon</p>
          <div className="flex mt-1">
            <Input
              type="text"
              className="flex-grow border border-gray-300 p-2 w-fit rounded-none"
              placeholder="Enter Coupon"
            />
            <Button className="bg-gray-800 rounded-none text-white py-2 px-4">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
