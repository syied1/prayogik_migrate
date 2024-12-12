"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../globals.css";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import Loading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status, router]);

  // Handle session loading
  if (status === "loading") {
    return <Loading />;
  }

  // Safely handle session and avoid accessing undefined session properties
  if (status === "authenticated" && session) {
    return (
      <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-56 pt-[80px] h-full">{children}</main>
      </div>
    );
  }

  // Redirecting state or handling undefined session
  return <div className="text-center py-16">Redirecting to login...</div>;
}
