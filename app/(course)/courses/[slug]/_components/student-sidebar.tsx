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

export default function StudentSidebar({ lesson, videoUrl, onVideoUrlUpdate }) {
  const [activeVideoUrl, setActiveVideoUrl] = useState(videoUrl);

  const handlePlayClick = (url) => {
    setActiveVideoUrl(url);
    onVideoUrlUpdate(url);
  };

  return (
    <div className="p-3 relative">
      <h1 className="text-xl font-bold mb-4">Course Lessons</h1>
      <Accordion
        type="single"
        collapsible
        className="border w-full"
        defaultValue={lesson[0]?.id}
      >
        {lesson.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            {/* Accordion Trigger */}
            <AccordionTrigger className="w-full capitalize flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-sm font-semibold">
              <span>{item.title}</span>
              <ChevronDown className="w-5 h-5 transition-transform" />
            </AccordionTrigger>
            {/* Accordion Content */}
            <AccordionContent className="bg-white px-4 py-3 border-t">
              <div
                className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                  activeVideoUrl === item.videoUrl
                    ? "bg-green-100 text-green-700 font-semibold "
                    : "hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => handlePlayClick(item.videoUrl)}
              >
                <PlayCircle
                  className={`w-5 h-5 ${
                    activeVideoUrl === item.videoUrl
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                />
                <span>
                  <p
                    className="text-xs capitalize"
                    dangerouslySetInnerHTML={{
                      __html: item.description || "Lesson Video",
                    }}
                  />
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
