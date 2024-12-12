// @ts-nocheck
"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loading from "@/app/(site)/loading";

// Zod schema for Sign-Up form validation
const signUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name is required and must be at least 3 characters long",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
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
        signUpSchema.parse({ name, email, password, confirmPassword });
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
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSubmitted(true);

    try {
      // Validate form data using Zod before sending it
      signUpSchema.parse({ name, email, password, confirmPassword });

      // Clear previous errors if validation succeeds
      setErrors({});

      // Send sign-up request to the API (excluding confirmPassword)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Clear form fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSubmitting(false);
        setFormSubmitted(false);
        router.push("/signin");
      } else {
        setErrors({ form: data.error });
        toast.error(data.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      // Handle Zod validation errors
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
  };

  // Display loading message when the session status is loading
  if (status === "loading") {
    return <Loading />;
  }

  // Don't render the form if the user is authenticated (redirect handled in useEffect)
  if (status === "authenticated") {
    return null;
  }

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
        <h1 className="text-xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {formSubmitted && errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
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
            {formSubmitted && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {formSubmitted && errors.password && (
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
            {formSubmitted && errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          {formSubmitted && errors.form && (
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
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
