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
    lesson?: {
      id: string;
      videoStatus?: string;
      title: string;
      textContent: string;
    };
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

  // Function to extract video ID from different YouTube URL formats
  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Determine video type
  const isYouTubeVideo =
    previewVideoUrl?.includes("youtube.com") ||
    previewVideoUrl?.includes("youtu.be");
  const isEmbeddedVideo = previewVideoUrl?.startsWith("http");
  const isVdoCipherVideo = previewVideoUrl?.includes("vdocipher.com");
  const isDirectVideo = previewVideoUrl?.endsWith(".mp4");

  // Extract video ID for YouTube
  const youtubeVideoId = isYouTubeVideo
    ? getYouTubeVideoId(previewVideoUrl)
    : null;

  return (
    <DialogContent className={previewVideoUrl ? "max-w-[1000px]" : "max-w-max"}>
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
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Video Content */}
      <div className="bg-[#115E57]">
        <div className="mx-auto flex w-full items-center justify-between gap-x-6">
          <div className="w-full text-red-400">
            {previewVideoUrl ? (
              // Check the type of video URL and render the appropriate player
              isYouTubeVideo && youtubeVideoId ? (
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1`}
                    title="YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              ) : isEmbeddedVideo ? (
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe
                    className="w-full h-full"
                    src={previewVideoUrl}
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded Video"
                  ></iframe>
                </div>
              ) : isDirectVideo ? (
                <div className="aspect-w-16 aspect-h-9 relative">
                  <video className="w-full h-full" controls autoPlay muted>
                    <source src={previewVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
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
              )
            ) : (
              <div
                className="bg-white p-4 max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: lesson.textContent }}
              ></div>
            )}
          </div>
        </div>
      </div>

      {/* Other Video Content List (optional) */}
      {/* <div className="overflow-y-scroll h-72 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {Array.from({ length: 8 }).map((_, index) => (
          <MoreCourseList key={index} />
        ))}
      </div> */}
    </DialogContent>
  );
}
