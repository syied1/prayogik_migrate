// @ts-nocheck
"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MoreCourseList from "./MoreCourseList";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";

export default function VideoPopUp({
  course,
}: {
  course: {
    id: string;
    title: string;
    previewVideoUrl: string;
    lesson?: { id: string; videoStatus?: string; title: string };
    isLocked?: boolean;
    completeOnEnd?: () => void;
  };
}) {
  const {
    title,
    previewVideoUrl,
    lesson = { id: "", videoStatus: "", title: "" },
    isLocked = false,
    completeOnEnd = () => {},
  } = course;
  // console.log(course);
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold tracking-wide text-white/75">
              Course Preview
            </h2>
            <div>
              <p
                className="text-xl font-semibold py-2 tracking-wide text-white capitalize"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {/* <p>
                Check video: {lesson.videoStatus} {lesson.id} {lesson.title}
              </p> */}
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Video Content */}

      <div className="bg-[#115E57]">
        <div className="mx-auto flex w-full items-center justify-between gap-x-6">
          <div className="w-full text-red-400">
            {previewVideoUrl ? (
              <VdocipherVideoPlayer
                chapterId={lesson.id}
                title={lesson.title}
                courseId={course.id || ""}
                nextChapterId={null}
                videoUrl={previewVideoUrl}
                videoStatus={lesson.videoStatus || ""}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
              />
            ) : (
              <p className="text-white">Video URL is missing or invalid.</p>
            )}
          </div>
        </div>
      </div>

      {/* Other Video Content List */}
      <div className="overflow-y-scroll h-72 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {Array.from({ length: 8 }).map((_, index) => (
          <MoreCourseList key={index} />
        ))}
      </div>
    </DialogContent>
  );
}
