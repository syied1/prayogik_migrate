// @ts-nocheck

"use client";

import axios from "axios";
import { CheckCircle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { getProgress } from "@/actions/get-progress";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { log } from "console";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  // Add other relevant attributes for Lesson here
}

interface Course {
  id: string;
  slug: string;
  lessons: Lesson[];
  // Add other relevant attributes for Course here
}

interface CourseProgressButtonProps {
  course: Course;
  lessonId: string;
  courseId: string;
  nextLessonId?: string;
  isCompleted?: boolean;
  userId: any;
}

export const CourseProgressButton = ({
  course,
  lessonId,
  courseId,
  nextLessonId,
  isCompleted,
  userId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

  const onClick = async () => {
    try {
      let lessonSlug;

      setIsLoading(true);

      if (nextLessonId) {
        lessonSlug = findLessonSlugById(nextLessonId); // Pass lessonId to find
      }

      // Update the lesson progress in the database
      const response = await axios.put(
        `/api/courses/${courseId}/lessons/${lessonId}/progress`,
        {
          isCompleted: !lessonCompleted,
        }
      );

      setLessonCompleted(response?.data?.isCompleted);

      // Trigger confetti if a lesson is completed
      // if (!isCompleted) {
      //   confetti.onOpen();
      // }

      response?.data?.isCompleted == false;

      if (response?.data?.isCompleted == false) {
        toast.success("Progress updated");
        // router.refresh();
        return;
      }

      if (response?.data?.isCompleted && nextLessonId && lessonSlug) {
        // Navigate to the next lesson if applicable
        router.push(`/courses/${course.slug}/${lessonSlug}`);
      }

      // toast.success("Progress updated");

      // fetching progress percentage

      const { data } = await axios.post(`/api/courses/${courseId}`, {
        userId,
        courseId: course.id,
      });

      const progressPercentage = data.progress;
      // console.log("progressPercentage:", progressPercentage);
      if (progressPercentage == "100") {
        confetti.onOpen();
        // toast.success("Course completed");
      } else {
        toast.success("Progress updated");
      }

      router.refresh(); // Refresh the page or update local state as needed
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const findLessonSlugById = (lessonId: string) => {
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
    return lesson ? lesson.slug : null;
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={lessonCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {lessonCompleted ? "Mark as incomplete" : "Mark as complete"}
          <CheckCircle
            className={`h-4 w-4 ml-2 ${
              lessonCompleted ? "text-gray-400" : " text-white"
            }`}
          />
        </>
      )}
    </Button>
  );
};
