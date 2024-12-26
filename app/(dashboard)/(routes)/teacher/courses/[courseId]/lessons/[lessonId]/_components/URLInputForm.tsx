// @ts-nocheck
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  videoUrl: string;
}

const URLInputForm: React.FC<{
  initialData: any;
  courseId: string;
  lessonId: string;
}> = ({ initialData, courseId, lessonId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      videoUrl: initialData?.videoUrl || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        videoUrl: data.videoUrl,
      });
      toast.success("Video URL updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error uploading video URL:", error);
      toast.error("Failed to update video URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbed = (url: string) => {
    // Check for YouTube URLs
    if (url.includes("youtube.com")) {
      const urlParams = new URL(url).searchParams; // Use URL object to get parameters
      const videoId = urlParams.get("v"); // Standard link format
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]; // Extract video ID from shortened URL
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } // Return original URL if not a valid YouTube link
    return url;
  };

  const isYoutubeVideo = (url: string) => {
    return /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)/.test(
      url
    );
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 items-center justify-center  bg-slate-100 rounded-md">
      <div className="space-y-4">
        <div>
          <div className="font-medium flex items-center justify-between">
            Lesson video
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing ? (
                "Cancel"
              ) : initialData?.videoUrl ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit URL
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add an External URL
                </>
              )}
            </Button>
          </div>

          {isEditing ? (
            <>
              <input
                id="videoUrl"
                type="text"
                {...register("videoUrl", { required: "Video URL is required" })}
                className={`block w-full p-2 border ${
                  errors.videoUrl ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              />
              {errors.videoUrl && (
                <span className="text-red-500 text-sm">
                  {errors.videoUrl.message}
                </span>
              )}
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </>
          ) : (
            initialData?.videoUrl &&
            isYoutubeVideo(initialData?.videoUrl) && (
              <div className="relative aspect-video mt-2 ">
                <iframe
                  src={getVideoEmbed(initialData.videoUrl)}
                  title="Video"
                  width="100%"
                  height="400px"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default URLInputForm;
