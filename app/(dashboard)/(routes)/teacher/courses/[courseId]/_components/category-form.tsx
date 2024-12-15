"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { CategorySelectionModal } from "./CategorySelectionModal";
import { Pencil, PlusCircle, ImageIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.categoryId || ""
  );

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await axios.patch(`/api/courses/${courseId}`, {
        categoryId: values.categoryId,
      });
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !selectedCategoryId && "text-slate-500 italic"
          )}
        >
          {selectedCategoryId
            ? options.find((opt) => opt.value === selectedCategoryId)?.label
            : "No category"}
        </p>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block w-full p-2 text-left bg-white border rounded-md shadow-md focus:outline-none hover:bg-gray-100 text-sm mt-2"
            >
              {selectedCategoryId
                ? options.find((opt) => opt.value === selectedCategoryId)?.label
                : "Select a category"}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 10l5 5 5-5H7z"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-x-2">
            <Button
              disabled={!isValid || isSubmitting || loading}
              type="submit"
            >
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}

      <CategorySelectionModal
        options={options}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(value) => {
          setSelectedCategoryId(value);
          form.setValue("categoryId", value); // Update form state
          form.trigger(); // Trigger validation
        }}
      />
    </div>
  );
};
