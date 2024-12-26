// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { IconBadge } from "@/components/icon-badge";
import { Video, Upload, Link as ExternalLink, PlusCircle } from "lucide-react";
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
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Customize your video</h2>
          </div>

          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer flex items-center"
                >
                  <PlusCircle className="mr-2 w-4 h-4" />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="me-5">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSelection("upload")}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 w-4 h-4" />
                  Upload
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelection("url")}
                  className="cursor-pointer"
                >
                  <ExternalLink className="mr-2 w-4 h-4" />
                  External URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
