// @ts-nocheck

import axios from "axios"; // Import axios
import { getServerUserSession } from "@/lib/getServerUserSession";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import Sidebar from "../_components/sidebar";
import CourseDescription from "../_components/course-description";
import { LessonContent } from "../_components/LessonContent";
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { getRelatedCourses } from "@/actions/get-related-courses";
import { redirect } from "next/navigation";

// Get lesson
const getLesson = async (lessonSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/lessons/lesson`;

  try {
    const response = await axios.post(url, {
      lessonSlug,
      userId,
    });

    // Log the data sent
    // console.log(JSON.stringify({ lessonSlug, userId }));

    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return {
      error: true,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Check course access via the new API route
const checkCourseAccess = async (courseSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;

  try {
    const response = await axios.post(url, {
      courseSlug,
      userId,
    });

    return {
      access: response.data.access,
    };
  } catch (error) {
    console.error("Error checking course access via API", error);
    return {
      access: false,
      message:
        error.response?.data?.error || "Error occurred while checking access",
    };
  }
};

// Lesson page component
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

  if (!hasCourseAccess) redirect(`/courses/${slug}`);

  // if (!hasCourseAccess) {
  //   return <div>Unauthorized access</div>;
  // }

  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  // Fetch course data using the slug, possibly without userId
  const currentCourse = await getCourseBySlug(slug, userId);

  // Fetch related courses only if userId is valid
  let relatedCourses = [];
  // !isNaN(userId)
  if (userId) {
    relatedCourses = await getRelatedCourses({
      userId,
      categoryId: currentCourse.categoryId,
      currentCourseId: currentCourse.id,
    });
  }

  return (
    <div>
      <LessonContent
        lesson={lesson}
        course={course}
        nextLesson={nextLesson}
        userProgress={userProgress}
        purchase={purchase}
        userId={userId}
        relatedCourses={relatedCourses}
      />
    </div>
  );
}
