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
  isCompleted = false,
  userId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      let lessonSlug;

      setIsLoading(true);

      if (nextLessonId) {
        lessonSlug = findLessonSlugById(nextLessonId); // Pass lessonId to find
      }

      // Update the lesson progress in the database
      await axios.put(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        isCompleted: !isCompleted,
      });

      // Trigger confetti if a lesson is completed
      // if (!isCompleted) {
      //   confetti.onOpen();
      // }

      // Navigate to the next lesson if applicable
      if (!isCompleted && nextLessonId && lessonSlug) {
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
      onClick={isCompleted ? undefined : onClick} // Only set onClick if not completed
      disabled={isLoading || isCompleted} // Disable if loading or already completed
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <>
          {isCompleted ? "Completed" : "Mark as complete"}
          <CheckCircle
            className={`h-4 w-4 ml-2 ${isCompleted ? "text-teal-700" : ""}`}
          />
        </>
      )}
    </Button>
  );
};
