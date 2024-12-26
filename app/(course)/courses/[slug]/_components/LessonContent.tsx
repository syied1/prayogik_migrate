// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import CourseDescription from "./course-description";
import Sidebar from "./sidebar";
import { CourseProgressButton } from "../chapters/[chapterId]/_components/course-progress-button";
import RatingForm from "./RatingForm";
import { Preview } from "@/components/preview";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthorBio from "./author-bio";
import Review from "./review";
import MoreCourses from "./more-course";
import RelatedCourse from "./related-course";

export const LessonContent = ({
  lesson,
  course,
  nextLesson,
  userProgress,
  purchase,
  userId,
  relatedCourses,
}) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState(lesson.videoUrl);
  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  const [activeTab, setActiveTab] = useState("content");

  // Function to extract video ID from different YouTube URL formats
  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Determine video type
  const isYouTubeVideo =
    currentVideoUrl?.includes("youtube.com") ||
    currentVideoUrl?.includes("youtu.be");
  const isEmbeddedVideo = currentVideoUrl?.startsWith("http");
  const isVdoCipherVideo = currentVideoUrl?.includes("vdocipher.com");
  const isDirectVideo = currentVideoUrl?.endsWith(".mp4");

  // Extract video ID for YouTube
  const youtubeVideoId = isYouTubeVideo
    ? getYouTubeVideoId(currentVideoUrl)
    : null;

  return (
    <div>
      {/* Course title */}
      <NotificationHandler />
      <div className="bg-[#105650]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-6 py-3 lg:px-8">
          <h1 className="text-xl font-semibold text-white">{course.title}</h1>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            {/* dynamic Video */}
            <div>
              {currentVideoUrl ? (
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
                      src={currentVideoUrl}
                      frameBorder="0"
                      allowFullScreen
                      title="Embedded Video"
                    ></iframe>
                  </div>
                ) : isDirectVideo ? (
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <video className="w-full h-full" controls autoPlay muted>
                      <source src={currentVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <VdocipherVideoPlayer
                    chapterId={lesson.id}
                    title={lesson.title}
                    courseId={course.id || ""}
                    nextChapterId={null}
                    videoUrl={currentVideoUrl}
                    videoStatus={lesson.videoStatus || ""}
                    isLocked={isLocked}
                    completeOnEnd={completeOnEnd}
                  />
                )
              ) : (
                <p className="text-white">Video URL is missing or invalid.</p>
              )}
            </div>
            {/* dynamic course Content */}
            <div className="min-h-screen mt-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-black capitalize">
                  {lesson.title}
                </h1>
                <div className="flex justify-end mt-2">
                  <CourseProgressButton
                    course={course}
                    lessonId={lesson.id}
                    courseId={course.id}
                    nextLessonId={nextLesson?.id}
                    isCompleted={userProgress?.isCompleted}
                    userId={userId}
                  />
                </div>
              </div>
              <Tabs
                defaultValue="content"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-4"
              >
                {/* Tabs Navigation */}
                <TabsList className="flex border-b justify-start">
                  <TabsTrigger
                    value="content"
                    className="px-4 py-2 font-medium text-gray-600"
                  >
                    Text Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="description"
                    className="px-4 py-2 font-medium text-gray-600 "
                  >
                    Course Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="rating"
                    className="px-4 py-2 font-medium text-gray-600 "
                  >
                    Rating
                  </TabsTrigger>
                </TabsList>

                {/* Tabs Content */}
                <TabsContent value="content" className="pt-4">
                  {lesson?.textContent ? (
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6">
                      <div className="w-full max-w-[51rem]">
                        <div className="w-full">
                          <Preview value={lesson?.textContent} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No content available for this lesson.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="description" className="pt-4">
                  <CourseDescription course={course} />
                </TabsContent>

                <TabsContent value="rating" className="pt-4">
                  <RatingForm courseId={course?.id} userId={userId} />
                </TabsContent>
              </Tabs>
              <RelatedCourse courses={relatedCourses} />
              {/* 
              <AuthorBio />
              <Review />
              <MoreCourses /> 
              */}
            </div>
          </div>
          {/* Sidebar */}
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full ">
              <div className="sticky bg-white top-4">
                <div className="border border-gray-200 min-h-[80vh]">
                  <Sidebar
                    videoUrl={currentVideoUrl}
                    onVideoUrlUpdate={setCurrentVideoUrl}
                    course={course}
                    access={!!purchase}
                    lesson={course.lessons}
                    userId={userId}
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
