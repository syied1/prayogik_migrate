// @ts-nocheck
"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  const { data: session, status } = useSession();

  // const handleSwitchRole = async (newRole) => {
  //   try {
  //     const response = await fetch("/api/role", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ role: newRole }),
  //     });

  //     // if (!response.ok) {
  //     //   throw new Error("Failed to switch role");
  //     // }

  //     const data = await response.json();
  //   } catch (error) {
  //     console.error("Error switching role:", error);
  //   } finally {
  //   }
  // };

  // console.log("isTeacherPage", isTeacherPage);

  // if (isTeacherPage === false && session?.user?.role !== "STUDENT") {
  //   handleSwitchRole("STUDENT");
  // }



  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
