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

// Zod schema for Sign-In form validation
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignIn() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        signInSchema.parse({ email, password });
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
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      signInSchema.parse({ email, password });

      setErrors({});

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        if (res.error === "data and hash arguments required") {
          setErrors({ form: "Incorrect email or password" });
          toast.error("Incorrect email or password");
        } else {
          setErrors({ form: res.error });
          toast.error(res.error);
        }
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        toast.error("Please correct the errors in the form.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    setIsSubmitting(false);
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
          <div className="pb-6 flex justify-center">
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
          <h1 className="text-xl font-bold mb-6 text-center">Sign In</h1>
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
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-500 hover:text-blue-600 text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
              {hasSubmitted && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            {hasSubmitted && errors.form && (
              <p className="text-red-500 text-sm">{errors.form}</p>
            )}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition ${
                !isFormValid || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <hr className="my-4" />
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
          >
            Sign in with Google
          </button>
          <p className="text-center mt-4">
            {`Don't have an account?`}{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    );
  }

  return null; // Return null if session is not determined yet
}
