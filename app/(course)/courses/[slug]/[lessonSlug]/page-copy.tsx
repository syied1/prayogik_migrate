//@ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { notFound } from "next/navigation";

const getLesson = async (courseSlug, lessonSlug) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseSlug}/${lessonSlug}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new error("Failed to get lesson");
    }
    return {
      error: false,
      lesson: await response.json(),
    };
  } catch (error) {
    console.error("lesson page", error);
    return {
      error: true,
      message: error.message,
    };
  }
  // call api
};

// Check course access via the new API route
const checkCourseAccess = async (courseSlug) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;
  try {
    const response = await fetch("/api/courses/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseSlug }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        access: false,
        message: data.message || "Access denied",
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

export default async function LessonPage({ params }) {
  const { userId } = await getServerUserSession();
  const { slug, lessonSlug } = params;
  const data = await getLesson(slug, lessonSlug);
  if (data.error) {
    notFound();
  }
  const lesson = data.lesson;

  // Call the API to check if the user has access to the course
  const accessResponse = await checkCourseAccess(courseSlug);
  const hasCourseAccess = accessResponse.access;
  if (!hasCourseAccess || !lesson.preview) {
    return <div>{accessResponse.message || "Unauthorized access"}</div>;
  }

  return (
    <div>
      <div> Lesson Content</div>
      <div> Lesson Sidebar</div>
    </div>
  );
}
