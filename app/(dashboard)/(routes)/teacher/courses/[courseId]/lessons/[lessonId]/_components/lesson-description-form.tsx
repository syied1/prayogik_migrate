"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import Tiptap from "@/components/ui/tiptap/tiptap";
import { Loader } from "lucide-react";
import JoditEditor from "jodit-react";

interface LessonDescriptionFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const LessonDescriptionForm = ({
  initialData,
  courseId,
  lessonId,
}: LessonDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState<string>(
    initialData.textContent || ""
  );

  const editor = useRef(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.textContent || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleTextContentSubmit = async () => {
    if (textContent) {
      setLoading(true);
      try {
        const data = {
          id: lessonId,
          textContent,
        };

        await axios.put(
          `/api/courses/${courseId}/lessons/${lessonId}/update`,
          data
        );
        toast.success("TextContent updated successfully");
        setLoading(false);
        router.refresh();
      } catch (error) {
        console.error("Error updating TextContent:", error);
        toast.error("Something went wrong");
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.textContent && "text-slate-500 italic"
          )}
        >
          {!initialData.textContent && "No description"}
          {initialData.textContent && (
            <Preview value={initialData.textContent} />
          )}
        </div>
      )}
    

      {isEditing && (
        <div>
          <JoditEditor
            ref={editor}
            value={textContent}
            onChange={(value) => setTextContent(value)}
          />
          <Button
            disabled={!textContent || isSubmitting || loading}
            onClick={handleTextContentSubmit}
          >
            {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};
