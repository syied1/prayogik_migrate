// import { redirect } from "next/navigation";

// import { db } from "@/lib/db";
// import { getProgress } from "@/actions/get-progress";

// import { CourseSidebar } from "./_components/course-sidebar";
// import { CourseNavbar } from "./_components/course-navbar";
// import { getServerUserSession } from "@/lib/getServerUserSession";

// const CourseLayout = async ({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { courseId: string };
// }) => {
//   const { userId } = await getServerUserSession();

//   if (!userId) {
//     return redirect("/");
//   }

//   const course = await db.course.findUnique({
//     where: {
//       id: params.courseId,
//     },
//     include: {
//       chapters: {
//         where: {
//           isPublished: true,
//         },
//         include: {
//           userProgress: {
//             where: {
//               userId: userId || "",
//             },
//           },
//         },
//         orderBy: {
//           position: "asc",
//         },
//       },
//     },
//   });

//   if (!course) {
//     return redirect("/");
//   }

//   const progressCount = await getProgress(userId, course.id);

//   return (
//     <div className="h-full">
//       <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
//         <CourseNavbar course={course} progressCount={progressCount} />
//       </div>
//       <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
//         <CourseSidebar course={course} progressCount={progressCount} />
//       </div>
//       <div className="md:pl-80 pt-[80px] h-full">{children}</div>
//     </div>
//   );
// };

// export default CourseLayout;
//@ts-nocheck

import Header from "@/app/(site)/_components/Header";
import "../../../globals.css";
import Courses from "./_components/courses";
import Hero from "./_components/hero";
import TopMenu from "./_components/top-menu";
import WhatYouLearn from "./_components/what-you-learn";
import StudentSidebar from "./_components/student-sidebar";
import Sidebar from "./_components/sidebar";
import Footer from "@/app/(site)/_components/Footer";
import LayoutWrapper from "./_components/layout-wrapper";

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
