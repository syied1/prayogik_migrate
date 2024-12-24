// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { IconBadge } from "@/components/icon-badge";
import { Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Adjust based on your actual import structure
import VdocipherVideoForm from "./lesson-vdocipher-video-form"; // Adjust the path as necessary
import URLInputForm from "./URLInputForm"; // Adjust the path as necessary
import { Button } from "@/components/ui/button";

interface VideoInputSectionProps {
  lesson: any; // Replace 'any' with your actual lesson type
  courseId: string;
  lessonId: string;
}

const VideoInputSection: React.FC<VideoInputSectionProps> = ({
  lesson,
  courseId,
  lessonId,
}) => {
  const [currentView, setCurrentView] = useState<"upload" | "url">("upload");

  const handleSelection = (selection: "upload" | "url") => {
    setCurrentView(selection);
  };

  useEffect(() => {
    if (
      lesson?.videoUrl?.includes("youtube.com") ||
      lesson?.videoUrl?.includes("youtu.be") ||
      lesson?.videoUrl?.includes("vimeo.com")
    ) {
      setCurrentView("url");
    } else {
      setCurrentView("upload");
    }
  }, [lesson?.videoUrl]);

  return (
    <div>
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={Video} />
          <div className="font-medium flex items-center justify-between">
            Lesson video
          </div>
        </div>

        <div className="w-full flex  justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer">Add video</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSelection("upload")}>
                Upload Video
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelection("url")}>
                Add Video URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render forms based on dropdown selection */}
        {currentView === "upload" && (
          <VdocipherVideoForm
            initialData={lesson}
            lessonId={lessonId}
            courseId={courseId}
          />
        )}
        {currentView === "url" && (
          <URLInputForm
            initialData={lesson}
            courseId={courseId}
            lessonId={lessonId}
          />
        )}
      </div>
    </div>
  );
};

export default VideoInputSection;
