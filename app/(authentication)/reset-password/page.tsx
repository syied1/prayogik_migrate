//@ts-nocheck

"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/(site)/loading"; // Adjust this import based on your directory structure
import Link from "next/link";
import Image from "next/image";

// Zod schema for password reset form validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Extract token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (!tokenFromUrl) {
      router.push("/");
    }

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Invalid token.");
        setIsTokenValid(false);
      } else {
        toast.success("Token is valid. You can reset your password.");
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("An error occurred while verifying the token.");
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form on input change
  useEffect(() => {
    const validateForm = () => {
      try {
        resetPasswordSchema.parse({ password, confirmPassword });
        setIsFormValid(true);
        setErrors({});
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors = err.issues.reduce((acc, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          }, {});
          setErrors(fieldErrors);
          setIsFormValid(false);
        }
      }
    };
    validateForm();
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the API route to reset the password
      const response = await fetch("/api/auth/reset-password-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        // Optionally redirect to login or another page
        router.push("/signin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loading state while verifying the token
  if (isLoading) {
    return <Loading />;
  }

  // Render the password reset form
  if (isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
          <div className="pb-8 flex justify-center">
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}` || "#"}>
              <span className="sr-only">প্রায়োগীক</span>
              <Image
                src="/prayogik-logo.png"
                width={130}
                height={130}
                className="h-auto w-[170px]"
                alt="prayogik logo"
                priority
              />
            </Link>
          </div>
          <h1 className="text-xl font-bold mb-4">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition ${
                !isFormValid || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Invalid Token</h1>
        <p className="text-base font-normal text-gray-500 mb-6">
          The reset password token is invalid or has expired.
        </p>
      </div>
    </div>
  );
}
