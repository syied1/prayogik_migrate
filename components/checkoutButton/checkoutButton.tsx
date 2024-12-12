"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutButton({
  className,
  courseId,
  priceId,
  userId,
  children,
  checked,
  ...props
}: {
  className?: string;
  courseId: string;
  userId: string | null;
  priceId: string | null;
  children?: React.ReactNode;
  checked?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      // for aamarPay
      // TODO: send priceId into payment API
      const response = await axios.post(`/api/courses/${courseId}/payment`, {
        priceId,
      });
      const result = window.location.assign(response.data.url);
    } catch (error) {
      console.log("Error from checkout button:", error);
      toast.error("Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(userId);
  return userId ? (
    <Button
      {...props}
      onClick={onClick}
      disabled={isLoading || !checked || !userId}
      className="w-full flex bg-teal-600 text-white py-2 rounded mb-2"
    >
      {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {children || (
        <>
          <span>এনরোল করুন</span>
        </>
      )}
    </Button>
  ) : (
    <Link href="/signin">
      <Button
        {...props}
        className="w-full flex bg-teal-600 text-white py-2 rounded mb-2"
      >
        {children || (
          <>
            <span>এনরোল করুন</span>
          </>
        )}
      </Button>
    </Link>
  );
}
