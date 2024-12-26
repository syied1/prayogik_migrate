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
    const [duration, setDuration] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

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
      } else if (url.includes("vimeo.com")) {
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
        const match = url.match(vimeoRegex);
        const vimeoId = match ? match[1] : null;
        if (vimeoId) {
          return `https://player.vimeo.com/video/${vimeoId}`;
        }
      }

      return url;
    };

    const isYoutubeVideo = (url: string) => {
      return /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)/.test(
        url
      );
    };

    const getVideoDuration = async (videoUrl) => {
      setError("");
      setDuration(null);

      // Check for YouTube URL
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoId = getYouTubeId(videoUrl);

        if (videoId) {
          try {
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`
            );

            const data = await response.json();

            if (data.items.length > 0) {
              const durationString = data.items[0].contentDetails.duration;
              const duration = convertISO8601DurationToSeconds(durationString);
              console.log("duration", duration);

              setDuration(duration);
              return duration;
            } else {
              setError("Video not found.");
            }
          } catch (error) {
            setError("Error fetching YouTube video details.");
          }
        }
      }

      // Check for Vimeo URL
      else if (videoUrl.includes("vimeo.com")) {
        const videoId = getVimeoId(videoUrl);

        if (videoId) {
          try {
            const response = await fetch(
              `https://api.vimeo.com/videos/${videoId}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
                },
              }
            );

            const data = await response.json();

            if (data && data.duration) {
              setDuration(data.duration);
              return data.duration; // Fix to use data.duration
            } else {
              setError("Video not found.");
            }
          } catch (error) {
            setError("Error fetching Vimeo video details.");
          }
        }
      } else {
        setError("Unsupported URL.");
      }
    };

    const getYouTubeId = (url) => {
      const regex =
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const getVimeoId = (url) => {
      const regex = /(?:vimeo\.com\/)(\d+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const convertISO8601DurationToSeconds = (duration) => {
      const regex = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
      const matches = regex.exec(duration);
      const hours = matches[1] ? parseInt(matches[1].replace("H", "")) : 0;
      const minutes = matches[2] ? parseInt(matches[2].replace("M", "")) : 0;
      const seconds = matches[3] ? parseInt(matches[3].replace("S", "")) : 0;
      return hours * 3600 + minutes * 60 + seconds;
    };

    const onSubmit = async (data: FormData) => {
      setLoading(true);
      try {
        let videoDuration = await getVideoDuration(data?.videoUrl);
        await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, {
          videoUrl: data.videoUrl,
          duration: videoDuration,
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
