// @ts-nocheck
// ok
import { getServerUserSession } from "@/lib/getServerUserSession";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import Sidebar from "../_components/sidebar";
import CourseDescription from "../_components/course-description";

import { LessonContent } from "../_components/LessonContent";

// get lesson
const getLesson = async (lessonSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/lessons/lesson`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lessonSlug, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to get lesson");
    }

    const data = await response.json();
    return {
      error: false,
      data,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return {
      error: true,
      message: error.message,
    };
  }
};

// Check course access via the new API route
const checkCourseAccess = async (courseSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseSlug, userId }),
    });

    if (!response.ok) {
      // Ensure you don't attempt to parse an empty body
      let errorMessage = "Access denied";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (error) {
        console.error("Error parsing error response:", error);
      }

      return {
        access: false,
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      access: data.access,
    };
  } catch (error) {
    console.error("Error checking course access via API", error);
    return {
      access: false,
      message: "Error occurred while checking access",
    };
  }
};

// lesson page component
export default async function LessonPage({ params }) {
  const { userId } = await getServerUserSession();
  const { slug, lessonSlug } = params;

  // Fetch the lesson data
  const lessonResponse = await getLesson(lessonSlug, userId);
  if (lessonResponse.error) {
    return <div>Lesson not found</div>;
  }

  const { lesson, course, attachments, nextLesson, userProgress, purchase } =
    lessonResponse.data;

  // Call the API to check if the user has access to the course
  const accessResponse = await checkCourseAccess(slug, userId);

  const hasCourseAccess = accessResponse.access;

  if (!hasCourseAccess) {
    return <div>Unauthorized access</div>;
  }

  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      <LessonContent
        lesson={lesson}
        course={course}
        nextLesson={nextLesson}
        userProgress={userProgress}
        purchase={purchase}
        userId={userId}
      />
    </div>
  );
}
