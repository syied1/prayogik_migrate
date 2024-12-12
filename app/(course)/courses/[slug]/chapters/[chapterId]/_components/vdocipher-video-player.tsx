"use client";

import axios from "axios";
import { Loader2, Lock, Video, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import VdocipherPlayer from "@/components/VdocipherPlayer";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Button } from "@/components/ui/button";

interface VdocipherVideoPlayerProps {
  videoUrl: string;
  videoStatus: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VdocipherVideoPlayer = ({
  videoUrl,
  videoStatus,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VdocipherVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  // TODO: Need to update progress onEnding video automatically
  // Instructed to avoid it
  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Function to refresh video status
  const refreshVideoStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/courses/${courseId}/chapters/${chapterId}`
      );
      setIsReady(data.videoStatus === "ready");
    } catch (error) {
      console.error("Error fetching video status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isReady) {
        refreshVideoStatus();
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, courseId, chapterId]);

  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary h-full">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && videoUrl && videoStatus === "ready" ? (
        // <VdocipherPlayer onEnded={onEnd} videoId={videoUrl || ""} />
        <VdocipherPlayer videoId={videoUrl || ""} />
      ) : (
        <div className="flex flex-col gap-2 border border-gray-300 items-center justify-center  bg-slate-100 rounded-md h-full">
          <Video className="h-10 w-10 text-slate-500" />
          <p className="text-gray-500 text-sm">
            Video is processing. It may take a few minutes!
          </p>
          <p className="text-gray-500 text-sm">
            Current Status: <span className="font-semibold">{videoStatus}</span>
          </p>
          <Button
            onClick={refreshVideoStatus}
            disabled={isLoading}
            variant="ghost"
            className="mt-1"
            title="Refresh"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <RefreshCw className="h-6 w-6 text-slate-500" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
