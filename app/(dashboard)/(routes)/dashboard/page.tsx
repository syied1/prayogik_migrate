// @ts-nocheck

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";


export default async function Dashboard() {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return redirect("/");
  }
  // import { useSession } from "next-auth/react";
  // const { data: session, status } = useSession();
  // if (session?.user?.role !== "STUDENT") {
  //   handleSwitchRole("STUDENT");
  // }

  // const handleSwitchRole = async (newRole) => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch("/api/role", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ role: newRole }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to switch role");
  //     }

  //     const data = await response.json();
  //   } catch (error) {
  //     console.error("Error switching role:", error);
  //     alert("Failed to switch role. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
