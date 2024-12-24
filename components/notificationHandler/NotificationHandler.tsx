// @ts-nocheck

"use client"; // Mark as a client component

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const NotificationHandler = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const failed = searchParams.get("failed");

  // Ref to track if the toast has already been shown
  const toastShown = useRef(false);

  useEffect(() => {
    if (success === "1" && !toastShown.current) {
      toast.success("Course purchase completed successfully");
      toastShown.current = true; // Mark as shown
    } else if (canceled === "1" && !toastShown.current) {
      toast.error("Course purchase canceled");
      toastShown.current = true; // Mark as shown
    } else if (failed === "1" && !toastShown.current) {
      toast.error("Course purchase failed");
      toastShown.current = true; // Mark as shown
    }
  }, [success, canceled, failed]); // Add dependencies

  return null; // Return nothing from this component
};

export default NotificationHandler;
