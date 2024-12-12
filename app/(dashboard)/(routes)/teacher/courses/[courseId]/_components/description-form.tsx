// @ts-nocheck

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Tiptap from "@/components/ui/tiptap/tiptap";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { Loader } from "lucide-react"; // Import Loader

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => setIsExpanded(!isExpanded);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true); // Set loading to true
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const shortDescription = initialData?.description?.substring(0, 1200);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
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
            !initialData?.description && "text-slate-500 italic"
          )}
        >
          {!initialData?.description && "No description"}
          {initialData?.description && (
            <div>
              <p
                className="text-sm mb-4 text-black text-justify"
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? initialData?.description
                    : `${shortDescription}...`,
                }}
              />
              <button
                onClick={toggleDescription}
                className="text-blue-500 hover:underline text-sm"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tiptap
                      className="font-normal"
                      description={`${
                        initialData.description ? initialData.description : ""
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" /> // Circular progress indicator
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
