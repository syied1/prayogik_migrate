// @ts-nocheck
import StudentSidebar from "./student-sidebar";
import VisitorSidebar from "./visitor-sidebar";

export default function Sidebar({
  course,
  access,
  lesson,
  videoUrl,
  onVideoUrlUpdate,
  userId,
}) {
  // console.log("access", access);
  return (
    <div>
      {access ? (
        <StudentSidebar
          courseSlug={course?.slug}
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
