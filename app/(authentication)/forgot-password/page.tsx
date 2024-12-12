//@ts-nocheck

"use client";

import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/(site)/loading";
import { ArrowLeft } from "lucide-react";

// Zod schema for Sign-In form validation
const forgotFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPassword() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Validate the form on every input change
  useEffect(() => {
    const validateForm = () => {
      try {
        forgotFormSchema.parse({ email });
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
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      // Validate email again before submission
      forgotFormSchema.parse({ email });
      setErrors({});

      // Call the API route for password reset
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error:", result.error);
        toast.error(result.error);
      } else {
        console.log("Success:", result.message);
        toast.success(result.message);
        // Optionally redirect or clear form after successful submission
        setEmail("");
        setErrors({});
        setHasSubmitted(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        toast.error("Please correct the error in the form.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false); // Ensure to stop submitting state even on error
    }
  };

  // Show a loading state while checking session
  if (status === "loading") {
    return <Loading />;
  }

  // Render the login form if the user is not authenticated
  if (status === "unauthenticated") {
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
          <h1 className="text-xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-base font-normal text-gray-500 mb-6">
            {` Enter the email address associated with your account and we'll send
            you a link to reset your password.`}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
              {hasSubmitted && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
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
              {isSubmitting ? "Sending..." : "Send me a recovery link"}
            </button>
          </form>
          <div className="flex justify-center mt-2">
            <div className="text-center mt-4 inline-flex justify-center text-sm items-center text-gray-500">
              <ArrowLeft className="w-6 h-4" />
              <p>
                {`Back to`}{" "}
                <a href="/signin" className="text-blue-500 hover:underline">
                  Signin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // Return null if session is not determined yet
}
