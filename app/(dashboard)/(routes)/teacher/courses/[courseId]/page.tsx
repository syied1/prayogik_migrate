// @ts-nocheck

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import { AttachmentForm } from "./_components/attachment-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/chapters-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { TitleForm } from "./_components/title-form";
import { MultiplePriceForm } from "./_components/multiple-price-form";
import { LessonsForm } from "./_components/lessons-form";
import { LearningOutcomesForm } from "./_components/learningOutcome-form";
import { CourseRequirementsForm } from "./_components/coureseRequirements-form";
import { SlugTitleForm } from "./_components/slug-title-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await getServerUserSession();

  // If no user is logged in, redirect to home page
  if (!userId) {
    return redirect("/");
  }

  // Fetch the course data and ensure the user is the owner (teacher)
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      teacherId: userId, // Assuming `teacherId` is used to link courses to their creator
    },
    include: {
      prices: true,
      lessons: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Fetch the available categories to populate the category form
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // If the course is not found or doesn't belong to the user, redirect to dashboard
  if (!course) {
    return redirect("/dashboard");
  }

  // Define required fields for the course setup completion
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.prices.some((price) => price.regularAmount) ||
      course.prices[0]?.isFree,
    course.categoryId,
    course.lessons.some((chapter) => chapter.isPublished),
  ];

  // Calculate course setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all required fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <SlugTitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <LearningOutcomesForm initialData={course} courseId={course.id} />
            <CourseRequirementsForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course lessons</h2>
              </div>
              <LessonsForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <MultiplePriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
