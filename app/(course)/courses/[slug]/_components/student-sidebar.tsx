// @ts-nocheck

"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { ChevronDown, PlayCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function StudentSidebar({
  lesson,
  videoUrl,
  onVideoUrlUpdate,
  courseSlug,
}) {
  const [activeVideoUrl, setActiveVideoUrl] = useState(videoUrl);
  const [expandedItems, setExpandedItems] = useState({});
  const router = useRouter();
  const { lessonSlug } = useParams();

  const handlePlayClick = (item) => {
    // Update the active video URL
    setActiveVideoUrl(item?.videoUrl);
    // Optionally update the video URL in the parent component
    onVideoUrlUpdate(item?.videoUrl);

    // Push the new lesson route
    router.push(`/courses/${courseSlug}/${item?.slug}`);

    // Expand the accordion item corresponding to the lesson clicked
    setExpandedItems((prev) => ({
      ...prev,
      [item.id]: true, // Set the clicked item's state to expanded
    }));
  };

  const toggleDescription = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle the specific item's expand state
    }));
  };

  let initialIdForAccordion = lesson.find(
    (item) => item.slug === lessonSlug
  )?.id;

  return (
    <div className="p-3 relative max-h-[90vh] overflow-y-auto ">
      <h1 className="text-xl font-bold mb-4">Course Lessons</h1>

      {/* ==---------------------== */}
      {lesson.map((item, index) => (
        <div key={item?.id} value={item?.id}>
          <div className="bg-white">
            <div
              className={`cursor-pointer flex items-start gap-2 py-3 rounded-md transition-all border-b border-gray-100 ${
                item.slug === lessonSlug
                  ? "text-green-500 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => handlePlayClick(item)}
            >
              <PlayCircle
                className={`w-5 h-5 min-w-[20px] ${
                  item.slug === lessonSlug ? "text-green-500" : "text-gray-500"
                }`}
              />
              <div className="text-sm flex gap-2">
                <span className="min-w-max text-nowrap">
                  Lesson {index + 1}:
                </span>
                <p
                  className="text-sm capitalize"
                  dangerouslySetInnerHTML={{
                    __html: item?.title || "Lesson Video",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
