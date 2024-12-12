// @ts-nocheck
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ArrowLeft, File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { VdocipherVideoPlayer } from "./_components/vdocipher-video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    });

  if (!chapter || !course) {
    return redirect("/dashboard");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 mt-3">
          <div className="w-full">
            <Link
              href="/dashboard"
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to dashboard
            </Link>
          </div>
          <VdocipherVideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            videoUrl={chapter?.videoUrl || ""}
            videoStatus={chapter?.videoStatus}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row md:gap-x-4 items-start justify-between">
            <h2 className="text-2xl font-semibold mb-2 flex-1">
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <div className="px-4">
            <Separator />
          </div>
          <div className="my-5 p-4">
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <div className="px-4">
                <Separator />
              </div>
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
