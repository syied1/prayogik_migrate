// @ts-nocheck
"use client";
import { useState } from "react";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import CourseDescription from "./course-description";
import Sidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import RatingForm from "./RatingForm";

export const LessonContent = ({
  lesson,
  course,
  nextLesson,
  userProgress,
  purchase,
  userId,
}) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState(lesson.videoUrl);

  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {/* course title */}
      <div className=" bg-[#105650]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-6 py-3 lg:px-8">
          <h1 className="text-xl font-semibold text-white">{course.title}</h1>
          <h1 className="text-xl font-semibold text-white">
            Video URL ID: {currentVideoUrl}
          </h1>
        </div>
      </div>
      {/* video */}
      <div className="bg-[#115E57]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
          <div className="w-full max-w-[51rem]">
            <div className="w-full">
              {currentVideoUrl ? (
                <VdocipherVideoPlayer
                  chapterId={lesson.id}
                  title={lesson.title}
                  courseId={course.id}
                  nextChapterId={nextLesson?.id}
                  videoUrl={currentVideoUrl} // Dynamic URL
                  videoStatus={lesson?.videoStatus}
                  isLocked={isLocked}
                  completeOnEnd={completeOnEnd}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-[450px] bg-gray-200 text-gray-600 text-center rounded-md">
                  <p className="text-md font-medium ">
                    Video is currently unavailable. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* slug content */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <main className="min-h-screen">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-black">
                  {lesson.title}
                </h1>
                {/* completed button */}
                <div className="flex justify-end mt-2">
                  <Button>
                    Mark as completed
                    <CheckCircle className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CourseDescription course={course} />
              <RatingForm courseId={course?.id} userId={userId} />
            </main>
          </div>
          {/* sidebar */}
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full lg:-mt-[508px]">
              <div className="sticky bg-white top-4">
                <div className="border border-gray-200 min-h-[80vh]">
                  <Sidebar
                    videoUrl={currentVideoUrl}
                    onVideoUrlUpdate={setCurrentVideoUrl} // Pass update function
                    course={course}
                    access={!!purchase}
                    lesson={course.lessons}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
