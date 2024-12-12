// @ts-nocheck
"use client";
import StudentSidebar from "./student-sidebar";
import VisitorSidebar from "./visitor-sidebar";

export default function Sidebar({
  course,
  access,
  lesson,
  videoUrl,
  onVideoUrlUpdate,
  userId
}) {
  return (
    <div>
      {access ? (
        <StudentSidebar
          lesson={lesson}
          videoUrl={videoUrl}
          onVideoUrlUpdate={onVideoUrlUpdate} // Prop for updating video URL
        />
      ) : (
        <VisitorSidebar course={course} access={access} userId={userId} />
      )}
    </div>
  );
}
