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
  // console.log("visitor-siderbar check", course);

  return (
    <div>
      {/* Video Modal */}
      <Dialog>
        <DialogTrigger asChild>
          {freeLesson?.videoUrl ? (
            <div className="relative w-full aspect-video cursor-pointer">
              {/* Play Icon */}
              <Image
                alt="play icon"
                src="/images/courses/video-icon.svg"
                height={100}
                width={100}
                className="absolute top-20 left-36 flex items-center justify-center mt-4"
              />
              {/* Course Image */}
              <Image
                alt={course?.imageUrl}
                className="object-cover h-[250px]"
                height={100}
                width={400}
                src={course?.imageUrl}
                priority
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video">
              {/* Course Image Only */}
              <Image
                alt={course?.imageUrl}
                className="object-cover h-[250px]"
                height={100}
                width={400}
                src={course?.imageUrl}
                priority
              />
            </div>
          )}
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

      <div className="px-6 mt-6">
        {/* <SubscriptionPrice />
        <div className="flex items-center justify-center my-3">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}
        <SingleCoursePrice course={course} access={access} userId={userId} />
        {/*------------- coupon------------------ */}
        {/* <div className="mb-4">
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
        </div> */}
      </div>
    </div>
  );
}
