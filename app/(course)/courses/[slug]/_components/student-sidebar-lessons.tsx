//  @ts-nocheck
"use client";
import { useState } from "react";
import { FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const StudentSidebarLessons = ({
  item,
  lessonSlug,
  onVideoUrlUpdate,
  courseSlug,
  index,
  videoUrl,
}) => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(videoUrl);
  const router = useRouter();
  const handlePlayClick = (item) => {
    // Update the active video URL
    setActiveVideoUrl(item?.videoUrl);
    // Optionally update the video URL in the parent component
    onVideoUrlUpdate(item?.videoUrl);
    // Push the new lesson route
    router.push(`/courses/${courseSlug}/${item?.slug}`);
  };
  return (
    <div className="bg-white">
      <div
        className={`cursor-pointer flex items-start gap-2 py-3 rounded-md transition-all border-b border-gray-100 ${
          item.slug === lessonSlug
            ? "text-green-500 font-semibold"
            : "text-gray-600"
        }`}
        onClick={() => handlePlayClick(item)}
      >
        {item.videoUrl !== null ? (
          <PlayCircleIcon
            className={`w-5 h-5 min-w-[20px] ${
              item.slug === lessonSlug ? "text-green-500" : "text-gray-500"
            }`}
          />
        ) : (
          <FileTextIcon
            className={`w-5 h-5 min-w-[20px] ${
              item.slug === lessonSlug ? "text-green-500" : "text-gray-500"
            }`}
          />
        )}
        <div className="text-sm flex gap-2">
          <span className="min-w-max text-nowrap">Lesson {index + 1}:</span>
          <p
            className="text-sm capitalize"
            dangerouslySetInnerHTML={{
              __html: item?.title || "Lesson Video",
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default StudentSidebarLessons;
