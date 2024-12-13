"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2Icon } from "lucide-react";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<null | true | false>(null); // Specify the type
  const [isVerifying, setIsVerifying] = useState(true);
  const isVerifiedRef = useRef(false); // Prevent multiple verification calls

  useEffect(() => {
    // Redirect if token is not available
    if (!token) {
      router.push("/");
      return;
    }

    // Prevent duplicate verification requests
    if (isVerifiedRef.current) {
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        isVerifiedRef.current = true; // Mark verification as initiated

        const response = await axios.post(
          "/api/auth/verify-email",
          {
            secret: process.env.NEXTAUTH_SECRET, // Include the secret in the request body
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use Bearer token in Authorization header
            },
          }
        );

        // Check success response
        if (response.data.success) {
          setStatus(true);
          toast.success("Email verified successfully!");

          // Delay the redirection to allow the success message to be visible
          setTimeout(() => {
            router.push("/signin");
          }, 2000); // 2-second delay before navigating
        } else {
          throw new Error(response.data.message || "Verification failed");
        }
      } catch (error) {
        setStatus(false);
        toast.error(error.response?.data?.message || "Something went wrong");
        router.push("/");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="text-center py-16">
        <div className="flex gap-2 items-center justify-center">
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="text-gray-800">
            Verifying your email, please wait...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center flex justify-center items-center py-16">
      <div className="flex gap-2 items-center">
        {status === true ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : status === false ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : null}
        <span className="text-gray-800">
          {status === true
            ? "Email verified successfully!"
            : status === false
            ? "Email verification failed."
            : "Please wait..."}
        </span>
      </div>
    </div>
  );
};

export default VerifyEmail;
