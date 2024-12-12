// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Minus, Pencil, Plus, Loader } from "lucide-react"; // Import Loader
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

const formSchema = z.object({
  requirements: z.array(
    z.string().min(1, { message: "Requirement is required" })
  ),
});

interface CourseRequirementsFormProps {
  initialData: Course;
  courseId: string;
}

export const CourseRequirementsForm = ({
  initialData,
  courseId,
}: CourseRequirementsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requirements: initialData?.requirements || [""],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const lastInputRef = useRef<HTMLInputElement | null>(null); // Ref for the last input field

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

  // Effect to focus the last input when a new field is appended
  useEffect(() => {
    if (isEditing && lastInputRef.current) {
      lastInputRef.current.focus(); // Focus the last input field
    }
  }, [fields.length, isEditing]);

  //   console.log("initialData.requirements", initialData.requirements);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Requirements
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Requirements
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="text-sm mt-2">
          {!initialData.requirements.length
            ? "No requirements"
            : initialData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center">
                  <span className="h-2 w-2 bg-black rounded-full mr-2"></span>
                  <p>{requirement}</p>
                </div>
              ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {fields.length === 0 && (
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <FormField
                  control={control}
                  name={`requirements.${0}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <input
                          {...field}
                          className="font-normal w-full border border-gray-300 rounded"
                          placeholder="Enter course requirement"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className={`w-10 px-0`}
                  type="button"
                  onClick={() => {
                    append("");
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="w-full flex flex-row items-center justify-between gap-3"
              >
                <FormField
                  control={control}
                  name={`requirements.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <input
                          {...field}
                          ref={
                            index === fields.length - 1 ? lastInputRef : null
                          } // Set ref on the last input
                          className="font-normal w-full border border-gray-300 rounded"
                          placeholder="Enter course requirement"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className={`w-10 px-0`}
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1 || isSubmitting}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  className={`w-10 px-0`}
                  type="button"
                  onClick={() => {
                    append("");
                  }}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="w-full flex flex-row gap-5">
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  {loading ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
