// @ts-nocheck

"use client";

import { Button } from "@/components/ui/button";
import { Loader, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "./search-input";
import UserProfileMenus from "./userProfileMenus";
import { useEffect, useState } from "react";



// important to fix role switch not updating issue 
export const dynamic = "force-dynamic";


export const NavbarRoutes = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [userRole, setUserRole] = useState(
    session?.user?.role ? session?.user?.role : "STUDENT"
  );
  // const userRole = session?.user?.role; // Assume the role is available in the session
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";
  const router = useRouter();

  const handleSwitchRole = async (newRole) => {
    setLoading(true);

    try {
      const response = await fetch("/api/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }), 
      });

      if (!response.ok) {
        throw new Error("Failed to switch role");
      }

      const data = await response.json();
      setUserRole(data.role); // Update user role from response

      // Redirect if the role switched to TEACHER
      if (data.role === "TEACHER") {
        router.push("/teacher/courses");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Failed to switch role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (userRole === "TEACHER") {
  //     router.push("/teacher/courses");
  //   } else {
  //     router.push("/dashboard");
  //   }
  // }, [userRole]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage && userRole === "TEACHER" ? (
          <button
            onClick={() => handleSwitchRole("STUDENT")}
            disabled={loading}
          >
            <Button size="sm" variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Exit"}
            </Button>
          </button>
        ) : (
          <button
            onClick={() => handleSwitchRole("TEACHER")}
            disabled={loading}
          >
            <Button size="sm" variant="outline">
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                `Switch to teacher mode`
              )}
            </Button>
          </button>
        )}

        <UserProfileMenus session={session} />
      </div>
    </>
  );
};
