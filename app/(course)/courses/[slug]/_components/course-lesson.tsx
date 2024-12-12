// @ts-nocheck
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import VideoPopUp from "./VideoPopUp";

export default function CourseLesson({ course }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="my-6">
      <h1 className="text-2xl font-bold mb-4">Course Lessons</h1>
      <Accordion type="single" collapsible className="border">
        {course.lessons.map((lesson, i) => (
          <AccordionItem key={lesson.id} value={lesson.id}>
            <div className="flex items-center justify-between bg-gray-100">
              <AccordionTrigger className="px-4 font-bold text-sm text-left flex justify-start gap-4 hover:no-underline">
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                <span className="capitalize">{lesson.title}</span>
              </AccordionTrigger>
              <p className="text-gray-500 px-4 text-sm">
                12 lectures 1hr 12min
              </p>
            </div>
            <AccordionContent className="p-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-start gap-4">
                  <PlayCircle className="w-6 h-6 text-gray-500" />
                  {lesson.isFree ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => handleLessonClick(lesson)}
                          className="text-sm text-black underline"
                        >
                          <p
                            className="text-sm mb-4 text-black capitalize"
                            dangerouslySetInnerHTML={{
                              __html: lesson.description,
                            }}
                          />
                        </button>
                      </DialogTrigger>
                      {selectedLesson && (
                        <VideoPopUp
                          course={{
                            id: course.id,
                            title: course.title,
                            previewVideoUrl:
                              selectedLesson.videoUrl ||
                              "", // Dummy video
                            lesson: selectedLesson, // Pass the lesson
                          }}
                        />
                      )}
                    </Dialog>
                  ) : (
                    <p
                      className="text-sm mb-4 text-gray-500 capitalize"
                      dangerouslySetInnerHTML={{
                        __html: lesson.description,
                      }}
                    />
                  )}
                  <span className="text-gray-500">03.27</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
